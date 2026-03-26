"use client";

import { ArrowRight, Sparkles, Cpu, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#0f0f13] border-b border-[#2a2a30] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/5 via-transparent to-[#6366f1]/5 pointer-events-none" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-[#00d4aa]/30 bg-[#00d4aa]/10">
              <Sparkles className="w-4 h-4 text-[#00d4aa]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-[#00d4aa]">
                AI-Optimized Hardware Database
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Build Your{" "}
              <span className="text-[#00d4aa]">AI Workstation</span>
              {" "}with Premium Hardware
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[#aaa] leading-relaxed mb-8 max-w-xl">
              Discover GPUs and CPUs specifically optimized for LLM inference, 
              model training, and AI development. Compare specs, prices, and 
              find the perfect components for your needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00d4aa] hover:bg-[#00b894] text-[#0a0a0f] font-semibold rounded-lg transition-all group"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1f] hover:bg-[#252525] text-white font-semibold rounded-lg border border-[#2a2a30] transition-all"
              >
                <span>Compare Hardware</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1a1a1f] rounded-lg">
                  <Cpu className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">60+</p>
                  <p className="text-sm text-[#666]">Components</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1a1a1f] rounded-lg">
                  <Zap className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">AI</p>
                  <p className="text-sm text-[#666]">Benchmarked</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1a1a1f] rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Live</p>
                  <p className="text-sm text-[#666]">Pricing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Cards */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-2xl p-6 shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Featured</p>
                    <h3 className="text-xl font-bold text-white">RTX 4090</h3>
                    <p className="text-sm text-[#aaa]">24GB VRAM • 16384 CUDA Cores</p>
                  </div>
                  <div className="px-3 py-1 bg-[#00d4aa]/20 rounded-full">
                    <span className="text-sm font-semibold text-[#00d4aa]">#1 Rated</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">AI Score</span>
                    <span className="text-white font-mono">95/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">LLM Inference</span>
                    <span className="text-[#00d4aa] font-mono">72 tok/s</span>
                  </div>
                  <div className="h-2 bg-[#0f0f13] rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-gradient-to-r from-[#00d4aa] to-[#00b894] rounded-full" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#2a2a30] flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#00d4aa]">$1,599</span>
                  <Link
                    href="/product/rtx-4090"
                    className="px-4 py-2 bg-[#ff9900] hover:bg-[#ff8800] text-white text-sm font-medium rounded transition-colors"
                  >
                    View Deal
                  </Link>
                </div>
              </div>

              {/* Secondary Cards */}
              <div className="absolute -bottom-4 -left-4 w-48 bg-[#1a1a1f] border border-[#2a2a30] rounded-xl p-4 shadow-xl opacity-60">
                <p className="text-xs text-[#666] mb-1">RX 7900 XTX</p>
                <p className="text-lg font-bold text-white">$999</p>
              </div>
              <div className="absolute -top-4 -right-4 w-48 bg-[#1a1a1f] border border-[#2a2a30] rounded-xl p-4 shadow-xl opacity-60">
                <p className="text-xs text-[#666] mb-1">Threadripper 7980X</p>
                <p className="text-lg font-bold text-white">$2,999</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
