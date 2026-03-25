"use client";

import { useState, useCallback } from "react";
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Zap, 
  Battery, 
  Fan, 
  Package,
  DollarSign,
  Filter,
  X
} from "lucide-react";

export type FilterState = {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
};

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const CATEGORIES = [
  { id: "GPU", label: "GPU", icon: Monitor },
  { id: "CPU", label: "CPU", icon: Cpu },
  { id: "Motherboard", label: "Motherboard", icon: HardDrive },
  { id: "RAM", label: "RAM", icon: Zap },
  { id: "Storage", label: "Storage", icon: HardDrive },
  { id: "PSU", label: "PSU", icon: Battery },
  { id: "Cooling", label: "Cooling", icon: Fan },
];

const BRANDS = [
  { id: "NVIDIA", label: "NVIDIA" },
  { id: "AMD", label: "AMD" },
  { id: "Intel", label: "Intel" },
  { id: "ASUS", label: "ASUS" },
  { id: "MSI", label: "MSI" },
  { id: "Gigabyte", label: "Gigabyte" },
  { id: "ASRock", label: "ASRock" },
];

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange);

  const toggleCategory = useCallback((categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    
    onFilterChange({
      ...filters,
      categories: newCategories,
    });
  }, [filters, onFilterChange]);

  const toggleBrand = useCallback((brandId: string) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter((b) => b !== brandId)
      : [...filters.brands, brandId];
    
    onFilterChange({
      ...filters,
      brands: newBrands,
    });
  }, [filters, onFilterChange]);

  const handlePriceChange = useCallback((value: number, index: number) => {
    const newRange: [number, number] = [...localPriceRange] as [number, number];
    newRange[index] = value;
    setLocalPriceRange(newRange);
    
    // Debounce the filter update
    setTimeout(() => {
      onFilterChange({
        ...filters,
        priceRange: newRange,
      });
    }, 100);
  }, [filters, localPriceRange, onFilterChange]);

  const clearFilters = useCallback(() => {
    const resetFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 30000],
    };
    setLocalPriceRange([0, 30000]);
    onFilterChange(resetFilters);
  }, [onFilterChange]);

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.brands.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 30000;

  return (
    <div className="w-full h-full bg-[#020617]/90 backdrop-blur-md border-r border-slate-800 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#10b981]" />
          <h2 className="text-lg font-bold text-white">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#10b981]" />
          Category
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = filters.categories.includes(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isSelected
                    ? "bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]"
                    : "bg-slate-800/30 border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{category.label}</span>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#10b981]" />
          Brand
        </h3>
        <div className="space-y-2">
          {BRANDS.map((brand) => {
            const isSelected = filters.brands.includes(brand.id);
            
            return (
              <button
                key={brand.id}
                onClick={() => toggleBrand(brand.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isSelected
                    ? "bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]"
                    : "bg-slate-800/30 border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <div className={`w-4 h-4 rounded border ${
                  isSelected 
                    ? "bg-[#10b981] border-[#10b981]" 
                    : "border-slate-600"
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="flex-1 text-left">{brand.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#10b981]" />
          Price Range
        </h3>
        
        <div className="px-2">
          {/* Min Price */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Min</span>
              <span className="text-[#10b981] font-mono">${localPriceRange[0].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="30000"
              step="100"
              value={localPriceRange[0]}
              onChange={(e) => handlePriceChange(Number(e.target.value), 0)}
              className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#10b981]"
            />
          </div>

          {/* Max Price */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Max</span>
              <span className="text-[#10b981] font-mono">${localPriceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="30000"
              step="100"
              value={localPriceRange[1]}
              onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
              className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#10b981]"
            />
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: "Under $1K", range: [0, 1000] as [number, number] },
            { label: "$1K-$2K", range: [1000, 2000] as [number, number] },
            { label: "$2K+", range: [2000, 30000] as [number, number] },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setLocalPriceRange(preset.range);
                onFilterChange({ ...filters, priceRange: preset.range });
              }}
              className="px-3 py-1.5 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-3">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-1 text-xs bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded-full"
              >
                {cat}
              </span>
            ))}
            {filters.brands.map((brand) => (
              <span
                key={brand}
                className="px-2 py-1 text-xs bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded-full"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
