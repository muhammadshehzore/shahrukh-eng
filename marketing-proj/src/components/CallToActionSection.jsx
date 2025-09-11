"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CallToActionSection() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-24 text-center overflow-hidden">
      <motion.h2
        className="text-4xl md:text-6xl font-extrabold text-white mb-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Ready to Elevate Your Project?
      </motion.h2>
      <motion.p
        className="text-white/90 text-lg md:text-2xl mb-10 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Connect with our expert team and bring your vision to life with precision, innovation, and efficiency.
      </motion.p>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link
          href="/get-quote"
          className="inline-block bg-white text-indigo-600 font-bold px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition transform"
        >
          Get a Quote
        </Link>
      </motion.div>
      {/* Decorative circles */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full animate-pulse"></div>
    </section>
  );
}
