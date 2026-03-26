"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Server, Cpu } from "lucide-react";
import { Product } from "@/lib/products";

interface EnterpriseScaleWarningProps {
  products: Product[];
}

const ENTERPRISE_THRESHOLD = 10000;

export function EnterpriseScaleWarning({ products }: EnterpriseScaleWarningProps) {
  // Check if we have mixed tiers
  const enterpriseProducts = products.filter(p => p.price > ENTERPRISE_THRESHOLD);
  const consumerProducts = products.filter(p => p.price <= ENTERPRISE_THRESHOLD);
  
  const hasMixedTiers = enterpriseProducts.length > 0 && consumerProducts.length > 0;
  const hasEnterprise = enterpriseProducts.length > 0;
  
  if (!hasMixedTiers) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h4 className="font-mono text-sm font-semibold text-amber-400 mb-1">
            Scale Gap Warning
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {enterpriseProducts.map(p => p.name).join(" & ")} are designed for{" "}
            <span className="text-amber-400 font-semibold">
              Multi-Node Datacenter workloads
            </span>
            . Direct comparison with consumer hardware may not reflect real-world deployment scenarios.
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-amber-500" />
              <span>Cluster-scale inference</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span>Multi-GPU training</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
