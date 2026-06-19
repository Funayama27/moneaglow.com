// api/products.js — Vercel Serverless Function
// 主要ドロップシッピングのAPIを集約し、共通フォーマットで人気順の商品を返す。
// フロント(design-reference.html / FEED.useApi=true)から GET /api/products?sort=best_selling&limit=8 で呼ばれる。
//
// APIキー・トークンはコードに直書きせず、リポジトリ（Vercel）の環境変数に設定する:
//   DROPSHIP_PROVIDER   使用プロバイダ（cjdropshipping | aliexpress | spocket | dsers | zendrop）
//   CJ_ACCESS_TOKEN     CJ Dropshipping
//   ALIEXPRESS_APP_KEY / ALIEXPRESS_APP_SECRET / ALIEXPRESS_TRACKING_ID
//   SPOCKET_API_KEY
//   DSERS_API_TOKEN
//   ZENDROP_API_KEY
//
// 化粧品（薬機法対象・国内発送）と美容雑貨（対象外・海外直送可）を type で区別する。
// 自動入れ替えの主対象は美容雑貨。化粧品は国内・正規仕入れに限定し、知財・商標侵害品は扱わない。

const PROVIDER = process.env.DROPSHIP_PROVIDER || "cjdropshipping";

const adapters = {
  cjdropshipping: fetchCJ,
  aliexpress: fetchAliExpress,
  spocket: fetchSpocket,
  dsers: fetchDsers,
  zendrop: fetchZendrop,
};

export default async function handler(req, res) {
  const sort = (req.query && req.query.sort) || "best_selling";
  const limit = Number((req.query && req.query.limit) || 8);
  try {
    const fn = adapters[PROVIDER];
    if (!fn) throw new Error("unknown DROPSHIP_PROVIDER: " + PROVIDER);
    const raw = await fn({ sort, limit });
    const items = raw.map(normalize).slice(0, limit);
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({ provider: PROVIDER, count: items.length, items });
  } catch (e) {
    // 失敗時は空配列を返し、フロント側でモックにフォールバックさせる
    res.status(200).json({ provider: PROVIDER, count: 0, items: [], error: String(e.message || e) });
  }
}

// 各社のレスポンスをフロント共通形式に正規化
// { n, en, p(価格), img, type(化粧品|美容雑貨), trend(人気度), lead(お届け目安), supplier, sku, url }
function normalize(p) {
  return {
    n: p.title,
    en: p.titleEn || "",
    p: Math.round(p.price || 0),
    img: p.image || "",
    type: p.cosmetic ? "化粧品" : "美容雑貨",
    trend: p.popularity || 0,
    lead: p.shipDays || (p.cosmetic ? "2-4日" : "5-9日"),
    supplier: p.supplier || PROVIDER,
    sku: p.sku || "",
    url: p.url || "",
  };
}

// ── 各プロバイダのアダプタ（公式API仕様に合わせて実装） ──

// CJ Dropshipping  https://developers.cjdropshipping.com
async function fetchCJ({ limit }) {
  const token = process.env.CJ_ACCESS_TOKEN;
  if (!token) throw new Error("CJ_ACCESS_TOKEN not set");
  const r = await fetch(
    "https://developers.cjdropshipping.com/api2.0/v1/product/list?pageSize=" + limit + "&categoryKeyword=beauty",
    { headers: { "CJ-Access-Token": token } }
  );
  const d = await r.json();
  return (d.data && d.data.list ? d.data.list : []).map((x) => ({
    title: x.productNameEn,
    price: Number(x.sellPrice),
    image: x.productImage,
    cosmetic: false,
    popularity: Number(x.listedNum || 0),
    shipDays: "5-9日",
    supplier: "CJ Dropshipping",
    sku: x.pid,
    url: x.productUrl,
  }));
}

// AliExpress Dropshipping  https://openservice.aliexpress.com
async function fetchAliExpress({ limit }) {
  const key = process.env.ALIEXPRESS_APP_KEY;
  if (!key) throw new Error("ALIEXPRESS_APP_KEY not set");
  const params = new URLSearchParams({
    app_key: key,
    tracking_id: process.env.ALIEXPRESS_TRACKING_ID || "",
    keywords: "beauty",
    page_size: String(limit),
    sort: "LAST_VOLUME_DESC", // 人気（販売数）順
  });
  const r = await fetch("https://api-sg.aliexpress.com/sync?" + params.toString());
  const d = await r.json();
  const list = (d.resp_result && d.resp_result.result && d.resp_result.result.products) || [];
  return list.map((x) => ({
    title: x.product_title,
    price: Number(x.target_sale_price),
    image: x.product_main_image_url,
    cosmetic: false,
    popularity: Number(x.lastest_volume || 0),
    shipDays: "7-14日",
    supplier: "AliExpress",
    sku: x.product_id,
    url: x.product_detail_url,
  }));
}

// Spocket  https://www.spocket.co (Partner API)
async function fetchSpocket({ limit }) {
  const key = process.env.SPOCKET_API_KEY;
  if (!key) throw new Error("SPOCKET_API_KEY not set");
  const r = await fetch(
    "https://api.spocket.co/api/v1/products?category=beauty&sort=best_selling&per_page=" + limit,
    { headers: { Authorization: "Bearer " + key } }
  );
  const d = await r.json();
  return (d.products || []).map((x) => ({
    title: x.title,
    price: Number(x.retail_price),
    image: x.image_url,
    cosmetic: false,
    popularity: Number(x.sold_count || 0),
    shipDays: x.from_us ? "3-7日" : "7-14日",
    supplier: "Spocket / " + (x.supplier_name || ""),
    sku: x.id,
    url: x.url,
  }));
}

// DSers  https://www.dsers.com (Open API)
async function fetchDsers({ limit }) {
  const token = process.env.DSERS_API_TOKEN;
  if (!token) throw new Error("DSERS_API_TOKEN not set");
  const r = await fetch(
    "https://api.dsers.com/v1/products?category=beauty&order_by=orders&limit=" + limit,
    { headers: { Authorization: "Bearer " + token } }
  );
  const d = await r.json();
  return (d.data || []).map((x) => ({
    title: x.title,
    price: Number(x.price),
    image: x.image,
    cosmetic: false,
    popularity: Number(x.orders || 0),
    shipDays: "7-14日",
    supplier: "DSers",
    sku: x.product_id,
    url: x.link,
  }));
}

// Zendrop  https://zendrop.com (API)
async function fetchZendrop({ limit }) {
  const key = process.env.ZENDROP_API_KEY;
  if (!key) throw new Error("ZENDROP_API_KEY not set");
  const r = await fetch(
    "https://api.zendrop.com/v1/products?niche=beauty&sort=trending&limit=" + limit,
    { headers: { "X-API-Key": key } }
  );
  const d = await r.json();
  return (d.products || []).map((x) => ({
    title: x.name,
    price: Number(x.price),
    image: x.image_url,
    cosmetic: false,
    popularity: Number(x.trending_score || 0),
    shipDays: "5-12日",
    supplier: "Zendrop",
    sku: x.sku,
    url: x.url,
  }));
}
