"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { Cpu, Zap, Database, HardDrive, Layers, ArrowRight, X, Battery, Filter } from "lucide-react";
import type { HardwareComponent } from "@/lib/constants";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

// Extract TDP value from specs string
function extractTdp(tdpString?: string): number {
  if (!tdpString) return 0;
  const match = tdpString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

interface ProductGridProps {
  initialComponents: HardwareComponent[];
  categories: string[];
  manufacturers: string[];
  bounds: {
    price: [number, number];
    vram: [number, number];
    tdp: [number, number];
  };
}

// Container animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export default function ProductGrid({ 
  initialComponents, 
  categories, 
  manufacturers, 
  bounds 
}: ProductGridProps) {
  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    brands: [] as string[],
    priceRange: bounds.price,
    minVram: 8,
  });

  // Selected products for wattage counter
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Real-time filtering with useMemo
  const filteredComponents = useMemo(() => {
    return initialComponents.filter((component) => {
      if (filters.categories.length > 0 && !filters.categories.includes(component.category)) {
        return false;
      }
      if (filters.brands.length > 0 && !filters.brands.includes(component.brand)) {
        return false;
      }
      if (component.price < filters.priceRange[0] || component.price > filters.priceRange[1]) {
        return false;
      }
      const vram = component.vram || 0;
      if (component.category === "GPU" && vram > 0 && vram < filters.minVram) {
        return false;
      }
      return true;
    });
  }, [filters, initialComponents]);

  // Calculate total wattage of selected products
  const totalWattage = useMemo(() => {
    let total = 0;
    selectedProducts.forEach((productId) => {
      const product = initialComponents.find((c) => c.id === productId);
      if (product) {
        total += extractTdp(product.specs.tdp);
      }
    });
    return total;
  }, [selectedProducts, initialComponents]);

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.search !== "" ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] !== bounds.price[0] ||
    filters.priceRange[1] !== bounds.price[1] ||
    filters.minVram !== 8;

  return (
    <div className="w-full">
      {/* Active Filters Summary */}
      <AnimatePresence mode="wait">
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 glass-premium"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 font-mono">
                SHOWING {filteredComponents.length.toString().padStart(2, "0")} RESULTS
              </span>
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    categories: [],
                    brands: [],
                    priceRange: bounds.price,
                    minVram: 8,
                  })
                }
                className="btn-ghost text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wattage Counter */}
      <AnimatePresence mode="wait">
        {selectedProducts.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-5 glass-premium spectral-glow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="icon-geometric">
                  <Battery className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="label-mono text-[10px] mb-1">TOTAL POWER DRAW</p>
                  <p className="text-2xl font-light tracking-tight text-emerald-400 font-mono">
                    {totalWattage}W
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">
                  {selectedProducts.size} item{selectedProducts.size > 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setSelectedProducts(new Set())}
                  className="icon-geometric w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid with Suspense */}
      <Suspense fallback={<ProductGridSkeleton count={6} />}>
        {filteredComponents.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
          >
            {filteredComponents.map((component, index) => (
              <ProductCard
                key={component.id}
                component={component}
                index={index}
                isSelected={selectedProducts.has(component.id)}
                onToggleSelection={() => toggleProductSelection(component.id)}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </Suspense>
    </div>
  );
}

// Skeleton loader for the entire grid
function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-24 h-24 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-8">
        <Database className="w-10 h-10 text-zinc-600" strokeWidth={1} />
      </div>
      <h3 className="headline-section text-xl mb-3">No Hardware Found</h3>
      <p className="body-premium max-w-md mb-8">
        Adjust your filters to discover AI-optimized components that match your requirements.
      </p>
      <div className="flex items-center gap-2 text-zinc-600">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-mono">Try broadening your search criteria</span>
      </div>
    </motion.div>
  );
}
