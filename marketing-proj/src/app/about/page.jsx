"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Particles from "react-tsparticles";
import Head from "next/head"; // <-- SEO head
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const fadeIn = (direction = "up", delay = 0) => {
  let x = 0, y = 0;
  if (direction === "left") x = 50;
  if (direction === "right") x = -50;
  if (direction === "up") y = 50;
  if (direction === "down") y = -50;

  return {
    hidden: { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0, transition: { delay, duration: 0.9, ease: "easeOut" } },
  };
};

export default function AboutUs() {
  const pageTitle = "About Us - M. Shahrukh Engineering Works";
  const pageDescription =
    "Learn about M. Shahrukh Engineering Works, leading industrial insulation manufacturers. High-temperature jackets for energy saving and safety.";

  return (
    <div className="bg-gradient-to-b from-[#0D1B2A] via-[#12274D] to-[#101840] text-white overflow-hidden">

      {/* SEO Meta */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Particles
          id="heroParticles"
          options={{
            fullScreen: { enable: false },
            particles: {
              number: { value: 60, density: { enable: true, area: 800 } },
              color: { value: "#FFD700" },
              opacity: { value: 0.4 },
              size: { value: { min: 2, max: 5 } },
              move: { enable: true, speed: 0.6, outModes: "bounce" },
            },
            interactivity: {
              events: { onHover: { enable: true, mode: "grab" } },
              modes: { grab: { distance: 140, links: { opacity: 0.4 } } },
            },
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
          {[
            "https://as1.ftcdn.net/v2/jpg/01/78/20/98/1000_F_178209834_94E3ZHfsv6rJA8nG7cH4fhqnhPDD7NE7.jpg",
            "https://as2.ftcdn.net/v2/jpg/02/43/43/89/1000_F_243438995_YJ6yXbPzAbdjjaWt0N3eYXRFUfiAvZjJ.jpg",
            "https://as2.ftcdn.net/v2/jpg/01/75/88/17/1000_F_175881747_T8C2NNtULcj0NcGf2tWEzmvvcvX90VCK.jpg",
          ].map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    className="text-[#FFD700] text-4xl md:text-6xl font-extrabold text-center tracking-widest drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]"
                  >
                    About M. Shahrukh Engineering Works
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
            className="text-5xl font-extrabold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent"
          >
            Who We Are
          </motion.h2>
          <motion.p
            variants={fadeIn("left", 0.2)}
            className="text-lg text-gray-200 leading-relaxed"
          >
            At <span className="font-semibold text-[#FFD700]">M. Shahrukh Engineering Works</span>, we manufacture high-temperature removable insulation jackets (up to 1200°C) for industrial equipment, helping industries save energy, reduce heat loss, and ensure worker safety.
          </motion.p>
          <motion.p
            variants={fadeIn("left", 0.4)}
            className="text-lg text-gray-200 leading-relaxed"
          >
            Our team partners with clients worldwide, ensuring excellence and innovation in every project.
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
            alt="About"
            className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A6C]/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
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
            <img
              src="https://as1.ftcdn.net/v2/jpg/02/86/82/00/1000_F_286820076_yKVgSiHZx40FK7RnK36Zl87TIKHO7Liv.jpg"
              alt="Our Mission"
              className="w-full h-auto object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-bold mb-6 text-[#FFD700]">Our Mission</h2>
            <p className="leading-relaxed text-lg text-gray-200">
              To deliver innovative, durable, and cost-effective insulation solutions that improve energy efficiency and reduce operating costs for industries in Pakistan and worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent"
        >
          What We Do
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 text-gray-200 text-lg leading-relaxed">
          <ul className="space-y-4 list-disc list-inside">
            <li>Generators (Caterpillar & Jenbacher models)</li>
            <li>Turbines and compressors</li>
            <li>Valves and flanges</li>
            <li>Pumps and exhaust systems</li>
            <li>Plastic extruder & molding machines</li>
            <li>Custom high-temperature equipment</li>
          </ul>
          <p>
            Jackets are made with <span className="text-[#FFD700] font-semibold">heat-resistant fabrics (up to 1200°C)</span>, designed for easy installation, long-term use, and maximum safety.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#1A2A6C] py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl font-extrabold mb-8 text-[#FFD700]"
            >
              Why Choose Us
            </motion.h2>
            <ul className="space-y-4 text-lg text-gray-200">
              <li>✅ Proven Industry Experience</li>
              <li>✅ Energy-Saving Solutions</li>
              <li>✅ Custom Engineering</li>
              <li>✅ Global Reach</li>
            </ul>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://as2.ftcdn.net/v2/jpg/01/95/82/90/1000_F_195829035_0tQmS2RhtTtNoF4bktPj5lRwG7FWSh8Q.jpg"
              alt="Why Choose Us"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-6xl mx-auto py-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent"
        >
          Our Journey
        </motion.h2>
        <div className="relative border-l-4 border-[#FFD700]/70 pl-8 space-y-12">
          {[
            { year: "2015", text: "Founded in Pakistan, delivering insulation for local industries." },
            { year: "2018", text: "Expanded to supply power plants and refineries." },
            { year: "2021", text: "Started exporting jackets internationally." },
            { year: "2024", text: "Trusted partner for textile, chemical & metal industries." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="relative"
            >
              <div className="absolute -left-6 top-2 w-4 h-4 rounded-full bg-[#FFD700] shadow-lg animate-pulse" />
              <h3 className="text-2xl font-bold text-[#FFD700]">{item.year}</h3>
              <p className="text-gray-200">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-[#12274D] py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold mb-6 text-[#FFD700]"
        >
          Our Commitment
        </motion.h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
          We build long-term client relationships by delivering quality products,
          on-time service, and reliable after-sales support.
        </p>
      </section>
    </div>
  );
}
