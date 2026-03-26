"use client";

import { useState } from "react";
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
  Heart
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
    <div className="min-h-screen bg-[#0f0f13]">
      {/* Breadcrumb */}
      <div className="border-b border-[#2a2a30]">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#00d4aa] transition-colors"
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
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-medium rounded">
                    {component.category}
                  </span>
                  <span className="px-2 py-1 bg-[#1a1a1f] text-[#aaa] text-xs rounded">
                    {component.brand}
                  </span>
                  {component.inStock ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                      <Check className="w-3 h-3" />
                      In Stock
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded">
                      <AlertCircle className="w-3 h-3" />
                      Out of Stock
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{component.name}</h1>
                <div className="flex items-center gap-4">
                  <StarRating score={component.aiScore} />
                  <span className="text-[#666]">|</span>
                  <span className="text-sm text-[#aaa]">AI Score: {component.aiScore}/100</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isFavorite 
                      ? "bg-red-500/10 border-red-500/30 text-red-500" 
                      : "bg-[#1a1a1f] border-[#2a2a30] text-[#666] hover:text-white"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
                <button className="p-2 bg-[#1a1a1f] border border-[#2a2a30] rounded-lg text-[#666] hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Image Placeholder */}
            <div className="aspect-video bg-[#1a1a1f] border border-[#2a2a30] rounded-xl flex items-center justify-center">
              <div className="text-center">
                {isGPU ? (
                  <Monitor className="w-24 h-24 text-[#333] mx-auto mb-4" />
                ) : isCPU ? (
                  <Cpu className="w-24 h-24 text-[#333] mx-auto mb-4" />
                ) : (
                  <Zap className="w-24 h-24 text-[#333] mx-auto mb-4" />
                )}
                <p className="text-[#555]">{component.name}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#2a2a30]">
              <div className="flex gap-6">
                {["specs", "benchmarks", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                      activeTab === tab
                        ? "text-[#00d4aa] border-[#00d4aa]"
                        : "text-[#666] border-transparent hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "specs" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Specifications</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(component.specs).filter(([_, v]) => v).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-[#2a2a30]">
                      <span className="text-[#888] capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <p className="text-[#aaa] leading-relaxed">{component.description}</p>
                </div>
              </div>
            )}

            {activeTab === "benchmarks" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">AI Performance Benchmarks</h2>
                <div className="space-y-4">
                  {[
                    { label: "LLM Inference (Llama 2 70B)", value: component.aiScore, unit: "tokens/sec" },
                    { label: "Image Generation (Stable Diffusion)", value: Math.round(component.aiScore * 0.8), unit: "img/min" },
                    { label: "Training Throughput", value: Math.round(component.aiScore * 0.6), unit: "samples/sec" },
                  ].map((bench) => (
                    <div key={bench.label} className="bg-[#1a1a1f] rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-[#aaa]">{bench.label}</span>
                        <span className="text-[#00d4aa] font-mono">{bench.value} {bench.unit}</span>
                      </div>
                      <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00d4aa] to-[#00b894] rounded-full"
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
                <h2 className="text-lg font-semibold text-white">User Reviews</h2>
                <div className="text-center py-12">
                  <p className="text-[#666]">Reviews coming soon...</p>
                </div>
              </div>
            )}

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div className="pt-6 border-t border-[#2a2a30]">
                <h2 className="text-lg font-semibold text-white mb-4">Similar Products</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {similarProducts.slice(0, 2).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg p-4 hover:border-[#00d4aa]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#252525] rounded flex items-center justify-center">
                          {product.category === "GPU" ? <Monitor className="w-6 h-6 text-[#666]" /> : <Cpu className="w-6 h-6 text-[#666]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{product.name}</p>
                          <p className="text-xs text-[#666]">{product.brand}</p>
                        </div>
                        <span className="text-[#00d4aa] font-semibold">${product.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Buy Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Price Comparison */}
              <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-xl p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#00d4aa]">${lowestPrice.toLocaleString()}</span>
                  <span className="text-[#666]">Lowest Price</span>
                </div>

                {/* Store List */}
                <div className="space-y-3">
                  {Object.entries(prices).length > 0 ? (
                    Object.entries(prices).map(([store, data]) => (
                      <a
                        key={store}
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-[#252525] rounded-lg hover:bg-[#303035] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${data.inStock ? "bg-green-500" : "bg-red-500"}`} />
                          <span className="text-sm text-white capitalize">{store}</span>
                          {data.price === lowestPrice && data.inStock && (
                            <span className="px-2 py-0.5 bg-[#00d4aa]/20 text-[#00d4aa] text-xs rounded">Best</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">${data.price}</span>
                          <ExternalLink className="w-4 h-4 text-[#666] group-hover:text-white" />
                        </div>
                      </a>
                    ))
                  ) : (
                    <a
                      href={component.directLinks?.amazon || component.affiliateLinks.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-[#ff9900] hover:bg-[#ff8800] text-white font-semibold rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      View on Amazon
                    </a>
                  )}
                </div>

                {/* Additional Stores */}
                <div className="mt-4 pt-4 border-t border-[#2a2a30]">
                  <p className="text-xs text-[#666] mb-3">Also available at:</p>
                  <div className="flex flex-wrap gap-2">
                    {component.directLinks?.ebay && (
                      <a
                        href={component.directLinks.ebay}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#e53238] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity"
                      >
                        eBay
                      </a>
                    )}
                    {component.directLinks?.aliexpress && (
                      <a
                        href={component.directLinks.aliexpress}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#ff4747] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity"
                      >
                        AliExpress
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Score Card */}
              <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#00d4aa]/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-[#00d4aa]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#aaa]">AI Performance Score</p>
                    <p className="text-2xl font-bold text-white">{component.aiScore}/100</p>
                  </div>
                </div>
                <div className="h-2 bg-[#252525] rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00d4aa] to-[#00b894] rounded-full"
                    style={{ width: `${component.aiScore}%` }}
                  />
                </div>
                <p className="text-xs text-[#666]">Based on LLM inference, training, and efficiency benchmarks</p>
              </div>

              {/* Compare Button */}
              <Link
                href={`/compare?id1=${component.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#252525] hover:bg-[#303035] text-white font-medium rounded-lg border border-[#2a2a30] transition-colors"
              >
                <Scale className="w-5 h-5" />
                Compare with Similar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
