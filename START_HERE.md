# MONEA GLOW セットアップ手順（START HERE）

このフォルダ一式が、サイトの完成データです。VS Codeのフォルダに置いて、GitHub経由でVercelに上げれば公開できます。

## フォルダの中身
```
index.html          トップ（メインビジュアル＋人気アイテム自動入れ替え）
collection.html     商品一覧（カテゴリ絞り込み）
diagnosis.html      5分肌診断
journal.html        記事一覧
article.html        記事個別（?slug= で表示）
api/products.js     ドロップシッピング集約（人気順・モックあり）
api/articles.js     自動生成記事の取得（Vercel KV）
api/generate-article.js  記事の自動生成（Claude API・cron）
api/sitemap.js      sitemap.xml 生成
vercel.json         cron と /sitemap.xml の設定
robots.txt / package.json / .env.example
```

## 1. フォルダを置く
解凍してできた `monea` フォルダを、いつもの場所（iCloud Drive ▸ 書類 ▸ github）に置き、VS Codeで開きます。

## 2. GitHub に上げる
VS Code のターミナルで:
```
git init
git add .
git commit -m "MONEA GLOW initial"
```
GitHubで空のリポジトリを作り、表示されるcoマンドで `git remote add origin ...` → `git push` します。
（pushは確認のうえで実行してください）

## 3. Vercel にデプロイ
1. Vercel で「Add New ▸ Project」から、上記のGitHubリポジトリを Import。
2. Framework Preset は **Other**。Build Command と Output は空のままでOK（静的＋APIのため）。
3. Deploy。

## 4. 環境変数を設定（Vercel ▸ Settings ▸ Environment Variables）
`.env.example` の項目を入れます。値はリポジトリに送付済みのものを使ってください。
- `ANTHROPIC_API_KEY` … 記事の自動生成に必要
- `ANTHROPIC_MODEL` … `claude-sonnet-4-6`
- `CRON_SECRET` … 任意の文字列（cron保護用）
- `DROPSHIP_PROVIDER` と該当社のキー … 商品を本番接続する場合
- `SITE_URL` … `https://moneaglow.com`

## 5. Vercel KV を接続（記事の自動発信に必要）
Vercel ▸ Storage ▸ KV を作成し、このプロジェクトに接続。`KV_REST_API_URL` / `KV_REST_API_TOKEN` は自動で入ります。
- 接続後、cron（毎日0時）が `api/generate-article` を叩いて記事を生成・保存します。
- すぐ試すなら、デプロイ後に一度だけ手動で叩けます（Authorizationヘッダーに `Bearer (CRON_SECRET)`）。

## 6. ドメイン接続
Vercel ▸ Settings ▸ Domains に `moneaglow.com` を追加。Cloudflare側のDNSを画面の指示どおり設定します。

## メモ
- 商品・記事の画像は仮素材（Unsplash）です。本番は差し替え前提です。
- 法務ページ（規約・特商法・プライバシー）はまだ入れていません。
- 決済は、指定の決済代行会社に合わせて後から組み込みます。
