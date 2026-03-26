"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ShoppingCart,
  ChevronDown,
  Cpu,
  HardDrive,
  Zap,
  Layers,
  CheckCircle2,
  Scale,
  Check,
} from "lucide-react";
import type { HardwareComponent } from "@/lib/constants";

interface HardwareCardProps {
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
    // CPU tier based on core count from name
    const coreMatch = component.name.match(/(\d+)-Core/);
    const cores = coreMatch ? parseInt(coreMatch[1]) : 0;
    if (cores >= 24) return "S-Tier";
    if (cores >= 16) return "A-Tier";
    return "B-Tier";
  }
}

// Tier badge colors - Quiet Luxury muted palette
const TIER_BADGES = {
  "S-Tier": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    label: "S",
  },
  "A-Tier": {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    label: "A",
  },
  "B-Tier": {
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    text: "text-zinc-400",
    label: "B",
  },
};

export default function HardwareCard({
  component,
  index,
  isSelected,
  isInComparison,
  onToggleSelection,
  onAddToComparison,
}: HardwareCardProps) {
  const { specs, affiliateLinks, price, msrp, aiScore = 0 } = component;
  const isGPU = component.category === "GPU";
  const [showBuyMenu, setShowBuyMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate dynamic AI Tier
  const aiTier = calculateAITier(component);
  const tierStyle = TIER_BADGES[aiTier];

  // Extract numeric VRAM and CUDA for display
  const vramMatch = specs.vram?.match(/(\d+)GB/);
  const vramNum = vramMatch ? vramMatch[1] : null;
  const cudaNum = specs.cuda;

  // Calculate savings percentage
  const savingsPercent = msrp && msrp > price ? Math.round((msrp - price) / msrp * 100) : 0;

  // Entry animation delay based on index for staggered reveal
  const entryDelay = Math.min(index * 0.05, 0.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: entryDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileTap={{ scale: 0.98 }}
      className="relative group will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
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
          {isSelected && (
            <Check className="w-4 h-4 text-black" strokeWidth={3} />
          )}
        </button>
      )}

      {/* Add to Compare Button */}
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
            <>
              <Check className="w-3 h-3" />
              Added
            </>
          ) : (
            <>
              <Scale className="w-3 h-3" />
              Compare
            </>
          )}
        </button>
      )}

      {/* Quiet Luxury Glass Card */}
      <div className="glass-card relative flex flex-col h-full overflow-hidden">
        <Link href={`/product/${component.id}`} className="block flex-1">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Category & AI Tier Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wide border ${
                      isGPU
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {component.category}
                  </span>
                  {/* AI-Tier Badge - Quiet Luxury */}
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-semibold border ${tierStyle.bg} ${tierStyle.border} ${tierStyle.text}`}
                    title={`${aiTier} - ${isGPU ? `${vramNum}GB VRAM` : "Multi-core Performance"}`}
                  >
                    {tierStyle.label}
                  </span>
                </div>

                {/* Product Name - Typography Hierarchy */}
                <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                  {component.name}
                </h3>

                {/* Brand - Muted Secondary */}
                <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest font-medium">
                  {component.brand}
                </p>
              </div>

              {/* Price Section with Stock Status */}
              <div className="flex flex-col items-end shrink-0 text-right">
                {/* In Stock Indicator */}
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-wide">In Stock</span>
                </div>
                
                <span className="text-2xl font-semibold text-emerald-400 font-mono tracking-tight">
                  ${price.toLocaleString()}
                </span>
                {savingsPercent > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500 line-through">
                      ${msrp.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      Save {savingsPercent}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specs Bar */}
          <div className="px-6 py-3 border-y border-white/[0.06] bg-white/[0.02]">
            <div className="flex flex-wrap gap-4">
              {isGPU && vramNum && (
                <div className="flex items-center gap-1.5 text-sm">
                  <HardDrive className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                  <span className="text-zinc-500 text-xs">VRAM</span>
                  <span className="text-zinc-300 font-medium text-sm">{vramNum}GB</span>
                </div>
              )}
              {isGPU && cudaNum && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                  <span className="text-zinc-500 text-xs">CUDA</span>
                  <span className="text-zinc-300 font-medium text-sm">
                    {parseInt(cudaNum).toLocaleString()}
                  </span>
                </div>
              )}
              {specs.tdp && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Zap className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                  <span className="text-zinc-500 text-xs">TDP</span>
                  <span className="text-zinc-300 font-medium text-sm">
                    {specs.tdp.replace("W", "")}W
                  </span>
                </div>
              )}
              {specs.architecture && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                  <span className="text-zinc-300 font-medium text-sm">
                    {specs.architecture}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description / Tags with Hover Animation */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.p
                  key="description"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-zinc-400 leading-relaxed line-clamp-3"
                >
                  {component.description}
                </motion.p>
              ) : (
                <motion.div
                  key="tags"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-2"
                >
                  {component.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[10px] text-zinc-500 bg-white/[0.04] border border-white/[0.06] rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Performance Meter */}
          <div className="px-6 pb-2">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-500">AI Capability</span>
              <span className="text-emerald-400 font-medium">{aiScore}/100</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${aiScore}%` }}
                transition={{ duration: 0.6, delay: entryDelay + 0.2 }}
                className={`h-full rounded-full ${
                  aiScore >= 80 ? "bg-emerald-500" : 
                  aiScore >= 60 ? "bg-blue-500" : "bg-zinc-500"
                }`}
              />
            </div>
          </div>
        </Link>

        {/* Buy Now Section */}
        <div className="p-6 pt-4 relative">
          {/* Buy Now Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBuyMenu(!showBuyMenu);
            }}
            className="btn-affiliate w-full flex items-center justify-center gap-2 relative min-h-[48px]"
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-medium">Buy Now</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showBuyMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showBuyMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-6 right-6 mb-2 bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
              >
                <div className="p-1.5">
                  <a
                    href={affiliateLinks.amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors min-h-[48px]"
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
                    className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors min-h-[48px]"
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
                    className="flex items-center gap-3 px-4 py-3.5 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white rounded-lg transition-colors min-h-[48px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ShoppingCart className="w-4 h-4 text-red-500" strokeWidth={1.5} />
                    <span className="flex-1 font-medium">AliExpress</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600" strokeWidth={1.5} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Affiliate Disclosure */}
          <p className="text-[9px] text-zinc-600 text-center mt-3 leading-tight">
            As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
