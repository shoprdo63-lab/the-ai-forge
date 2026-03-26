"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#050505] border-b border-white/[0.06]">
      {/* Subtle ambient glow - restrained */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#10b981]/5 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#10b981]/3 rounded-full blur-[100px] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-[#10b981]/20 bg-[#10b981]/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#10b981]" strokeWidth={1.5} />
            <span className="text-xs font-medium text-[#10b981] tracking-wide">
              AI-Optimized Hardware
            </span>
          </motion.div>

          {/* Main Title - Sophisticated Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-6"
          >
            Premium Hardware for{" "}
            <span className="text-[#10b981] font-medium">AI Workloads</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl mb-10"
          >
            Curated selection of GPUs and CPUs optimized for LLM inference and
            model training. Find the perfect components for your AI workstation.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToProducts}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-[#050505] font-medium text-sm rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#10b981]/10"
          >
            <span>Explore Products</span>
            <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
