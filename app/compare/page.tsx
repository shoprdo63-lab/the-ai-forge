"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ComparisonDashboard from "@/components/ComparisonDashboard";
import { hardwareComponents, type HardwareComponent } from "@/data/components";

function ComparePageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<HardwareComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const p1 = searchParams.get("p1");
    const p2 = searchParams.get("p2");

    if (p1 && p2) {
      const product1 = hardwareComponents.find((c) => c.id === p1);
      const product2 = hardwareComponents.find((c) => c.id === p2);

      if (product1 && product2) {
        setProducts([product1, product2]);
        setShowDashboard(true);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleRemove = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (products.length <= 2) {
      setShowDashboard(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Cpu className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (products.length !== 2) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Cpu className="w-16 h-16 text-slate-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Comparison</h1>
          <p className="text-slate-400 mb-6">
            Please select two products to compare. Use the product IDs in the URL:
            <br />
            <code className="text-emerald-400 bg-slate-900 px-2 py-1 rounded mt-2 inline-block">
              /compare?p1=rtx-4090&p2=rtx-4080
            </code>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Product Comparison</h1>
              <p className="text-sm text-slate-400">
                {products[0].name} vs {products[1].name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Dashboard */}
      <AnimatePresence>
        {showDashboard && (
          <ComparisonDashboard
            products={products}
            onClose={() => setShowDashboard(false)}
            onRemove={handleRemove}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <Cpu className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
