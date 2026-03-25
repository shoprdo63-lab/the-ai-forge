"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  Cpu,
  HardDrive,
  Zap,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  ExternalLink,
  Award,
  BarChart3,
  Sparkles,
  ZapIcon,
  BrainCircuit,
} from "lucide-react";
import type { HardwareComponent } from "@/lib/constants";
import {
  calculateDiff,
  getBetterComponent,
  getOverallWinner,
  formatPrice,
} from "@/lib/utils";

interface ComparisonOverlayProps {
  products: HardwareComponent[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export default function ComparisonOverlay({
  products,
  onClose,
  onRemove,
}: ComparisonOverlayProps) {
  if (products.length !== 2) return null;

  const [c1, c2] = products;
  const isGPU = c1.category === "GPU";

  // Calculate winners for each category
  const vramComparison = getBetterComponent(c1, c2, "vram");
  const cudaComparison = getBetterComponent(c1, c2, "cuda");
  const wattageComparison = getBetterComponent(c1, c2, "wattage");
  const priceComparison = getBetterComponent(c1, c2, "price");
  const aiScoreComparison = getBetterComponent(c1, c2, "aiScore");

  // Overall winner
  const overallWinner = getOverallWinner(c1, c2);

  // AI Task scores (mock data based on aiScore)
  const getTaskScores = (component: HardwareComponent) => ({
    llm: Math.round(component.aiScore * 0.9),
    imageGen: Math.round(component.aiScore * 0.85),
    training: Math.round(component.aiScore * 0.75),
  });

  const c1Tasks = getTaskScores(c1);
  const c2Tasks = getTaskScores(c2);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      >
        {/* Full screen blur backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Comparison Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-[#10b981]" />
              <h2 className="text-xl font-bold text-white">Product Comparison</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comparison Grid */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Side-by-Side Header */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 mb-8">
              {/* Product 1 */}
              <motion.div
                layoutId={`card-${c1.id}`}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  overallWinner.winner === 1
                    ? "bg-[#10b981]/10 border-[#10b981]/50 shadow-lg shadow-[#10b981]/20"
                    : "bg-slate-800/50 border-slate-700/50"
                }`}
              >
                {overallWinner.winner === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-[#10b981] text-slate-950 text-xs font-bold rounded-full">
                    <Crown className="w-3 h-3" />
                    Winner
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded">
                    {c1.category}
                  </span>
                  <button
                    onClick={() => onRemove(c1.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{c1.name}</h3>
                <p className="text-sm text-slate-400">{c1.brand}</p>
              </motion.div>

              {/* VS Circle */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#10b981] blur-xl opacity-30 animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10b981]/30">
                    <span className="text-xl font-black text-white">VS</span>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <motion.div
                layoutId={`card-${c2.id}`}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  overallWinner.winner === 2
                    ? "bg-[#10b981]/10 border-[#10b981]/50 shadow-lg shadow-[#10b981]/20"
                    : "bg-slate-800/50 border-slate-700/50"
                }`}
              >
                {overallWinner.winner === 2 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-[#10b981] text-slate-950 text-xs font-bold rounded-full">
                    <Crown className="w-3 h-3" />
                    Winner
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded">
                    {c2.category}
                  </span>
                  <button
                    onClick={() => onRemove(c2.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{c2.name}</h3>
                <p className="text-sm text-slate-400">{c2.brand}</p>
              </motion.div>
            </div>

            {/* Head-to-Head Stats Table */}
            <div className="bg-slate-800/30 rounded-2xl overflow-hidden mb-6">
              <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Technical Specifications
                </h3>
              </div>
              <div className="divide-y divide-slate-700/30">
                {/* VRAM */}
                {isGPU && (
                  <div className="grid grid-cols-3 gap-4 px-4 py-3 items-center">
                    <div className="text-right">
                      <span className={`text-lg font-mono font-semibold ${vramComparison.winner === 1 ? "text-[#10b981]" : "text-slate-400"}`}>
                        {c1.vram}GB
                      </span>
                      {vramComparison.winner === 1 && (
                        <Crown className="w-4 h-4 text-[#10b981] inline-block ml-1" />
                      )}
                    </div>
                    <div className="text-center text-xs text-slate-500 uppercase tracking-wider">VRAM</div>
                    <div className="text-left">
                      <span className={`text-lg font-mono font-semibold ${vramComparison.winner === 2 ? "text-[#10b981]" : "text-slate-400"}`}>
                        {c2.vram}GB
                      </span>
                      {vramComparison.winner === 2 && (
                        <Crown className="w-4 h-4 text-[#10b981] inline-block ml-1" />
                      )}
                    </div>
                  </div>
                )}

                {/* CUDA Cores */}
                {isGPU && (
                  <div className="grid grid-cols-3 gap-4 px-4 py-3 items-center">
                    <div className="text-right">
                      <span className={`text-lg font-mono font-semibold ${cudaComparison.winner === 1 ? "text-[#10b981]" : "text-slate-400"}`}>
                        {parseInt(c1.specs.cuda || "0").toLocaleString()}
                      </span>
                      {cudaComparison.winner === 1 && (
                        <Crown className="w-4 h-4 text-[#10b981] inline-block ml-1" />
                      )}
                    </div>
                    <div className="text-center text-xs text-slate-500 uppercase tracking-wider">CUDA Cores</div>
                    <div className="text-left">
                      <span className={`text-lg font-mono font-semibold ${cudaComparison.winner === 2 ? "text-[#10b981]" : "text-slate-400"}`}>
                        {parseInt(c2.specs.cuda || "0").toLocaleString()}
                      </span>
                      {cudaComparison.winner === 2 && (
                        <Crown className="w-4 h-4 text-[#10b981] inline-block ml-1" />
                      )}
                    </div>
                  </div>
                )}

                {/* Wattage */}
                <div className="grid grid-cols-3 gap-4 px-4 py-3 items-center">
                  <div className="text-right">
                    <span className={`text-lg font-mono font-semibold ${wattageComparison.winner === 1 ? "text-[#10b981]" : "text-slate-400"}`}>
                      {c1.wattage}W
                    </span>
                    {wattageComparison.winner === 1 && (
                      <Crown className="w-4 h-4 text-[#10b981] inline-block ml-1" />
                    )}
                  </div>
                  <div className="text-center text-xs text-slate-500 uppercase tracking-wider">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Power Draw
                  </div>
                  <div className="text-left">
                    <span className={`text-lg font-mono font-semibold ${wattageComparison.winner === 2 ? "text-[#10b981]" : "text-slate-400"}`}>
                      {c2.wattage}W
                    </span>
                    {wattageComparison.winner === 2 && (
                      <Crown className="w-4 h-4 text-[#10b981] inline-block ml-1" />
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="grid grid-cols-3 gap-4 px-4 py-3 items-center">
                  <div className="text-right">
                    <span className={`text-lg font-mono font-semibold ${priceComparison.winner === 1 ? "text-[#10b981]" : "text-slate-400"}`}>
                      {formatPrice(c1.price)}
                    </span>
                    {priceComparison.winner === 1 && (
                      <Crown className="w-4 h-4 text-[#10b981] inline-block ml-1" />
                    )}
                  </div>
                  <div className="text-center text-xs text-slate-500 uppercase tracking-wider">
                    <DollarSign className="w-3 h-3 inline mr-1" />
                    Price
                  </div>
                  <div className="text-left">
                    <span className={`text-lg font-mono font-semibold ${priceComparison.winner === 2 ? "text-[#10b981]" : "text-slate-400"}`}>
                      {formatPrice(c2.price)}
                    </span>
                    {priceComparison.winner === 2 && (
                      <Crown className="w-4 h-4 text-[#10b981] inline-block ml-1" />
                    )}
                  </div>
                </div>

                {/* AI Score */}
                <div className="grid grid-cols-3 gap-4 px-4 py-3 items-center bg-[#10b981]/5">
                  <div className="text-right">
                    <span className={`text-lg font-mono font-bold ${aiScoreComparison.winner === 1 ? "text-[#10b981]" : "text-slate-400"}`}>
                      {c1.aiScore}/100
                    </span>
                    {aiScoreComparison.winner === 1 && (
                      <Award className="w-5 h-5 text-[#10b981] inline-block ml-1" />
                    )}
                  </div>
                  <div className="text-center text-xs text-slate-500 uppercase tracking-wider">
                    <BrainCircuit className="w-3 h-3 inline mr-1" />
                    AI Score
                  </div>
                  <div className="text-left">
                    <span className={`text-lg font-mono font-bold ${aiScoreComparison.winner === 2 ? "text-[#10b981]" : "text-slate-400"}`}>
                      {c2.aiScore}/100
                    </span>
                    {aiScoreComparison.winner === 2 && (
                      <Award className="w-5 h-5 text-[#10b981] inline-block ml-1" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Task Analysis */}
            <div className="bg-slate-800/30 rounded-2xl overflow-hidden mb-6">
              <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI Task Performance Analysis
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {/* LLM Performance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4" />
                      Large Language Models
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c1Tasks.llm}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="h-full bg-[#10b981] rounded-full"
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">{c1.name}</span>
                    </div>
                    <div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c2Tasks.llm}%` }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">{c2.name}</span>
                    </div>
                  </div>
                </div>

                {/* Image Generation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <ZapIcon className="w-4 h-4" />
                      Image Generation (Stable Diffusion)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c1Tasks.imageGen}%` }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="h-full bg-purple-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">{c1.name}</span>
                    </div>
                    <div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c2Tasks.imageGen}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="h-full bg-pink-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">{c2.name}</span>
                    </div>
                  </div>
                </div>

                {/* Training Speed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Model Training Speed
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c1Tasks.training}%` }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="h-full bg-amber-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">{c1.name}</span>
                    </div>
                    <div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c2Tasks.training}%` }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          className="h-full bg-orange-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">{c2.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buy Now Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[c1, c2].map((product, idx) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-xl border ${
                    idx === 0
                      ? overallWinner.winner === 1
                        ? "bg-[#10b981]/10 border-[#10b981]/30"
                        : "bg-slate-800/50 border-slate-700/50"
                      : overallWinner.winner === 2
                      ? "bg-[#10b981]/10 border-[#10b981]/30"
                      : "bg-slate-800/50 border-slate-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">{product.name}</span>
                    <span className="text-lg font-bold text-[#10b981]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <a
                      href={product.affiliateLinks.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#10b981] hover:bg-[#059669] text-slate-950 font-semibold rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy on Amazon
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={product.affiliateLinks.ebay}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                      >
                        eBay
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={product.affiliateLinks.aliexpress}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                      >
                        AliExpress
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
