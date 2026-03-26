"use client";

import { motion } from "framer-motion";
import { ExternalLink, Zap, Cpu, Database, Gauge, ShoppingCart } from "lucide-react";
import type { HardwareComponent } from "@/lib/constants";
import { TIER_COLORS } from "@/lib/constants";

interface AICardProps {
  component: HardwareComponent;
  index: number;
}

// Primary Buy Button - Prominent with Electric Emerald
function BuyButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#10b981] text-slate-950 font-semibold text-sm rounded-lg hover:bg-[#0d9488] transition-all duration-200 shadow-lg shadow-[#10b981]/20"
      onClick={(e) => e.stopPropagation()}
    >
      <ShoppingCart className="w-4 h-4" />
      <span>Buy on {label}</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

// Secondary affiliate button
function SecondaryAffiliateButton({ 
  href, 
  label 
}: { 
  href: string; 
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 bg-white/[0.03] text-zinc-400 text-xs font-medium rounded-lg hover:bg-white/[0.06] hover:text-zinc-300 transition-all duration-200 border border-white/[0.06]"
      onClick={(e) => e.stopPropagation()}
    >
      <span>{label}</span>
      <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
    </a>
  );
}

// Tier badge component
function TierBadge({ tier }: { tier: keyof typeof TIER_COLORS }) {
  const colors = TIER_COLORS[tier];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}>
      {tier}
    </span>
  );
}

// Spec badge component
function SpecBadge({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-zinc-600" strokeWidth={1.5} />
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className="text-xs text-zinc-300 font-medium">{value}</span>
    </div>
  );
}

// AI Intelligence metric bar with Electric Emerald
function MetricBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider w-20">{label}</span>
      <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="h-full bg-[#10b981]"
        />
      </div>
      <span className="text-[10px] text-[#10b981] font-mono w-8 text-right">{value}</span>
    </div>
  );
}

export default function AICard({ component, index }: AICardProps) {
  const { aiIntelligence, specs, affiliateLinks } = component;
  const isGPU = component.category === "GPU";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="group relative flex flex-col bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/[0.06] overflow-hidden hover:border-[#10b981]/20 transition-colors duration-300"
    >
      {/* Subtle gradient overlay - restrained */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-[#10b981]/[0.02] pointer-events-none" />

      {/* Header section */}
      <div className="relative p-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <TierBadge tier={aiIntelligence.aiTier} />
              {component.inStock ? (
                <span className="text-[10px] text-[#10b981] font-medium">In Stock</span>
              ) : (
                <span className="text-[10px] text-amber-400 font-medium">Out of Stock</span>
              )}
            </div>
            <h3 className="text-sm font-medium text-zinc-200 leading-tight line-clamp-2 group-hover:text-[#10b981] transition-colors">
              {component.name}
            </h3>
            <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">
              {component.brand} · {component.category}
            </p>
          </div>
          
          {/* Price tag with Electric Emerald */}
          <div className="flex flex-col items-end">
            <span className="text-xl font-semibold text-[#10b981] font-mono">
              ${component.price.toLocaleString()}
            </span>
            {component.price < component.msrp && (
              <span className="text-[10px] text-zinc-600 line-through">
                ${component.msrp.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Specs section */}
      <div className="relative px-5 py-3 space-y-2 border-b border-white/[0.06]">
        {isGPU && specs.vram && (
          <SpecBadge icon={Database} label="VRAM" value={specs.vram} />
        )}
        {specs.tdp && (
          <SpecBadge icon={Zap} label="TDP" value={specs.tdp} />
        )}
        {specs.architecture && (
          <SpecBadge icon={Cpu} label="Arch" value={specs.architecture} />
        )}
        {isGPU && aiIntelligence.llama3Tps > 0 && (
          <SpecBadge icon={Gauge} label="Llama3 TPS" value={`${aiIntelligence.llama3Tps}`} />
        )}
      </div>

      {/* AI Intelligence metrics - only for GPUs */}
      {isGPU && (
        <div className="relative px-5 py-3 space-y-2 border-b border-white/[0.06] bg-white/[0.01]">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">AI Intelligence</p>
          <MetricBar label="Inference" value={aiIntelligence.inferenceScore} />
          <MetricBar label="Training" value={aiIntelligence.trainingScore} />
          <MetricBar label="Efficiency" value={aiIntelligence.efficiencyScore} />
          {aiIntelligence.vramPerDollar > 0 && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">VRAM/$</span>
              <span className="text-xs font-mono text-[#10b981]">
                {(aiIntelligence.vramPerDollar * 1000).toFixed(1)} GB/$1K
              </span>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="relative px-5 py-3 flex-1">
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
          {component.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {component.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] text-zinc-600 bg-white/[0.03] border border-white/[0.06] rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Affiliate links footer - Prominent Buy Section */}
      <div className="relative p-5 pt-3 bg-white/[0.01] border-t border-white/[0.06] space-y-3">
        {/* Primary Amazon Buy Button */}
        <BuyButton href={affiliateLinks.amazon} label="Amazon" />
        
        {/* Secondary affiliate options */}
        <div className="flex gap-2">
          <SecondaryAffiliateButton href={affiliateLinks.ebay} label="eBay" />
          <SecondaryAffiliateButton href={affiliateLinks.aliexpress} label="AliExpress" />
        </div>
      </div>
    </motion.div>
  );
}
