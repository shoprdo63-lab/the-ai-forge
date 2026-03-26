"use client";

import { motion } from "framer-motion";
import { Cpu, HardDrive, Zap, Layers, Gauge, Activity } from "lucide-react";

interface ProductSchematicProps {
  category: "GPU" | "CPU";
  name: string;
}

export default function ProductSchematic({ category, name }: ProductSchematicProps) {
  const isGPU = category === "GPU";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="relative w-full aspect-square max-w-md mx-auto"
    >
      {/* 3D Effect Container */}
      <div className="relative w-full h-full preserve-3d perspective-1000">
        {/* Outer Glow Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-3xl border border-emerald-500/10"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, rgba(16, 185, 129, 0.03) 50%, transparent 100%)",
          }}
        />

        {/* Main Schematic Card */}
        <div className="absolute inset-4 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Central Hardware SVG */}
          <div className="relative z-10">
            {isGPU ? <GPUSchematic name={name} /> : <CPUSchematic name={name} />}
          </div>

          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-500/30 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-500/30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-500/30 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-500/30 rounded-br-lg" />
        </div>

        {/* Floating Data Points */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 right-8 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
            {isGPU ? "GPU" : "CPU"}
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-8 left-8 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
        >
          <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
            AI-Ready
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function GPUSchematic({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-48 h-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* GPU Die */}
      <rect
        x="60"
        y="40"
        width="80"
        height="80"
        rx="4"
        className="stroke-emerald-500/40"
        strokeWidth="1"
        fill="rgba(16, 185, 129, 0.05)"
      />

      {/* Die Cross Pattern */}
      <line x1="100" y1="40" x2="100" y2="120" className="stroke-emerald-500/20" strokeWidth="0.5" />
      <line x1="60" y1="80" x2="140" y2="80" className="stroke-emerald-500/20" strokeWidth="0.5" />

      {/* VRAM Chips - Top */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`vram-top-${i}`}
          x={50 + i * 35}
          y="15"
          width="25"
          height="15"
          rx="2"
          className="stroke-zinc-600"
          strokeWidth="0.5"
          fill="rgba(255, 255, 255, 0.03)"
        />
      ))}

      {/* VRAM Chips - Bottom */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`vram-bottom-${i}`}
          x={50 + i * 35}
          y="130"
          width="25"
          height="15"
          rx="2"
          className="stroke-zinc-600"
          strokeWidth="0.5"
          fill="rgba(255, 255, 255, 0.03)"
        />
      ))}

      {/* PCIe Connector */}
      <rect x="80" y="150" width="40" height="10" rx="1" className="stroke-zinc-600" strokeWidth="0.5" fill="rgba(255, 255, 255, 0.02)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`pcie-${i}`} x1={82 + i * 7} y1="150" x2={82 + i * 7} y2="158" className="stroke-zinc-700" strokeWidth="0.5" />
      ))}

      {/* Power Connectors */}
      <rect x="155" y="50" width="12" height="20" rx="1" className="stroke-zinc-600" strokeWidth="0.5" fill="rgba(255, 255, 255, 0.02)" />
      <rect x="155" y="90" width="12" height="20" rx="1" className="stroke-zinc-600" strokeWidth="0.5" fill="rgba(255, 255, 255, 0.02)" />

      {/* I/O Shield */}
      <rect x="25" y="50" width="20" height="60" rx="1" className="stroke-zinc-600" strokeWidth="0.5" fill="rgba(255, 255, 255, 0.02)" />
      <circle cx="35" cy="65" r="4" className="stroke-emerald-500/30" strokeWidth="0.5" fill="none" />
      <circle cx="35" cy="80" r="4" className="stroke-emerald-500/30" strokeWidth="0.5" fill="none" />
      <circle cx="35" cy="95" r="4" className="stroke-emerald-500/30" strokeWidth="0.5" fill="none" />

      {/* Label */}
      <text
        x="100"
        y="82"
        textAnchor="middle"
        className="fill-zinc-400 text-[8px] font-mono uppercase tracking-wider"
      >
        {name.length > 15 ? name.substring(0, 12) + "..." : name}
      </text>

      {/* Status Indicators */}
      <circle cx="70" cy="55" r="2" className="fill-emerald-500/50" />
      <circle cx="130" cy="55" r="2" className="fill-emerald-500/50" />
      <circle cx="70" cy="105" r="2" className="fill-emerald-500/50" />
      <circle cx="130" cy="105" r="2" className="fill-emerald-500/50" />
    </svg>
  );
}

function CPUSchematic({ name }: { name: string }) {
  const coreCount = name.match(/(\d+)-Core/)?.[1] || "16";

  return (
    <svg
      viewBox="0 0 160 160"
      className="w-40 h-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Heat Spreader */}
      <rect
        x="20"
        y="20"
        width="120"
        height="120"
        rx="8"
        className="stroke-emerald-500/30"
        strokeWidth="1"
        fill="rgba(16, 185, 129, 0.03)"
      />

      {/* IHS Pattern */}
      <rect
        x="35"
        y="35"
        width="90"
        height="90"
        rx="4"
        className="stroke-zinc-600"
        strokeWidth="0.5"
        fill="rgba(255, 255, 255, 0.02)"
      />

      {/* Core Grid Pattern */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <rect
            key={`core-${row}-${col}`}
            x={40 + col * 20}
            y={40 + row * 20}
            width="16"
            height="16"
            rx="1"
            className="stroke-zinc-700"
            strokeWidth="0.3"
            fill="rgba(16, 185, 129, 0.05)"
          />
        ))
      )}

      {/* Center Triangle */}
      <path
        d="M80 55 L95 85 L65 85 Z"
        className="stroke-emerald-500/20"
        strokeWidth="0.5"
        fill="rgba(16, 185, 129, 0.05)"
      />

      {/* Label */}
      <text
        x="80"
        y="110"
        textAnchor="middle"
        className="fill-zinc-400 text-[8px] font-mono uppercase tracking-wider"
      >
        {coreCount} CORES
      </text>

      {/* Pin Grid Around Edges */}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={`pin-top-${i}`} cx={25 + i * 10} cy="15" r="1.5" className="fill-zinc-700" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={`pin-bottom-${i}`} cx={25 + i * 10} cy="145" r="1.5" className="fill-zinc-700" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={`pin-left-${i}`} cx="15" cy={30 + i * 10} r="1.5" className="fill-zinc-700" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={`pin-right-${i}`} cx="145" cy={30 + i * 10} r="1.5" className="fill-zinc-700" />
      ))}

      {/* Corner Markers */}
      <circle cx="30" cy="30" r="3" className="fill-emerald-500/20" />
      <circle cx="130" cy="30" r="3" className="fill-emerald-500/20" />
      <circle cx="30" cy="130" r="3" className="fill-emerald-500/20" />
      <circle cx="130" cy="130" r="3" className="fill-emerald-500/20" />
    </svg>
  );
}
