"use client";

import { motion } from "framer-motion";

interface ProductCardSkeletonProps {
  index?: number;
}

export default function ProductCardSkeleton({ index = 0 }: ProductCardSkeletonProps) {
  // Stagger delay based on index
  const delay = index * 0.1;

  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-white/[0.01] backdrop-blur-md border border-white/10">
      {/* Shimmer Overlay */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          delay: delay,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
        }}
      />

      {/* Header Skeleton */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Category & Tier Badges */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-12 h-5 rounded-md bg-white/[0.05]" />
              <div className="w-6 h-6 rounded bg-white/[0.05]" />
            </div>
            {/* Product Name */}
            <div className="w-3/4 h-5 rounded bg-white/[0.05] mb-2" />
            <div className="w-1/2 h-4 rounded bg-white/[0.03]" />
            {/* Brand */}
            <div className="w-16 h-3 rounded bg-white/[0.03] mt-2" />
          </div>
          {/* Price Section */}
          <div className="flex flex-col items-end gap-2">
            <div className="w-16 h-3 rounded bg-white/[0.03]" />
            <div className="w-20 h-7 rounded bg-white/[0.05]" />
          </div>
        </div>
      </div>

      {/* Image Placeholder */}
      <div className="mx-6 h-32 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10" />
      </div>

      {/* Specs Grid Skeleton */}
      <div className="px-6 py-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-2 rounded bg-white/[0.03] mb-2" />
            <div className="w-12 h-4 rounded bg-white/[0.05]" />
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-2 rounded bg-white/[0.03] mb-2" />
            <div className="w-16 h-4 rounded bg-white/[0.05]" />
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="w-6 h-2 rounded bg-white/[0.03] mb-2" />
            <div className="w-10 h-4 rounded bg-white/[0.05]" />
          </div>
        </div>
      </div>

      {/* AI Score Skeleton */}
      <div className="px-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="w-14 h-2 rounded bg-white/[0.03]" />
          <div className="w-8 h-3 rounded bg-white/[0.05]" />
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-zinc-700 rounded-full" />
        </div>
      </div>

      {/* Action Button Skeleton */}
      <div className="p-6 pt-4">
        <div className="w-full h-11 rounded-xl bg-white/[0.05]" />
        <div className="w-32 h-2 rounded bg-white/[0.03] mx-auto mt-3" />
      </div>
    </div>
  );
}
