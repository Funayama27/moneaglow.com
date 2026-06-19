"use client";

import { useEffect, useMemo, useState } from "react";

const heroImage =
  "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?auto=format&fit=crop&w=2000&q=90";

const categories = [
  {
    slug: "skincare",
    label: "SKINCARE",
    jp: "スキンケア",
    title: "肌本来の透明感を育てるケア",
    text: "乾燥、ゆらぎ、くすみ感に寄り添い、毎日の肌を静かに整えるライン。",
    match: "SKINCARE",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "makeup",
    label: "MAKEUP",
    jp: "メイクアップ",
    title: "自分らしさを引き出す色と質感",
    text: "誰かに近づくためではなく、あなたの表情を咲かせるカラーコスメ。",
    match: "MAKEUP",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "fragrance",
    label: "FRAGRANCE",
    jp: "フレグランス",
    title: "記憶に残る印象をまとう香り",
    text: "近づいた瞬間に残る、静かで美しい余韻をまとう香りのコレクション。",
    match: "FRAGRANCE",
    image:
      "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "inner-glow",
    label: "INNER GLOW",
    jp: "インナーグロウ",
    title: "内側から整える美容習慣",
    text: "外側の美しさだけでなく、毎日のリズムから自分らしい輝きを整える。",
    match: "INNER GLOW",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=90",
  },
];

const diagnosisQuestions = [
  {
    question: "朝、鏡を見たときに一番気になることは？",
    options: [
      { label: "乾燥やつっぱり", type: "skincare" },
      { label: "血色感のなさ", type: "makeup" },
      { label: "印象が薄いこと", type: "fragrance" },
      { label: "疲れが残る感じ", type: "inner-glow" },
    ],
  },
  {
    question: "理想の雰囲気に近いものは？",
    options: [
      { label: "透明感がある", type: "skincare" },
      { label: "華やかで印象的", type: "makeup" },
      { label: "静かに惹きつける", type: "fragrance" },
      { label: "自然体で健やか", type: "inner-glow" },
    ],
  },
  {
    question: "美容で一番続けたいものは？",
    options: [
      { label: "毎日の肌ケア", type: "skincare" },
      { label: "似合う色探し", type: "makeup" },
      { label: "香りの使い分け", type: "fragrance" },
      { label: "生活リズム改善", type: "inner-glow" },
    ],
  },
  {
    question: "今の自分に足したいものは？",
    options: [
      { label: "うるおい", type: "skincare" },
      { label: "彩り", type: "makeup" },
      { label: "余韻", type: "fragrance" },
      { label: "軽やかさ", type: "inner-glow" },
    ],
  },
  {
    question: "買い物で重視することは？",
    options: [
      { label: "肌への心地よさ", type: "skincare" },
      { label: "仕上がりの美しさ", type: "makeup" },
      { label: "印象に残る体験", type: "fragrance" },
      { label: "続けやすさ", type: "inner-glow" },
    ],
  },
  {
    question: "moneaに期待することは？",
    options: [
      { label: "肌を整えたい", type: "skincare" },
      { label: "似合う色を知りたい", type: "makeup" },
      { label: "自分の香りを見つけたい", type: "fragrance" },
      { label: "内側から変わりたい", type: "inner-glow" },
    ],
  },
];

const resultCopy = {
  skincare: {
    title: "Glow Skin Type",
    text: "あなたには、肌本来の透明感を育てるスキンケア中心の提案が合います。",
  },
  makeup: {
    title: "Bloom Color Type",
    text: "あなたには、自分らしさを引き出す色と質感のメイク提案が合います。",
  },
  fragrance: {
    title: "Memory Scent Type",
    text: "あなたには、印象を静かに残すフレグランス提案が合います。",
  },
  "inner-glow": {
    title: "Inner Glow Type",
    text: "あなたには、内側から整える美容習慣の提案が合います。",
  },
};

function filterByCategory(products, category) {
  if (!products.length) return [];
  const key = category.match.toLowerCase();
  const matched = products.filter((product) =>
    (product.category || "").toLowerCase().includes(key.split(" ")[0])
  );
  return matched.concat(products).slice(0, 4);
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoverSlug, setHoverSlug] = useState("");
  const [touchSlug, setTouchSlug] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!products.length) return;
    const timer = setInterval(() => {
      setFeatureIndex((current) => (current + 1) % products.length);
    }, 4600);
    return () => clearInterval(timer);
  }, [products]);

  useEffect(() => {
    const timer = setTimeout(() => setPopupOpen(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeCategory) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeCategory]);

  const featuredProduct = products[featureIndex];

  const diagnosisResult = useMemo(() => {
    if (answers.length < diagnosisQuestions.length) return null;
    const score = answers.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
  }, [answers]);

  const currentCategory = categories.find((item) => item.slug === activeCategory);

  function answerQuestion(type) {
    if (answers.length >= diagnosisQuestions.length) return;
    setAnswers((current) => [...current, type]);
  }

  function resetDiagnosis() {
    setAnswers([]);
  }

  function handleMemberSubmit(event) {
    event.preventDefault();
  }

  if (currentCategory) {
    const categoryProducts = filterByCategory(products, currentCategory);

    return (
      <main>
        <Header onCategorySelect={setActiveCategory} />

        <section className="subpageHero">
          <div className="subpageImage radialReveal imageZoom" style={imageVar(currentCategory.image)} />
          <div className="subpageCopy luxuryFade">
            <p className="eyebrow">{currentCategory.jp}</p>
            <h1>{currentCategory.label}</h1>
            <h2>{currentCategory.title}</h2>
            <p>{currentCategory.text}</p>
            <button className="ghostButton" onClick={() => setActiveCategory(null)}>
              ← TOPへ戻る
            </button>
          </div>
        </section>

        <section className="editorialSection productSection">
          <div className="sectionHead">
            <p className="eyebrow">SELECTED FOR {currentCategory.label}</p>
            <h2>{currentCategory.jp}のおすすめ</h2>
          </div>
          <div className="productGrid">
            {categoryProducts.map((product) => (
              <ProductCard key={`${currentCategory.slug}-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Header onCategorySelect={setActiveCategory} />

      <section className="hero">
        <div className="radialReveal imageZoom" style={imageVar(heroImage)} />
        <div className="heroOverlay" />
        <div className="heroCopy luxuryFade">
          <p className="brandMark">monea</p>
          <h1>
            <span>自分らしく美しくなりたい</span>
            <span>すべての人へ</span>
          </h1>
          <p className="heroSub">
            誰かになるためではなく、自分自身の魅力を見つけ、
            <br />
            花開かせるために。
          </p>
          <div className="heroActions">
            <a href="#diagnosis" className="solidButton">
              診断をはじめる
            </a>
            <a href="#member" className="outlineButton">
              メンバー登録
            </a>
          </div>
        </div>
        <div className="scrollHint">SCROLL</div>
      </section>

      <section id="member" className="memberBand editorialSection">
        <p className="eyebrow">MONEA MEMBER</p>
        <h2>メンバーはいつでも10%OFF</h2>
        <p className="memberLead">
          あなたらしい美しさのために。moneaのアイテムを特別な価格で。
        </p>
        <a href="#member-form" className="solidButton invert">
          メンバー登録
        </a>
      </section>

      <section className="editorialSection categorySection">
        <div className="sectionHead">
          <p className="eyebrow">DISCOVER MONEA</p>
          <h2>白黒の世界に、触れた瞬間だけ色が宿る。</h2>
        </div>

        <div className="categoryPanels">
          {categories.map((category) => {
            const active = hoverSlug === category.slug || touchSlug === category.slug;
            return (
              <article
                key={category.slug}
                className={`categoryPanel ${active ? "active" : ""}`}
                onMouseEnter={() => setHoverSlug(category.slug)}
                onMouseLeave={() => setHoverSlug("")}
                onClick={() =>
                  setTouchSlug((current) =>
                    current === category.slug ? "" : category.slug
                  )
                }
              >
                <div
                  className="panelImage hoverColor"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="panelShade" />
                <p className="panelIndex">0{categories.indexOf(category) + 1}</p>
                <div className="panelCopy">
                  <p className="panelJp">{category.jp}</p>
                  <h3>{category.label}</h3>
                  <p className="panelText">{category.title}</p>
                  <button
                    className="enterButton"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveCategory(category.slug);
                    }}
                  >
                    ENTER →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="products" className="editorialSection productFeature">
        <div className="sectionHead">
          <p className="eyebrow">AUTO CURATED</p>
          <h2>今のmoneaが選ぶアイテム</h2>
        </div>

        {featuredProduct && (
          <div className="featureProduct" key={featuredProduct.id}>
            <div className="featureImage radialReveal" style={imageVar(featuredProduct.image)} />
            <div className="featureCopy luxuryFade">
              <p className="eyebrow">{featuredProduct.category}</p>
              <h3>{featuredProduct.title}</h3>
              <p className="featureText">{featuredProduct.description}</p>
              <strong>{featuredProduct.price}</strong>
              <a href={featuredProduct.url} className="ghostButton dark">
                詳細を見る →
              </a>
            </div>
          </div>
        )}

        <div className="productGrid compact">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="diagnosis" className="diagnosis editorialSection">
        <div className="diagnosisImage hoverColor active" />
        <div className="diagnosisInner">
          <div className="sectionHead light">
            <p className="eyebrow">5 MINUTES DIAGNOSIS</p>
            <h2>あなたに似合うmoneaを見つける</h2>
          </div>

          {!diagnosisResult && (
            <div className="questionBox luxuryFade" key={answers.length}>
              <p className="questionCount">
                <span>{String(answers.length + 1).padStart(2, "0")}</span> / 0
                {diagnosisQuestions.length}
              </p>
              <h3>{diagnosisQuestions[answers.length].question}</h3>
              <div className="answerGrid">
                {diagnosisQuestions[answers.length].options.map((option) => (
                  <button key={option.label} onClick={() => answerQuestion(option.type)}>
                    {option.label}
                  </button>
                ))}
              </div>
              {answers.length > 0 && (
                <button className="textButton" onClick={resetDiagnosis}>
                  はじめからやり直す
                </button>
              )}
            </div>
          )}

          {diagnosisResult && (
            <div className="resultBox luxuryFade">
              <p className="eyebrow">YOUR RESULT</p>
              <h3>{resultCopy[diagnosisResult].title}</h3>
              <p className="resultText">{resultCopy[diagnosisResult].text}</p>
              <p className="resultRecommend">
                おすすめカテゴリ：
                {categories.find((c) => c.slug === diagnosisResult)?.label}
              </p>

              <div className="resultProducts">
                {filterByCategory(
                  products,
                  categories.find((c) => c.slug === diagnosisResult)
                ).map((product) => (
                  <ProductCard key={`result-${product.id}`} product={product} />
                ))}
              </div>

              <div className="resultActions">
                <button
                  className="solidButton invert"
                  onClick={() => setActiveCategory(diagnosisResult)}
                >
                  おすすめを見る →
                </button>
                <button className="textButton" onClick={resetDiagnosis}>
                  もう一度診断する
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="member-form" className="memberForm editorialSection">
        <p className="eyebrow">JOIN MONEA</p>
        <h2>メンバー登録</h2>
        <p className="memberLead">
          登録すると、moneaのアイテムをいつでも10%OFFでご利用いただけます。
        </p>
        <form onSubmit={handleMemberSubmit}>
          <input type="text" placeholder="お名前" />
          <input type="email" placeholder="メールアドレス" />
          <button type="submit" className="solidButton">
            登録する
          </button>
        </form>
      </section>

      <footer className="footer">
        <p className="footerMark">monea</p>
        <span>自分自身の魅力を見つけ、花開かせるために。</span>
      </footer>

      {popupOpen && (
        <div className="memberPopup luxuryFade">
          <button className="popupClose" onClick={() => setPopupOpen(false)} aria-label="閉じる">
            ×
          </button>
          <p className="eyebrow">MEMBER ONLY</p>
          <h3>メンバーはいつでも10%OFF</h3>
          <a href="#member-form" className="solidButton" onClick={() => setPopupOpen(false)}>
            メンバー登録
          </a>
        </div>
      )}
    </main>
  );
}

function imageVar(url) {
  return { "--image": `url(${url})` };
}

function Header({ onCategorySelect }) {
  return (
    <header className="header">
      <button className="logo" onClick={() => onCategorySelect(null)}>
        monea
      </button>
      <nav aria-label="Main navigation">
        {categories.map((category) => (
          <button key={category.slug} onClick={() => onCategorySelect(category.slug)}>
            {category.label}
          </button>
        ))}
        <a href="#diagnosis">DIAGNOSIS</a>
        <a href="#member">MEMBER</a>
      </nav>
    </header>
  );
}

function ProductCard({ product }) {
  return (
    <a className="productCard" href={product.url}>
      <div className="productImage hoverColor" style={{ backgroundImage: `url(${product.image})` }} />
      <div className="productMeta">
        <p>{product.category}</p>
        <h3>{product.title}</h3>
        <span>{product.price}</span>
      </div>
    </a>
  );
}
