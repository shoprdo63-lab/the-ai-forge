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
      
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        
        {/* Main Content Area */}
        <div id="products" className="mt-16 flex flex-col lg:flex-row gap-8">
          {/* Sidebar - 25% on desktop */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <FilterSidebar
              onFilterChange={setFilters}
              resultsCount={filteredComponents.length}
            />
          </aside>
          
          {/* Product Grid - 75% on desktop */}
          <section className="w-full lg:w-3/4">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#10b981]">
                AI Hardware Database
              </h2>
              <span className="text-sm text-slate-400">
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
                  className="mb-6 p-4 bg-slate-900/50 backdrop-blur rounded-xl border border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Showing {filteredComponents.length} filtered results
                    </span>
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#10b981] hover:bg-[#10b981]/10 rounded-lg transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Grid with AnimatePresence and layout animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      className={`absolute top-3 left-3 z-10 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        selectedProducts.has(component.id)
                          ? "bg-[#10b981] border-[#10b981]"
                          : "bg-slate-900/80 border-slate-600 hover:border-[#10b981]"
                      }`}
                    >
                      {selectedProducts.has(component.id) && (
                        <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="p-6 bg-slate-900/50 rounded-full mb-6 border border-slate-800">
                  <Zap className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  No hardware matches your criteria
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-6">
                  Try adjusting your filters to find components that match your requirements.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 rounded-lg hover:bg-[#10b981]/20 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Filters
                </button>
              </motion.div>
            )}
          </section>
        </div>
      </main>
      
      {/* Enhanced Floating Power Widget */}
      <AnimatePresence>
        {selectedProducts.size > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-50 w-[360px]"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#10b981]" />
                  <span className="font-semibold text-white">Build Power</span>
                </div>
                <button
                  onClick={() => setSelectedProducts(new Set())}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  Clear Build
                </button>
              </div>

              {/* Cart Summary */}
              <div className="px-5 py-3 max-h-[120px] overflow-y-auto">
                {Array.from(selectedProducts).map((productId) => {
                  const product = hardwareComponents.find((c) => c.id === productId);
                  return product ? (
                    <div key={productId} className="flex items-center justify-between py-1.5 text-sm">
                      <span className="text-slate-300 truncate flex-1">{product.name}</span>
                      <span className="text-slate-500 ml-2">{product.wattage}W</span>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="border-t border-slate-700/50" />

              {/* Power Stats */}
              <div className="px-5 py-4">
                {/* Total Wattage */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-400">Total Power Draw</span>
                  <span className="text-2xl font-bold text-[#10b981] font-mono">
                    {totalWattage}W
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>Power Load</span>
                    <span>{Math.min(Math.round((totalWattage / 1000) * 100), 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
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
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>0W</span>
                    <span>500W</span>
                    <span>1000W</span>
                  </div>
                </div>

                {/* PSU Recommendation */}
                <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Battery className="w-4 h-4 text-[#10b981]" />
                    <span className="text-xs font-medium text-[#10b981]">Recommended PSU</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {Math.ceil(totalWattage * 1.2 / 50) * 50}W
                    <span className="text-xs font-normal text-slate-400 ml-2">
                      ({Math.round(totalWattage * 1.2)}W with 20% headroom)
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
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="w-5 h-5 text-[#10b981]" />
                <span className="text-sm font-semibold text-white">
                  Compare ({comparisonList.length}/2)
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {comparisonList.map((product) => (
                  <div key={product.id} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-300 truncate w-32">{product.name}</span>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {comparisonList.length === 2 ? (
                <button
                  onClick={() => setShowComparison(true)}
                  className="w-full px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-slate-950 font-semibold text-sm rounded-lg transition-colors"
                >
                  Compare Now
                </button>
              ) : (
                <p className="text-xs text-slate-500">Select 1 more product</p>
              )}
              <button
                onClick={clearComparison}
                className="w-full mt-2 text-xs text-slate-500 hover:text-slate-300"
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
      <footer className="mt-24 border-t border-slate-800 p-8 text-center text-slate-500">
        <p>© 2026 The AI Forge. Built to Global Standards.</p>
      </footer>
    </div>
  );
}
