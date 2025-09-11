"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

/* ✅ Service Content renderer (allow HTML safely) */
function ServiceContent({ content }) {
  if (!content) return null;

  return (
    <div
      className="prose prose-lg prose-invert max-w-none
                 prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6
                 prose-h2:text-3xl prose-h2:font-semibold prose-h2:mb-4
                 prose-p:text-blue-100 prose-p:leading-relaxed
                 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
                 prose-strong:text-yellow-300"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default function ServiceDetailClient({ service }) {
  const [showScroll, setShowScroll] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* ✅ Hero Section */}
      <section className="relative w-full overflow-hidden">
        {service.hero_image && (
          <motion.div
            className="relative h-[60vh] w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={service.hero_image}
              alt={service.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <motion.h1
                className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg text-center px-4"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {service.name}
              </motion.h1>
            </div>
          </motion.div>
        )}
      </section>

      {/* ✅ Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {service.tagline && (
          <motion.p
            className="text-2xl text-blue-100 font-medium text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {service.tagline}
          </motion.p>
        )}

        {/* ✅ SEO + HTML Content */}
        <motion.section
          ref={contentRef}
          className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 py-12 px-6 rounded-3xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <ServiceContent content={service.content} />
        </motion.section>

        {/* ✅ CTA Section */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-10 rounded-2xl shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started with {service.name}?
          </h2>
          <p className="mb-6 text-lg opacity-90">
            Contact us today and let’s build the perfect solution for your needs.
          </p>
          <motion.a
            href="/get-quote"
            className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get a Free Quote
          </motion.a>
        </motion.div>
      </section>

      {/* ✅ Scroll To Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={
          showScroll
            ? { opacity: 1, scale: [1, 1.1, 1] }
            : { opacity: 0, scale: 0 }
        }
        transition={{
          duration: 1.5,
          repeat: showScroll ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </>
  );
}
