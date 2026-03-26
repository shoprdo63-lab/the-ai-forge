"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ObsidianGoldBorderProps {
  children: ReactNode;
  isEnterprise?: boolean;
  className?: string;
}

export function ObsidianGoldBorder({ 
  children, 
  isEnterprise = false,
  className = "" 
}: ObsidianGoldBorderProps) {
  if (!isEnterprise) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Animated gradient border background */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl z-0"
        style={{
          background: "linear-gradient(90deg, #b45309, #f59e0b, #10b981, #059669, #b45309)",
          backgroundSize: "300% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      {/* Inner glow effect */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl z-0 blur-sm opacity-50"
        style={{
          background: "linear-gradient(90deg, #b45309, #f59e0b, #10b981, #059669, #b45309)",
          backgroundSize: "300% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      {/* Content container with dark background */}
      <div className="relative z-10 bg-[#0a0a0a] rounded-2xl overflow-hidden h-full">
        {children}
      </div>
    </div>
  );
}
