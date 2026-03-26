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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#10b981]/30 focus:bg-white/[0.05] transition-all"
          style={{ fontSize: "16px" }} // Prevent iOS zoom
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Category Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-medium text-zinc-300">Category</h3>
          {filters.categories.length > 0 && (
            <span className="text-xs text-zinc-500">{filters.categories.length}</span>
          )}
        </div>
        <div className="space-y-2.5">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-3">
              <Checkbox
                id={`cat-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                className="h-4 w-4 rounded border-zinc-700 bg-transparent data-[state=checked]:border-[#10b981] data-[state=checked]:bg-[#10b981]"
              />
              <Label
                htmlFor={`cat-${category}`}
                className="flex-1 cursor-pointer text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Brand Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-medium text-zinc-300">Brand</h3>
          {filters.brands.length > 0 && (
            <span className="text-xs text-zinc-500">{filters.brands.length}</span>
          )}
        </div>
        <div className="space-y-2.5">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center gap-3">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded border-zinc-700 bg-transparent data-[state=checked]:border-[#10b981] data-[state=checked]:bg-[#10b981]"
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="flex-1 cursor-pointer text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Price Range Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-medium text-zinc-300">Price Range</h3>
          <span className="text-xs text-[#10b981]">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          min={0}
          max={5000}
          step={50}
          onValueChange={(value) => updateFilters({ priceRange: [value[0], value[1]] })}
          className="[&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-[#10b981] [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[#10b981] [&_[data-slot=slider-thumb]]:bg-[#050505] [&_[data-slot=slider-thumb]]:hover:scale-110 [&_[data-slot=slider-thumb]]:transition-transform"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
          <span>$0</span>
          <span>$5000</span>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Min VRAM Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-medium text-zinc-300">Min VRAM</h3>
          <span className="text-xs text-[#3b82f6]">{filters.minVram} GB</span>
        </div>
        <Slider
          value={[filters.minVram]}
          min={8}
          max={80}
          step={4}
          onValueChange={(value) => updateFilters({ minVram: value[0] })}
          className="[&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-track]]:bg-zinc-800 [&_[data-slot=slider-range]]:bg-[#3b82f6] [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[#3b82f6] [&_[data-slot=slider-thumb]]:bg-[#050505] [&_[data-slot=slider-thumb]]:hover:scale-110 [&_[data-slot=slider-thumb]]:transition-transform"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
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
            <div className="bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl max-h-[80vh] overflow-hidden">
              {/* Handle bar */}
              <div className="flex items-center justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-zinc-800 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-4 border-b border-white/10">
                <h2 className="text-base font-medium text-white">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {children}
              </div>

              {/* Done Button */}
              <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-[#050505] font-medium rounded-xl transition-colors"
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
      {/* Desktop Sidebar - Glassmorphism Card */}
      <aside className="hidden lg:block w-[260px] shrink-0">
        <div className="sticky top-24 p-6 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06]">
          <FilterContent
            filters={filters}
            updateFilters={updateFilters}
            toggleCategory={toggleCategory}
            toggleBrand={toggleBrand}
            resetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </aside>

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-20 left-4 z-30">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-lg shadow-black/40"
        >
          <Filter className="w-4 h-4 text-[#10b981]" strokeWidth={1.5} />
          <span className="text-sm font-medium text-zinc-300">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 bg-[#10b981] text-[#050505] text-xs font-medium rounded-full">
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
