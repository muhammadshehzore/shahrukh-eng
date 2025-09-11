"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const getImageUrl = (img) =>
    img
      ? img.startsWith("http")
        ? img
        : `${process.env.NEXT_PUBLIC_API_URL}${img}`
      : "/placeholder.png";

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="group relative bg-gradient-to-br from-[#101935]/90 via-[#0f1a2e]/90 to-[#0a0f24]/90 
                 rounded-3xl overflow-hidden shadow-xl border border-white/10 
                 hover:border-[#FFD700]/40 hover:shadow-[#FFD700]/30 cursor-pointer"
    >
      <Link href={`/products/${product.slug}`}>
        {/* Product Image */}
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={getImageUrl(product.image)}
            alt={product.title}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition" />
        </div>

        {/* Content */}
        <div className="p-6 relative z-10">
          <h3 className="text-2xl font-bold text-white group-hover:text-[#FFD700] transition">
            {product.title}
          </h3>
          <p className="mt-2 text-gray-300 text-sm line-clamp-3">
            {product.desc}
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-5"
          >
            <span className="inline-block px-5 py-2 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 
                           text-[#FFD700] text-sm font-semibold tracking-wide group-hover:bg-[#FFD700]/20 
                           transition-all duration-300">
              View Details →
            </span>
          </motion.div>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/30 via-transparent to-[#00CFFF]/30 
                       rounded-3xl blur-2xl opacity-0 group-hover:opacity-70 transition duration-500" />
      </Link>
    </motion.div>
  );
}
