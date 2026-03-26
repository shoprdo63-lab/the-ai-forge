"use client";

import { motion } from "framer-motion";
import { MessageSquare, Palette, Layers, Server, GraduationCap, Check, Sparkles } from "lucide-react";
import { CATEGORIES, PLANS } from "@/lib/builder-actions";

const iconMap: Record<string, React.ElementType> = {
  MessageSquare,
  Palette,
  Layers,
  Server,
  GraduationCap,
};

interface StepCategoryProps {
  selectedCategory: string | null;
  selectedPlan: string | null;
  onSelect: (categoryId: string) => void;
  onBack: () => void;
}

export default function StepCategory({ 
  selectedCategory, 
  selectedPlan, 
  onSelect, 
  onBack 
}: StepCategoryProps) {
  const plan = PLANS.find((p) => p.id === selectedPlan);

  // Filter categories based on plan capabilities
  const availableCategories = CATEGORIES.filter((cat) => {
    if (!plan) return true;
    // Category is available if plan's recommended VRAM meets category minimum
    return plan.recommendedVram >= cat.minVram || plan.minVram >= cat.minVram;
  });

  const unavailableCategories = CATEGORIES.filter((cat) => {
    if (!plan) return false;
    return plan.recommendedVram < cat.minVram && plan.minVram < cat.minVram;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="text-zinc-500 hover:text-emerald-400 transition-colors text-sm font-mono"
          >
            ← Back
          </button>
          <span className="label-mono text-emerald-400">Step 2 of 4</span>
        </div>
        <h2 className="headline-section text-2xl md:text-3xl">
          Select Your Primary Task
        </h2>
        <p className="body-premium">
          Choose the AI workload you&apos;ll primarily run. This determines the optimal hardware configuration.
        </p>
      </div>

      {/* Plan Indicator */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-sm text-zinc-400">Selected Tier: </span>
            <span className="text-emerald-400 font-medium">{plan.name}</span>
          </div>
        </motion.div>
      )}

      {/* Available Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {availableCategories.map((category, index) => {
          const Icon = iconMap[category.icon] || MessageSquare;
          const isSelected = selectedCategory === category.id;

          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              onClick={() => onSelect(category.id)}
              className={`relative group text-left p-5 rounded-2xl border transition-all duration-500 ${
                isSelected
                  ? "bg-white/[0.03] border-emerald-500/50"
                  : "bg-white/[0.01] border-white/5 hover:border-white/10"
              }`}
            >
              {/* Breathing Glow Effect */}
              <motion.div
                className="absolute -inset-0.5 rounded-2xl blur-xl"
                animate={isSelected ? { 
                  opacity: [0.3, 0.6, 0.3],
                } : { 
                  opacity: 0 
                }}
                transition={isSelected ? { 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                } : {}}
                style={{
                  background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                {/* Icon & Selection */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/[0.03] text-zinc-500 group-hover:text-emerald-400/70"
                    }`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-base font-light text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                  {category.name}
                </h3>

                {/* VRAM Requirement */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                    Min VRAM
                  </span>
                  <span className="text-sm font-mono text-emerald-400">
                    {category.minVram}GB
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Unavailable Categories (if any) */}
      {unavailableCategories.length > 0 && (
        <div className="pt-6 border-t border-white/5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-4">
            Requires Higher Tier
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-40">
            {unavailableCategories.map((category) => {
              const Icon = iconMap[category.icon] || MessageSquare;
              return (
                <div
                  key={category.id}
                  className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] cursor-not-allowed"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.03] text-zinc-600 mb-3">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-light text-zinc-500 mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-mono">
                      Needs {category.minVram}GB+
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
