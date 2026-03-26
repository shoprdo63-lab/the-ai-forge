"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Cpu, 
  Monitor, 
  HardDrive, 
  Zap,
  LayoutGrid,
  List,
  ArrowUpDown
} from "lucide-react";
import { hardwareComponents, type HardwareComponent, type Category, type AITier, AI_TIERS, CATEGORIES, TIER_COLORS } from "@/lib/constants";
import AICard from "@/components/AICard";

// Filter state type
type FilterState = {
  searchQuery: string;
  selectedCategories: Category[];
  selectedTiers: AITier[];
  priceRange: [number, number];
  minVram: number;
  inStockOnly: boolean;
  sortBy: "price" | "aiScore" | "vramPerDollar" | "llama3Tps";
  sortOrder: "asc" | "desc";
};

// Initial filter state
const initialFilters: FilterState = {
  searchQuery: "",
  selectedCategories: [],
  selectedTiers: [],
  priceRange: [0, 30000],
  minVram: 0,
  inStockOnly: false,
  sortBy: "aiScore",
  sortOrder: "desc",
};

// Filter chip component
function FilterChip({ 
  label, 
  onRemove, 
  color = "zinc" 
}: { 
  label: string; 
  onRemove: () => void;
  color?: "zinc" | "amber" | "emerald" | "cyan";
}) {
  const colorClasses = {
    zinc: "bg-zinc-800/50 text-zinc-400 border-zinc-700/50",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    emerald: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
      {label}
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
        <X className="w-3 h-3" strokeWidth={1.5} />
      </button>
    </span>
  );
}

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  GPU: <Monitor className="w-4 h-4" />,
  CPU: <Cpu className="w-4 h-4" />,
  Motherboard: <HardDrive className="w-4 h-4" />,
  RAM: <Zap className="w-4 h-4" />,
  Storage: <HardDrive className="w-4 h-4" />,
  PSU: <Zap className="w-4 h-4" />,
  Cooling: <Cpu className="w-4 h-4" />,
};

export default function HardwareGrid() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(true);

  // O(n) filtering with useMemo for optimal performance
  const filteredComponents = useMemo(() => {
    let result = hardwareComponents;

    // Search filter - O(n) string matching
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((c) => 
        c.name.toLowerCase().includes(query) ||
        c.brand.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category filter - O(1) set lookup
    if (filters.selectedCategories.length > 0) {
      const categorySet = new Set(filters.selectedCategories);
      result = result.filter((c) => categorySet.has(c.category));
    }

    // Tier filter - O(1) set lookup
    if (filters.selectedTiers.length > 0) {
      const tierSet = new Set(filters.selectedTiers);
      result = result.filter((c) => tierSet.has(c.aiIntelligence.aiTier));
    }

    // Price range filter
    result = result.filter((c) => 
      c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1]
    );

    // VRAM filter (GPU only)
    if (filters.minVram > 0) {
      result = result.filter((c) => {
        if (c.category !== "GPU") return true;
        const vramMatch = c.specs.vram?.match(/(\d+)/);
        return vramMatch ? parseInt(vramMatch[1]) >= filters.minVram : false;
      });
    }

    // In stock filter
    if (filters.inStockOnly) {
      result = result.filter((c) => c.inStock);
    }

    // Sorting - O(n log n) but only on filtered results
    result = [...result].sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (filters.sortBy) {
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "aiScore":
          aVal = a.aiScore;
          bVal = b.aiScore;
          break;
        case "vramPerDollar":
          aVal = a.aiIntelligence.vramPerDollar;
          bVal = b.aiIntelligence.vramPerDollar;
          break;
        case "llama3Tps":
          aVal = a.aiIntelligence.llama3Tps;
          bVal = b.aiIntelligence.llama3Tps;
          break;
        default:
          aVal = a.aiScore;
          bVal = b.aiScore;
      }

      return filters.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [filters]);

  // Toggle handlers
  const toggleCategory = useCallback((category: Category) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  }, []);

  const toggleTier = useCallback((tier: AITier) => {
    setFilters((prev) => ({
      ...prev,
      selectedTiers: prev.selectedTiers.includes(tier)
        ? prev.selectedTiers.filter((t) => t !== tier)
        : [...prev.selectedTiers, tier],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Active filter chips
  const activeFilters = useMemo(() => {
    const chips: { label: string; onRemove: () => void; color: "zinc" | "amber" | "emerald" | "cyan" }[] = [];
    
    filters.selectedCategories.forEach((cat) => {
      chips.push({
        label: cat,
        onRemove: () => toggleCategory(cat),
        color: "cyan",
      });
    });

    filters.selectedTiers.forEach((tier) => {
      chips.push({
        label: tier,
        onRemove: () => toggleTier(tier),
        color: tier.startsWith("S") ? "amber" : tier.startsWith("A") ? "emerald" : "cyan",
      });
    });

    if (filters.minVram > 0) {
      chips.push({
        label: `${filters.minVram}GB+ VRAM`,
        onRemove: () => setFilters((p) => ({ ...p, minVram: 0 })),
        color: "zinc",
      });
    }

    if (filters.inStockOnly) {
      chips.push({
        label: "In Stock",
        onRemove: () => setFilters((p) => ({ ...p, inStockOnly: false })),
        color: "emerald",
      });
    }

    return chips;
  }, [filters, toggleCategory, toggleTier]);

  return (
    <section className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#10b981]/10 rounded-lg border border-[#10b981]/20">
                <Cpu className="w-5 h-5 text-[#10b981]" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-lg font-medium text-zinc-200">AI Command Center</h1>
                <p className="text-xs text-zinc-600">Intelligent hardware selection for AI workloads</p>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search components, brands, specs..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/[0.06] rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#10b981]/30 focus:bg-white/[0.04] transition-all"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters((p) => ({ ...p, searchQuery: "" }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showFilters ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20" : "bg-white/[0.02] text-zinc-500 border border-white/[0.06] hover:text-zinc-300"
                }`}
              >
                <Filter className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} strokeWidth={1.5} />
              </button>

              <div className="flex items-center bg-white/[0.02] rounded-lg border border-white/[0.06] p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-white/[0.06] text-zinc-300" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={`p-1.5 rounded transition-colors ${viewMode === "compact" ? "bg-white/[0.06] text-zinc-300" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Sort dropdown */}
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-") as [FilterState["sortBy"], FilterState["sortOrder"]];
                  setFilters((p) => ({ ...p, sortBy, sortOrder }));
                }}
                className="px-3 py-2 bg-white/[0.02] border border-white/[0.06] rounded-lg text-sm text-zinc-400 focus:outline-none focus:border-[#10b981]/30"
              >
                <option value="aiScore-desc">Highest AI Score</option>
                <option value="aiScore-asc">Lowest AI Score</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="vramPerDollar-desc">Best VRAM Value</option>
                <option value="llama3Tps-desc">Fastest Inference</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]"
            >
              <span className="text-xs text-zinc-600 uppercase tracking-wider">Active:</span>
              {activeFilters.map((filter, i) => (
                <FilterChip key={i} {...filter} />
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-zinc-600 hover:text-zinc-400 underline"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex gap-8">
          {/* Filter sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 280 }}
                exit={{ opacity: 0, width: 0 }}
                className="shrink-0 overflow-hidden"
              >
                <div className="w-[280px] space-y-6">
                  {/* Category filter */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2">
                      {categoryIcons["GPU"]} Category
                    </h3>
                    <div className="space-y-3">
                      {CATEGORIES.filter(c => ["GPU", "CPU", "Motherboard"].includes(c)).map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 rounded border-zinc-700 bg-transparent text-[#10b981] focus:ring-[#10b981]/20"
                          />
                          <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* AI Tier filter */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" strokeWidth={1.5} /> AI Tier
                    </h3>
                    <div className="space-y-3">
                      {AI_TIERS.map((tier) => {
                        const colors = TIER_COLORS[tier];
                        return (
                          <label key={tier} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.selectedTiers.includes(tier)}
                              onChange={() => toggleTier(tier)}
                              className="w-4 h-4 rounded border-zinc-700 bg-transparent text-[#10b981] focus:ring-[#10b981]/20"
                            />
                            <span className={`text-sm transition-colors ${colors.text}`}>
                              {tier}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* VRAM filter */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-sm font-medium text-zinc-300 mb-4">Minimum VRAM</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 16, 24, 48].map((vram) => (
                        <button
                          key={vram}
                          onClick={() => setFilters((p) => ({ ...p, minVram: vram === filters.minVram ? 0 : vram }))}
                          className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            filters.minVram === vram
                              ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                              : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-300 border border-zinc-700/50"
                          }`}
                        >
                          {vram === 0 ? "Any" : `${vram}GB`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-sm font-medium text-zinc-300 mb-4">Price Range</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) => setFilters((p) => ({ ...p, priceRange: [parseInt(e.target.value) || 0, p.priceRange[1]] }))}
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-[#10b981]/30"
                        placeholder="Min"
                      />
                      <span className="text-zinc-600">-</span>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters((p) => ({ ...p, priceRange: [p.priceRange[0], parseInt(e.target.value) || 30000] }))}
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-[#10b981]/30"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Stock filter */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStockOnly}
                        onChange={(e) => setFilters((p) => ({ ...p, inStockOnly: e.target.checked }))}
                        className="w-4 h-4 rounded border-zinc-700 bg-transparent text-[#10b981] focus:ring-[#10b981]/20"
                      />
                      <span className="text-sm text-zinc-500">In Stock Only</span>
                    </label>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Grid content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-zinc-600">
                Showing <span className="text-zinc-400 font-medium">{filteredComponents.length}</span> components
              </p>
            </div>

            {/* Grid */}
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredComponents.map((component, index) => (
                  <AICard
                    key={component.id}
                    component={component}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty state */}
            {filteredComponents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="p-6 bg-white/[0.02] rounded-2xl mb-6 border border-white/[0.06]">
                  <Search className="w-8 h-8 text-zinc-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2">No components found</h3>
                <p className="text-sm text-zinc-500 max-w-md">
                  Try adjusting your filters or search query to find what you&apos;re looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-5 py-2.5 bg-white/[0.03] text-zinc-300 border border-white/[0.08] rounded-xl text-sm font-medium hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
