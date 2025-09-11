"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/products/`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-br from-[#1a2c7c] via-[#243b9f] to-[#16205c] overflow-hidden">
      {/* Title */}
      <motion.h2
        className="text-5xl font-extrabold text-center mb-16 text-white tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Our <span className="text-[#FFD700] drop-shadow-md">Products</span>
      </motion.h2>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-10">
          {products.map((product, index) => {
            // ✅ Handle relative and absolute URLs
            const imageUrl = product.image
              ? product.image.startsWith("http")
                ? product.image
                : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
              : "/placeholder.png"; // fallback image

            return (
              <Link
                key={product.slug || index}
                href={`/products/${product.slug}`}
                className="block"
              >
                <motion.div
                  className="group relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-2xl hover:border-[#FFD700]/50 transition-all duration-500 cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.7 }}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-72">
                    <Image
                      src={imageUrl}
                      alt={product.title || "Product Image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                  </div>

                  {/* Hover Details */}
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition duration-500 z-10">
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#FFD700] transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-white/80 text-sm leading-relaxed">
                      {product.desc}
                    </p>
                  </div>

                  {/* Default Details */}
                  <div className="p-6 group-hover:opacity-0 transition duration-500">
                    <h3 className="text-xl font-semibold text-white">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-gray-300 text-sm">{product.desc}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
