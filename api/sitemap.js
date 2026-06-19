// api/sitemap.js — sitemap.xml を動的生成（SEO）。vercel.json で /sitemap.xml にrewrite。
// 環境変数 SITE_URL（例: https://moneaglow.com）。未設定時はリクエストホストから推定。
import { kv } from "@vercel/kv";

const STATIC = ["", "category.html", "diagnosis.html", "media.html", "design-reference.html"];

export default async function handler(req, res) {
  const base = (process.env.SITE_URL || ("https://" + (req.headers.host || "moneaglow.com"))).replace(/\/$/, "");
  let slugs = [];
  try { slugs = (await kv.lrange("articles:index", 0, 1000)) || []; } catch (e) {}

  const urls = [];
  for (const p of STATIC) urls.push(`${base}/${p}`);
  for (const s of slugs) urls.push(`${base}/article.html?slug=${encodeURIComponent(s)}`);

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
    `\n</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
