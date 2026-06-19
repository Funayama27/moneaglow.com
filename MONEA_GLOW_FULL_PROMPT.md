# MONEA GLOW｜ECサイト構築・公開・自動化 一括指示（Claude Code 用）

このファイルの本文を、VS Code で `~/github/v0-monea` を開いた状態で Claude Code にそのまま貼ってください。
参考デザインとして `REFERENCE_DESIGN.html` と `monea-glow-trending.html` を同フォルダに置いておくこと。

---

あなたは MONEA GLOW のECサイトを `~/github/v0-monea` にゼロから構築し、GitHub と Vercel に公開し、独自ドメインを接続し、ドロップシッピングの自動化まで実装します。同フォルダの参考デザイン（REFERENCE_DESIGN.html / monea-glow-trending.html）を下敷きに、同等以上の見栄えで作ってください。

## 1. ブランド（変更しないこと）
- 名称: MONEA GLOW
- タグライン: 自分らしい輝きを、毎日に。
- コンセプト: 誰かになるためではなく、自分自身の魅力を見つけ、花開かせるために。MONEA のツヤ・輝き・美しさを届けるオンラインショップ。
- ターゲット: 美容に関心の高い女性
- ドメイン: moneaglow.com（Cloudflare で取得済み）

## 2. 技術構成
- 静的サイト（HTML / CSS / JavaScript）。ビルド・npm install はフロントには不要。
- 役割ごとにファイル分割（index.html, css/style.css, js/main.js, js/feed.js, assets/, pages/, data/）。フレームワーク不使用。外部依存は Google Fonts のみ。将来 Next.js へ移行しやすい構造に。
- 自動化スクリプト部分のみ Node を使う（後述の setup / 注文転送）。
- ホスティング: Vercel / リポジトリ: GitHub。

## 3. デザインシステム
- 配色・トーンは `monea-glow-mono.html` と `MONEA_GLOW_MONO_PROMPT.md` に従う（白背景モノトーン：白／黒／グレーの無彩色のみ。金・暖色は使わない）。
- 写真・商品画像はすべてグレースケール。
- タイポ: 英字 Cormorant Garamond / 和文見出し Noto Serif JP / 本文 Noto Sans JP
- ロゴ: MONEA を大きく、下に小さく GLOW。
- ヒーローは `monea-glow-mono.html` のヒーロー（白黒ポートレート＋白銀の光）をそのまま使う。

## 4. ページ・セクション（トップを最優先で完成）
トップ: アナウンスバー → ヘッダー → ヒーロー → 信頼バー → カテゴリ → 新着 → コンセプト → いま人気の美容アイテム（自動入れ替え）→ お客様の声 → メルマガ → フッター。
他ページ（about/products/product/contact/law/privacy）は枠とテンプレートを用意。

## 5. 機能（すべて実装）
多階層ナビ＋モバイルメニュー、アナウンスバーのローテーション、カートドロワー（追加・数量変更・削除・小計・送料無料判定）、滞在15秒で初回クーポンのポップアップ＋離脱検知（同一セッションで再表示しない）、検索モーダル、お気に入り、トースト、スクロール連動フェードイン、完全レスポンシブ（スマホ最優先）。UTF-8 / フォーカス可視化 / prefers-reduced-motion 配慮 / 金額3桁区切り / 外部画像URLに依存しない。

## 6. ドロップシッピング：人気アイテムの自動入荷・自動入れ替え
- 並び順の基準は「自店売上」ではなく、外部フィード由来の人気度（トレンド指数／サプライヤーの人気ランキング）。立ち上げ直後・売上ゼロでも商品が並ぶこと。
- 「いま人気の美容アイテム」セクションを `js/feed.js` の `fetchTrendingItems(limit)`（人気度 trend 降順）で描画。固定配列にしない。
- 一定間隔で再取得し、トレンド商品が自動で入れ替わる。順位変動した商品は一瞬ハイライト。取得失敗時はモックにフォールバック。
- 各カード: 順位、在庫種別（国内発送／海外直送・取り寄せ）、お届け目安、価格、カートに入れる。売上個数は表示しない。
- 商品を「化粧品（薬機法対象・国内発送・成分/製造販売業者/内容量/使用上の注意フィールド必須）」と「美容雑貨（対象外・海外直送可）」に分ける。自動入れ替えの主対象は美容雑貨。化粧品DSは国内・正規仕入れに限定。知財・商標侵害品は扱わない。

## 7. 自動セットアップ（キーを入れたら全自動で回る）
- `.env.example` を用意し、記入欄を作る: サプライヤー／連携ドロップシッピングアプリの API キー・トークン、Shopify の Storefront/Admin API トークン。
- `npm run setup` で自動実行する setup スクリプトを作る:
  1. `.env` を読み込み各サービスへ接続テスト
  2. `trending` 自動コレクションが無ければ作成
  3. サプライヤーの人気美容アイテムを初回取り込み（化粧品＝国内発送、美容雑貨＝海外直送に自動分類）
  4. フロントの取得先を本番（USE_SHOPIFY=true）へ切替
- 常時自動処理（Vercel Cron 等）: 人気度による商品自動入れ替え、在庫・価格の自動同期、注文 webhook 受信 → サプライヤーへ自動発注（直送）。
- 本番のデータ取得は `.env` のトークンを使用（ハードコード禁止）。取得元は設定で切替: Shopify Storefront API ＋ 自動コレクション、またはサプライヤーのトレンドAPI。

## 8. 手動が必要なのは最初の1ステップだけ（自動化しない）
- ドロップシッピングサービス／サプライヤーのアカウント開設と、API キー／連携トークンの発行。
- 本人確認・規約同意を伴い、ボット登録は規約違反・凍結の原因になるため。Claude Code はこのアカウント開設・ログイン・パスワード入力に踏み込まないこと。発行キーを `.env` に貼った時点から先は全自動で動かす。

## 9. EC・決済
- 購入導線は Shopify を接続（Buy Button / Checkout）。各「カートに入れる」「レジに進む」付近に Shopify 埋め込み用プレースホルダーと `<!-- TODO: Shopify Buy Button embed here -->` を置く。
- 決済は Shopify Payments を想定（後日接続。今回はUI）。

## 10. 構築・公開手順
1. 上記構成で実装（まずトップを完成、他はテンプレ）。ローカルで表示確認。
2. git 初期化＆コミット（"init: MONEA GLOW storefront"）。
3. GitHub に private リポジトリ v0-monea を作成して push（`gh repo create v0-monea --private --source=. --push`、未ログインなら `gh auth login`）。
4. Vercel に新規プロジェクトとして接続しデプロイ（`vercel --prod`、対話は Project name → v0-monea / directory → ./ / Framework → Other / Modify settings → no）。
5. Vercel にカスタムドメイン moneaglow.com と www.moneaglow.com を追加。
6. Cloudflare DNS に Vercel 指示のレコードを設定（apex → A 76.76.21.21、www → CNAME cname.vercel-dns.com、プロキシは DNS only）。Vercel 画面の指示を優先。
7. https://moneaglow.com で表示確認。

## 11. 進め方・確認ゲート
- 基本はフルオートで進める。`git push`・各CLIの初回実行・ファイル削除の直前だけ1行で確認する。
- 依頼にない改善・設計変更はしない。既存の MONEA GLOW デザイン・ブランドは変えない。
- 完了後、次を提示: GitHub リポジトリ URL / Vercel 本番 URL / moneaglow.com の接続状態 / `npm run setup` の使い方 / 手動で必要な作業（アカウント開設とキー発行）。
