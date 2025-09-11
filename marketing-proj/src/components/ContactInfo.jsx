  "use client";

  import { motion } from "framer-motion";

  const contactData = [
    { label: "Address", value: "Plot # 55-C 15th Commercial St, D.H.A. Phase 2 Commercial Area Defence Housing Authority, Karachi, 77550" },
    { label: "Phone", value: "+92 305 26463127" },
    { label: "Email", value: "info@mshahrukhengineeringworks.com" },
  ];
 
  export default function ContactInfo() {
    return (
      <section className="py-16 bg-gradient-to-br from-[#344CB7] via-[#4A5DDE] to-[#6B7BFF]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center text-white mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Information
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {contactData.map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              >
                <h4 className="text-lg font-semibold text-white mb-2">
                  {item.label}
                </h4>
                <p className="text-white/90">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
