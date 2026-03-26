"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  ChevronDown,
  HardDrive,
  Cpu,
  Zap,
  Layers,
  CheckCircle2,
  Scale,
  Check,
  ExternalLink,
} from "lucide-react";
import type { HardwareComponent } from "@/lib/constants";

interface ProductCardProps {
  component: HardwareComponent;
  index: number;
  isSelected?: boolean;
  isInComparison?: boolean;
  onToggleSelection?: () => void;
  onAddToComparison?: () => void;
}

// Calculate AI Tier based on VRAM (GPUs) or cores (CPUs)
function calculateAITier(component: HardwareComponent): "S-Tier" | "A-Tier" | "B-Tier" {
  if (component.category === "GPU") {
    const vram = component.vram || 0;
    if (vram >= 24) return "S-Tier";
    if (vram >= 16) return "A-Tier";
    return "B-Tier";
  } else {
    const coreMatch = component.name.match(/(\d+)-Core/);
    const cores = coreMatch ? parseInt(coreMatch[1]) : 0;
    if (cores >= 24) return "S-Tier";
    if (cores >= 16) return "A-Tier";
    return "B-Tier";
  }
}

// Tier badge styles - NASA-grade precision
const TIER_STYLES = {
  "S-Tier": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
    label: "S",
  },
  "A-Tier": {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    label: "A",
  },
  "B-Tier": {
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    text: "text-zinc-400",
    glow: "shadow-zinc-500/10",
    label: "B",
  },
};

// Animation variants for staggered entry
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function ProductCard({
  component,
  index,
  isSelected,
  isInComparison,
  onToggleSelection,
  onAddToComparison,
}: ProductCardProps) {
  const { specs, affiliateLinks, price, msrp, aiScore = 0 } = component;
  const isGPU = component.category === "GPU";
  const [showBuyMenu, setShowBuyMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate dynamic AI Tier
  const aiTier = calculateAITier(component);
  const tierStyle = TIER_STYLES[aiTier];

  // Extract numeric specs
  const vramMatch = specs.vram?.match(/(\d+)GB/);
  const vramNum = vramMatch ? vramMatch[1] : null;
  const cudaNum = specs.cuda;
  const tdpValue = specs.tdp?.replace("W", "");

  // Calculate savings
  const savingsPercent = msrp && msrp > price ? Math.round((msrp - price) / msrp * 100) : 0;

  return (
    <motion.div
      variants={cardVariants}
      whileTap={{ scale: 0.98 }}
      className="relative group will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Controls */}
      {onToggleSelection && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelection();
          }}
          className={`absolute top-4 left-4 z-20 w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? "bg-emerald-500 border-emerald-500"
              : "bg-black/40 border-white/20 hover:border-white/40"
          }`}
        >
          {isSelected && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
        </button>
      )}

      {onAddToComparison && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToComparison();
          }}
          disabled={isInComparison}
          className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
            isInComparison
              ? "bg-emerald-500/20 text-emerald-400 cursor-default"
              : "bg-black/40 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          {isInComparison ? (
            <><Check className="w-3 h-3" /> Added</>
          ) : (
            <><Scale className="w-3 h-3" /> Compare</>
          )}
        </button>
      )}

      {/* Floating Glass Card */}
      <div className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-white/[0.01] backdrop-blur-md border border-white/10 transition-all duration-400 ease-out hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
        
        {/* Emerald Glow Border Effect on Hover */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          }}
        />

        <Link href={`/product/${component.id}`} className="block flex-1 relative z-10">
          {/* Header Section */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Category & AI Tier Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border ${
                    isGPU
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {component.category}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold border ${tierStyle.bg} ${tierStyle.border} ${tierStyle.text}`}
                    title={`${aiTier} - ${isGPU ? `${vramNum}GB VRAM` : "Multi-core Performance"}`}
                  >
                    {tierStyle.label}
                  </span>
                </div>

                {/* Product Name - NASA Typography */}
                <h3 className="text-lg font-light tracking-tight text-white leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                  {component.name}
                </h3>

                {/* Brand Label */}
                <p className="text-[11px] text-zinc-500 mt-2 uppercase tracking-[0.15em] font-mono">
                  {component.brand}
                </p>
              </div>

              {/* Price Section */}
              <div className="flex flex-col items-end shrink-0 text-right">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] text-emerald-500 font-mono uppercase tracking-wide">IN STOCK</span>
                </div>
                
                <span className="text-2xl font-light text-emerald-400 font-mono tracking-tight">
                  ${price.toLocaleString()}
                </span>
                
                {savingsPercent > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500 line-through font-mono">
                      ${msrp.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      -{savingsPercent}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hardware Schematic Placeholder - No Human Imagery */}
          <div className="mx-6 h-32 rounded-xl bg-gradient-to-br from-white/[0.02] to-white/[0.05] border border-white/[0.06] flex items-center justify-center overflow-hidden relative">
            {/* Abstract geometric pattern representing hardware */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="160" height="60" rx="4" stroke="currentColor" strokeWidth="0.5" className="text-zinc-600"/>
                <rect x="30" y="30" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700"/>
                <rect x="80" y="35" width="80" height="8" rx="1" fill="currentColor" className="text-zinc-700"/>
                <rect x="80" y="50" width="60" height="8" rx="1" fill="currentColor" className="text-zinc-700"/>
                <rect x="80" y="65" width="70" height="8" rx="1" fill="currentColor" className="text-zinc-700"/>
                <circle cx="55" cy="50" r="12" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/50"/>
                <circle cx="55" cy="50" r="6" fill="currentColor" className="text-emerald-500/30"/>
              </svg>
            </div>
            {/* GPU/CPU Icon Overlay */}
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
              {isGPU ? (
                <HardDrive className="w-8 h-8 text-zinc-500" strokeWidth={1} />
              ) : (
                <Cpu className="w-8 h-8 text-zinc-500" strokeWidth={1} />
              )}
            </div>
          </div>

          {/* Technical Dashboard - Specs Grid */}
          <div className="px-6 py-4 mt-4">
            <div className="grid grid-cols-3 gap-3">
              {isGPU && vramNum && (
                <div className="flex flex-col p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono mb-1">VRAM</span>
                  <span className="text-sm font-mono text-zinc-300">{vramNum}<span className="text-zinc-500 text-xs">GB</span></span>
                </div>
              )}
              {isGPU && cudaNum && (
                <div className="flex flex-col p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono mb-1">CUDA</span>
                  <span className="text-sm font-mono text-zinc-300">{parseInt(cudaNum).toLocaleString()}</span>
                </div>
              )}
              {tdpValue && (
                <div className="flex flex-col p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono mb-1">TDP</span>
                  <span className="text-sm font-mono text-zinc-300">{tdpValue}<span className="text-zinc-500 text-xs">W</span></span>
                </div>
              )}
              {specs.architecture && (
                <div className="flex flex-col p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] col-span-2">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono mb-1">ARCHITECTURE</span>
                  <span className="text-sm font-mono text-zinc-300 truncate">{specs.architecture}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Capability Meter */}
          <div className="px-6 pb-2">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-500 font-mono uppercase tracking-wider text-[10px]">AI Score</span>
              <span className="text-emerald-400 font-mono font-medium">{aiScore}/100</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${aiScore}%` }}
                transition={{ duration: 0.8, delay: index * 0.08 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`h-full rounded-full ${
                  aiScore >= 80 ? "bg-emerald-500" : 
                  aiScore >= 60 ? "bg-blue-500" : "bg-zinc-500"
                }`}
              />
            </div>
          </div>
        </Link>

        {/* Action Section */}
        <div className="p-6 pt-4 relative z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBuyMenu(!showBuyMenu);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-sm hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
            <span>Purchase Options</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showBuyMenu ? "rotate-180" : ""}`} />
          </button>

          {/* Purchase Dropdown */}
          <motion.div
            initial={false}
            animate={showBuyMenu ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.96, pointerEvents: "none" }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-6 right-6 mb-2 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
          >
            <div className="p-1.5">
              <a
                href={affiliateLinks.amazon}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ShoppingCart className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />
                <span className="flex-1 font-medium">Amazon</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600" strokeWidth={1.5} />
              </a>
              <a
                href={affiliateLinks.ebay}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ShoppingCart className="w-4 h-4 text-blue-500" strokeWidth={1.5} />
                <span className="flex-1 font-medium">eBay</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600" strokeWidth={1.5} />
              </a>
              <a
                href={affiliateLinks.aliexpress}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ShoppingCart className="w-4 h-4 text-red-500" strokeWidth={1.5} />
                <span className="flex-1 font-medium">AliExpress</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600" strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          {/* Affiliate Disclosure */}
          <p className="text-[9px] text-zinc-600 text-center mt-3 leading-tight font-mono uppercase tracking-wider">
            Affiliate Links • Commission Earned
          </p>
        </div>
      </div>
    </motion.div>
  );
}
