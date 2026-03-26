"use client";

import { motion } from "framer-motion";

interface TrustShieldProps {
  className?: string;
  size?: number;
}

export function TrustShield({ className = "", size = 120 }: TrustShieldProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        {/* Gradient for shield */}
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer shield shape */}
      <motion.path
        d="M60 10 L100 25 V55 C100 80 60 110 60 110 C60 110 20 80 20 55 V25 L60 10Z"
        stroke="url(#shieldGradient)"
        strokeWidth="2"
        fill="rgba(16, 185, 129, 0.1)"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Inner circuit pattern */}
      <g stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.6">
        {/* Central chip */}
        <rect x="45" y="45" width="30" height="30" rx="2" />
        <rect x="50" y="50" width="20" height="20" rx="1" strokeOpacity="0.4" />
        
        {/* Circuit traces */}
        <path d="M60 35 V45" />
        <path d="M60 75 V85" />
        <path d="M35 60 H45" />
        <path d="M75 60 H85" />
        
        {/* Corner connections */}
        <path d="M40 40 L45 45" />
        <path d="M80 40 L75 45" />
        <path d="M40 80 L45 75" />
        <path d="M80 80 L75 75" />
      </g>
      
      {/* Checkmark */}
      <motion.path
        d="M45 60 L55 70 L75 45"
        stroke="#10b981"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      />
      
      {/* Corner accents */}
      <g fill="#f59e0b" opacity="0.8">
        <circle cx="60" cy="10" r="3" />
        <circle cx="20" cy="25" r="2" />
        <circle cx="100" cy="25" r="2" />
        <circle cx="20" cy="55" r="2" />
        <circle cx="100" cy="55" r="2" />
      </g>
      
      {/* Text label */}
      <text
        x="60"
        y="95"
        textAnchor="middle"
        fill="#f59e0b"
        fontSize="8"
        fontFamily="monospace"
        letterSpacing="0.1em"
        opacity="0.8"
      >
        FORGE CERTIFIED
      </text>
    </motion.svg>
  );
}
