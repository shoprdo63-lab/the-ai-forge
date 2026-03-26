"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TechnicalSpecCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  delay?: number;
}

export default function TechnicalSpecCard({
  icon: Icon,
  label,
  value,
  unit,
  delay = 0,
}: TechnicalSpecCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:border-emerald-500/20 transition-colors duration-300">
          <Icon className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300" strokeWidth={1.5} />
        </div>

        {/* Label */}
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1">
          {label}
        </p>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-light text-zinc-200 font-mono tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs text-zinc-500 font-mono">
              {unit}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
