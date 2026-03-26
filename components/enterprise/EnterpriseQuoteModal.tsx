"use client";

import { useOptimistic, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Server, Database, Check, Shield, Zap, Cpu } from "lucide-react";
import { Product } from "@/lib/products";

interface EnterpriseQuoteModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface QuoteFormData {
  companyName: string;
  nodeCount: string;
  dataScale: string;
  contactEmail: string;
  useCase: string;
}

export function EnterpriseQuoteModal({ product, isOpen, onClose }: EnterpriseQuoteModalProps) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<QuoteFormData>({
    companyName: "",
    nodeCount: "",
    dataScale: "",
    contactEmail: "",
    useCase: "",
  });

  // useOptimistic for instant feedback
  const [optimisticState, addOptimistic] = useOptimistic(
    { status: "idle" as "idle" | "submitting" | "success", formData },
    (state, newStatus: "idle" | "submitting" | "success") => ({
      ...state,
      status: newStatus,
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(() => {
      addOptimistic("submitting");
    });

    // Simulate API call - in production, this would send to your backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    startTransition(() => {
      addOptimistic("success");
      setSubmitted(true);
    });
  };

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 z-50 overflow-y-auto"
          >
            {/* Circuit Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M0 30 H25 M35 30 H60 M30 0 V25 M30 35 V60" stroke="#f59e0b" strokeWidth="0.5" fill="none"/>
                    <circle cx="30" cy="30" r="2" fill="#f59e0b"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit)"/>
              </svg>
            </div>

            {/* Header */}
            <div className="relative border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-mono text-lg font-semibold text-white tracking-tight">
                      Enterprise Deployment
                    </h2>
                    <p className="text-sm text-zinc-500">Request Quote from Forge Engineers</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Summary */}
            <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-mono text-xl font-semibold text-white tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-amber-400 font-mono">
                    ${product.price.toLocaleString()} MSRP
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="relative p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="font-mono text-2xl font-semibold text-white mb-4">
                    Quote Request Received
                  </h3>
                  <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                    Our Enterprise Engineering team will review your requirements and contact you within 24 hours.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                      <Building2 className="w-4 h-4" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono"
                      placeholder="Acme AI Research Labs"
                    />
                  </div>

                  {/* Node Count */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                      <Server className="w-4 h-4" />
                      Required Node Count
                    </label>
                    <select
                      required
                      value={formData.nodeCount}
                      onChange={(e) => handleInputChange("nodeCount", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0a0a0a]">Select deployment scale...</option>
                      <option value="1-4" className="bg-[#0a0a0a]">1-4 Nodes (Pilot)</option>
                      <option value="5-16" className="bg-[#0a0a0a]">5-16 Nodes (Small Cluster)</option>
                      <option value="17-64" className="bg-[#0a0a0a]">17-64 Nodes (Medium Cluster)</option>
                      <option value="65-256" className="bg-[#0a0a0a]">65-256 Nodes (Large Cluster)</option>
                      <option value="256+" className="bg-[#0a0a0a]">256+ Nodes (Hyperscale)</option>
                    </select>
                  </div>

                  {/* Data Scale */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                      <Database className="w-4 h-4" />
                      Project Data Scale
                    </label>
                    <select
                      required
                      value={formData.dataScale}
                      onChange={(e) => handleInputChange("dataScale", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0a0a0a]">Select data volume...</option>
                      <option value="1-10" className="bg-[#0a0a0a]">1-10 TB</option>
                      <option value="10-100" className="bg-[#0a0a0a]">10-100 TB</option>
                      <option value="100-500" className="bg-[#0a0a0a]">100-500 TB</option>
                      <option value="500-2000" className="bg-[#0a0a0a]">500 TB - 2 PB</option>
                      <option value="2000+" className="bg-[#0a0a0a]">2+ PB</option>
                    </select>
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                      <Zap className="w-4 h-4" />
                      Enterprise Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono"
                      placeholder="procurement@company.com"
                    />
                  </div>

                  {/* Use Case */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                      <Cpu className="w-4 h-4" />
                      Primary Use Case
                    </label>
                    <textarea
                      rows={4}
                      value={formData.useCase}
                      onChange={(e) => handleInputChange("useCase", e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono resize-none"
                      placeholder="Describe your AI training/inference workload, model sizes, and infrastructure requirements..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={optimisticState.status === "submitting"}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {optimisticState.status === "submitting" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="w-5 h-5" />
                        </motion.div>
                        Submitting to Forge Engineers...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Request Enterprise Quote
                      </>
                    )}
                  </button>

                  <p className="text-xs text-zinc-600 text-center">
                    All inquiries are handled under NDA. Response within 24 business hours.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
