"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShoppingCart, 
  ExternalLink,
  Star,
  Check,
  AlertCircle,
  TrendingUp,
  Scale,
  Monitor,
  Cpu,
  Zap,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart,
  X
} from "lucide-react";
import type { HardwareComponent } from "@/data/components";

interface ProductDetailProps {
  component: HardwareComponent;
  similarProducts: HardwareComponent[];
}

// Store prices (mock for demo - in production would come from API)
const STORE_PRICES: Record<string, Record<string, { price: number; url: string; inStock: boolean }>> = {
  "rtx-4090": {
    amazon: { price: 1599, url: "https://www.amazon.com/dp/B0GBR4BKMW?tag=aiforge-20", inStock: true },
    newegg: { price: 1579, url: "https://www.newegg.com", inStock: true },
    bestbuy: { price: 1599, url: "https://www.bestbuy.com", inStock: false },
    bnh: { price: 1599, url: "https://www.bhphotovideo.com", inStock: true },
  },
  "rx-7900-xtx": {
    amazon: { price: 999, url: "https://www.amazon.com/dp/B0BNL9NPL9?tag=aiforge-20", inStock: true },
    newegg: { price: 979, url: "https://www.newegg.com", inStock: true },
    bestbuy: { price: 999, url: "https://www.bestbuy.com", inStock: true },
  },
  "core-i9-14900k": {
    amazon: { price: 589, url: "https://www.amazon.com/dp/B0BCJN2H7G?tag=aiforge-20", inStock: true },
    newegg: { price: 569, url: "https://www.newegg.com", inStock: true },
    bestbuy: { price: 589, url: "https://www.bestbuy.com", inStock: true },
  },
};

export default function ProductDetail({ component, similarProducts }: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState<"specs" | "benchmarks" | "reviews">("specs");
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const isGPU = component.category === "GPU";
  const isCPU = component.category === "CPU";
  
  // Get store prices
  const prices = STORE_PRICES[component.id] || {};
  const lowestPrice = Object.values(prices).length > 0 
    ? Math.min(...Object.values(prices).filter(p => p.inStock).map(p => p.price))
    : component.price;

  // Star rating component
  const StarRating = ({ score }: { score: number }) => {
    const stars = Math.round(score / 20);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= stars ? "text-yellow-500 fill-yellow-500" : "text-[#444]"}`}
          />
        ))}
        <span className="ml-2 text-sm text-[#aaa]">({score}/100)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#f5f5f5] border-b border-[#e5e5e5]">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#4f46e5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-center gap-3 mb-2"
            >
              <motion.span 
                className="px-2.5 py-1 bg-[#0d9488]/10 text-[#0d9488] text-xs font-semibold rounded-md border border-[#0d9488]/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(13, 148, 136, 0.15)" }}
                transition={{ duration: 0.2 }}
              >
                {component.category}
              </motion.span>
              <span className="px-2.5 py-1 bg-[#f5f5f5] text-[#6b7280] text-xs font-medium rounded-md border border-[#e5e5e5]">
                {component.brand}
              </span>
              {component.inStock ? (
                <motion.span 
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-200"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  In Stock
                </motion.span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-md border border-red-200">
                  <X className="w-3 h-3" />
                  Out of Stock
                </span>
              )}
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-[#0a0a0a] mb-3 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {component.name}
            </motion.h1>
            
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <StarRating score={component.aiScore} />
              <span className="text-[#e5e7eb]">|</span>
              <span className="text-sm text-[#6b7280]">AI Score: <span className="font-semibold text-[#0d9488]">{component.aiScore}/100</span></span>
            </motion.div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isFavorite 
                      ? "bg-red-50 border-red-200 text-red-500" 
                      : "bg-white border-[#e5e5e5] text-[#9ca3af] hover:text-[#6b7280]"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
                <button className="p-2 bg-white border border-[#e5e5e5] rounded-lg text-[#9ca3af] hover:text-[#6b7280] transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Image with Premium Effects */}
            <motion.div 
              className="aspect-video bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.01 }}
            >
              {component.imageUrl ? (
                <motion.img
                  src={component.imageUrl}
                  alt={component.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    {isGPU ? (
                      <Monitor className="w-24 h-24 text-[#cbd5e1] mx-auto mb-4" strokeWidth={1} />
                    ) : isCPU ? (
                      <Cpu className="w-24 h-24 text-[#cbd5e1] mx-auto mb-4" strokeWidth={1} />
                    ) : (
                      <Zap className="w-24 h-24 text-[#cbd5e1] mx-auto mb-4" strokeWidth={1} />
                    )}
                    <p className="text-[#94a3b8] font-medium">{component.name}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Animated Tabs */}
            <motion.div 
              className="border-b border-[#e2e8f0]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex gap-1">
                {["specs", "benchmarks", "reviews"].map((tab, index) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`relative py-3 px-4 text-sm font-medium capitalize transition-colors rounded-t-lg ${
                      activeTab === tab
                        ? "text-[#4f46e5]"
                        : "text-[#64748b] hover:text-[#374151]"
                    }`}
                    whileHover={{ backgroundColor: activeTab === tab ? "transparent" : "rgba(79, 70, 229, 0.05)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            {activeTab === "specs" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#0a0a0a]">Specifications</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(component.specs).filter(([_, v]) => v).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-[#e5e5e5]">
                      <span className="text-[#6b7280] capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-[#0a0a0a] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <p className="text-[#6b7280] leading-relaxed">{component.description}</p>
                </div>
              </div>
            )}

            {activeTab === "benchmarks" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#0a0a0a]">AI Performance Benchmarks</h2>
                <div className="space-y-4">
                  {[
                    { label: "LLM Inference (Llama 2 70B)", value: component.aiScore, unit: "tokens/sec" },
                    { label: "Image Generation (Stable Diffusion)", value: Math.round(component.aiScore * 0.8), unit: "img/min" },
                    { label: "Training Throughput", value: Math.round(component.aiScore * 0.6), unit: "samples/sec" },
                  ].map((bench) => (
                    <div key={bench.label} className="bg-[#f5f5f5] rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-[#6b7280]">{bench.label}</span>
                        <span className="text-[#0d9488] font-mono font-medium">{bench.value} {bench.unit}</span>
                      </div>
                      <div className="h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#0d9488] to-[#14b8a6] rounded-full"
                          style={{ width: `${bench.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#0a0a0a]">User Reviews</h2>
                <div className="text-center py-12 bg-[#f5f5f5] rounded-lg">
                  <p className="text-[#9ca3af]">Reviews coming soon...</p>
                </div>
              </div>
            )}

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div className="pt-6 border-t border-[#e5e5e5]">
                <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">Similar Products</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {similarProducts.slice(0, 2).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="bg-white border border-[#e5e5e5] rounded-lg p-4 hover:border-[#4f46e5]/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#f5f5f5] rounded flex items-center justify-center overflow-hidden shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            product.category === "GPU" ? <Monitor className="w-6 h-6 text-[#9ca3af]" /> : <Cpu className="w-6 h-6 text-[#9ca3af]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0a0a0a] truncate">{product.name}</p>
                          <p className="text-xs text-[#6b7280]">{product.brand}</p>
                        </div>
                        <span className="text-[#0d9488] font-semibold">${product.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Buy Box */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="sticky top-20 space-y-4">
              {/* Price Comparison - Glassmorphism Card */}
              <motion.div 
                className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                whileHover={{ y: -2, boxShadow: "0_12px_40px_rgb(0,0,0,0.12)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-baseline gap-2 mb-4">
                  <motion.span 
                    className="text-4xl font-bold bg-gradient-to-r from-[#0d9488] to-[#14b8a6] bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7, type: "spring" }}
                  >
                    ${lowestPrice.toLocaleString()}
                  </motion.span>
                  <span className="text-[#94a3b8] text-sm">Lowest Price</span>
                </div>

                {/* Store List */}
                <div className="space-y-2">
                  {Object.entries(prices).length > 0 ? (
                    Object.entries(prices).map(([store, data], index) => (
                      <motion.a
                        key={store}
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-xl hover:shadow-md transition-all group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`w-2 h-2 rounded-full ${data.inStock ? "bg-green-500" : "bg-red-500"}`}
                            animate={data.inStock ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-sm font-medium text-[#1e293b] capitalize">{store}</span>
                          {data.price === lowestPrice && data.inStock && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-[#0d9488]/20 to-[#14b8a6]/20 text-[#0d9488] text-xs font-semibold rounded-full border border-[#0d9488]/20">
                              Best
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#1e293b] font-semibold">${data.price}</span>
                          <ExternalLink className="w-4 h-4 text-[#94a3b8] group-hover:text-[#64748b] transition-colors" />
                        </div>
                      </motion.a>
                    ))
                  ) : (
                    <motion.a
                      href={component.directLinks?.amazon || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#ff9900] to-[#ff8800] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      View on Amazon
                    </motion.a>
                  )}
                </div>

                {/* Additional Stores */}
                <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
                  <p className="text-xs text-[#94a3b8] mb-3 font-medium">Also available at:</p>
                  <div className="flex flex-wrap gap-2">
                    {component.directLinks?.ebay && (
                      <motion.a
                        href={component.directLinks.ebay}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-[#e53238] to-[#c41e3a] text-white text-xs font-semibold rounded-lg shadow-md"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        eBay
                      </motion.a>
                    )}
                    {component.directLinks?.aliexpress && (
                      <motion.a
                        href={component.directLinks.aliexpress}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-[#ff4747] to-[#e03e3e] text-white text-xs font-semibold rounded-lg shadow-md"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        AliExpress
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* AI Score Card - Premium */}
              <motion.div 
                className="bg-gradient-to-br from-white/90 to-[#f8fafc]/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="p-2.5 bg-gradient-to-br from-[#0d9488]/20 to-[#14b8a6]/20 rounded-xl"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <TrendingUp className="w-5 h-5 text-[#0d9488]" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-[#64748b] font-medium">AI Performance Score</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-[#1e293b] to-[#334155] bg-clip-text text-transparent">
                      {component.aiScore}
                      <span className="text-lg text-[#94a3b8] font-normal">/100</span>
                    </p>
                  </div>
                </div>
                <div className="h-2.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#2dd4bf] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${component.aiScore}%` }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-[#94a3b8] mt-2">Based on LLM inference benchmarks</p>
              </motion.div>

              {/* Compare Button - Premium */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/compare?id1=${component.id}`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-[#1e293b] font-semibold rounded-xl border border-[#e2e8f0] shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all"
                >
                  <Scale className="w-5 h-5 text-[#64748b]" />
                  Compare with Similar
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
