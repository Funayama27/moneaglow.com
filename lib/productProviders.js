const fallbackProducts = [
  {
    id: "mock-1",
    title: "Glow Veil Serum",
    category: "SKINCARE",
    description: "肌本来の透明感を育てる、軽やかな美容液。",
    price: "¥6,800",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    url: "#skincare",
  },
  {
    id: "mock-2",
    title: "Bloom Color Lip",
    category: "MAKEUP",
    description: "自分らしさを引き出す、やわらかな血色リップ。",
    price: "¥3,900",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    url: "#makeup",
  },
  {
    id: "mock-3",
    title: "Monea Eau de Glow",
    category: "FRAGRANCE",
    description: "記憶に残る印象をまとう、透明感のある香り。",
    price: "¥8,900",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
    url: "#fragrance",
  },
  {
    id: "mock-4",
    title: "Inner Radiance Blend",
    category: "INNER GLOW",
    description: "内側から整える、毎日の美容習慣。",
    price: "¥4,800",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    url: "#inner-glow",
  },
  {
    id: "mock-5",
    title: "Silk Tone Cushion",
    category: "MAKEUP",
    description: "肌に溶け込むように整える、上品なツヤのクッション。",
    price: "¥5,400",
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=80",
    url: "#makeup",
  },
  {
    id: "mock-6",
    title: "Pure Layer Cream",
    category: "SKINCARE",
    description: "うるおいを重ね、肌をなめらかに包み込むクリーム。",
    price: "¥7,200",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=80",
    url: "#skincare",
  },
];

export async function getProducts() {
  const provider = process.env.DROPSHIP_PROVIDER || "mock";

  if (provider === "shopify") {
    return getShopifyProducts();
  }

  if (provider === "cj") {
    return getCJProducts();
  }

  if (provider === "generic") {
    return getGenericProducts();
  }

  return fallbackProducts;
}

async function getShopifyProducts() {
  const domain = process.env.SHOPIFY_SHOP_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || "2026-01";

  if (!domain || !token) {
    return fallbackProducts;
  }

  const query = `
    query Products {
      products(first: 12) {
        nodes {
          id
          title
          handle
          description
          productType
          featuredImage {
            url
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${domain}/admin/api/${version}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({ query }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return fallbackProducts;
    }

    const json = await response.json();
    const products = json?.data?.products?.nodes || [];

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      category: product.productType || "MONEA",
      description:
        product.description || "moneaが選ぶ、あなたらしさを引き出すアイテム。",
      price: formatPrice(
        product.priceRangeV2?.minVariantPrice?.amount,
        product.priceRangeV2?.minVariantPrice?.currencyCode
      ),
      image:
        product.featuredImage?.url ||
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      url: `https://${domain}/products/${product.handle}`,
    }));
  } catch {
    return fallbackProducts;
  }
}

async function getCJProducts() {
  const endpoint = process.env.CJ_PRODUCT_LIST_URL;
  const token = process.env.CJ_ACCESS_TOKEN;

  if (!endpoint || !token) {
    return fallbackProducts;
  }

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "CJ-Access-Token": token,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackProducts;
    }

    const json = await response.json();
    const items = json?.data?.list || json?.data || [];

    return items.slice(0, 12).map((item, index) => ({
      id: item.pid || item.productId || `cj-${index}`,
      title: item.productNameEn || item.productName || "monea selected item",
      category: item.categoryName || "MONEA",
      description:
        item.description || "moneaが選ぶ、今のあなたに寄り添う美容アイテム。",
      price: item.sellPrice ? `¥${Math.round(Number(item.sellPrice))}` : "Price soon",
      image:
        item.productImage ||
        item.productImageSet?.[0] ||
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      url: item.productUrl || "#products",
    }));
  } catch {
    return fallbackProducts;
  }
}

async function getGenericProducts() {
  const endpoint = process.env.GENERIC_PRODUCTS_API_URL;
  const key = process.env.GENERIC_PRODUCTS_API_KEY;

  if (!endpoint) {
    return fallbackProducts;
  }

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: key ? `Bearer ${key}` : "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackProducts;
    }

    const json = await response.json();
    const items = Array.isArray(json) ? json : json.products || [];

    return items.slice(0, 12).map((item, index) => ({
      id: item.id || `generic-${index}`,
      title: item.title || item.name || "monea selected item",
      category: item.category || "MONEA",
      description: item.description || "あなたらしい美しさを引き出すアイテム。",
      price: item.price || "Price soon",
      image:
        item.image ||
        item.imageUrl ||
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      url: item.url || "#products",
    }));
  } catch {
    return fallbackProducts;
  }
}

function formatPrice(amount, currencyCode) {
  if (!amount) return "Price soon";

  const value = Number(amount);

  if (currencyCode === "JPY") {
    return `¥${Math.round(value).toLocaleString("ja-JP")}`;
  }

  return `${currencyCode || ""} ${value.toLocaleString("ja-JP")}`;
}
