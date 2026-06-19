// /api/articles  KVに蓄積した自動生成記事を返す。?slug= で個別。KV未設定時は空配列。
let kv = null;
try { ({ kv } = await import("@vercel/kv")); } catch(e){ kv = null; }

export default async function handler(req, res){
  const slug = (req.query && req.query.slug) || "";
  try{
    if(!kv) throw new Error("kv unavailable");
    if(slug){
      const a = await kv.get("article:"+slug);
      if(!a) return res.status(404).json({ error:"not found" });
      return res.status(200).json({ article:a });
    }
    const slugs = (await kv.lrange("articles:index", 0, 49)) || [];
    const list = [];
    for(const s of slugs){ const a = await kv.get("article:"+s); if(a) list.push(a); }
    res.setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ count:list.length, articles:list });
  }catch(e){
    return res.status(200).json({ count:0, articles:[], note:"KV未設定。同梱記事を表示しています。" });
  }
}
