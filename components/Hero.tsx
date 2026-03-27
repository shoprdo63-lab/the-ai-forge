"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Cpu, Zap, TrendingUp, Check } from "lucide-react";
import Link from "next/link";

const features = [
  "60+ AI-optimized components",
  "Real-time price comparison",
  "LLM inference benchmarks",
  "Direct Amazon links",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-[#f0fdfa] via-white to-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Floating blobs */}
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-[#0d9488]/10 to-[#14b8a6]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-[#4f46e5]/5 to-[#7c3aed]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-[#0d9488]/10 to-[#14b8a6]/10 border border-[#0d9488]/20"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-[#0d9488]" strokeWidth={1.5} />
              </motion.div>
              <span className="text-sm font-semibold text-[#0d9488]">
                AI Hardware Database
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] leading-[1.1] tracking-tight mb-6"
            >
              Build Your{" "}
              <span className="bg-gradient-to-r from-[#0d9488] to-[#14b8a6] bg-clip-text text-transparent">
                AI Workstation
              </span>
              {" "}with Confidence
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-[#525252] leading-relaxed mb-8 max-w-xl"
            >
              Discover GPUs and CPUs specifically optimized for LLM inference, 
              model training, and AI development. Compare specs, prices, and 
              find the perfect components with direct links to Amazon.
            </motion.p>

            {/* Feature list */}
            <motion.div 
              variants={itemVariants}
              className="grid sm:grid-cols-2 gap-3 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={feature} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, type: "spring", stiffness: 500 }}
                  >
                    <Check className="w-4 h-4 text-[#0d9488]" strokeWidth={2} />
                  </motion.div>
                  <span className="text-sm text-[#525252]">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white font-semibold rounded-xl transition-all group shadow-lg shadow-[#0d9488]/20"
                >
                  <span>Browse Products</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/compare"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-[#f8fafc] text-[#0a0a0a] font-semibold rounded-xl border border-[#e2e8f0] transition-all shadow-sm hover:shadow-md"
                >
                  <span>Compare Hardware</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div 
                className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1 font-medium">Featured GPU</p>
                    <h3 className="text-xl font-bold text-[#0a0a0a]">RTX 4090</h3>
                    <p className="text-sm text-[#64748b]">24GB VRAM • 16384 CUDA Cores</p>
                  </div>
                  <motion.div 
                    className="px-3 py-1 bg-gradient-to-r from-[#0d9488]/10 to-[#14b8a6]/10 rounded-full border border-[#0d9488]/20"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-sm font-semibold text-[#0d9488]">#1 Rated</span>
                  </motion.div>
                </div>
                
                {/* Specs */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748b]">AI Score</span>
                    <span className="text-[#0a0a0a] font-mono font-semibold">95/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748b]">LLM Inference</span>
                    <span className="text-[#0d9488] font-mono font-semibold">72 tok/s</span>
                  </div>
                  <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0d9488] to-[#14b8a6] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0]">
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#0a0a0a] to-[#374151] bg-clip-text text-transparent">$1,599</span>
                    <p className="text-xs text-[#64748b]">on Amazon</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/product/rtx-4090"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#ff9900] to-[#ff8800] text-white text-sm font-semibold rounded-lg transition-all shadow-md"
                    >
                      View Deal
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              {/* Secondary Cards */}
              <motion.div 
                className="absolute -bottom-4 -left-4 w-56 bg-white/90 backdrop-blur-sm border border-[#e2e8f0] rounded-xl p-4 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <p className="text-xs text-[#64748b] mb-1 font-medium">RX 7900 XTX</p>
                <p className="text-lg font-bold text-[#0a0a0a]">$999</p>
                <p className="text-xs text-[#0d9488] font-medium">Great value</p>
              </motion.div>
              
              <motion.div 
                className="absolute -top-4 -right-4 w-56 bg-white/90 backdrop-blur-sm border border-[#e2e8f0] rounded-xl p-4 shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <p className="text-xs text-[#64748b] mb-1 font-medium">Ryzen 9 9950X</p>
                <p className="text-lg font-bold text-[#0a0a0a]">$649</p>
                <p className="text-xs text-[#0d9488] font-medium">16 cores</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-[#e5e5e5]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f0fdfa] rounded-lg">
              <Cpu className="w-5 h-5 text-[#0d9488]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a0a]">60+</p>
              <p className="text-sm text-[#737373]">Components</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f0fdfa] rounded-lg">
              <Zap className="w-5 h-5 text-[#0d9488]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a0a]">AI</p>
              <p className="text-sm text-[#737373]">Benchmarked</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f0fdfa] rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#0d9488]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a0a]">Live</p>
              <p className="text-sm text-[#737373]">Pricing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f0fdfa] rounded-lg">
              <Sparkles className="w-5 h-5 text-[#0d9488]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a0a]">Direct</p>
              <p className="text-sm text-[#737373]">Links</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
