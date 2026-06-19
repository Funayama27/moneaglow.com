// api/articles.js — Vercel Serverless Function
// 保存済みの記事を返す。フロント（media.html / article.html、FEED.useApi=true）から呼ばれる。
//   GET /api/articles?limit=30          → { items:[...] }（新しい順）
//   GET /api/articles?slug=xxx          → { item:{...} }
// 失敗・空の場合は空を返し、フロント側でモック記事にフォールバックする。

import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const slug = req.query && req.query.slug;
  const limit = Number((req.query && req.query.limit) || 30);
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  try {
    if (slug) {
      const item = await kv.get("article:" + slug);
      return res.status(200).json({ item: item || null });
    }
    const slugs = (await kv.lrange("articles:index", 0, limit - 1)) || [];
    const items = [];
    for (const s of slugs) {
      const a = await kv.get("article:" + s);
      if (a) items.push(a);
    }
    res.status(200).json({ items });
  } catch (e) {
    res.status(200).json({ items: [], item: null, error: String(e.message || e) });
  }
}
