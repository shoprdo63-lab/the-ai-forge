"use client";

import { useState, useMemo } from "react";
import { Cpu, Zap, Database, TrendingUp, ArrowRight, Filter, X, Battery } from "lucide-react";
import { hardwareComponents, TIER_COLORS, type HardwareComponent } from "@/lib/constants";
import HardwareCard from "@/components/HardwareCard";
import FilterSidebar, { type HardwareFilters } from "@/components/FilterSidebar";

// Extract TDP value from specs string
function extractTdp(tdpString?: string): number {
  if (!tdpString) return 0;
  const match = tdpString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

interface FilteredHardwareGridProps {
  initialComponents: HardwareComponent[];
  categories: string[];
  manufacturers: string[];
  bounds: {
    price: [number, number];
    vram: [number, number];
    tdp: [number, number];
  };
}

// Client Component - handles user interactions and state
export default function FilteredHardwareGrid({ 
  initialComponents, 
  categories, 
  manufacturers, 
  bounds 
}: FilteredHardwareGridProps) {
  // Filter state from FilterSidebar - using new simplified interface
  const [filters, setFilters] = useState<HardwareFilters>({
    search: "",
    categories: [],
    brands: [],
    priceRange: bounds.price,
    minVram: 8,
  });

  // Selected products for wattage counter
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Real-time filtering with useMemo - O(n) complexity
  const filteredComponents = useMemo(() => {
    return initialComponents.filter((component) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(component.category)) {
        return false;
      }

      // Brand filter (renamed from manufacturers)
      if (filters.brands.length > 0 && !filters.brands.includes(component.brand)) {
        return false;
      }

      // Price range filter
      if (component.price < filters.priceRange[0] || component.price > filters.priceRange[1]) {
        return false;
      }

      // Min VRAM filter (for GPUs) - simplified from vramRange
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar - Filters */}
      <FilterSidebar 
        onFilterChange={setFilters}
        resultsCount={filteredComponents.length}
      />

      {/* Right Content - Products Grid */}
      <div className="w-full lg:w-3/4">
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-slate-900/50 backdrop-blur rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Showing {filteredComponents.length} filtered results
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
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#10b981] hover:bg-[#10b981]/10 rounded-lg transition-colors"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Wattage Counter */}
        {selectedProducts.size > 0 && (
          <div className="mb-6 p-4 bg-slate-900/90 backdrop-blur-xl border border-[#10b981]/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                  <Battery className="w-5 h-5 text-[#10b981]" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Total Power Draw
                  </p>
                  <p className="text-xl font-bold text-[#10b981] font-mono">
                    {totalWattage}W
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  {selectedProducts.size} item
                  {selectedProducts.size > 1 ? "s" : ""} selected
                </span>
                <button
                  onClick={() => setSelectedProducts(new Set())}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredComponents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredComponents.map((component, index) => (
              <div
                key={component.id}
                className={`relative transition-all ${
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
                <HardwareCard component={component} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-slate-900 rounded-full mb-6">
              <Database className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No AI hardware found for this budget
            </h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">
              Try adjusting your price range or category filter to find
              components that match your requirements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
