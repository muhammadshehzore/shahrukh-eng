"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Particles from "react-tsparticles";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const fadeIn = (direction = "up", delay = 0) => {
  let x = 0,
    y = 0;
  if (direction === "left") x = 50;
  if (direction === "right") x = -50;
  if (direction === "up") y = 50;
  if (direction === "down") y = -50;

  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { delay, duration: 0.9, ease: "easeOut" },
    },
  };
};

export default function AboutUs() {
  return (
    <div className="bg-gradient-to-b from-[#1A2A6C] via-[#23338C] to-[#101840] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Particles
          id="heroParticles"
          options={{
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            particles: {
              number: { value: 70, density: { enable: true, area: 900 } },
              color: { value: "#FFD700" },
              shape: { type: "circle" },
              opacity: { value: 0.4 },
              size: { value: { min: 2, max: 6 } },
              move: { enable: true, speed: 0.7, outModes: "bounce" },
            },
            interactivity: {
              events: { onHover: { enable: true, mode: "repulse" } },
              modes: { repulse: { distance: 100, duration: 0.6 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-10"
        />

        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          effect="fade"
          loop
          className="h-full relative z-20"
        >
          {["https://as1.ftcdn.net/v2/jpg/01/78/20/98/1000_F_178209834_94E3ZHfsv6rJA8nG7cH4fhqnhPDD7NE7.jpg", 
          "https://as2.ftcdn.net/v2/jpg/02/43/43/89/1000_F_243438995_YJ6yXbPzAbdjjaWt0N3eYXRFUfiAvZjJ.jpg", 
          "https://as2.ftcdn.net/v2/jpg/01/75/88/17/1000_F_175881747_T8C2NNtULcj0NcGf2tWEzmvvcvX90VCK.jpg"].map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1A2A6C]/70 flex items-center justify-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="text-[#FFD700] text-4xl md:text-6xl font-extrabold text-center tracking-widest drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]"
                  >
                    About Our Company
                  </motion.h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Who We Are */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
          className="space-y-6"
        >
          <motion.h2
            variants={fadeIn("left", 0)}
            className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-white drop-shadow-lg"
          >
            Who We Are
          </motion.h2>
          <motion.p variants={fadeIn("left", 0.2)} className="text-lg text-gray-200 leading-relaxed">
            M Shahrukh Engineering works is a premium provider of industrial insulation solutions,
            delivering services that elevate efficiency, safety, and sustainability.
          </motion.p>
          <motion.p variants={fadeIn("left", 0.4)} className="text-lg text-gray-200 leading-relaxed">
            Our expert team partners with clients worldwide, ensuring excellence and innovation in
            every project we deliver.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="rounded-2xl overflow-hidden shadow-2xl relative group"
        >
          <img
            src="https://as1.ftcdn.net/v2/jpg/13/87/23/66/1000_F_1387236673_f1NT4h0xc6eJBmVb9UO71Be1WXlsN7yv.jpg"
            alt="About FCG"
            className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A6C]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
        </motion.div>
      </section>

      {/* Mission */}
      <section className="bg-[#23338C] relative py-24">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#23338C] to-[#101840] opacity-90" />
        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img src="https://as1.ftcdn.net/v2/jpg/02/86/82/00/1000_F_286820076_yKVgSiHZx40FK7RnK36Zl87TIKHO7Liv.jpg" alt="Our Mission" className="w-full h-auto object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <h2 className="text-5xl font-bold mb-6 text-[#FFD700]">Our Mission</h2>
            <p className="leading-relaxed text-lg text-gray-200">
              To deliver cutting-edge engineering and insulation solutions that drive operational
              excellence and promote environmental responsibility worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-white drop-shadow-lg"
        >
          Our Core Values
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            { title: "Integrity", desc: "We uphold the highest standards of honesty and professionalism." },
            { title: "Innovation", desc: "Driving progress with forward-thinking engineering solutions." },
            { title: "Sustainability", desc: "Dedicated to eco-friendly and responsible practices." },
          ].map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.8 }}
              className="p-10 bg-gradient-to-br from-[#1A2A6C] via-[#23338C] to-[#101840] rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-500 text-center border border-[#FFD700]/40"
            >
              <h3 className="text-2xl font-bold mb-4 text-[#FFD700]">{val.title}</h3>
              <p className="text-gray-200">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
