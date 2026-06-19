# monea-glow

美容・コスメオンラインサイト「monea」のNext.jsプロジェクトです。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで以下を開きます。

```txt
http://localhost:3000
```

## レスポンシブ対応

対応済みです。

- PC：大きなヒーロービジュアル、4カラムカテゴリ、4カラム商品表示
- タブレット：カテゴリと商品を2カラムへ変更
- スマホ：カテゴリ、商品、診断、フォームを1カラムへ変更
- スマホ：ヘッダーナビを横スクロール化
- スマホ：CTA、入力欄、診断ボタンをタップしやすいサイズに調整
- スマホ：メインビジュアルと下層ページの高さを調整

## 商品API接続

`.env.local.example` を `.env.local` にコピーして、利用するAPIに合わせて設定します。

```bash
cp .env.local.example .env.local
```

初期状態は `DROPSHIP_PROVIDER=mock` なので、API未設定でもモック商品で動きます。

対応アダプター：

- mock
- shopify
- cj
- generic
