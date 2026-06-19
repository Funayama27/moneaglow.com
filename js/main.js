/* ============================================================
   MONEA GLOW — main.js
   ※ 商品データは Shopify Storefront 連携に差し替えられる形で
     ここに仮置きしています（TODO: Shopify）。
   ============================================================ */

/* ---------- SVG パーツ（化粧品容器：本物画像の代わり） ---------- */
const SVG = {
  bottle:`<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#E3CBBC"/></linearGradient></defs><rect x="22" y="4" width="16" height="9" rx="2" fill="#B08D57"/><rect x="25" y="11" width="10" height="6" fill="#C9AE86"/><rect x="16" y="17" width="28" height="62" rx="9" fill="url(#g1)" stroke="#B08D57" stroke-width="1"/><rect x="21" y="40" width="18" height="22" rx="3" fill="#fff" opacity=".55"/><line x1="24" y1="46" x2="36" y2="46" stroke="#B08D57" stroke-width="1"/><line x1="24" y1="52" x2="33" y2="52" stroke="#C9AE86" stroke-width="1"/>`,
  bottleGold:`<defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4D2B4"/><stop offset="1" stop-color="#B08D57"/></linearGradient></defs><rect x="22" y="4" width="16" height="9" rx="2" fill="#EFE7DC"/><rect x="25" y="11" width="10" height="6" fill="#D9C9B0"/><rect x="16" y="17" width="28" height="62" rx="9" fill="url(#gg)" stroke="#EFE7DC" stroke-width="1"/><rect x="21" y="40" width="18" height="22" rx="3" fill="#fff" opacity=".25"/>`,
  jar:`<defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#DCC9B6"/></linearGradient></defs><ellipse cx="30" cy="34" rx="22" ry="6" fill="#B08D57"/><rect x="8" y="34" width="44" height="14" fill="#C9AE86"/><ellipse cx="30" cy="48" rx="22" ry="6" fill="#B08D57"/><rect x="11" y="48" width="38" height="30" rx="4" fill="url(#g2)" stroke="#B08D57" stroke-width="1"/><ellipse cx="30" cy="78" rx="19" ry="5" fill="#E3CBBC"/><ellipse cx="30" cy="34" rx="22" ry="6" fill="#C9AE86" opacity=".5"/>`,
  drop:`<defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#D9C2CE"/></linearGradient></defs><rect x="24" y="2" width="12" height="20" rx="3" fill="#B08D57"/><rect x="26" y="22" width="8" height="6" fill="#C9AE86"/><rect x="19" y="28" width="22" height="52" rx="8" fill="url(#g3)" stroke="#B08D57" stroke-width="1"/><rect x="27" y="6" width="6" height="40" rx="3" fill="#fff" opacity=".5"/><rect x="23" y="44" width="14" height="30" rx="3" fill="#fff" opacity=".4"/>`,
  tube:`<defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E4D2B4"/></linearGradient></defs><rect x="25" y="3" width="10" height="12" rx="2" fill="#B08D57"/><path d="M19 15 h22 v55 a4 4 0 0 1 -4 4 h-14 a4 4 0 0 1 -4 -4 z" fill="url(#g4)" stroke="#B08D57" stroke-width="1"/><line x1="24" y1="36" x2="36" y2="36" stroke="#B08D57" stroke-width="1"/><line x1="24" y1="42" x2="33" y2="42" stroke="#C9AE86" stroke-width="1"/>`
};
function paint(svg){return svg.replace(/__BOTTLE_GOLD__/g,SVG.bottleGold).replace(/__BOTTLE__/g,SVG.bottle).replace(/__JAR__/g,SVG.jar).replace(/__DROP__/g,SVG.drop).replace(/__TUBE__/g,SVG.tube);}
document.body.innerHTML = paint(document.body.innerHTML);

/* ---------- 商品データ（仮置き：TODO Shopify Storefront 連携） ---------- */
const products = [
  {n:"オーロラ クレンジングバーム",en:"Aurora Cleansing Balm",c:"CLEANSE",p:6600,img:"/assets/products/7815016.jpg",tag:"NEW"},
  {n:"ネロリ ブラン トナー",en:"Néroli Blanc Toner",c:"TONE",p:5500,img:"/assets/products/7814991.jpg",tag:"NEW"},
  {n:"ローズ ド ニュイ セラム",en:"Rose de Nuit Serum",c:"SERUM",p:12100,img:"/assets/products/7796975.jpg",tag:""},
  {n:"シルク モイスチャークリーム",en:"Silk Moisture Cream",c:"CREAM",p:9900,img:"/assets/products/8049849.jpg",tag:""},
  {n:"ゴールド リフティングマスク",en:"Gold Lifting Mask",c:"MASK",p:7700,img:"/assets/products/7691166.jpg",tag:"NEW"},
  {n:"ルミエール UVプロテクター",en:"Lumière UV Protector",c:"UV",p:4950,img:"/assets/products/8049841.jpg",tag:""},
  {n:"ナイトリペア オイルセラム",en:"Night Repair Oil",c:"SERUM",p:11000,img:"/assets/products/8101147.jpg",tag:""},
  {n:"アイ ブライトニングクリーム",en:"Eye Brightening Cream",c:"EYE",p:8800,img:"/assets/products/7005933.jpg",tag:""}
];
const yen = v => "¥" + v.toLocaleString("ja-JP");

function cardHTML(pr,i){
  return `<article class="card reveal">
    <div class="card-media">
      ${pr.tag?`<span class="tag">${pr.tag}</span>`:""}
      <button class="fav" onclick="togFav(this)" aria-label="お気に入り"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.3 8.6 1.7 5 5.2 5c2 0 3.3 1.1 4 2.2C9.9 6.1 11.2 5 13.2 5c3.5 0 4.9 3.6 3.2 6.8C20 16.4 12 21 12 21z" transform="translate(.8 0)"/></svg></button>
      <a href="/pages/product.html?i=${i}" class="card-media-link" style="position:absolute;inset:0;z-index:1"></a>
      <img class="card-img" src="${pr.img}" alt="${pr.n}" loading="lazy">
    </div>
    <div class="card-body">
      <div class="card-cat">${pr.c}</div>
      <div class="card-name">${pr.n}</div>
      <div class="card-en">${pr.en}</div>
      <div class="card-price">${yen(pr.p)} <small>税込</small></div>
      <button class="add" onclick='addCart(${i})'>カートに入れる</button>
    </div>
  </article>`;
}

/* ホームページ用グリッド（存在する時だけ描画） */
const newGrid = document.getElementById("newGrid");
if(newGrid) newGrid.innerHTML = products.slice(0,4).map((p,i)=>cardHTML(p,i)).join("");
const bestGrid = document.getElementById("bestGrid");
if(bestGrid) bestGrid.innerHTML = products.slice(4,8).map((p,i)=>cardHTML(p,i+4)).join("");

/* 商品一覧ページ用グリッド */
const allGrid = document.getElementById("allGrid");
if(allGrid){
  const render = (filter)=>{
    allGrid.innerHTML = products
      .map((p,i)=>({p,i}))
      .filter(o=>!filter||filter==="ALL"||o.p.c===filter)
      .map(o=>cardHTML(o.p,o.i)).join("");
    initReveal();
  };
  render("ALL");
  document.querySelectorAll(".filter-bar button").forEach(b=>{
    b.addEventListener("click",()=>{
      document.querySelectorAll(".filter-bar button").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      render(b.dataset.cat);
    });
  });
}

/* 商品詳細ページ */
const pdRoot = document.getElementById("pdRoot");
if(pdRoot){
  const params = new URLSearchParams(location.search);
  const i = Math.max(0, Math.min(products.length-1, parseInt(params.get("i")||"0",10)));
  const pr = products[i];
  document.title = `${pr.n}｜MONEA GLOW`;
  pdRoot.innerHTML = `
    <div class="pd">
      <div class="pd-media">${pr.tag?`<span class="tag">${pr.tag}</span>`:""}<img src="${pr.img}" alt="${pr.n}"></div>
      <div class="pd-info">
        <div class="pd-cat">${pr.c}</div>
        <h1>${pr.n}</h1>
        <div class="en">${pr.en}</div>
        <div class="price">${yen(pr.p)} <small>税込</small></div>
        <p class="desc">あなた本来のツヤと輝きにそっと寄り添う、MONEA GLOW のスキンケア。厳選した成分とていねいな処方で、毎日のケアを特別な時間へ。</p>
        <div class="qty-row">
          <span style="font-size:.76rem;letter-spacing:.1em;color:var(--ink-soft)">数量</span>
          <div class="ci-qty"><button onclick="pdQty(-1)">−</button><span id="pdQ">1</span><button onclick="pdQty(1)">＋</button></div>
        </div>
        <button class="add" onclick="addCart(${i}, document.getElementById('pdQ')?+document.getElementById('pdQ').textContent:1)">カートに入れる</button>
        <div class="buy-embed"><!-- TODO: Shopify Buy Button embed here -->※ 本番では、ここに Shopify のチェックアウト（Buy Button）が接続されます</div>
      </div>
    </div>`;
  initReveal();
}
function pdQty(d){const e=document.getElementById("pdQ");let q=parseInt(e.textContent,10)+d;if(q<1)q=1;e.textContent=q;}

/* ---------- カート ---------- */
let cart = [];
function addCart(i, q){
  q = q || 1;
  const ex = cart.find(c=>c.i===i);
  if(ex) ex.q += q; else cart.push({i, q});
  renderCart(); showToast("カートに追加しました"); openCart();
}
function renderCart(){
  const body = document.getElementById("cartBody");
  if(!body) return;
  const count = cart.reduce((s,c)=>s+c.q,0);
  const total = cart.reduce((s,c)=>s+products[c.i].p*c.q,0);
  const cc = document.getElementById("cartCount");
  if(cc){cc.textContent=count;cc.classList.toggle("show",count>0);}
  const sub = document.getElementById("subtotal");
  if(sub) sub.textContent = yen(total);
  if(!cart.length){body.innerHTML=`<div class="empty-cart"><svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg><p>バッグは空です</p></div>`;return;}
  body.innerHTML = cart.map((c,ci)=>{const pr=products[c.i];return `<div class="cart-item">
    <div class="thumb"><img src="${pr.img}" alt="${pr.n}" loading="lazy"></div>
    <div class="ci-info"><div class="ci-name">${pr.n}</div><div class="ci-price">${yen(pr.p)}</div>
      <div class="ci-qty"><button onclick="qty(${ci},-1)">−</button><span>${c.q}</span><button onclick="qty(${ci},1)">＋</button></div>
      <a class="ci-remove" onclick="rm(${ci})">削除</a>
    </div></div>`;}).join("");
}
function qty(ci,d){cart[ci].q+=d;if(cart[ci].q<1)cart.splice(ci,1);renderCart();}
function rm(ci){cart.splice(ci,1);renderCart();}
function fakeCheckout(){showToast("本番ではShopifyの決済画面に進みます");}

/* ---------- お気に入り ---------- */
function togFav(b){b.classList.toggle("active");showToast(b.classList.contains("active")?"お気に入りに追加しました":"お気に入りから削除しました");}

/* ---------- 開閉系 ---------- */
const ov = document.getElementById("overlay");
function openCart(){const d=document.getElementById("drawer");if(d)d.classList.add("show");if(ov)ov.classList.add("show");}
function openSearch(){const m=document.getElementById("searchModal");if(m){m.classList.add("show");setTimeout(()=>{const s=document.getElementById("searchInput");if(s)s.focus();},300);}}
function closeSearch(){const m=document.getElementById("searchModal");if(m)m.classList.remove("show");}
function toggleMenu(o){const m=document.getElementById("mmenu");if(m)m.classList.toggle("show",o);if(ov)ov.classList.toggle("show",o);}
function acc(b){b.parentElement.classList.toggle("open");}
function closeAll(){const d=document.getElementById("drawer");if(d)d.classList.remove("show");const m=document.getElementById("mmenu");if(m)m.classList.remove("show");if(ov)ov.classList.remove("show");}

/* ---------- ポップアップ（滞在トリガー） ---------- */
let popupDone = false;
function showPopup(){const p=document.getElementById("popup");if(!p||popupDone)return;if(sessionStorage.getItem("mg_popup"))return;p.classList.add("show");popupDone=true;sessionStorage.setItem("mg_popup","1");}
function closePopup(){const p=document.getElementById("popup");if(p)p.classList.remove("show");}
function claimOffer(e){e.preventDefault();closePopup();showToast("クーポンコード WELCOME10 を送信しました");return false;}
if(document.getElementById("popup")){
  setTimeout(showPopup,15000); // 15秒滞在で表示
  document.addEventListener("mouseout",e=>{if(e.clientY<=0&&!popupDone)showPopup();}); // 離脱（exit intent）
}

/* ---------- その他 ---------- */
function subscribe(e){e.preventDefault();e.target.reset();showToast("ご登録ありがとうございます");return false;}
let toastT;
function showToast(m){const t=document.getElementById("toast");if(!t)return;const tm=document.getElementById("toastMsg");if(tm)tm.textContent=m;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),2600);}

/* hero cinematic slideshow */
const heroScenes = document.querySelectorAll(".hero-scene");
if(heroScenes.length > 1){
  const heroDots = document.querySelectorAll(".hero-dot");
  const HERO_INTERVAL = 6000;
  let hsIdx = 0, hsTimer;
  function setScene(n){
    hsIdx = (n + heroScenes.length) % heroScenes.length;
    heroScenes.forEach((s,i)=>s.classList.toggle("active", i===hsIdx));
    heroDots.forEach((d,i)=>{
      d.classList.remove("active");
      if(i===hsIdx){ void d.offsetWidth; d.classList.add("active"); } // restart fill animation
    });
  }
  function heroRestart(){ clearInterval(hsTimer); hsTimer = setInterval(()=>setScene(hsIdx+1), HERO_INTERVAL); }
  window.goScene = function(n){ setScene(n); heroRestart(); };
  heroRestart();
}

/* announce rotation */
const aSpans = document.querySelectorAll("#announce span");
if(aSpans.length){let ai=0;setInterval(()=>{aSpans[ai].classList.remove("on");ai=(ai+1)%aSpans.length;aSpans[ai].classList.add("on");},4000);}

/* scroll reveal */
let io;
function initReveal(){
  if(!io) io = new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}}),{threshold:.12});
  document.querySelectorAll(".reveal:not(.in)").forEach(el=>io.observe(el));
}
initReveal();

/* esc閉じる */
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAll();closeSearch();closePopup();}});
renderCart();
