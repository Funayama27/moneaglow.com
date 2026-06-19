"use client";

import { useEffect, useMemo, useState } from "react";

const heroImage =
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1800&q=85";

const categories = [
  {
    slug: "skincare",
    label: "SKINCARE",
    jp: "スキンケア",
    title: "肌本来の透明感を育てるケア",
    text: "乾燥、ゆらぎ、くすみ感に寄り添い、毎日の肌を静かに整えるライン。",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=85",
  },
  {
    slug: "makeup",
    label: "MAKEUP",
    jp: "メイクアップ",
    title: "自分らしさを引き出す色と質感",
    text: "誰かに近づくためではなく、あなたの表情を咲かせるカラーコスメ。",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=85",
  },
  {
    slug: "fragrance",
    label: "FRAGRANCE",
    jp: "フレグランス",
    title: "記憶に残る印象をまとう香り",
    text: "近づいた瞬間に残る、静かで美しい余韻をまとう香りのコレクション。",
    image:
      "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1400&q=85",
  },
  {
    slug: "inner-glow",
    label: "INNER GLOW",
    jp: "インナーグロウ",
    title: "内側から整える美容習慣",
    text: "外側の美しさだけでなく、毎日のリズムから自分らしい輝きを整える。",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85",
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

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [touchSlug, setTouchSlug] = useState("");
  const [popupOpen, setPopupOpen] = useState(true);
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
    }, 4200);

    return () => clearInterval(timer);
  }, [products]);

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
    const categoryProducts = products
      .filter((product) =>
        product.category
          ?.toLowerCase()
          .includes(currentCategory.label.toLowerCase().split(" ")[0])
      )
      .concat(products)
      .slice(0, 4);

    return (
      <main>
        <Header onCategorySelect={setActiveCategory} />
        <section className="subpageHero">
          <div
            className="subpageImage colorReveal"
            style={{ "--image": `url(${currentCategory.image})` }}
          />
          <div className="subpageCopy">
            <p className="eyebrow">{currentCategory.jp}</p>
            <h1>{currentCategory.label}</h1>
            <h2>{currentCategory.title}</h2>
            <p>{currentCategory.text}</p>
            <button className="lineButton" onClick={() => setActiveCategory(null)}>
              TOPへ戻る
            </button>
          </div>
        </section>

        <section className="section productSection">
          <div className="sectionTitle">
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
        <div
          className="heroImage colorReveal autoReveal"
          style={{ "--image": `url(${heroImage})` }}
        />
        <div className="heroCopy">
          <p className="brandMark">monea</p>
          <h1>自分らしく美しくなりたいすべての人へ</h1>
          <p>
            誰かになるためではなく、自分自身の魅力を見つけ、
            <br />
            花開かせるために。
          </p>
          <div className="heroActions">
            <a href="#diagnosis" className="darkButton">
              診断をはじめる
            </a>
            <a href="#member" className="lightButton">
              メンバー登録
            </a>
          </div>
        </div>
      </section>

      <section id="member" className="memberBand">
        <p>MEMBER BENEFIT</p>
        <h2>メンバーはいつでも10%OFF</h2>
        <a href="#member-form">メンバー登録</a>
      </section>

      <section className="section">
        <div className="sectionTitle">
          <p className="eyebrow">DISCOVER MONEA</p>
          <h2>白黒の美しさが、触れた瞬間に色づく。</h2>
        </div>

        <div className="categoryGrid">
          {categories.map((category) => (
            <button
              key={category.slug}
              className={`categoryCard ${touchSlug === category.slug ? "touchActive" : ""}`}
              onClick={() => setActiveCategory(category.slug)}
              onTouchStart={() => setTouchSlug(category.slug)}
            >
              <div
                className="categoryImage"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="categoryCopy">
                <p>{category.jp}</p>
                <h3>{category.label}</h3>
                <span>{category.title}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="products" className="section productFeature">
        <div className="sectionTitle">
          <p className="eyebrow">AUTO CURATED</p>
          <h2>今のmoneaが選ぶアイテム</h2>
        </div>

        {featuredProduct && (
          <div className="featureProduct">
            <div
              className="featureImage colorReveal"
              style={{ "--image": `url(${featuredProduct.image})` }}
            />
            <div className="featureCopy">
              <p className="eyebrow">{featuredProduct.category}</p>
              <h3>{featuredProduct.title}</h3>
              <p>{featuredProduct.description}</p>
              <strong>{featuredProduct.price}</strong>
              <a href={featuredProduct.url}>詳細を見る</a>
            </div>
          </div>
        )}

        <div className="productGrid compact">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="diagnosis" className="section diagnosis">
        <div className="sectionTitle">
          <p className="eyebrow">5 MINUTES DIAGNOSIS</p>
          <h2>あなたに似合うmoneaを見つける</h2>
        </div>

        {!diagnosisResult && (
          <div className="questionBox">
            <p className="questionCount">
              {answers.length + 1} / {diagnosisQuestions.length}
            </p>
            <h3>{diagnosisQuestions[answers.length].question}</h3>

            <div className="answerGrid">
              {diagnosisQuestions[answers.length].options.map((option) => (
                <button key={option.label} onClick={() => answerQuestion(option.type)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {diagnosisResult && (
          <div className="resultBox">
            <p className="eyebrow">YOUR RESULT</p>
            <h3>{resultCopy[diagnosisResult].title}</h3>
            <p>{resultCopy[diagnosisResult].text}</p>
            <button onClick={() => setActiveCategory(diagnosisResult)}>
              おすすめを見る
            </button>
            <button className="textButton" onClick={resetDiagnosis}>
              もう一度診断する
            </button>
          </div>
        )}
      </section>

      <section id="member-form" className="memberForm">
        <p className="eyebrow">MONEA MEMBER</p>
        <h2>メンバー登録</h2>
        <p>登録すると、moneaのアイテムをいつでも10%OFFでご利用いただけます。</p>
        <form onSubmit={handleMemberSubmit}>
          <input type="text" placeholder="お名前" />
          <input type="email" placeholder="メールアドレス" />
          <button type="submit">登録する</button>
        </form>
      </section>

      <footer className="footer">
        <p>monea</p>
        <span>自分自身の魅力を見つけ、花開かせるために。</span>
      </footer>

      {popupOpen && (
        <div className="memberPopup">
          <button className="popupClose" onClick={() => setPopupOpen(false)}>
            ×
          </button>
          <p>MEMBER ONLY</p>
          <h3>メンバーはいつでも10%OFF</h3>
          <a href="#member-form" onClick={() => setPopupOpen(false)}>
            メンバー登録
          </a>
        </div>
      )}
    </main>
  );
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
      <div
        className="productImage"
        style={{ backgroundImage: `url(${product.image})` }}
      />
      <p>{product.category}</p>
      <h3>{product.title}</h3>
      <span>{product.price}</span>
    </a>
  );
}
