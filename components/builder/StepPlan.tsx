"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Brain, Crown, Check } from "lucide-react";
import { PLANS } from "@/lib/builder-actions";

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Zap,
  Brain,
  Crown,
};

interface StepPlanProps {
  selectedPlan: string | null;
  onSelect: (planId: string) => void;
}

export default function StepPlan({ selectedPlan, onSelect }: StepPlanProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="label-mono text-emerald-400">Step 1 of 4</span>
        <h2 className="headline-section text-2xl md:text-3xl">
          Choose Your Performance Tier
        </h2>
        <p className="body-premium">
          Select a tier that matches your AI workload requirements and budget.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANS.map((plan, index) => {
          const Icon = iconMap[plan.icon] || Cpu;
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              onClick={() => onSelect(plan.id)}
              className={`relative group text-left p-6 rounded-2xl border transition-all duration-500 ${
                isSelected
                  ? "bg-white/[0.03] border-emerald-500/50"
                  : "bg-white/[0.01] border-white/5 hover:border-white/10"
              }`}
            >
              {/* Emerald Glow Effect */}
              <motion.div
                className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={isSelected ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
                transition={isSelected ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                style={{
                  background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                {/* Icon & Tier Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/[0.03] text-zinc-500 group-hover:text-emerald-400/70"
                    }`}
                  >
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* Plan Name */}
                <h3 className="text-lg font-light text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                  {plan.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">
                      VRAM
                    </p>
                    <p className="text-sm font-mono text-zinc-300">
                      {plan.minVram}-{plan.recommendedVram}GB
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">
                      Budget
                    </p>
                    <p className="text-sm font-mono text-zinc-300">
                      ${plan.minBudget.toLocaleString()}+
                    </p>
                  </div>
                </div>

                {/* Price Range */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                    {plan.tier}
                  </span>
                  <span className="text-emerald-400 font-mono text-sm">
                    Up to ${plan.maxBudget.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
