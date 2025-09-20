import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";
  return path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export default function ProductsSlider({ products = [] }) {
  if (!products.length) return null;

  return (
    <section
      className="relative py-20 bg-gradient-to-br from-[#1a2c7c] via-[#243b9f] to-[#16205c] overflow-hidden"
      aria-label="Our Products"
    >
      <motion.h2
        className="text-5xl font-extrabold text-center mb-12 text-white tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Our <span className="text-[#FFD700] drop-shadow-md">Products</span>
      </motion.h2>

      <div className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
              1280: { slidesPerView: 4, spaceBetween: 32 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={products.length > 1}
            pagination={{ clickable: true }}
            navigation
            className="py-6"
          >
            {products.map((product, idx) => (
              <SwiperSlide key={product.slug || idx}>
                <Link href={`/products/${product.slug}`} className="block">
                  <motion.div
                    className="group relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-2xl hover:border-[#FFD700]/50 transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.7 }}
                  >
                    <div className="relative w-full h-72">
                      <Image
                        src={getImageUrl(product.hero_image)}
                        alt={product.name || "Product Image"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                    </div>

                    <div className="p-6 group-hover:opacity-0 transition duration-500">
                      <h3 className="text-xl font-semibold text-white">
                        {product.name}
                      </h3>
                      <p
                        className="mt-2 text-gray-300 text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: product.tagline || product.meta_description || "",
                        }}
                      />
                    </div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
