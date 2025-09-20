"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import ProductQuote from "../../../components/ProductQuote";
import Script from "next/script";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";
  const cleanPath = path.replace(/^\/api/, "");
  return path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
};

// Sparkle overlay component
function Sparkle() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0.8, 1.2, 0.8],
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: Math.random() * 2,
      }}
      className="absolute w-2 h-2 bg-white rounded-full filter blur-sm"
    />
  );
}

export default function ProductDetailClient({ product, moreProducts }) {
  const productImage = getImageUrl(product.hero_image);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [productImage],
    description: product.meta_description || product.tagline || product.description || "",
    sku: product.slug,
    brand: {
      "@type": "Organization",
      name: "M. Shahrukh Engineering Works",
    },
  };

  return (
    <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white">
      <Script id="product-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      {/* HERO SECTION */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={productImage}
            alt={product.name}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-blue-950/20 to-black/10" />
          {[...Array(10)].map((_, i) => (
            <Sparkle key={i} />
          ))}
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 bg-clip-text text-transparent drop-shadow-lg"
          >
            {product.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-6 text-lg md:text-xl text-blue-200 max-w-2xl"
          >
            {product.tagline || "Premium engineering excellence, built for performance."}
          </motion.p>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-800/30 to-blue-900/30 p-10 rounded-2xl shadow-2xl backdrop-blur-sm"
        >
          {product?.description ? (
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              className="text-lg md:text-xl text-gray-200 leading-relaxed text-center"
            />
          ) : (
            <p className="text-center text-gray-400">No description available.</p>
          )}
        </motion.div>
      </section>

      {/* QUOTE FORM */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-2xl p-10 shadow-xl border border-blue-700/30"
        >
          {[...Array(5)].map((_, i) => (
            <Sparkle key={i} />
          ))}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-300 mb-8">
            Get a Custom Quote
          </h2>

          {/* Pass product name and optionally service to ProductQuote */}
          <ProductQuote productTitle={product.name} serviceName={null} />
        </motion.div>
      </section>

      {/* MORE PRODUCTS */}
      {moreProducts.length > 0 && (
        <section className="container mx-auto px-6 py-24">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-12"
          >
            Explore More Premium Products
          </motion.h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {moreProducts.map((p, index) => {
              const moreImg = getImageUrl(p.hero_image);
              return (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-950 to-blue-900 shadow-xl group hover:shadow-cyan-400/20 hover:scale-[1.02] transition-transform"
                >
                  <div className="relative h-60">
                    <Image
                      src={moreImg}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-blue-950/10 to-transparent opacity-70 group-hover:opacity-100 transition" />
                  <div className="relative p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition">
                      {p.name}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                      {p.meta_description || p.tagline || "High quality engineering solution"}
                    </p>
                    <Link
                      href={`/products/${p.slug}`}
                      className="inline-block font-semibold text-cyan-300 hover:text-blue-400 transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
