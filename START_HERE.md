# MONEA GLOW｜はじめかた（これだけ読めばOK）

このフォルダ一式で、MONEA GLOW のサイトが動きます。順番にやれば公開まで進みます。

サイトのテーマ（全体の軸）：
**自分らしく美しくなりたいすべての人へ。誰かになるためではなく、自分自身の魅力を見つけ、花開かせるために。**

---

## 0. 用意するもの（アカウント）
- GitHub アカウント
- Vercel アカウント（GitHub連携でログイン）
- Anthropic の APIキー（記事の自動生成に使用）
- ドメイン moneaglow.com … Cloudflare取得済み
- （任意）ドロップシッピング各社のAPIキー

---

## 1. ファイルを置く場所
1. この `v0-monea` フォルダを、次の場所に置く（フォルダ名は `moneaglow` などに変えてOK）：
   `iCloud Drive ▸ 書類 ▸ github ▸ v0-monea`
   ＝ ターミナルでの表記は `~/github/v0-monea`
2. VS Code を開き、「フォルダを開く」でこのフォルダを開く。

### フォルダの中身
```
v0-monea/
├─ index.html          トップ（白黒→色づくヒーロー、シャネル風の縦積み）
├─ category.html       商品カテゴリ（?cat= で各カテゴリ表示）
├─ diagnosis.html      5分診断フォーム
├─ media.html          メディア記事一覧
├─ article.html        記事個別（?slug=）
├─ api/
│  ├─ products.js          ドロップシッピング集約（人気順・自動入れ替え）
│  ├─ articles.js          記事の取得（一覧・個別）
│  ├─ generate-article.js  記事を自動生成（Cronで定期実行）
│  └─ sitemap.js           sitemap.xml を生成
├─ vercel.json         Cron と sitemap のルーティング
├─ robots.txt          SEO
├─ package.json        依存（@vercel/kv）
├─ .env.example        環境変数の雛形
├─ MONEA_GLOW_BUILD.md 仕様（指示の全文）
└─ README.md
```

---

## 2. VS Code の Claude Code に貼る指示

### ステップA：まず中身を確認・整える（最初の一言）
> このフォルダの `MONEA_GLOW_BUILD.md` を読んで全体像を把握して。`index.html` がトップページ。`index.html` / `category.html` / `diagnosis.html` / `media.html` / `article.html` をブラウザで開いて表示を確認し、リンク（ヘッダー・フッター・各カテゴリ・診断・記事）がすべて正しくつながっているか点検して。崩れている箇所があれば、デザインのトーン（白背景モノトーン、白黒→色づく、シャネル風の縦積み）を保ったまま直して。

### ステップB：本番用に整える
> 本番に向けて次をお願い。
> 1. 商品と記事を実データに切り替えられるよう、各HTML内の `FEED.useApi` を `true` にする（APIキー未設定のうちはモックにフォールバックする実装になっているのでこのままでOK）。
> 2. `.env.example` を `.env.local` にコピーして、必要な環境変数の一覧を確認できる状態にして。
> 3. Git の初期化と最初のコミットまでやって（push はまだしない）。

※ Claude Code が「git push / ファイル削除 / 環境変数の変更 / 実際のメール送信 / 新しいコマンドの初回実行」をしようとするときだけ確認を入れます。それ以外は止めずに進めてOK。

---

## 3. GitHub に上げる
Claude Code にこう頼む：
> GitHub に新しいリポジトリ `moneaglow` を作って、このフォルダを push して。`.gitignore` で `.env` と `node_modules` が除外されていることを確認してから。

（手動でやる場合：GitHubで空リポジトリを作成 → VS Codeのソース管理から push）

---

## 4. Vercel にデプロイ
1. Vercel にログイン → 「Add New ▸ Project」
2. GitHub の `moneaglow` リポジトリを Import
3. Framework Preset は「Other」（ビルド不要の静的サイト＋Serverless）
4. そのまま Deploy

---

## 5. 環境変数を設定（Vercel）
Vercel の Project ▸ Settings ▸ Environment Variables に、`.env.example` の項目を登録する。最低限：
- `ANTHROPIC_API_KEY`（記事自動生成）
- `SITE_URL` = `https://moneaglow.com`
- `SITE_NAME` = `MONEA GLOW`
- 使うドロップシッピングの `DROPSHIP_PROVIDER` とそのキー

---

## 6. 記事の自動発信を有効化（Vercel KV）
1. Vercel の Storage ▸ KV を作成し、このプロジェクトに接続（接続すると `KV_REST_API_*` は自動で入る）
2. `vercel.json` の Cron 設定により、`/api/generate-article` が毎日自動実行され、美容記事が増えていく
3. すぐ試したいときは、デプロイ後のURL `https://（あなたのドメイン）/api/generate-article` を一度開くと1本生成される（`CRON_SECRET` を設定した場合は手動実行は弾かれます）

---

## 7. 独自ドメイン moneaglow.com を接続
1. Vercel の Project ▸ Settings ▸ Domains に `moneaglow.com` を追加
2. Cloudflare のDNSに、Vercelが指示するレコード（A もしくは CNAME）を設定
3. 反映後、`https://moneaglow.com` で表示される

---

## 8. 確認
- トップ → カテゴリ → 商品、トップ → 診断 → 結果、トップ → MEDIA → 記事 と一通り辿れるか
- `https://moneaglow.com/sitemap.xml` が表示されるか
- 数日後、メディアに記事が自動で増えているか

---

### 困ったら Claude Code にそのまま聞く
> 〇〇ページのこの部分をこう直したい（テーマと白背景モノトーンは保って）。

商品の写真や記事のカバー画像は、いまは仮のフリー素材です。本番では正式な素材に差し替えてください。
