"use client";

import { memo } from "react";

const SpectralGlow = memo(function SpectralGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Primary Emerald Glow - Top Left */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      
      {/* Secondary Emerald Glow - Bottom Right */}
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.04) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />
      
      {/* Subtle Accent Glow - Center */}
      <div
        className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.03) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />
      
      {/* Fine Grid Overlay for Cyber-Workstation Feel */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
});

export default SpectralGlow;
