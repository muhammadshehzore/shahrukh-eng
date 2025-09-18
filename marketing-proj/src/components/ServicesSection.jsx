// src/components/ServicesSection.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [floatingStreaks, setFloatingStreaks] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/`, { cache: "no-store" })
      .then((res) => res.json())
      .then(setServices)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const streaks = [...Array(10)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      rotate: Math.random() * 360,
    }));
    setFloatingStreaks(streaks);
  }, []);

  useEffect(() => {
    if (!services.length) return;

    cardRefs.current.forEach((card) => {
      if (!card) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
      });

      const image = card.querySelector("img");
      const title = card.querySelector("h3");
      const tagline = card.querySelector("p");

      tl.from(image, { scale: 0.9, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(title, { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(tagline, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
    });
  }, [services]);

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#1a2c7c] via-[#243b9f] to-[#16205c] overflow-hidden">
      {floatingStreaks.map((s, i) => (
        <div
          key={i}
          className="absolute w-1 h-32 rounded-full bg-gradient-to-b from-blue-400 via-cyan-300 to-indigo-400 opacity-20 blur-lg pointer-events-none"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            transform: `rotate(${s.rotate}deg)`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.h2
          className="text-5xl font-extrabold mb-14 text-center text-white tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our <span className="text-[#FFD700] drop-shadow-lg">Premium Services</span>
        </motion.h2>

        <div className="flex overflow-x-auto space-x-6 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-10 pb-4 no-scrollbar-for-overflow">
          {services.map((service, idx) => (
            <motion.div
              key={service.slug}
              ref={(el) => (cardRefs.current[idx] = el)}
              whileHover={{ scale: 1.06 }}
              className="min-w-[300px] md:min-w-0 relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl 
                             rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/20
                             transition-all duration-500 group cursor-pointer"
            >
              <Link href={`/services/${service.slug}`} className="block">
                <div className="h-52 w-full overflow-hidden relative">
                  <motion.img
                    src={service.image || "/placeholder-service.jpg"}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#FFD700] transition-colors duration-300">
                    {service.name}
                  </h3>
                  {service.tagline && (
                    <p className="text-gray-200 text-sm mt-2 leading-relaxed">
                      {service.tagline}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}