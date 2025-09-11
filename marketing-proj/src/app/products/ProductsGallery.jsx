"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function ProductsGallery({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-white text-xl">
        No products available.
      </div>
    );
  }

  return (
    <section className="relative py-28 bg-gradient-to-br from-[#0a0f24] via-[#111a3c] to-[#0a0d1a] overflow-hidden">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-6xl font-extrabold text-center mb-20 tracking-tight 
                   bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-white drop-shadow-lg"
      >
        Our Exclusive Products
      </motion.h2>

      {/* Product Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-3 sm:grid-cols-2 gap-12 px-6"
      >
        {products.map((product, idx) => (
          <ProductCard key={product.slug || idx} product={product} idx={idx} />
        ))}
      </motion.div>
    </section>
  );
}
