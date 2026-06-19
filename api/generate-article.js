// /api/generate-article  cronで定期実行。Claude APIで美容ハウツー記事を生成しKVへ保存。
// vercel.json の crons から日次で叩く。CRON_SECRET で保護。
import Anthropic from "@anthropic-ai/sdk";
let kv = null;
try { ({ kv } = await import("@vercel/kv")); } catch(e){ kv = null; }

const TOPICS = [
  ["スキンケア","季節の変わり目の肌のゆらぎケア"],
  ["成分ガイド","ナイアシンアミドの基本"],
  ["UVケア","曇りの日の紫外線対策"],
  ["スキンケア","朝のスキンケアの時短ルーティン"],
  ["成分ガイド","セラミドでうるおいを守る"],
  ["ボディケア","乾燥する季節のボディケア"]
];

function slugify(s){ return "auto-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6); }

export default async function handler(req, res){
  const secret = req.headers["authorization"];
  if(process.env.CRON_SECRET && secret !== `Bearer ${process.env.CRON_SECRET}`)
    return res.status(401).json({ error:"unauthorized" });
  if(!process.env.ANTHROPIC_API_KEY)
    return res.status(500).json({ error:"ANTHROPIC_API_KEY未設定" });

  const [cat, theme] = TOPICS[Math.floor(Math.random()*TOPICS.length)];
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `あなたは日本の美容メディアの編集者です。テーマ「${theme}」（カテゴリ:${cat}）で、20〜40代女性向けのハウツー記事をJSONのみで出力してください。
制約:
- 日本の薬機法に配慮し、効果・効能を断定しない（「〜が期待できる」等も避け、一般的な情報として穏やかに書く）。
- 特定商品名・ブランド名は出さない。
- 無駄な読点を入れない。
出力JSON形式:
{"title":"32字以内","cat":"${cat}","excerpt":"40字以内の要約","meta":"70字以内のSEO説明","tags":["3語"],"lead":"導入80字程度","steps":[{"h":"見出し","p":["本文1","本文2"],"point":"任意の補足"},{"h":"","p":[""]},{"h":"","p":[""]}],"outro":"まとめ80字程度"}
JSON以外は一切出力しないこと。`;

  try{
    const msg = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 1600,
      messages: [{ role:"user", content: prompt }]
    });
    let txt = (msg.content || []).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
    txt = txt.replace(/^```json\s*/i,"").replace(/```$/,"").trim();
    const data = JSON.parse(txt);

    const slug = slugify(data.title);
    const today = new Date();
    const article = {
      slug, title:data.title, cat:data.cat||cat,
      date: `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,"0")}.${String(today.getDate()).padStart(2,"0")}`,
      cover: "photo-1556228578-8c89e6adf883",
      excerpt:data.excerpt, meta:data.meta, tags:data.tags||[],
      lead:data.lead, steps:data.steps||[], outro:data.outro,
      generatedAt: today.toISOString()
    };

    if(kv){
      await kv.set("article:"+slug, article);
      await kv.lpush("articles:index", slug);
      await kv.ltrim("articles:index", 0, 199);
    }
    return res.status(200).json({ ok:true, slug, saved: !!kv, article });
  }catch(e){
    return res.status(500).json({ error:String(e.message||e) });
  }
}
