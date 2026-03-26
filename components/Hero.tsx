"use client";

import { ArrowRight, Sparkles, Cpu, Zap, TrendingUp, Check } from "lucide-react";
import Link from "next/link";

const features = [
  "60+ AI-optimized components",
  "Real-time price comparison",
  "LLM inference benchmarks",
  "Direct Amazon links",
];

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0fdfa] via-white to-white pointer-events-none" />
      
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-[#0d9488]/10 border border-[#0d9488]/20">
              <Sparkles className="w-4 h-4 text-[#0d9488]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-[#0d9488]">
                AI Hardware Database
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0a0a0a] leading-[1.1] tracking-tight mb-6">
              Build Your{" "}
              <span className="text-[#0d9488]">AI Workstation</span>
              {" "}with Confidence
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[#525252] leading-relaxed mb-8 max-w-xl">
              Discover GPUs and CPUs specifically optimized for LLM inference, 
              model training, and AI development. Compare specs, prices, and 
              find the perfect components with direct links to Amazon.
            </p>

            {/* Feature list */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0d9488]" strokeWidth={2} />
                  <span className="text-sm text-[#525252]">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold rounded-xl transition-all group shadow-lg shadow-[#0d9488]/20"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#f5f5f5] text-[#0a0a0a] font-semibold rounded-xl border border-[#e5e5e5] transition-all"
              >
                <span>Compare Hardware</span>
              </Link>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-xl shadow-black/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#737373] uppercase tracking-wider mb-1">Featured GPU</p>
                    <h3 className="text-xl font-bold text-[#0a0a0a]">RTX 4090</h3>
                    <p className="text-sm text-[#525252]">24GB VRAM • 16384 CUDA Cores</p>
                  </div>
                  <div className="px-3 py-1 bg-[#0d9488]/10 rounded-full">
                    <span className="text-sm font-semibold text-[#0d9488]">#1 Rated</span>
                  </div>
                </div>
                
                {/* Specs */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737373]">AI Score</span>
                    <span className="text-[#0a0a0a] font-mono font-medium">95/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737373]">LLM Inference</span>
                    <span className="text-[#0d9488] font-mono font-medium">72 tok/s</span>
                  </div>
                  <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0d9488] to-[#14b8a6] rounded-full"
                      style={{ width: "95%" }}
                    />
                  </div>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5]">
                  <div>
                    <span className="text-2xl font-bold text-[#0a0a0a]">$1,599</span>
                    <p className="text-xs text-[#737373]">on Amazon</p>
                  </div>
                  <Link
                    href="/product/rtx-4090"
                    className="px-4 py-2 bg-[#ff9900] hover:bg-[#ff8800] text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    View Deal
                  </Link>
                </div>
              </div>

              {/* Secondary Cards */}
              <div className="absolute -bottom-4 -left-4 w-52 bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-lg opacity-90">
                <p className="text-xs text-[#737373] mb-1">RX 7900 XTX</p>
                <p className="text-lg font-bold text-[#0a0a0a]">$999</p>
                <p className="text-xs text-[#0d9488]">Great value</p>
              </div>
              
              <div className="absolute -top-4 -right-4 w-52 bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-lg opacity-90">
                <p className="text-xs text-[#737373] mb-1">Ryzen 9 9950X</p>
                <p className="text-lg font-bold text-[#0a0a0a]">$649</p>
                <p className="text-xs text-[#0d9488]">16 cores</p>
              </div>
            </div>
          </div>
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
