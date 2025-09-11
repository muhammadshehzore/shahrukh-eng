"use client";

import { motion } from "framer-motion";

const partners = [
  "/img/partners/adm.jpg",
  "/img/partners/alleid.jpg",
  "/img/partners/am.jpg",
  "/img/partners/liberty.jpg",
  "/img/partners/syntec.jpg",

];

export default function PartnersSection() {
  return (
    <section className="bg-gray-100 py-20 px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
        Trusted by Leading Companies
      </h2>
      <motion.div
        className="flex justify-center flex-wrap items-center gap-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {partners.map((logo, i) => (
          <motion.img
            key={i}
            src={logo}
            alt={`Partner ${i + 1}`}
            className="h-16 md:h-20 object-contain grayscale hover:grayscale-0 transition-all duration-500"
            whileHover={{ scale: 1.1 }}
          />
        ))}
      </motion.div>
    </section>
  );
}
