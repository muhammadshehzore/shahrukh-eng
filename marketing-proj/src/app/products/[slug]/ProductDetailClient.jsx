"use client";

import ProductQuote from "@/components/ProductQuote";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function ProductDetailClient({ product, allProducts }) {
  const getImageUrl = (img) =>
    img ? (img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`) : "/placeholder.png";

  // Filter products (remove current one)
  const moreProducts = allProducts.filter((p) => p.slug !== product.slug);

  return (
    <section className="relative bg-gradient-to-b from-[#0f1a4d] via-[#1a2c7c] to-[#0b0f2e] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-700/30 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[180px] animate-pulse" />
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[60vh] overflow-hidden rounded-b-[3rem] max-w-7xl mx-auto">
        <Image
          src={getImageUrl(product.image)}
          alt={product.title}
          fill
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            {product.title}
          </motion.h1>
        </div>
      </div>

      {/* Description + Quote Form */}
      <div className="relative max-w-5xl mx-auto px-6 mt-16 text-center">
        <motion.p
          className="text-lg md:text-xl text-gray-200 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {product.desc}
        </motion.p>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <ProductQuote productTitle={product.title} />
        </motion.div>
      </div>

      {/* More Products Slider */}
      {moreProducts.length > 0 && (
        <div className="relative max-w-7xl mx-auto px-6 mt-20 pb-20">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-[#FFD700] mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            More Products
          </motion.h2>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={Math.min(3, moreProducts.length)}
            loop={moreProducts.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              640: { slidesPerView: Math.min(1, moreProducts.length) },
              768: { slidesPerView: Math.min(2, moreProducts.length) },
              1024: { slidesPerView: Math.min(3, moreProducts.length) },
            }}
          >
            {moreProducts.map((p, idx) => (
              <SwiperSlide key={p.slug || idx}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-b from-[#1a2c7c] to-[#0f1a4d] rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-[#FFD700]/50 transition"
                >
                  <Link href={`/products/${p.slug}`}>
                    <div className="relative w-full h-56">
                      <Image
                        src={getImageUrl(p.image)}
                        alt={p.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">{p.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2">{p.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
}
