# v0-monea — MONEA GLOW storefront

MONEA GLOW のECサイト（静的サイト：HTML / CSS / JavaScript）。

- タグライン: 自分らしい輝きを、毎日に。
- コンセプト: 誰かになるためではなく、自分自身の魅力を見つけ、花開かせるために。
- ドメイン: moneaglow.com（Cloudflare 取得済み）

## 構成

```
v0-monea/
├ index.html          … トップページ
├ css/style.css       … 全体スタイル
├ js/main.js          … 商品データ（仮）・カート・UI
├ assets/             … 画像・SVG（プレースホルダー）
└ pages/
   ├ about.html       … コンセプト / ブランドについて
   ├ products.html    … 商品一覧（カテゴリ絞り込み）
   ├ product.html     … 商品詳細（?i=インデックス）
   ├ contact.html     … お問い合わせ
   ├ law.html         … 特定商取引法に基づく表記
   └ privacy.html     … プライバシーポリシー
```

## ローカル表示

VS Code の Live Server などで `index.html` を開く。
ビルド・npm install 不要。

## EC / 決済

- 購入導線は Shopify 接続前提（Buy Button / Checkout）。
- カート／レジボタン付近に `<!-- TODO: Shopify Buy Button embed here -->` を設置済み。
- 商品データは `js/main.js` の配列で仮置き。Shopify Storefront 連携時に差し替え。

## ホスティング

- GitHub リポジトリ: `v0-monea`
- Vercel（Framework: Other / 静的）でデプロイ。
- カスタムドメイン: moneaglow.com（Cloudflare DNS → Vercel）。
