/* ============================================================
   MONEA GLOW — JOURNAL ジェネレーター
   content/articles.js を読み込み、静的な記事ページ・一覧・sitemap を生成。
   使い方:  node scripts/build-journal.js
   ============================================================ */
const fs = require("fs");
const path = require("path");
const articles = require("../content/articles.js");

const ROOT = path.join(__dirname, "..");
const SITE = "https://moneaglow.com";
const fmt = iso => iso.replace(/-/g, ".");

/* ---------- 共通パーツ（ルート絶対パス） ---------- */
const head = ({ title, desc, canonical, ogType, image }) => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="#1A1613">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/og.png">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="MONEA GLOW">
<meta property="og:locale" content="ja_JP">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Noto+Serif+JP:wght@400;500;600&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css?v=6">`;

const header = () => `
<div class="announce" id="announce">
  <span class="on">メンバーはいつでも全品10%OFF</span>
  <span>5分でわかる無料肌診断｜あなたに最適なケアをご提案</span>
  <span>新規メンバー登録受付中</span>
</div>
<header>
  <div class="wrap">
    <div class="bar">
      <button class="burger icon-btn" onclick="toggleMenu(true)" aria-label="メニュー"><svg viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg></button>
      <nav class="nav left">
        <div class="nav-item has-sub"><a href="/pages/products.html">SKINCARE</a><div class="submenu"><a href="/pages/products.html">クレンジング</a><a href="/pages/products.html">化粧水・トナー</a><a href="/pages/products.html">美容液</a><a href="/pages/products.html">クリーム・乳液</a><a href="/pages/products.html">マスク・スペシャル</a><a href="/pages/products.html">UVケア</a></div></div>
        <div class="nav-item has-sub"><a href="/pages/products.html">お悩み別</a><div class="submenu"><a href="/pages/products.html">乾燥・保湿</a><a href="/pages/products.html">毛穴・ハリ</a><a href="/pages/products.html">くすみ・透明感</a><a href="/pages/products.html">ゆらぎ・敏感肌</a><a href="/pages/products.html">エイジングケア</a></div></div>
        <div class="nav-item"><a href="/pages/about.html">CONCEPT</a></div>
        <div class="nav-item"><a href="/pages/journal.html">JOURNAL</a></div>
      </nav>
      <a href="/index.html" class="logo">MONEA<small>GLOW</small></a>
      <div class="nav tools">
        <button class="icon-btn" onclick="openSearch()" aria-label="検索"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg></button>
        <button class="icon-btn fav-h" aria-label="お気に入り"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.3 8.6 1.7 5 5.2 5c2 0 3.3 1.1 4 2.2C9.9 6.1 11.2 5 13.2 5c3.5 0 4.9 3.6 3.2 6.8C20 16.4 12 21 12 21z" transform="translate(0.8 0)"/></svg></button>
        <button class="icon-btn" onclick="openCart()" aria-label="カート"><svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg><span class="cart-count" id="cartCount">0</span></button>
      </div>
    </div>
  </div>
</header>`;

const footer = () => `
<footer>
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-col foot-brand">
        <div class="foot-logo">MONEA GLOW</div>
        <p>「毎日のスキンケアを特別な時間へ」</p>
        <div class="foot-sns">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
          <a href="#" aria-label="LINE"><svg viewBox="0 0 24 24"><path d="M21 11c0-4-4-7-9-7s-9 3-9 7c0 3.6 3.2 6.6 7.5 7v3l3.5-3.2C18.2 17 21 14.3 21 11z"/></svg></a>
          <a href="#" aria-label="X"><svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20"/></svg></a>
        </div>
      </div>
      <div class="foot-col"><h4>Shop</h4><a href="/pages/products.html">新着商品</a><a href="/pages/products.html">ランキング</a><a href="/pages/products.html">スキンケア</a><a href="/pages/products.html">お悩み別</a><a href="/pages/products.html">ギフト</a></div>
      <div class="foot-col"><h4>About</h4><a href="/pages/about.html">ブランドについて</a><a href="/pages/contact.html">カウンセリング</a><a href="/pages/journal.html">JOURNAL</a><a href="/pages/contact.html">よくあるご質問</a></div>
      <div class="foot-col"><h4>Support</h4><a href="/pages/contact.html">お問い合わせ</a><a href="/pages/law.html">配送・送料について</a><a href="/pages/law.html">返品・交換</a>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© MONEA GLOW All Rights Reserved.</span>
      <div class="links"><a href="/pages/privacy.html">プライバシーポリシー</a><a href="/pages/law.html">特定商取引法に基づく表記</a><a href="/pages/privacy.html">利用規約</a></div>
    </div>
  </div>
</footer>`;

const overlays = () => `
<div class="overlay" id="overlay" onclick="closeAll()"></div>
<aside class="drawer" id="drawer">
  <div class="drawer-head"><h3>Shopping Bag</h3><button class="close-x" onclick="closeAll()">×</button></div>
  <div class="drawer-body" id="cartBody"></div>
  <div class="drawer-foot">
    <div class="subtotal"><span>小計</span><span class="amt" id="subtotal">¥0</span></div>
    <p class="ship-note">メンバー登録で、いつでも全品10%OFF</p>
    <button class="checkout" onclick="fakeCheckout()">レジに進む</button>
    <!-- TODO: Shopify Buy Button embed here -->
    <p class="buybtn-note">※ 本番では、このボタンに Shopify のチェックアウト（Buy Button）が接続されます</p>
  </div>
</aside>
<div class="search-modal" id="searchModal">
  <button class="search-close" onclick="closeSearch()">×</button>
  <div class="search-box"><span class="eyebrow">Search</span><input type="text" class="search-input" placeholder="探す…" id="searchInput">
    <div class="search-sug"><span>人気のキーワード：</span><a href="/pages/products.html">美容液</a><a href="/pages/products.html">クレンジング</a><a href="/pages/products.html">毛穴</a><a href="/pages/products.html">エイジングケア</a><a href="/pages/products.html">UV</a></div>
  </div>
</div>
<div class="toast" id="toast"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg><span id="toastMsg">カートに追加しました</span></div>
<div class="mmenu" id="mmenu">
  <div class="mmenu-head"><span class="logo">MONEA GLOW</span><button class="close-x" onclick="toggleMenu(false)">×</button></div>
  <div class="macc"><button onclick="acc(this)">SKINCARE <span class="pm">＋</span></button><div class="macc-sub"><a href="/pages/products.html">クレンジング</a><a href="/pages/products.html">化粧水・トナー</a><a href="/pages/products.html">美容液</a><a href="/pages/products.html">クリーム・乳液</a><a href="/pages/products.html">マスク</a><a href="/pages/products.html">UVケア</a></div></div>
  <div class="macc"><button onclick="acc(this)">お悩み別 <span class="pm">＋</span></button><div class="macc-sub"><a href="/pages/products.html">乾燥・保湿</a><a href="/pages/products.html">毛穴・ハリ</a><a href="/pages/products.html">くすみ・透明感</a><a href="/pages/products.html">敏感肌</a><a href="/pages/products.html">エイジングケア</a></div></div>
  <div class="macc"><button onclick="location.href='/pages/about.html'">CONCEPT <span class="pm" style="opacity:0">＋</span></button></div>
  <div class="macc"><button onclick="location.href='/pages/journal.html'">JOURNAL <span class="pm" style="opacity:0">＋</span></button></div>
</div>
<script src="/js/main.js"></script>
</body>
</html>`;

/* ---------- 一覧ページ ---------- */
const sorted = articles.slice().sort((a, b) => b.date.localeCompare(a.date));
const cards = sorted.map(a => `
      <a class="jcard reveal" href="/pages/journal/${a.slug}.html">
        <div class="jcard-media"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>
        <div class="jcard-body">
          <div class="jcard-cat">${a.category}</div>
          <h3>${a.title}</h3>
          <div class="jcard-date">${fmt(a.date)}</div>
        </div>
      </a>`).join("");

const journalHtml = `${head({
  title: "JOURNAL｜MONEA GLOW",
  desc: "MONEA GLOW のジャーナル。スキンケアのヒント、うるおい・毛穴・エイジングケアなど、毎日に役立つ美容コラムをお届けします。",
  canonical: SITE + "/pages/journal.html",
  ogType: "website",
  image: SITE + "/assets/og.png"
})}
</head>
<body>
${header()}
<section class="page-hero">
  <span class="eyebrow">Journal</span>
  <h1>Journal<span class="jp">スキンケアのヒント</span></h1>
</section>
<section class="section">
  <div class="wrap">
    <div class="journal-grid">${cards}
    </div>
  </div>
</section>
${footer()}
${overlays()}`;

fs.writeFileSync(path.join(ROOT, "pages", "journal.html"), journalHtml);

/* ---------- 記事ページ ---------- */
const artDir = path.join(ROOT, "pages", "journal");
fs.mkdirSync(artDir, { recursive: true });

sorted.forEach(a => {
  const canonical = `${SITE}/pages/journal/${a.slug}.html`;
  const image = SITE + a.image;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: [image],
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "ja",
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "MONEA GLOW", url: SITE + "/" },
    publisher: { "@type": "Organization", name: "MONEA GLOW", logo: { "@type": "ImageObject", url: SITE + "/assets/og.png" } }
  };
  const html = `${head({
    title: `${a.title}｜MONEA GLOW`,
    desc: a.description,
    canonical,
    ogType: "article",
    image
  })}
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>
</head>
<body>
${header()}
<article class="section">
  <div class="wrap" style="max-width:880px">
    <div class="crumbs"><a href="/index.html">HOME</a> ／ <a href="/pages/journal.html">JOURNAL</a> ／ ${a.category}</div>
    <div class="article-hero"><img src="${a.image}" alt="${a.title}"></div>
    <div class="article prose">
      <div class="article-meta">${a.category}　|　${fmt(a.date)}　|　約${a.readMin}分で読めます</div>
      <h1>${a.title}</h1>
      ${a.body.trim()}
    </div>
    <div style="margin-top:48px"><a href="/pages/journal.html" class="btn ghost">JOURNAL 一覧へ戻る</a></div>
  </div>
</article>
${footer()}
${overlays()}`;
  fs.writeFileSync(path.join(artDir, `${a.slug}.html`), html);
});

/* ---------- sitemap 再生成（静的ページ＋記事） ---------- */
const staticUrls = [
  ["/", "weekly", "1.0"],
  ["/pages/products.html", "weekly", "0.9"],
  ["/pages/journal.html", "weekly", "0.8"],
  ["/pages/about.html", "monthly", "0.7"],
  ["/pages/contact.html", "monthly", "0.5"],
  ["/pages/law.html", "yearly", "0.3"],
  ["/pages/privacy.html", "yearly", "0.3"]
];
const urls = staticUrls.map(([u, f, p]) =>
  `  <url><loc>${SITE}${u}</loc><changefreq>${f}</changefreq><priority>${p}</priority></url>`
).concat(sorted.map(a =>
  `  <url><loc>${SITE}/pages/journal/${a.slug}.html</loc><lastmod>${a.date}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
)).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

console.log(`✓ journal.html + ${sorted.length} articles + sitemap.xml generated`);
