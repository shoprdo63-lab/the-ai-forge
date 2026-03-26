"use client";

import { useState, useMemo, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Battery, Zap, RotateCcw, Scale } from "lucide-react";
import { hardwareComponents, type HardwareComponent } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterSidebar, { type HardwareFilters } from "@/components/FilterSidebar";
import HardwareCard from "@/components/HardwareCard";
import { HardwareGridSkeleton } from "@/components/Skeletons";
import Newsletter from "@/components/Newsletter";
import ExitPopup from "@/components/ExitPopup";
import Head from "next/head";

// Dynamic imports for heavy components
const ComparisonOverlay = lazy(() => import("@/components/ComparisonOverlay"));

// Default filter state matching FilterSidebar interface
const defaultFilters: HardwareFilters = {
  search: "",
  categories: [],
  brands: [],
  priceRange: [0, 5000],
  minVram: 8,
};

export default function Home() {
  // Filter state - lifted from FilterSidebar
  const [filters, setFilters] = useState<HardwareFilters>(defaultFilters);

  // Selected products for wattage counter
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Comparison state (max 2 products)
  const [comparisonList, setComparisonList] = useState<HardwareComponent[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Add to comparison
  const addToComparison = (component: HardwareComponent) => {
    if (comparisonList.length >= 2) return;
    if (comparisonList.find(c => c.id === component.id)) return;
    
    const newList = [...comparisonList, component];
    setComparisonList(newList);
    
    // Auto-open comparison when 2 products selected
    if (newList.length === 2) {
      setShowComparison(true);
    }
  };

  // Remove from comparison
  const removeFromComparison = (id: string) => {
    setComparisonList(prev => prev.filter(c => c.id !== id));
  };

  // Clear comparison
  const clearComparison = () => {
    setComparisonList([]);
    setShowComparison(false);
  };

  // Real-time filtering engine with useMemo - O(n) complexity
  const filteredComponents = useMemo(() => {
    return hardwareComponents.filter((component) => {
      // Search filter (name, description, tags)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = component.name.toLowerCase().includes(searchLower);
        const descMatch = component.description.toLowerCase().includes(searchLower);
        const tagsMatch = component.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!nameMatch && !descMatch && !tagsMatch) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(component.category)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(component.brand)) {
        return false;
      }

      // Price range filter
      if (component.price < filters.priceRange[0] || component.price > filters.priceRange[1]) {
        return false;
      }

      // Min VRAM filter (for GPUs)
      const vram = component.vram || 0;
      if (component.category === "GPU" && vram > 0 && vram < filters.minVram) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Calculate total wattage of selected products
  const totalWattage = useMemo(() => {
    let total = 0;
    selectedProducts.forEach((productId) => {
      const product = hardwareComponents.find((c) => c.id === productId);
      if (product) {
        total += product.wattage;
      }
    });
    return total;
  }, [selectedProducts]);

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
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 5000 ||
    filters.minVram !== 8;

  // Reset all filters
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-500">
      <Head>
        <link rel="canonical" href="https://theaiforge.ai/" />
      </Head>
      <Navbar />
      
      <main className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12">
        <Hero />
        
        {/* Main Content Area - Breathing Layout with gap-12 */}
        <div id="products" className="mt-20 flex flex-col lg:flex-row gap-12">
          {/* Sidebar - 25% on desktop */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <FilterSidebar
              onFilterChange={setFilters}
              resultsCount={filteredComponents.length}
            />
          </aside>
          
          {/* Product Grid - 75% on desktop */}
          <section className="w-full lg:flex-1">
            {/* Header */}
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-medium text-white">
                AI Hardware Database
              </h2>
              <span className="text-sm text-zinc-500">
                {filteredComponents.length} products
              </span>
            </div>

            {/* Active Filters Summary */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-white/[0.02] backdrop-blur rounded-xl border border-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                      Showing {filteredComponents.length} filtered results
                    </span>
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#10b981] hover:bg-[#10b981]/10 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Grid with AnimatePresence and layout animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredComponents.map((component, index) => (
                  <motion.div
                    key={component.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.25, 
                      delay: index * 0.02,
                      layout: { duration: 0.3 }
                    }}
                    className={`relative ${
                      selectedProducts.has(component.id)
                        ? "ring-2 ring-[#10b981] rounded-xl"
                        : ""
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleProductSelection(component.id);
                      }}
                      className={`absolute top-4 left-4 z-10 w-6 h-6 rounded border flex items-center justify-center transition-all duration-200 ${
                        selectedProducts.has(component.id)
                          ? "bg-[#10b981] border-[#10b981]"
                          : "bg-black/40 border-white/20 hover:border-white/40"
                      }`}
                    >
                      {selectedProducts.has(component.id) && (
                        <svg className="w-4 h-4 text-[#050505]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <HardwareCard 
                      component={component} 
                      index={index}
                      isSelected={selectedProducts.has(component.id)}
                      isInComparison={comparisonList.some(c => c.id === component.id)}
                      onToggleSelection={() => toggleProductSelection(component.id)}
                      onAddToComparison={() => addToComparison(component)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredComponents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="p-6 bg-white/[0.02] rounded-2xl mb-8 border border-white/[0.06]">
                  <Zap className="w-10 h-10 text-zinc-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-3">
                  No hardware matches your criteria
                </h3>
                <p className="text-sm text-zinc-500 max-w-md mb-8">
                  Try adjusting your filters to find components that match your requirements.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] text-zinc-300 border border-white/[0.08] rounded-xl hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                  Reset Filters
                </button>
              </motion.div>
            )}
          </section>
        </div>
      </main>
      
      {/* Floating Power Widget */}
      <AnimatePresence>
        {selectedProducts.size > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-50 w-[340px]"
          >
            <div className="bg-[#050505]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#10b981]" strokeWidth={1.5} />
                  <span className="font-medium text-sm text-zinc-200">Build Power</span>
                </div>
                <button
                  onClick={() => setSelectedProducts(new Set())}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Cart Summary */}
              <div className="px-5 py-3 max-h-[120px] overflow-y-auto">
                {Array.from(selectedProducts).map((productId) => {
                  const product = hardwareComponents.find((c) => c.id === productId);
                  return product ? (
                    <div key={productId} className="flex items-center justify-between py-1.5 text-sm">
                      <span className="text-zinc-400 truncate flex-1">{product.name}</span>
                      <span className="text-zinc-600 ml-2 text-xs">{product.wattage}W</span>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="border-t border-white/[0.06]" />

              {/* Power Stats */}
              <div className="px-5 py-4">
                {/* Total Wattage */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-zinc-500">Total Power Draw</span>
                  <span className="text-xl font-semibold text-[#10b981] font-mono">
                    {totalWattage}W
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-zinc-600 mb-1.5">
                    <span>Power Load</span>
                    <span>{Math.min(Math.round((totalWattage / 1000) * 100), 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalWattage / 1000) * 100, 100)}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full rounded-full ${
                        totalWattage > 800 ? 'bg-red-500' : 
                        totalWattage > 500 ? 'bg-yellow-500' : 'bg-[#10b981]'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-700 mt-1">
                    <span>0W</span>
                    <span>500W</span>
                    <span>1000W</span>
                  </div>
                </div>

                {/* PSU Recommendation */}
                <div className="bg-[#10b981]/5 border border-[#10b981]/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Battery className="w-3.5 h-3.5 text-[#10b981]" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-[#10b981]">Recommended PSU</span>
                  </div>
                  <p className="text-lg font-semibold text-zinc-200">
                    {Math.ceil(totalWattage * 1.2 / 50) * 50}W
                    <span className="text-xs font-normal text-zinc-500 ml-2">
                      ({Math.round(totalWattage * 1.2)}W headroom)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Overlay with Suspense */}
      {showComparison && comparisonList.length === 2 && (
        <Suspense fallback={
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
            <HardwareGridSkeleton count={1} />
          </div>
        }>
          <ComparisonOverlay
            products={comparisonList}
            onClose={() => setShowComparison(false)}
            onRemove={(id) => {
              removeFromComparison(id);
              if (comparisonList.length <= 2) {
                setShowComparison(false);
              }
            }}
          />
        </Suspense>
      )}

      {/* Comparison Mini-Widget */}
      <AnimatePresence>
        {comparisonList.length > 0 && !showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-40"
          >
            <div className="bg-[#050505]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="w-4 h-4 text-[#10b981]" strokeWidth={1.5} />
                <span className="text-sm font-medium text-zinc-200">
                  Compare ({comparisonList.length}/2)
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {comparisonList.map((product) => (
                  <div key={product.id} className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400 truncate w-32">{product.name}</span>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
              {comparisonList.length === 2 ? (
                <button
                  onClick={() => setShowComparison(true)}
                  className="w-full px-4 py-2.5 bg-[#10b981] hover:bg-[#059669] text-[#050505] font-medium text-sm rounded-xl transition-colors"
                >
                  Compare Now
                </button>
              ) : (
                <p className="text-xs text-zinc-600">Select 1 more product</p>
              )}
              <button
                onClick={clearComparison}
                className="w-full mt-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Exit Intent Popup */}
      <ExitPopup />

      {/* Footer */}
      <footer className="mt-32 border-t border-white/[0.06] py-12 text-center">
        <p className="text-sm text-zinc-600">© 2026 The AI Forge. Built to Global Standards.</p>
      </footer>
    </div>
  );
}
