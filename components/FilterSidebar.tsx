"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Filter, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HardwareFilters {
  search: string;
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  minVram: number;
}

interface FilterSidebarProps {
  onFilterChange?: (filters: HardwareFilters) => void;
  resultsCount?: number;
}

const BRANDS = ["NVIDIA", "AMD", "Intel"];
const CATEGORIES = ["GPU", "CPU"];

// ============================================
// Filter Content Component (Shared)
// ============================================

function FilterContent({
  filters,
  updateFilters,
  toggleCategory,
  toggleBrand,
  resetFilters,
  hasActiveFilters,
}: {
  filters: HardwareFilters;
  updateFilters: (next: Partial<HardwareFilters>) => void;
  toggleCategory: (category: string) => void;
  toggleBrand: (brand: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#64748b]" strokeWidth={2} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-6 px-2 text-[10px] text-[#64748b] hover:text-[#94a3b8]"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981]/50"
          style={{ fontSize: "16px" }} // Prevent iOS zoom
        />
      </div>

      <Separator className="bg-[#1e293b]" />

      {/* Category Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[12px] font-semibold text-white">Category</h3>
          {filters.categories.length > 0 && (
            <span className="text-[10px] text-[#64748b]">{filters.categories.length}</span>
          )}
        </div>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                className="h-3.5 w-3.5 rounded border-[#475569] bg-transparent data-[state=checked]:border-[#10b981] data-[state=checked]:bg-[#10b981]"
              />
              <Label
                htmlFor={`cat-${category}`}
                className="flex-1 cursor-pointer text-[11px] text-[#94a3b8] hover:text-white"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[#1e293b]" />

      {/* Brand Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[12px] font-semibold text-white">Brand</h3>
          {filters.brands.length > 0 && (
            <span className="text-[10px] text-[#64748b]">{filters.brands.length}</span>
          )}
        </div>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="h-3.5 w-3.5 rounded border-[#475569] bg-transparent data-[state=checked]:border-[#10b981] data-[state=checked]:bg-[#10b981]"
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="flex-1 cursor-pointer text-[11px] text-[#94a3b8] hover:text-white"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[#1e293b]" />

      {/* Price Range Filter */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[12px] font-semibold text-white">Price Range</h3>
          <span className="text-[10px] text-[#10b981]">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          min={0}
          max={5000}
          step={50}
          onValueChange={(value) => updateFilters({ priceRange: [value[0], value[1]] })}
          className="[&_[data-slot=slider-track]]:h-[2px] [&_[data-slot=slider-track]]:bg-[#262626] [&_[data-slot=slider-range]]:bg-[#10b981] [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-[#10b981] [&_[data-slot=slider-thumb]]:bg-white"
        />
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#475569]">
          <span>$0</span>
          <span>$5000</span>
        </div>
      </div>

      <Separator className="bg-[#1e293b]" />

      {/* Min VRAM Filter */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[12px] font-semibold text-white">Min VRAM</h3>
          <span className="text-[10px] text-[#3b82f6]">{filters.minVram} GB</span>
        </div>
        <Slider
          value={[filters.minVram]}
          min={8}
          max={80}
          step={4}
          onValueChange={(value) => updateFilters({ minVram: value[0] })}
          className="[&_[data-slot=slider-track]]:h-[2px] [&_[data-slot=slider-track]]:bg-[#262626] [&_[data-slot=slider-range]]:bg-[#3b82f6] [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-[#3b82f6] [&_[data-slot=slider-thumb]]:bg-white"
        />
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#475569]">
          <span>8GB</span>
          <span>80GB</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Mobile Drawer Component
// ============================================

function MobileFilterDrawer({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <div className="bg-slate-950/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl max-h-[80vh] overflow-hidden">
              {/* Handle bar */}
              <div className="flex items-center justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {children}
              </div>

              {/* Done Button */}
              <div className="p-4 border-t border-white/10 bg-slate-900/50">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                >
                  Show Results
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// Main Filter Sidebar Component
// ============================================

export default function FilterSidebar({
  onFilterChange,
  resultsCount,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<HardwareFilters>({
    search: "",
    categories: [],
    brands: [],
    priceRange: [0, 5000],
    minVram: 8,
  });
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const updateFilters = (next: Partial<HardwareFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...next };
      onFilterChange?.(updated);
      return updated;
    });
  };

  const toggleCategory = (category: string) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: updated });
  };

  const toggleBrand = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    updateFilters({ brands: updated });
  };

  const resetFilters = () => {
    const reset = {
      search: "",
      categories: [],
      brands: [],
      priceRange: [0, 5000] as [number, number],
      minVram: 8,
    };
    setFilters(reset);
    onFilterChange?.(reset);
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 5000 ||
    filters.minVram !== 8;

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    filters.categories.length +
    filters.brands.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000 ? 1 : 0) +
    (filters.minVram !== 8 ? 1 : 0);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0 space-y-6">
        <FilterContent
          filters={filters}
          updateFilters={updateFilters}
          toggleCategory={toggleCategory}
          toggleBrand={toggleBrand}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </aside>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-20 left-4 z-30">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-full shadow-lg shadow-black/30"
        >
          <Filter className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium text-white">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Mobile Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      >
        <FilterContent
          filters={filters}
          updateFilters={updateFilters}
          toggleCategory={toggleCategory}
          toggleBrand={toggleBrand}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </MobileFilterDrawer>
    </>
  );
}
