# MONEA GLOW

自分らしく美しくなりたいすべての人へ。
誰かになるためではなく、自分自身の魅力を見つけ、花開かせるために。

## 使い方
1. このフォルダを `~/github/v0-monea`（iCloud Drive ▸ 書類 ▸ github 配下）に置く
2. VS Code で開く
3. Claude Code に次の一言を伝える：

   > このフォルダの `MONEA_GLOW_BUILD.md` を読んで、その指示通りにサイトを作って。
   > `index.html` を見本に、配色・ヒーローの白黒→色づく演出・ホバーで色づくレイアウト・自動入れ替えを再現して。

## ファイル
- `MONEA_GLOW_BUILD.md` … 構築指示プロンプト（決定版）。最初に必ず読み込ませる。
- `index.html` … 完成デザインの見本（白背景モノトーン・シャネル風縦積み・白黒→色づく）。ブラウザで開くと動作を確認できる。
- `api/products.js` … 主要ドロップシッピング（CJ / AliExpress / Spocket / DSers / Zendrop）を集約するVercel Serverless Function。
- `.gitignore`

## 公開
GitHub へ push → Vercel に連携 → moneaglow.com を接続。
ドロップシッピング各社のAPIキーは Vercel の環境変数に設定し、フロントの `FEED.useApi=true` で実フィードに切り替える。
