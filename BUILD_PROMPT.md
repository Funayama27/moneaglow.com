# MONEA GLOW｜ECサイト構築指示（Claude Code 用）

このファイルの本文を Claude Code にそのまま貼ってください。
作業ディレクトリは `~/github/v0-monea`（このフォルダ）を開いている前提です。

---

あなたは MONEA GLOW のECサイトを、このフォルダ `~/github/v0-monea` にゼロから構築します。
同フォルダにある `REFERENCE_DESIGN.html` は完成イメージの参考デザインです。これを下敷きに、構造を整理しながら、同等以上の見栄えで実装してください。

## ゴール
- ブランド「MONEA GLOW」の通販サイトを構築する
- 美容に関心の高い女性向け。高級感・ツヤ・輝き（GLOW）のある上質なデザイン
- GitHub（リポジトリ名 `v0-monea`）と Vercel に公開し、独自ドメイン `moneaglow.com` を接続する

## ブランド
- 名称: MONEA GLOW
- タグライン: 自分らしい輝きを、毎日に。
- コンセプト: 誰かになるためではなく、自分自身の魅力を見つけ、花開かせるために。MONEA のツヤ・輝き・美しさを届けるオンラインショップ。
- ターゲット: 美容に関心の高い女性
- ドメイン: moneaglow.com（Cloudflare で取得済み）
※ ブランド名・タグライン・コンセプトは変更しないこと。

## 技術構成
- 静的サイト（HTML / CSS / JavaScript）。ビルド・npm install 不要。
- ファイルは役割ごとに分割する（1枚に詰め込まない）。
- 外部依存は Google Fonts のみ。フレームワークは使わない。
- 各セクションは部品的に切り出し、将来 Next.js へ移行しやすい構造にする。
- ホスティング: Vercel / リポジトリ: GitHub。

## ディレクトリ構成（目安）
```
v0-monea/
├ index.html
├ css/
│  └ style.css
├ js/
│  └ main.js
├ assets/
│  └ （SVG・画像）
├ pages/
│  ├ about.html        … コンセプト/ブランドについて
│  ├ products.html     … 商品一覧
│  ├ product.html      … 商品詳細（テンプレ）
│  ├ contact.html      … お問い合わせ
│  ├ law.html          … 特定商取引法に基づく表記
│  └ privacy.html      … プライバシーポリシー
├ README.md
└ .gitignore
```

## デザインシステム
配色（CSS変数で定義）:
- `--ivory #FAF6F1` / `--white #FFFFFF`
- `--ink #2A2622`（本文）/ `--ink-soft #7C7166`（補助）
- `--gold #B08D57`（アクセント）/ `--gold-light #E4D2B4`（輝き・ハイライト）
- `--rose #E7D3C6` / `--dark #211E1A`（ダークセクション）

「GLOW（輝き）」の表現:
- ゴールドのハイライト、繊細な光の演出、ガラス容器のツヤ感
- ただし派手にしすぎない。余白・タイポ・抑制で高級感を出す。

タイポグラフィ:
- 英字ディスプレイ: Cormorant Garamond
- 和文見出し: Noto Serif JP
- 本文: Noto Sans JP

ロゴ: 「MONEA」を大きく、その下に小さく「GLOW」。

トーン: 上品・女性的・ツヤ。既製テーマ感を避け、オリジナルなデザインにする。

## ページ・セクション構成（トップを最優先で完成）
トップページの縦の流れ:
アナウンスバー → ヘッダー → ヒーロー → 信頼バー（送料無料等）→ カテゴリ → 新着商品 → コンセプト → ベストセラー → お客様の声 → メルマガ登録 → フッター
他ページはまず枠とテンプレートを用意（中身は仮で可）。

## 機能要件（すべて実装）
- ヘッダー: 多階層ナビ（ホバーでサブメニュー）、検索、お気に入り、カート、モバイルはハンバーガー＋アコーディオン
- アナウンスバー: 複数文言をローテーション表示
- カートドロワー: 右からスライドイン。追加・数量変更・削除・小計・送料無料判定
- ポップアップ: サイト滞在から一定時間（既定15秒）で初回クーポン（会員登録訴求）を表示。離脱検知（exit-intent）でも表示。一度閉じたら同一セッションでは再表示しない。
- 検索モーダル / お気に入りトグル / トースト通知
- スクロール連動のフェードイン演出
- 完全レスポンシブ（スマートフォン最優先）

## EC・決済の方針
- 購入導線は Shopify を接続する前提（Shopify Buy Button / Checkout）。
- 各「カートに入れる」「レジに進む」ボタン付近に、Shopify の埋め込みコードを後から差し込めるよう、プレースホルダーと明示コメント（例: `<!-- TODO: Shopify Buy Button embed here -->`）を置く。
- 決済は Shopify Payments を想定（後日接続）。今回はUIのみ。
- 商品データは `js/main.js` 内の配列で仮置きし、後で Shopify Storefront 連携に差し替えやすい形にする。
- 商品画像は当面 SVG プレースホルダー（実写差し替え前提）。

## 品質基準
- レスポンシブ（スマホ最優先）、文字コードは UTF-8
- キーボードフォーカスの可視化、`prefers-reduced-motion` への配慮
- 画面に出る金額は3桁区切り（¥12,100 形式）
- 外部画像URLに依存しない（オフラインでもレイアウトが崩れない）

## 構築手順
1. 上記の構成でファイルを作成する（参考: `REFERENCE_DESIGN.html`）。まずトップページを完成させ、他ページはテンプレートを置く。
2. ローカルで表示確認（VS Code の Live Server 等）。
3. git を初期化し、コミットする（メッセージ: `init: MONEA GLOW storefront`）。
4. GitHub に private リポジトリ `v0-monea` を作成して push する。
   - 使用: `gh repo create v0-monea --private --source=. --push`
   - gh が未ログインなら `gh auth login` を先に案内する。
5. Vercel に新規プロジェクトとして接続し、本番デプロイする。
   - 使用: `vercel --prod`（未ログインなら `vercel login` を案内）
   - 対話の回答方針: Set up and deploy → yes / Link to existing → no / Project name → v0-monea / directory → ./ / Framework → Other（静的）/ Modify settings → no
6. Vercel のプロジェクト設定でカスタムドメイン `moneaglow.com`（および `www.moneaglow.com`）を追加する。
7. Cloudflare の DNS に、Vercel が指示するレコードを設定する。
   - 一般的な値（Vercel 画面の指示を優先）:
     - apex `moneaglow.com` → A レコード `76.76.21.21`
     - `www` → CNAME `cname.vercel-dns.com`
   - Cloudflare のプロキシ（オレンジの雲）は「DNS only（グレー）」にする。
8. 反映後、`https://moneaglow.com` で表示を確認する。

## 進め方・確認ゲート
- 基本は確認を取らずに進めてよい（フルオート）。
- 次の操作の「直前だけ」1行で確認する: `git push` / 各CLIの初回実行 / ファイル削除。
- 依頼にない改善・追加実装・設計変更はしない。
- 完了後、最後に次の3点を提示する:
  - GitHub リポジトリ URL
  - Vercel 本番 URL
  - `moneaglow.com` の接続状態（反映待ちなら、その旨と確認方法）
