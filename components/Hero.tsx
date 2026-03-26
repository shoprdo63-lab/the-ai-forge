"use client";

import { ArrowDown, Sparkles } from "lucide-react";

export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-[var(--background)] border-b border-[var(--border)]">
      <div className="max-w-[1800px] mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-md border border-[var(--accent)] bg-[var(--card-bg)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.5} />
            <span className="text-xs font-medium text-[var(--accent)] tracking-wide">
              AI-Optimized Hardware
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--text-primary)] leading-[1.1] tracking-tight mb-6">
            Premium Hardware for{" "}
            <span className="text-[var(--accent)]">AI Workloads</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mb-10">
            Curated selection of GPUs and CPUs optimized for LLM inference and
            model training. Find the perfect components for your AI workstation.
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToProducts}
            className="btn-primary"
          >
            <span>Explore Products</span>
            <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
