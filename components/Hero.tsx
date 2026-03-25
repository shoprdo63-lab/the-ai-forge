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
    <section className="relative overflow-hidden bg-[#020617]">
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left emerald glow */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#10b981]/20 rounded-full blur-[150px] opacity-60" />
        {/* Center blue glow */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] opacity-50" />
        {/* Bottom subtle gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#020617] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[#10b981]/30 bg-[#10b981]/10"
          >
            <Sparkles className="w-4 h-4 text-[#10b981]" />
            <span className="text-sm font-medium text-[#10b981]">
              AI-Optimized Hardware
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Premium Hardware for{" "}
            <span className="text-[#10b981]">AI Workloads</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mb-10"
          >
            Curated selection of GPUs and CPUs optimized for LLM inference and
            model training. Find the perfect components for your AI workstation.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToProducts}
            className="btn-affiliate inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            <span>Explore Products</span>
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent" />
    </section>
  );
}
