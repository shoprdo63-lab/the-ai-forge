"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Share2, RotateCcw, ShoppingCart, ExternalLink, Cpu, HardDrive, Zap, Layers } from "lucide-react";
import type { HardwareComponent } from "@/data/components";
import { PLANS, CATEGORIES, OS_OPTIONS } from "@/lib/builder-actions";
import Link from "next/link";

interface StepBuildProps {
  plan: string | null;
  category: string | null;
  os: string | null;
  recommendedGPU: HardwareComponent | null;
  totalPrice: number;
  shareableUrl: string;
  onReset: () => void;
}

const componentIcons: Record<string, React.ElementType> = {
  GPU: Zap,
  CPU: Cpu,
  Motherboard: Layers,
  RAM: HardDrive,
  Storage: HardDrive,
  PSU: Zap,
  Cooling: Layers,
};

export default function StepBuild({
  plan,
  category,
  os,
  recommendedGPU,
  totalPrice,
  shareableUrl,
  onReset,
}: StepBuildProps) {
  const planData = PLANS.find((p) => p.id === plan);
  const categoryData = CATEGORIES.find((c) => c.id === category);
  const osData = OS_OPTIONS.find((o) => o.id === os);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/builder${shareableUrl}`;
      navigator.clipboard.writeText(url);
      // Could add toast notification here
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="label-mono text-emerald-400">Step 4 of 4</span>
        <h2 className="headline-section text-2xl md:text-3xl">
          Your AI Workstation Configuration
        </h2>
        <p className="body-premium">
          Based on your selections, here&apos;s your optimized hardware configuration.
        </p>
      </div>

      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex items-center justify-center py-4"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Configuration Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-premium p-6"
      >
        <h3 className="text-lg font-light text-white mb-4">Configuration Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">
              Tier
            </p>
            <p className="text-emerald-400 font-medium">{planData?.name}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">
              Task
            </p>
            <p className="text-emerald-400 font-medium">{categoryData?.name}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">
              OS
            </p>
            <p className="text-emerald-400 font-medium">{osData?.name}</p>
          </div>
        </div>
      </motion.div>

      {/* Recommended GPU Card */}
      {recommendedGPU && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-premium p-6 spectral-glow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-geometric">
              <Zap className="w-5 h-5" />
            </div>
            <span className="label-mono">Recommended GPU</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h3 className="text-xl font-light text-white mb-1">
                {recommendedGPU.name}
              </h3>
              <p className="text-sm text-zinc-400">{recommendedGPU.description}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-2xl font-light text-emerald-400 font-mono">
                ${recommendedGPU.price.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500">AI Score: {recommendedGPU.aiScore}/100</p>
            </div>
          </div>

          {/* GPU Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            {recommendedGPU.specs.vram && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">VRAM</p>
                <p className="text-sm font-mono text-zinc-300">{recommendedGPU.specs.vram}</p>
              </div>
            )}
            {recommendedGPU.specs.cuda && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">CUDA Cores</p>
                <p className="text-sm font-mono text-zinc-300">{parseInt(recommendedGPU.specs.cuda).toLocaleString()}</p>
              </div>
            )}
            {recommendedGPU.specs.tdp && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">TDP</p>
                <p className="text-sm font-mono text-zinc-300">{recommendedGPU.specs.tdp}</p>
              </div>
            )}
            {recommendedGPU.specs.architecture && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">Architecture</p>
                <p className="text-sm font-mono text-zinc-300">{recommendedGPU.specs.architecture}</p>
              </div>
            )}
          </div>

          {/* Affiliate Links */}
          <div className="flex flex-wrap gap-3 pt-6">
            <Link
              href={recommendedGPU.affiliateLinks.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium flex items-center gap-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy on Amazon
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href={recommendedGPU.affiliateLinks.ebay}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              eBay
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href={recommendedGPU.affiliateLinks.aliexpress}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              AliExpress
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Estimated Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-premium p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Estimated Total Build Cost</p>
            <p className="text-3xl font-light text-emerald-400 font-mono">
              ${totalPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-1">Includes all components</p>
            <p className="text-xs text-zinc-500">CPU, Motherboard, RAM, Storage, PSU, Cooling</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-4"
      >
        <button
          onClick={handleShare}
          className="btn-ghost flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Copy Share Link
        </button>
        <button
          onClick={onReset}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
      </motion.div>
    </div>
  );
}
