"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LearnMorePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Render nothing on server

  return (
    <section className="relative bg-gradient-to-r from-[#1A2A6C] via-[#344CB7] to-[#2E8BC0] text-white min-h-screen py-24 px-6">
      {/* Decorative shapes */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-[-150px]" />
        <div className="absolute w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl bottom-[-150px] right-[-120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Learn More About <span className="text-[#FFD700]">MSEW</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto"
        >
          With over 50 years of expertise, MSEW delivers cutting-edge solutions in{" "}
          <span className="text-[#FFD700] font-semibold">engineering, consultancy, and innovation</span>. 
          Our mission is to provide sustainable, efficient, and future-ready services to industries worldwide.
        </motion.p>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Engineering Excellence",
              desc: "Tailor-made solutions with unmatched technical expertise.",
              icon: "⚙️",
            },
            {
              title: "Innovation",
              desc: "Pioneering new technologies to shape the future of industries.",
              icon: "💡",
            },
            {
              title: "Consultancy",
              desc: "Guiding businesses towards sustainable growth and success.",
              icon: "📊",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8 hover:scale-105 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-[#FFD700] mb-3">{item.title}</h3>
              <p className="text-gray-200">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <a href="/learn-more">
            <button className="mt-16 px-10 py-4 bg-[#FFD700] text-[#1A2A6C] font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-[#FFC300] transition-all duration-300">
              Learn More
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
