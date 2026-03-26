"use client";

import { motion } from "framer-motion";

interface CapabilityBarProps {
  score: number;
  delay?: number;
  label?: string;
}

export default function CapabilityBar({ score, delay = 0, label }: CapabilityBarProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-mono uppercase tracking-wider">{label}</span>
          <span className="text-emerald-400 font-mono font-medium">{score}/100</span>
        </div>
      )}
      <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{
            duration: 1.2,
            delay: delay,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
          }}
          className={`h-full rounded-full ${
            score >= 90
              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
              : score >= 75
              ? "bg-gradient-to-r from-blue-500 to-blue-400"
              : score >= 60
              ? "bg-gradient-to-r from-amber-500 to-amber-400"
              : "bg-gradient-to-r from-zinc-500 to-zinc-400"
          }`}
        />
      </div>
    </div>
  );
}
