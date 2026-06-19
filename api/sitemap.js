// /api/sitemap  → /sitemap.xml （vercel.json の rewrites で公開）
let kv = null;
try { ({ kv } = await import("@vercel/kv")); } catch(e){ kv = null; }

const BASE = process.env.SITE_URL || "https://moneaglow.com";
const STATIC = ["", "collection.html", "diagnosis.html", "journal.html"];
const ARTICLE_SLUGS = ["winter-dry-skincare","vitamin-c-serum-guide","sunscreen-reapply"];

export default async function handler(req, res){
  let slugs = [...ARTICLE_SLUGS];
  try{ if(kv){ const k = await kv.lrange("articles:index",0,199); if(k && k.length) slugs = [...new Set([...slugs, ...k])]; } }catch(e){}
  const today = new Date().toISOString().slice(0,10);
  const urls = [
    ...STATIC.map(p=>`${BASE}/${p}`),
    ...slugs.map(s=>`${BASE}/article.html?slug=${s}`)
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>`;
  res.setHeader("Content-Type","application/xml");
  res.setHeader("Cache-Control","s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
