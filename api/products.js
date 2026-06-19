// /api/products  ドロップシッピング各社を集約し人気順で返す。失敗時はモック。
// 対応プロバイダ: cj / aliexpress / spocket / dsers / zendrop （DROPSHIP_PROVIDER で選択）
const MOCK = [
  { id:"m1", category:"美容液",     name:"Glow Serum",   price:3480, image:"https://images.unsplash.com/photo-1599022484220-967921f2217c?w=520&h=700&fit=crop&q=80&auto=format", type:"cosmetic", popularity:980 },
  { id:"m2", category:"クレンジング", name:"Pure Balm",    price:2640, image:"https://images.unsplash.com/photo-1680537260333-20fd95432044?w=520&h=700&fit=crop&q=80&auto=format", type:"cosmetic", popularity:910 },
  { id:"m3", category:"マスク",     name:"Rose Mask",    price:1980, image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=520&h=700&fit=crop&q=80&auto=format", type:"cosmetic", popularity:870 },
  { id:"m4", category:"クリーム",   name:"Velvet Cream", price:4200, image:"https://images.unsplash.com/photo-1605204359736-9a08b7175fc7?w=520&h=700&fit=crop&q=80&auto=format", type:"cosmetic", popularity:820 },
  { id:"m5", category:"化粧水",     name:"Dew Lotion",   price:2860, image:"https://images.unsplash.com/photo-1619166855062-f63c187def3d?w=520&h=700&fit=crop&q=80&auto=format", type:"cosmetic", popularity:760 },
  { id:"m6", category:"日焼け止め", name:"Veil UV",      price:2420, image:"https://images.unsplash.com/photo-1643747394944-89b11e7fb616?w=520&h=700&fit=crop&q=80&auto=format", type:"cosmetic", popularity:700 },
  { id:"m7", category:"美容雑貨",   name:"Jade Roller",  price:1680, image:"https://images.unsplash.com/photo-1665763630810-e6251bdd392d?w=520&h=700&fit=crop&q=80&auto=format", type:"goods",    popularity:640 }
];

// 発送目安: 化粧品は薬機法対象/国内発送、美容雑貨は対象外/海外発送
function withShipping(p){
  const cosmetic = p.type !== "goods";
  return { ...p, lead: cosmetic ? "国内発送 2〜4日" : "海外直送 5〜9日", regulated: cosmetic };
}

async function fetchProvider(provider){
  // 各社のキーは環境変数から（リポジトリに送付済みの値を Vercel に設定）
  const k = {
    cj:        process.env.CJ_API_KEY,
    aliexpress:process.env.ALIEXPRESS_API_KEY,
    spocket:   process.env.SPOCKET_API_KEY,
    dsers:     process.env.DSERS_API_KEY,
    zendrop:   process.env.ZENDROP_API_KEY
  }[provider];
  if(!k) return null;
  const ep = {
    cj:        "https://developers.cjdropshipping.com/api2.0/v1/product/list?pageSize=24",
    aliexpress:"https://api.aliexpress.com/products?limit=24",
    spocket:   "https://api.spocket.co/api/v1/products?per_page=24",
    dsers:     "https://api.dsers.com/v1/products?limit=24",
    zendrop:   "https://api.zendrop.com/v1/products?limit=24"
  }[provider];
  if(!ep) return null;
  const r = await fetch(ep, { headers:{ "Authorization":`Bearer ${k}`, "CJ-Access-Token":k } });
  if(!r.ok) return null;
  const d = await r.json();
  const raw = d.products || d.data || d.list || [];
  if(!Array.isArray(raw) || !raw.length) return null;
  return raw.map((x,i)=>({
    id: String(x.id || x.pid || x.product_id || i),
    category: x.category || x.categoryName || "美容雑貨",
    name: x.name || x.productNameEn || x.title || "Item",
    price: Math.round(Number(x.price || x.sellPrice || x.retail_price || 0)) || 0,
    image: x.image || x.productImage || (x.images && x.images[0]) || MOCK[i%MOCK.length].image,
    type: /化粧|cosme|skin|serum|cream|lotion|mask|spf|uv/i.test((x.name||"")+(x.category||"")) ? "cosmetic" : "goods",
    popularity: Number(x.sales || x.orders || x.popularity || (1000 - i*10))
  }));
}

export default async function handler(req, res){
  const provider = (process.env.DROPSHIP_PROVIDER || "").toLowerCase();
  let items = null;
  try { if(provider) items = await fetchProvider(provider); } catch(e){ items = null; }
  const list = (items && items.length ? items : MOCK)
    .map(withShipping)
    .sort((a,b)=> b.popularity - a.popularity);
  res.setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=600");
  res.status(200).json({ source: items && items.length ? provider : "mock", count: list.length, products: list });
}
