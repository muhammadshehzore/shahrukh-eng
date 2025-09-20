import ProductDetailClient from "./ProductDetailClient";

// Fetch single product
async function getProduct(slug) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/`;
  console.log("Fetching product:", url);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// Fetch more products (for recommendations)
async function getMoreProducts(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
    cache: "no-store",
  });
  if (!res.ok) return [];

  const all = await res.json();
  return all.filter((p) => p.slug !== slug).slice(0, 3);
}

// Metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params; // 🔥 FIX HERE
  try {
    const product = await getProduct(slug);
    return {
      title: product.name,
      description: product.meta_description || product.tagline || "",
      openGraph: {
        title: product.name,
        description: product.meta_description || product.tagline || "",
        images: [
          {
            url: product.hero_image
              ? `${process.env.NEXT_PUBLIC_API_URL}${product.hero_image}`
              : "/placeholder.png",
          },
        ],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

// Page Component
export default async function ProductDetailPage({ params }) {
  const { slug } = await params; // 🔥 FIX HERE
  let product = null;
  let moreProducts = [];

  try {
    product = await getProduct(slug);
    moreProducts = await getMoreProducts(slug);
  } catch (err) {
    console.error("❌ Server Error fetching product:", err);
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-red-500">Product not found.</div>
    );
  }

  return <ProductDetailClient product={product} moreProducts={moreProducts} />;
}
