"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Cpu, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

interface RelatedHardwareProps {
  hardware: Product[];
  postTags: string[];
}

export default function RelatedHardwareSidebar({
  hardware,
  postTags,
}: RelatedHardwareProps) {
  if (hardware.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-sans text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
        Related Hardware
      </h3>
      
      {hardware.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={`/product/${product.id}`}
            className="group block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              {/* Product Image/Icon */}
              <div className="w-12 h-12 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                {product.category === "GPU" ? (
                  <Zap className="w-6 h-6 text-emerald-400/70" strokeWidth={1.5} />
                ) : (
                  <Cpu className="w-6 h-6 text-emerald-400/70" strokeWidth={1.5} />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
                  {product.name}
                </h4>
                
                {/* Specs */}
                <div className="flex items-center gap-2 mt-1">
                  {product.specs.vram && (
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">
                      {product.specs.vram}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-400 font-mono">
                    AI: {product.aiScore}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-mono text-emerald-400">
                    ${product.price.toLocaleString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

      {/* Matching Tags */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
          Matched Tags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {postTags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[10px] text-zinc-400 bg-white/[0.03] rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
