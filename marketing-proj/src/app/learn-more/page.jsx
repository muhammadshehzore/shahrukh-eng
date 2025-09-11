"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LearnMorePage() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#1E3A8A] via-[#1E40AF] to-[#1E3A8A] text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-cover" />

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        {/* Title */}
        <motion.h1
          className="text-5xl font-extrabold text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Learn More About{" "}
          <span className="text-[#FFD700]">Our Expertise</span>
        </motion.h1>

        {/* Intro text */}
        <motion.p
          className="text-lg text-gray-200 max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          We deliver world-class engineering, consultancy, and innovative
          solutions across industries. From concept to execution, our team
          ensures precision, efficiency, and sustainability at every step.
        </motion.p>

        {/* Three premium feature cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Our Services",
              desc: "Explore our tailored engineering and consultancy services designed to solve real-world challenges.",
              href: "/services",
              btn: "View Services",
            },
            {
              title: "Our Products",
              desc: "Discover how we've partnered with clients worldwide to deliver innovative and sustainable solutions.",
              href: "/products",
              btn: "View Products",
            },
            {
              title: "Work With Us",
              desc: "Ready to discuss your project? Get in touch with our experts and start building your solution today.",
              href: "/contact",
              btn: "Contact Us",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-[#FFD700]">
                {item.title}
              </h3>
              <p className="text-gray-200 mb-6">{item.desc}</p>
              <Link
                href={item.href}
                className="mt-auto inline-block bg-[#FFD700] text-[#1E3A8A] font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
              >
                {item.btn}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
