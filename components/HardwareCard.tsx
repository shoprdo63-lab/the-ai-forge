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
  Clock,
  TrendingDown,
  Scale,
  Plus,
  Check,
  Star,
} from "lucide-react";
import type { HardwareComponent } from "@/lib/constants";
import { TIER_COLORS } from "@/lib/constants";
import StarRating from "./StarRating";

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

// Tier badge colors (Cyberpunk Minimalist style)
const TIER_BADGES = {
  "S-Tier": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/50",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
    label: "S",
  },
  "A-Tier": {
    bg: "bg-slate-400/10",
    border: "border-slate-400/50",
    text: "text-slate-300",
    glow: "shadow-slate-400/20",
    label: "A",
  },
  "B-Tier": {
    bg: "bg-slate-600/10",
    border: "border-slate-600/50",
    text: "text-slate-500",
    glow: "shadow-slate-600/20",
    label: "B",
  },
};

// Extract prices from affiliate links for comparison
function getPriceFromUrl(url: string): number | null {
  // Extract price from URL parameters or return null
  const priceMatch = url.match(/[?&]price=(\d+)/);
  return priceMatch ? parseInt(priceMatch[1]) : null;
}

// Mock prices for comparison (in real app, these would come from API)
function getComparisonPrices(component: HardwareComponent) {
  const basePrice = component.price;
  return {
    amazon: basePrice,
    ebay: Math.round(basePrice * 0.95), // 5% cheaper
    aliexpress: Math.round(basePrice * 0.88), // 12% cheaper
  };
}

export default function HardwareCard({ 
  component, 
  index, 
  isSelected,
  isInComparison,
  onToggleSelection,
  onAddToComparison,
}: HardwareCardProps) {
  const { aiIntelligence, specs, affiliateLinks, price, msrp, aiScore = 0 } = component;
  const isGPU = component.category === "GPU";
  const [showBuyMenu, setShowBuyMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPriceTooltip, setShowPriceTooltip] = useState(false);

  // Calculate dynamic AI Tier
  const aiTier = calculateAITier(component);
  const tierStyle = TIER_BADGES[aiTier];

  // Extract numeric VRAM and CUDA for display
  const vramMatch = specs.vram?.match(/(\d+)GB/);
  const vramNum = vramMatch ? vramMatch[1] : null;
  const cudaNum = specs.cuda;

  // Calculate savings percentage
  const savingsPercent = msrp && msrp > price ? Math.round((msrp - price) / msrp * 100) : 0;

  // Get price comparison with mocked data
  const basePrice = price;
  const prices = [
    { store: "Amazon", price: basePrice, url: affiliateLinks.amazon },
    { store: "eBay", price: Math.round(basePrice * 0.95), url: affiliateLinks.ebay },
    { store: "AliExpress", price: Math.round(basePrice * 0.88), url: affiliateLinks.aliexpress },
  ];
  const bestValue = prices.reduce((min, p) => (p.price < min.price ? p : min), prices[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="relative group will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Selection Checkbox */}
      {onToggleSelection && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelection();
          }}
          className={`absolute top-3 left-3 z-20 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            isSelected
              ? "bg-[#10b981] border-[#10b981]"
              : "bg-slate-900/80 border-slate-600 hover:border-[#10b981]"
          }`}
        >
          {isSelected && (
            <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
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
          className={`absolute top-3 right-3 z-20 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
            isInComparison
              ? "bg-[#10b981]/20 text-[#10b981] cursor-default"
              : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700"
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

      {/* Glow shadow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#10b981]/0 via-[#10b981]/0 to-[#10b981]/0 rounded-xl blur opacity-0 group-hover:opacity-100 group-hover:from-[#10b981]/20 group-hover:via-[#10b981]/10 group-hover:to-[#10b981]/20 transition-all duration-500" />

      <div className="glass-card relative flex flex-col h-full overflow-hidden">
        <Link href={`/product/${component.id}`} className="block flex-1">
          {/* Header */}
          <div className="p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Category & AI Tier Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      isGPU
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {component.category}
                  </span>
                  {/* AI-Tier Badge - Cyberpunk Minimalist */}
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold border ${tierStyle.bg} ${tierStyle.border} ${tierStyle.text} shadow-lg ${tierStyle.glow}`}
                    title={`${aiTier} - ${isGPU ? `${vramNum}GB VRAM` : "Multi-core Performance"}`}
                  >
                    {tierStyle.label}
                  </span>
                </div>

                {/* Product Name - Bold */}
                <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-[#10b981] transition-colors duration-300">
                  {component.name}
                </h3>

                {/* Star Rating & Review Count */}
                {component.rating && component.reviewCount && (
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating
                      rating={component.rating}
                      size="sm"
                      animated={isHovered}
                    />
                    <span className="text-xs text-slate-400">
                      ({component.reviewCount} Reviews)
                    </span>
                  </div>
                )}

                {/* Brand */}
                <p className="text-xs text-slate-500 mt-1.5 uppercase tracking-wider">
                  {component.brand}
                </p>
              </div>

              {/* Price Section with Stock Status */}
              <div className="flex flex-col items-end shrink-0">
                {/* In Stock Indicator */}
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                  <span className="text-[10px] text-[#10b981] font-medium">In Stock</span>
                </div>
                
                <span className="text-2xl font-bold text-[#10b981] font-mono">
                  ${price.toLocaleString()}
                </span>
                {savingsPercent > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500 line-through">
                      ${msrp.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#10b981] font-medium">
                      Save {savingsPercent}%
                    </span>
                  </div>
                )}
                
                {/* Last Updated */}
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span className="text-[10px] text-slate-500">Updated 1h ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs with Icons */}
          <div className="px-5 py-3 border-y border-white/5 bg-white/[0.02]">
            <div className="flex flex-wrap gap-3">
              {isGPU && vramNum && (
                <div className="flex items-center gap-1.5 text-sm">
                  <HardDrive className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">VRAM</span>
                  <span className="text-white font-semibold">{vramNum}GB</span>
                </div>
              )}
              {isGPU && cudaNum && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Cpu className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">CUDA</span>
                  <span className="text-white font-semibold">
                    {parseInt(cudaNum).toLocaleString()}
                  </span>
                </div>
              )}
              {specs.tdp && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Zap className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">TDP</span>
                  <span className="text-white font-semibold">
                    {specs.tdp.replace("W", "")}W
                  </span>
                </div>
              )}
              {specs.architecture && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span className="text-white font-semibold">
                    {specs.architecture}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description / Tags with Hover Animation */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.p
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-slate-300 leading-relaxed line-clamp-3"
                >
                  {component.description}
                </motion.p>
              ) : (
                <motion.div
                  key="tags"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-1.5"
                >
                  {component.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] text-slate-500 bg-slate-800/60 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Performance Meter */}
          <div className="px-5 pb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">AI Capability</span>
              <span className="text-[#10b981] font-medium">{aiScore}/100</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${aiScore}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`h-full rounded-full ${
                  aiScore >= 80 ? "bg-[#10b981]" : 
                  aiScore >= 60 ? "bg-blue-500" : "bg-slate-500"
                }`}
              />
            </div>
          </div>
        </Link>

        {/* Buy Now Section with Enhanced Affiliate Matrix */}
        <div className="p-5 pt-0 relative">
          {/* Buy Now Button - Mobile optimized hit area */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBuyMenu(!showBuyMenu);
            }}
            onMouseEnter={() => setShowPriceTooltip(true)}
            onMouseLeave={() => setShowPriceTooltip(false)}
            className="btn-affiliate w-full flex items-center justify-center gap-2 relative min-h-[48px] active:scale-[0.98] transition-transform"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy Now</span>
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
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-5 right-5 mb-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl z-50"
              >
                <div className="p-1">
                  <a
                    href={affiliateLinks.amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-4 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-md transition-colors min-h-[48px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ShoppingCart className="w-4 h-4 text-[#10b981]" />
                    <span className="flex-1">Amazon</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                  <a
                    href={affiliateLinks.ebay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-4 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-md transition-colors min-h-[48px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ShoppingCart className="w-4 h-4 text-blue-400" />
                    <span className="flex-1">eBay</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                  <a
                    href={affiliateLinks.aliexpress}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-4 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-md transition-colors min-h-[48px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ShoppingCart className="w-4 h-4 text-red-400" />
                    <span className="flex-1">AliExpress</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Affiliate Disclosure */}
          <p className="text-[9px] text-slate-600 text-center mt-2 leading-tight">
            As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
