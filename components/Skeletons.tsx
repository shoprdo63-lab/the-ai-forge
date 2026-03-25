"use client";

import { motion } from "framer-motion";

interface HardwareCardSkeletonProps {
  index?: number;
}

export function HardwareCardSkeleton({ index = 0 }: HardwareCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
    >
      {/* Header Skeleton */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-12 h-5 bg-slate-800 rounded animate-pulse" />
              <div className="w-6 h-6 bg-slate-800 rounded animate-pulse" />
            </div>
            {/* Title */}
            <div className="h-6 bg-slate-800 rounded animate-pulse mb-2 w-3/4" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2" />
          </div>
          {/* Price */}
          <div className="flex flex-col items-end gap-1">
            <div className="w-20 h-8 bg-slate-800 rounded animate-pulse" />
            <div className="w-12 h-3 bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Specs Skeleton */}
      <div className="px-5 py-3 border-y border-white/5 bg-white/[0.02]">
        <div className="flex flex-wrap gap-3">
          <div className="w-20 h-4 bg-slate-800 rounded animate-pulse" />
          <div className="w-24 h-4 bg-slate-800 rounded animate-pulse" />
          <div className="w-16 h-4 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="p-5">
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded animate-pulse w-full" />
          <div className="h-3 bg-slate-800 rounded animate-pulse w-5/6" />
        </div>
      </div>

      {/* AI Score Skeleton */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="w-20 h-3 bg-slate-800 rounded animate-pulse" />
          <div className="w-8 h-3 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-slate-700 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="p-5 pt-0">
        <div className="h-10 bg-slate-800 rounded-lg animate-pulse" />
      </div>
    </motion.div>
  );
}

export function HardwareGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <HardwareCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

export function FilterSidebarSkeleton() {
  return (
    <div className="w-full lg:w-[240px] shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-800 rounded animate-pulse" />
        <div className="w-16 h-3 bg-slate-800 rounded animate-pulse" />
      </div>

      {/* Search */}
      <div className="h-10 bg-slate-800 rounded-lg animate-pulse" />

      {/* Filters */}
      <div className="space-y-4">
        <div className="w-20 h-4 bg-slate-800 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 bg-slate-800 rounded animate-pulse" />
          <div className="h-5 bg-slate-800 rounded animate-pulse" />
          <div className="h-5 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="w-16 h-4 bg-slate-800 rounded animate-pulse" />
        <div className="h-2 bg-slate-800 rounded-full animate-pulse" />
        <div className="flex justify-between">
          <div className="w-8 h-3 bg-slate-800 rounded animate-pulse" />
          <div className="w-8 h-3 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
