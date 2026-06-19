"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────
   画像 URL
────────────────────────────────────────────── */
const IMAGES = {
  // 高級コスメ広告風・外国人女性ポートレート
  hero:        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2800&q=95",
  // フェイスマスク・スパ・集中ケア
  specialCare: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=2800&q=95",
  // 洗顔・クレンジング泡・清潔感
  cleanser:    "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=2800&q=95",
  // 化粧水ボトル・水しずく・うるおい
  toner:       "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=2800&q=95",
  // スポイト付きガラスボトル・美容液
  serum:       "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1800&q=95",
  // 白いクリームジャー・保湿クリーム
  cream:       "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1800&q=95",
  // 目元クローズアップ・繊細なアイケア
  eyecream:    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=2800&q=95",
  // ボディオイル・なめらかな肌
  body:        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2800&q=95",
  // スキンケア商品フラットレイ・肌診断
  diagnosis:   "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=2800&q=95",
  // 3人の外国人女性が正面で笑っている
  member:      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=2800&q=95",
};

/* ──────────────────────────────────────────────
   Topbar
────────────────────────────────────────────── */
function Topbar() {
  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        <button className="hamburger-icon" aria-label="メニューを開く" />
        <span>メニュー</span>
      </div>

      <a className="topbar-brand" href="#" aria-label="monea トップへ">
        MONEA
      </a>

      <div className="topbar-right">
        <button className="topbar-icon-btn" aria-label="検索">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>
        <button className="topbar-icon-btn" aria-label="アカウント">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
        <button className="topbar-icon-btn" aria-label="お気に入り">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z" />
          </svg>
        </button>
        <button className="topbar-icon-btn" aria-label="カート">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────────────
   HeroMultiBloom
   最初モノトーン → 12箇所から同時多発的に色づく演出
────────────────────────────────────────────── */
function HeroMultiBloom() {
  const [blobs, setBlobs]         = useState([]);
  const [fullColor, setFullColor] = useState(false);
  const [swept, setSwept]         = useState(false);

  useEffect(() => {
    // 顔中心から外側へ向かって配置した12点
    const positions = [
      { x: 50, y: 30 },  // 顔の中心
      { x: 41, y: 36 },  // 左頬
      { x: 59, y: 36 },  // 右頬
      { x: 50, y: 16 },  // 額・髪
      { x: 22, y: 28 },  // 左背景
      { x: 78, y: 30 },  // 右背景
      { x: 34, y: 58 },  // 首もと左
      { x: 65, y: 58 },  // 首もと右
      { x: 10, y: 65 },  // 左下
      { x: 88, y: 60 },  // 右下
      { x: 50, y: 82 },  // 下部中央
      { x:  5, y: 12 },  // 左上隅
    ];

    positions.forEach((pos, i) => {
      setTimeout(() => {
        setBlobs((prev) => [...prev, { id: i, x: pos.x, y: pos.y }]);
      }, 500 + i * 280);
    });

    // ブロブが十分重なったらフルカラーへクロスフェード
    const crossFadeAt = 500 + (positions.length - 3) * 280 + 1400;
    setTimeout(() => setFullColor(true), crossFadeAt);

    // 最後の光スウィープ
    setTimeout(() => setSwept(true), crossFadeAt + 1100);
  }, []);

  return (
    <section
      className="campaign tall hero-main"
      style={{
        "--img": `url('${IMAGES.hero}')`,
        "--pos": "center 30%",
      }}
      aria-label="メインビジュアル"
    >
      {/* グレースケールベース */}
      <div className="hero-gray" aria-hidden="true" />

      {/* 各色づきブロブ */}
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="hero-blob"
          style={{ "--bx": `${blob.x}%`, "--by": `${blob.y}%` }}
          aria-hidden="true"
        />
      ))}

      {/* 全面カラーオーバーレイ（最終仕上げ） */}
      <div
        className={`hero-full-color${fullColor ? " visible" : ""}`}
        aria-hidden="true"
      />

      {/* 光スウィープ */}
      <div
        className={`hero-sweep${swept ? " play" : ""}`}
        aria-hidden="true"
      />

      <div className="campaign-copy">
        <h1 className="campaign-title jp">
          自分らしく美しくなりたい<br />すべての人へ
        </h1>
        <p className="campaign-sub">
          誰かになるためではなく、自分自身の魅力を見つけ、花開かせるために
        </p>
        <a className="campaign-button" href="#diagnosis">診断をはじめる</a>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   BloomSection — ホバーで色づく + 触れたら光る
────────────────────────────────────────────── */
function BloomSection({ className = "", style = {}, children, ...rest }) {
  const ref      = useRef(null);
  const [cssVars, setCssVars] = useState({ "--x": "50%", "--y": "50%", "--r": "0px" });
  const waves    = useRef([]);
  const [waveList, setWaveList]   = useState([]);
  const [shineKey, setShineKey]   = useState(0);
  const nextId   = useRef(0);

  const setPos = useCallback((x, y) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((x - rect.left) / rect.width)  * 100;
    const py = ((y - rect.top)  / rect.height) * 100;
    setCssVars({ "--x": `${px}%`, "--y": `${py}%`, "--r": "0px" });
  }, []);

  const spawnWave = useCallback((x, y) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const id = nextId.current++;
    const wx = x - rect.left;
    const wy = y - rect.top;
    const newWave = { id, wx, wy };
    waves.current = [...waves.current, newWave];
    setWaveList([...waves.current]);
    setTimeout(() => {
      waves.current = waves.current.filter((w) => w.id !== id);
      setWaveList([...waves.current]);
    }, 1400);
  }, []);

  const handleMouseMove  = (e) => setPos(e.clientX, e.clientY);
  const handleMouseEnter = ()  => setShineKey((k) => k + 1);
  const handleClick      = (e) => spawnWave(e.clientX, e.clientY);
  const handleTouch      = (e) => {
    const t = e.touches[0];
    if (t) { setPos(t.clientX, t.clientY); spawnWave(t.clientX, t.clientY); }
  };

  return (
    <section
      ref={ref}
      className={`campaign bloom ${className}`}
      style={{ ...style, ...cssVars }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onTouchStart={handleTouch}
      {...rest}
    >
      {children}
      {/* マウス進入ごとに新しいキーでマウントし直してアニメーションを再生 */}
      {shineKey > 0 && (
        <div key={shineKey} className="section-shine" aria-hidden="true" />
      )}
      {waveList.map((w) => (
        <div
          key={w.id}
          className="bloom-wave"
          style={{ "--wave-x": `${w.wx}px`, "--wave-y": `${w.wy}px` }}
          aria-hidden="true"
        />
      ))}
    </section>
  );
}

/* ──────────────────────────────────────────────
   MemberPopup
────────────────────────────────────────────── */
function MemberPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <aside className="site-popup" role="dialog" aria-modal="true" aria-label="メンバー登録">
      <button className="popup-close" onClick={() => setOpen(false)} aria-label="閉じる">
        ×
      </button>
      <p className="popup-eyebrow">MEMBER ONLY</p>
      <h3>メンバーは<br />いつでも10%OFF</h3>
      <a href="#member" className="popup-btn" onClick={() => setOpen(false)}>
        登録する
      </a>
    </aside>
  );
}

/* ──────────────────────────────────────────────
   Page
────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Topbar />

      <main>
        {/* ① メインビジュアル */}
        <HeroMultiBloom />

        {/* ② SPECIAL CARE */}
        <BloomSection
          className="clean"
          style={{ "--img": `url('${IMAGES.specialCare}')`, "--pos": "center 48%" }}
          aria-label="Special Care"
        >
          <div className="campaign-gray"  aria-hidden="true" />
          <div className="campaign-color" aria-hidden="true" />
          <div className="campaign-copy">
            <h2 className="campaign-title">SPECIAL CARE</h2>
            <p className="campaign-sub">いつものケアに、特別な一滴と余白を</p>
            <a className="campaign-button" href="#">スペシャルケアを見る</a>
          </div>
        </BloomSection>

        {/* ③ CLEANSER */}
        <BloomSection
          className="clean"
          style={{ "--img": `url('${IMAGES.cleanser}')`, "--pos": "center 52%" }}
          aria-label="Cleanser"
        >
          <div className="campaign-gray"  aria-hidden="true" />
          <div className="campaign-color" aria-hidden="true" />
          <div className="campaign-copy">
            <h2 className="campaign-title">CLEANSER</h2>
            <p className="campaign-sub">一日の始まりと終わりに、肌を静かにリセットする</p>
            <a className="campaign-button" href="#">クレンザーを見る</a>
          </div>
        </BloomSection>

        {/* ④ TONER */}
        <BloomSection
          style={{ "--img": `url('${IMAGES.toner}')`, "--pos": "center 50%" }}
          aria-label="Toner"
        >
          <div className="campaign-gray"  aria-hidden="true" />
          <div className="campaign-color" aria-hidden="true" />
          <div className="campaign-copy">
            <h2 className="campaign-title">TONER</h2>
            <p className="campaign-sub">うるおいの通り道を整え、肌の印象をなめらかに</p>
            <a className="campaign-button" href="#">トナーを見る</a>
          </div>
        </BloomSection>

        {/* ⑤⑥ SERUM + CREAM (split) */}
        <div className="split-promo" role="group" aria-label="Serum と Cream">
          <SplitItem
            img={IMAGES.serum}
            pos="center"
            title="SERUM"
            sub="透明感を集中して育てる"
            btnLabel="美容液を見る"
          />
          <SplitItem
            img={IMAGES.cream}
            pos="center"
            title="CREAM"
            sub="肌を包み、うるおいを閉じ込める"
            btnLabel="クリームを見る"
          />
        </div>

        {/* ⑦ EYECREAM */}
        <BloomSection
          className="clean"
          style={{ "--img": `url('${IMAGES.eyecream}')`, "--pos": "center 46%" }}
          aria-label="Eye Cream"
        >
          <div className="campaign-gray"  aria-hidden="true" />
          <div className="campaign-color" aria-hidden="true" />
          <div className="campaign-copy">
            <h2 className="campaign-title">EYECREAM</h2>
            <p className="campaign-sub">目もとの印象に、繊細な明るさとハリを</p>
            <a className="campaign-button" href="#">アイクリームを見る</a>
          </div>
        </BloomSection>

        {/* ⑧ BODY */}
        <BloomSection
          style={{ "--img": `url('${IMAGES.body}')`, "--pos": "center 48%" }}
          aria-label="Body"
        >
          <div className="campaign-gray"  aria-hidden="true" />
          <div className="campaign-color" aria-hidden="true" />
          <div className="campaign-copy">
            <h2 className="campaign-title">BODY</h2>
            <p className="campaign-sub">肌に触れるたび、自分を大切にしている実感を</p>
            <a className="campaign-button" href="#">ボディケアを見る</a>
          </div>
        </BloomSection>

        {/* ⑨ DIAGNOSIS */}
        <BloomSection
          id="diagnosis"
          className="short"
          style={{ "--img": `url('${IMAGES.diagnosis}')`, "--pos": "center 44%" }}
          aria-label="肌診断"
        >
          <div className="campaign-gray"  aria-hidden="true" />
          <div className="campaign-color" aria-hidden="true" />
          <div className="campaign-copy">
            <h2 className="campaign-title jp">5分で見つける<br />あなたのケア</h2>
            <p className="campaign-sub">簡単な診断で、今のあなたに合う商品カテゴリを提案します</p>
            <a className="campaign-button" href="#">診断する</a>
          </div>
        </BloomSection>

        {/* ⑩ MEMBER */}
        <MemberSection />

        {/* サービスエリア */}
        <div className="service-bar">
          <div className="service-grid">
            <div className="service-card">
              <h3>SKIN DIAGNOSIS</h3>
              <p>5つの質問に答えるだけで、今のあなたに最適なスキンケアカテゴリをご提案します。</p>
              <a href="#">詳しく見る</a>
            </div>
            <div className="service-card">
              <h3>MONEA MEMBER</h3>
              <p>メンバー登録で、すべてのアイテムがいつでも10%OFF。特別なケア体験をあなたに。</p>
              <a href="#member">登録はこちら</a>
            </div>
            <div className="service-card">
              <h3>BEAUTY JOURNAL</h3>
              <p>肌の悩みに寄り添うビューティーコンテンツを随時更新。あなたの日常ケアをより豊かに。</p>
              <a href="#">ジャーナルを読む</a>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>MONEA</h3>
            <p>自分らしく美しくなりたい<br />すべての人へ</p>
          </div>
          <div className="footer-col">
            <h3>CATEGORY</h3>
            <a href="#">Special Care</a>
            <a href="#">Cleanser</a>
            <a href="#">Toner</a>
            <a href="#">Serum</a>
            <a href="#">Cream</a>
            <a href="#">Eye Cream</a>
            <a href="#">Body</a>
          </div>
          <div className="footer-col">
            <h3>SERVICES</h3>
            <a href="#">肌診断</a>
            <a href="#">メンバー登録</a>
            <a href="#">ビューティージャーナル</a>
          </div>
          <div className="footer-col">
            <h3>SUPPORT</h3>
            <a href="#">お問い合わせ</a>
            <a href="#">特定商取引法に基づく表記</a>
            <a href="#">プライバシーポリシー</a>
            <a href="#">利用規約</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 monea. All rights reserved.</span>
          <span>自分自身の魅力を見つけ、花開かせるために。</span>
        </div>
      </footer>

      <MemberPopup />
    </>
  );
}

/* ──────────────────────────────────────────────
   SplitItem — split-promo 内の左右セクション（光る演出付き）
────────────────────────────────────────────── */
function SplitItem({ img, pos, title, sub, btnLabel }) {
  const ref     = useRef(null);
  const [cssVars, setCssVars]   = useState({ "--x": "50%", "--y": "50%", "--r": "0px" });
  const waves   = useRef([]);
  const [waveList, setWaveList] = useState([]);
  const [shineKey, setShineKey] = useState(0);
  const nextId  = useRef(0);

  const spawnWave = (clientX, clientY) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const id = nextId.current++;
    const newWave = { id, wx: clientX - rect.left, wy: clientY - rect.top };
    waves.current = [...waves.current, newWave];
    setWaveList([...waves.current]);
    setTimeout(() => {
      waves.current = waves.current.filter((w) => w.id !== id);
      setWaveList([...waves.current]);
    }, 1400);
  };

  const handleMouseMove  = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width)  * 100;
    const py = ((e.clientY - rect.top)  / rect.height) * 100;
    setCssVars({ "--x": `${px}%`, "--y": `${py}%`, "--r": "0px" });
  };
  const handleMouseEnter = ()  => setShineKey((k) => k + 1);

  return (
    <div
      ref={ref}
      className="split-item bloom"
      style={{ "--img": `url('${img}')`, "--pos": pos, ...cssVars }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onClick={(e) => spawnWave(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) spawnWave(t.clientX, t.clientY);
      }}
    >
      <div className="campaign-gray"  aria-hidden="true" />
      <div className="campaign-color" aria-hidden="true" />
      <div className="campaign-copy">
        <h2 className="campaign-title">{title}</h2>
        <p className="campaign-sub">{sub}</p>
        <a className="campaign-button" href="#">{btnLabel}</a>
      </div>
      {shineKey > 0 && (
        <div key={shineKey} className="section-shine" aria-hidden="true" />
      )}
      {waveList.map((w) => (
        <div
          key={w.id}
          className="bloom-wave"
          style={{ "--wave-x": `${w.wx}px`, "--wave-y": `${w.wy}px` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   MemberSection — member-smooth 演出
────────────────────────────────────────────── */
function MemberSection() {
  const [active, setActive] = useState(false);

  return (
    <section
      id="member"
      className={`campaign member-smooth ${active ? "active" : ""}`}
      style={{ "--img": `url('${IMAGES.member}')`, "--pos": "center 45%" }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={() => setActive(true)}
      aria-label="メンバー登録"
    >
      <div className="campaign-gray"  aria-hidden="true" />
      <div className="campaign-color" aria-hidden="true" />
      <div className="campaign-copy">
        <h2 className="campaign-title jp">
          メンバーは<br />いつでも10%OFF
        </h2>
        <p className="campaign-sub">monea member</p>
        <a className="campaign-button" href="#">メンバー登録</a>
      </div>
    </section>
  );
}
