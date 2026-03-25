"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Cpu, Layers, ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";
import { hardwareComponents } from "@/data/components";

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      setDisplayValue(v);
    });
    return unsubscribe;
  }, [rounded]);

  return <span>{displayValue}</span>;
}

export default function HomeHero() {
  const componentCount = hardwareComponents.length;

  const stats = [
    { icon: Layers, value: componentCount, label: "Components", suffix: "+" },
    { icon: Zap, value: 15, label: "GPU Models", suffix: "" },
    { icon: TrendingUp, value: 99, label: "AI Score", suffix: "%" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0f1a] via-[#020617] to-[#020617]">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="relative max-w-[1800px] mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-[12px] font-semibold text-emerald-400 uppercase tracking-wider">
              Professional Hardware Database
            </span>
          </motion.div>

          {/* Large Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]"
          >
            Build Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600">
              AI Workstation
            </span>
            <br />
            <span className="text-[#64748b]">With Confidence</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-[#94a3b8] mb-12 leading-relaxed max-w-2xl"
          >
            Compare prices across Amazon, eBay, and AliExpress. 
            <span className="text-white font-medium"> 70+ AI-optimized components</span> with 
            smart compatibility checking and live price tracking.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#components"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#020617] font-bold text-sm rounded-xl transition-all group shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              Browse Components
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#334155] hover:border-emerald-500/50 text-white font-semibold text-sm rounded-xl transition-all hover:bg-[#1e293b]/50"
            >
              <Cpu className="h-5 w-5 text-emerald-400" />
              System Builder
            </a>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-20 lg:mt-28 pt-8 border-t border-[#1e293b]/50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#334155] shadow-lg">
                  <stat.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-[12px] text-[#64748b] uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
