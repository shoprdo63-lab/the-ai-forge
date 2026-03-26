"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingCart,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Star,
  Cpu,
  HardDrive,
  Zap,
  Layers,
  Gauge,
  Activity,
  ArrowRight,
  Scale,
} from "lucide-react";
import type { HardwareComponent } from "@/lib/constants";
import { TIER_COLORS } from "@/lib/constants";
import CapabilityBar from "./CapabilityBar";
import ProductSchematic from "./ProductSchematic";
import TechnicalSpecCard from "./TechnicalSpecCard";
import StarRating from "./StarRating";

interface HardwareDashboardClientProps {
  component: HardwareComponent;
  similarProducts: HardwareComponent[];
}

export default function HardwareDashboardClient({
  component,
  similarProducts,
}: HardwareDashboardClientProps) {
  const {
    id,
    name,
    brand,
    category,
    price,
    msrp,
    specs,
    description,
    tags,
    aiScore,
    aiIntelligence,
    affiliateLinks,
    inStock,
    releaseDate,
    rating,
    reviewCount,
  } = component;

  const isGPU = category === "GPU";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-12"
      >
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link
            href="/specs"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono uppercase tracking-wider">Back to Database</span>
          </Link>
        </motion.div>

        {/* Hero Section - Split Layout */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tier Badge - Glassmorphism */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border backdrop-blur-md ${
                  TIER_COLORS[aiIntelligence.aiTier].bg
                } ${TIER_COLORS[aiIntelligence.aiTier].text} ${
                  TIER_COLORS[aiIntelligence.aiTier].border
                }`}
              >
                {aiIntelligence.aiTier}
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                {brand} · {category}
              </span>
              {inStock ? (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" /> In Stock
                </span>
              ) : (
                <span className="text-xs text-amber-400 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <AlertCircle className="w-3 h-3" /> Out of Stock
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="headline-hero text-4xl sm:text-5xl lg:text-6xl">
              {name}
            </h1>

            {/* Description */}
            <p className="body-premium text-lg max-w-xl">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 text-xs text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-lg font-mono uppercase tracking-wider"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Rating */}
            {rating && reviewCount && (
              <div className="flex items-center gap-3">
                <StarRating rating={rating} size="md" animated />
                <span className="text-sm text-zinc-400 font-mono">
                  {rating.toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 pt-4 border-t border-white/10">
              <span className="text-5xl font-light text-emerald-400 font-mono tracking-tight">
                ${price.toLocaleString()}
              </span>
              {price < msrp && (
                <span className="text-xl text-zinc-500 line-through font-mono">
                  ${msrp.toLocaleString()}
                </span>
              )}
              {releaseDate && (
                <span className="text-sm text-zinc-500 font-mono ml-auto">
                  Released: {releaseDate}
                </span>
              )}
            </div>
          </motion.div>

          {/* Right: 3D Schematic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <ProductSchematic category={category} name={name} />
          </motion.div>
        </section>

        {/* Technical Data Grid */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="headline-section text-2xl mb-8 flex items-center gap-3"
          >
            <div className="icon-geometric">
              <Cpu className="w-5 h-5" />
            </div>
            Technical Specifications
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isGPU && specs.vram && (
              <TechnicalSpecCard
                icon={HardDrive}
                label="VRAM Capacity"
                value={specs.vram.replace(/GB.*$/, "")}
                unit="GB"
                delay={0.1}
              />
            )}
            {isGPU && specs.cuda && (
              <TechnicalSpecCard
                icon={Gauge}
                label="CUDA Cores"
                value={parseInt(specs.cuda).toLocaleString()}
                delay={0.15}
              />
            )}
            {isGPU && specs.tensor && (
              <TechnicalSpecCard
                icon={Activity}
                label="Tensor Cores"
                value={specs.tensor}
                delay={0.2}
              />
            )}
            {specs.tdp && (
              <TechnicalSpecCard
                icon={Zap}
                label="Thermal Design Power"
                value={specs.tdp.replace("W", "")}
                unit="W"
                delay={0.25}
              />
            )}
            {specs.architecture && (
              <TechnicalSpecCard
                icon={Layers}
                label="Architecture"
                value={specs.architecture}
                delay={0.3}
              />
            )}
            {!isGPU && specs.cores && (
              <TechnicalSpecCard
                icon={Cpu}
                label="Core Count"
                value={specs.cores}
                unit="cores"
                delay={0.1}
              />
            )}
            {!isGPU && specs.threads && (
              <TechnicalSpecCard
                icon={Activity}
                label="Threads"
                value={specs.threads}
                delay={0.15}
              />
            )}
            {!isGPU && specs.socket && (
              <TechnicalSpecCard
                icon={Layers}
                label="Socket"
                value={specs.socket}
                delay={0.2}
              />
            )}
            {specs.clock && (
              <TechnicalSpecCard
                icon={Gauge}
                label="Clock Speed"
                value={specs.clock}
                delay={0.35}
              />
            )}
            {isGPU && aiIntelligence.llama3Tps > 0 && (
              <TechnicalSpecCard
                icon={Activity}
                label="LLM Inference"
                value={aiIntelligence.llama3Tps.toString()}
                unit="tok/s"
                delay={0.4}
              />
            )}
          </div>
        </section>

        {/* AI Performance Section */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Capability Scores */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-premium p-8"
          >
            <h3 className="headline-section text-xl mb-6 flex items-center gap-3">
              <div className="icon-geometric w-10 h-10">
                <Activity className="w-5 h-5" />
              </div>
              AI Performance Metrics
            </h3>

            <div className="space-y-6">
              <CapabilityBar
                score={aiScore}
                delay={0.6}
                label="Overall AI Score"
              />
              <CapabilityBar
                score={aiIntelligence.inferenceScore}
                delay={0.7}
                label="Inference Performance"
              />
              <CapabilityBar
                score={aiIntelligence.trainingScore}
                delay={0.8}
                label="Training Capability"
              />
              <CapabilityBar
                score={aiIntelligence.efficiencyScore}
                delay={0.9}
                label="Power Efficiency"
              />
            </div>

            {isGPU && aiIntelligence.vramPerDollar > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500 font-mono uppercase tracking-wider">
                    VRAM per Dollar
                  </span>
                  <span className="text-emerald-400 font-mono">
                    {aiIntelligence.vramPerDollar.toFixed(3)} GB/$
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Purchase Options - PCPartPicker Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-premium p-8"
          >
            <h3 className="headline-section text-xl mb-6 flex items-center gap-3">
              <div className="icon-geometric w-10 h-10">
                <ShoppingCart className="w-5 h-5" />
              </div>
              Buy Now
            </h3>

            <div className="space-y-3">
              {/* Amazon - Primary CTA */}
              <a
                href={component.directLinks?.amazon || affiliateLinks.amazon}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#ff9900] hover:bg-[#ff8800] text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>View Deal on Amazon</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Secondary Stores */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={component.directLinks?.ebay || affiliateLinks.ebay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#e53238] hover:bg-[#d4202a] text-white font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  <span>eBay</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={component.directLinks?.aliexpress || affiliateLinks.aliexpress}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#ff4747] hover:bg-[#ff3333] text-white font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  <span>AliExpress</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-[10px] text-zinc-500 text-center font-mono uppercase tracking-wider mt-4">
                {component.directLinks?.amazon ? "Direct Product Link • " : ""}Affiliate Links • Commission Earned
              </p>
            </div>
          </motion.div>
        </section>

        {/* Quick Compare Section */}
        {similarProducts.length > 0 && (
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="headline-section text-2xl mb-8 flex items-center gap-3"
            >
              <div className="icon-geometric">
                <Scale className="w-5 h-5" />
              </div>
              Similar Hardware
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6">
              {similarProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="group block p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded border ${
                              TIER_COLORS[product.aiIntelligence.aiTier].bg
                            } ${TIER_COLORS[product.aiIntelligence.aiTier].text} ${
                              TIER_COLORS[product.aiIntelligence.aiTier].border
                            }`}
                          >
                            {product.aiIntelligence.aiTier}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                            {product.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-light text-zinc-200 group-hover:text-emerald-400 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-light text-emerald-400 font-mono">
                          ${product.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-zinc-500">
                          <span className="text-xs font-mono">AI Score: {product.aiScore}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-zinc-500 group-hover:text-emerald-400 transition-colors">
                      <span className="text-sm font-mono uppercase tracking-wider">Compare</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
