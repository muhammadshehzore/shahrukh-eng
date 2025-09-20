import Link from "next/link";
import Image from "next/image";

// Fetch products from API
async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

// Build full image URL
function getImageUrl(path) {
  if (!path) return "/placeholder.png";
  return path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white min-h-screen">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-16 bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-200 bg-clip-text text-transparent drop-shadow-xl">
          Our Premium Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No products available yet.
          </p>
        ) : (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              const imageUrl = getImageUrl(product.hero_image);
              return (
                <div
                  key={product.slug}
                  className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 hover:shadow-cyan-400/40 transition-transform transform hover:scale-105 group"
                >
                  {/* Image */}
                  <div className="relative h-72 md:h-80">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-blue-950/10 to-transparent opacity-60 group-hover:opacity-100 transition" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                      {product.name}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-4">
                      {product.meta_description || product.tagline || "High quality engineering solution"}
                    </p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-block font-semibold text-cyan-300 hover:text-blue-400 transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
