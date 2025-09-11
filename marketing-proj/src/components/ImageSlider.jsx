"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

export default function ImageSlider({ images }) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      className="rounded-lg overflow-hidden"
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <motion.img
            src={img}
            alt={`Slide ${i + 1}`}
            className="w-full h-64 object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
