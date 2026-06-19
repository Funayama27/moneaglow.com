// api/generate-article.js — Vercel Serverless Function（Vercel Cronで定期実行）
// 美容に関する記事を Claude API で自動生成し、Vercel KV に保存する。SEO目的の自動発信。
//
// 環境変数（Vercel に設定。コードに直書きしない）:
//   ANTHROPIC_API_KEY   Anthropic APIキー
//   ANTHROPIC_MODEL     使用モデル（未設定時は claude-sonnet-4-6）
//   CRON_SECRET         Vercel Cron 認証用（任意。設定すると外部からの実行を拒否）
//   SITE_NAME           ブランド名（未設定時 MONEA GLOW）
//   （Vercel KV を接続すると KV_REST_API_URL / KV_REST_API_TOKEN は自動注入）
//
// 定期実行は vercel.json の crons で設定（既定: 毎日）。
// 薬機法に配慮し、化粧品で認められた範囲を超える効能・効果の断定表現は避けるよう指示している。

import { kv } from "@vercel/kv";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const SITE = process.env.SITE_NAME || "MONEA GLOW";

// 生成テーマのローテーション（被りを避けつつ美容領域を網羅）
const TOPICS = [
  "季節の変わり目の乾燥対策スキンケア",
  "毛穴の目立ちが気になるときのケアの考え方",
  "ビタミンC・レチノールなど人気美容成分の基礎知識",
  "肌質別（乾燥・脂性・混合・敏感）のスキンケアの選び方",
  "紫外線対策と日焼け止めの正しい使い方",
  "朝と夜でのスキンケアの使い分け",
  "くすみ印象をケアする生活習慣とスキンケア",
  "クレンジングの種類と肌質別の選び方",
  "ナイトルーティンで整える素肌づくり",
  "敏感に傾いた肌をいたわるシンプルケア",
  "メイク前の保湿でメイクのりを高めるコツ",
  "ゆらぎ肌の季節を快適に過ごすヒント",
];

// カバー画像候補（Unsplash License・商用可）。本番は自社素材に差し替え推奨。
const COVERS = [
  "photo-1544717304-a2db4a7b16ee","photo-1581182800629-7d90925ad072",
  "photo-1500917293891-ef795e70e1f6","photo-1524502397800-2eeaad7c3fe5",
  "photo-1544005313-94ddf0286df2","photo-1594465919760-441fe5908ab0",
];

const SYSTEM = `あなたは美容メディア「${SITE}」の編集者兼ライターです。日本語で、読みやすく信頼できる美容・スキンケア記事を書きます。
ブランドの世界観は「自分らしく美しくなりたいすべての人へ。誰かになるためではなく、自分自身の魅力を見つけ、花開かせるために。」です。
必ず守ること:
- 薬機法に配慮し、化粧品で認められた範囲を超える効能・効果（治る・改善する等の断定、医薬品的表現）を書かない。
- 誇大表現や不安を煽る表現を避け、中立的で実用的な情報を提供する。
- 特定の病気・症状の治療を目的とした表現はしない。
- 出力は指定のJSONのみ。前後に説明やマークダウンの囲みを付けない。`;

function buildPrompt(topic, existingSlugs) {
  return `次のテーマで、${SITE}のメディア記事を1本作成してください。
テーマ: 「${topic}」

以下のキーを持つJSONだけを返してください（コードフェンスなし、JSON以外の文字を含めない）:
{
  "title": "記事タイトル（30文字前後、SEOを意識しつつ自然に）",
  "slug": "英小文字とハイフンのみのURLスラッグ（既存と重複しないこと。既存: ${existingSlugs.join(", ") || "なし"}）",
  "excerpt": "一覧用の要約（60〜90文字）",
  "cat": "カテゴリ（スキンケア / 成分ガイド / UVケア / セルフケア のいずれか）",
  "tags": ["タグ", "3〜5個"],
  "meta": "検索結果用のメタディスクリプション（110〜120文字）",
  "body": "本文HTML。<h2>見出しと<p>段落、必要なら<ul><li>のみ使用。導入→2〜4の見出しセクション→まとめ。各段落は読みやすい長さに。"
}`;
}

export default async function handler(req, res) {
  // Cron認証（CRON_SECRET設定時のみ）
  if (process.env.CRON_SECRET) {
    const auth = req.headers["authorization"] || "";
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  try {
    // 既存slug（重複回避）
    let slugs = [];
    try { slugs = (await kv.lrange("articles:index", 0, 50)) || []; } catch (e) {}

    // テーマ選択（日替わりでローテーション）
    const topic = TOPICS[new Date().getDate() % TOPICS.length];

    // Claude API 呼び出し
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        system: SYSTEM,
        messages: [{ role: "user", content: buildPrompt(topic, slugs) }],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: "anthropic error", detail: t.slice(0, 400) });
    }
    const data = await r.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    const json = text.replace(/^```json\s*|\s*```$/g, "");
    let art;
    try { art = JSON.parse(json); } catch (e) {
      return res.status(502).json({ error: "parse error", raw: text.slice(0, 400) });
    }

    // 整形・保存
    art.slug = String(art.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || ("post-" + Date.now());
    art.date = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
    art.cover = COVERS[Math.floor(Math.random() * COVERS.length)];

    await kv.set("article:" + art.slug, art);
    // 重複を除いて先頭に追加
    if (!slugs.includes(art.slug)) await kv.lpush("articles:index", art.slug);

    res.status(200).json({ ok: true, slug: art.slug, title: art.title, topic });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
