"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Cpu, 
  Zap, 
  ShoppingCart, 
  Shield, 
  ArrowRight, 
  Server,
  Award,
  TrendingUp,
  Lock
} from "lucide-react";
import { Product } from "@/lib/products";
import { ObsidianGoldBorder } from "./ObsidianGoldBorder";
import { EnterpriseQuoteModal } from "./EnterpriseQuoteModal";
import { TrustShield } from "./TrustShield";

interface EnterpriseProductCardProps {
  product: Product;
  featured?: boolean;
}

const ENTERPRISE_THRESHOLD = 10000;
const HIGH_TICKET_THRESHOLD = 15000;

function isEnterpriseProduct(product: Product): boolean {
  return product.price > ENTERPRISE_THRESHOLD || 
         product.tags.includes("Enterprise") ||
         product.tags.includes("Datacenter") ||
         product.category === "Workstation";
}

function formatPerformance(value: string | undefined): string {
  if (!value) return "N/A";
  return value;
}

export function EnterpriseProductCard({ product, featured = false }: EnterpriseProductCardProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  
  const isEnterprise = isEnterpriseProduct(product);
  const isHighTicket = product.price > HIGH_TICKET_THRESHOLD;
  
  // Enterprise specs display
  const enterpriseSpecs = [
    { label: "HBM3e", value: product.specs.hbmCapacity, icon: Server },
    { label: "NVLink", value: product.specs.nvlinkVersion, icon: Zap },
    { label: "FP8", value: product.specs.fp8Performance, icon: Cpu },
    { label: "FP16", value: product.specs.fp16Performance, icon: TrendingUp },
  ].filter(spec => spec.value);

  const CardContent = () => (
    <div className="h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          {isEnterprise ? (
            <Server className="w-20 h-20 text-amber-500/30" />
          ) : (
            <Cpu className="w-20 h-20 text-emerald-500/30" />
          )}
        </div>
        
        {/* Enterprise Badge */}
        {isEnterprise && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                Enterprise
              </span>
            </div>
          </div>
        )}
        
        {/* Trust Shield for Enterprise */}
        {isEnterprise && (
          <div className="absolute top-4 right-4">
            <TrustShield size={40} />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-xs text-zinc-600">
            {product.brand}
          </span>
        </div>
        
        {/* Product Name */}
        <h3 className={`font-semibold text-white mb-3 tracking-tight ${
          isEnterprise ? "font-mono text-lg" : "text-xl"
        }`}>
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Enterprise Specs - Server Log Style */}
        {isEnterprise && enterpriseSpecs.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-black/30 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider">
                Quant Specs
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {enterpriseSpecs.map((spec) => (
                <div key={spec.label} className="flex items-center gap-2">
                  <spec.icon className="w-3 h-3 text-zinc-600" />
                  <span className="text-xs font-mono text-zinc-400">
                    {spec.label}: <span className="text-zinc-300">{formatPerformance(spec.value)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard Specs */}
        {!isEnterprise && (
          <div className="flex flex-wrap gap-3 mb-4">
            {product.specs.vram && (
              <div className="flex items-center gap-1.5 text-xs">
                <Server className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono text-zinc-300">{product.specs.vram}</span>
              </div>
            )}
            {product.aiScore && (
              <div className="flex items-center gap-1.5 text-xs">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono text-zinc-300">AI: {product.aiScore}</span>
              </div>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Starting at</p>
            <p className={`font-mono font-semibold ${
              isEnterprise ? "text-amber-400 text-xl" : "text-emerald-400 text-lg"
            }`}>
              ${product.price.toLocaleString()}
            </p>
          </div>
          
          {/* CTA Button */}
          {isHighTicket ? (
            <button
              onClick={() => setShowQuoteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-500 hover:to-amber-400 text-white text-sm font-semibold rounded-lg transition-all"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Reserve for Enterprise</span>
              <span className="sm:hidden">Reserve</span>
            </button>
          ) : (
            <Link
              href={`/product/${product.id}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-semibold rounded-lg transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isEnterprise ? (
        <ObsidianGoldBorder isEnterprise={true} className="h-full">
          <CardContent />
        </ObsidianGoldBorder>
      ) : (
        <div className="h-full rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all overflow-hidden">
          <CardContent />
        </div>
      )}
      
      {/* Enterprise Quote Modal */}
      <EnterpriseQuoteModal
        product={product}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </>
  );
}
