"use client";

import { motion } from "framer-motion";
import { Monitor, Terminal, Cloud, Check } from "lucide-react";
import { OS_OPTIONS } from "@/lib/builder-actions";

const iconMap: Record<string, React.ElementType> = {
  Linux: Terminal,
  Monitor,
  Terminal,
  Cloud,
};

interface StepOSProps {
  selectedOS: string | null;
  onSelect: (osId: string) => void;
  onBack: () => void;
}

export default function StepOS({ selectedOS, onSelect, onBack }: StepOSProps) {
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
          <span className="label-mono text-emerald-400">Step 3 of 4</span>
        </div>
        <h2 className="headline-section text-2xl md:text-3xl">
          Choose Your Operating System
        </h2>
        <p className="body-premium">
          Select the OS that best fits your workflow and software requirements.
        </p>
      </div>

      {/* OS Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {OS_OPTIONS.map((os, index) => {
          const Icon = iconMap[os.icon] || Terminal;
          const isSelected = selectedOS === os.id;

          return (
            <motion.button
              key={os.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              onClick={() => onSelect(os.id)}
              className={`relative group text-left p-6 rounded-2xl border transition-all duration-500 ${
                isSelected
                  ? "bg-white/[0.03] border-emerald-500/50"
                  : "bg-white/[0.01] border-white/5 hover:border-white/10"
              }`}
            >
              {/* Hover Glow */}
              <div
                className={`absolute -inset-0.5 rounded-2xl blur-xl transition-opacity duration-500 ${
                  isSelected ? "opacity-50" : "opacity-0 group-hover:opacity-30"
                }`}
                style={{
                  background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    isSelected
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/[0.03] text-zinc-500 group-hover:text-emerald-400/70"
                  }`}
                >
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>

                {/* Name & Selection */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-light text-white group-hover:text-emerald-400 transition-colors duration-300">
                    {os.name}
                  </h3>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-400">
                  {os.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
