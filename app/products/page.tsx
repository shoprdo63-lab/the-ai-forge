"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ExternalLink, 
  ShoppingCart, 
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  Cpu,
  X
} from "lucide-react";
import { hardwareComponents, type HardwareComponent, type Category } from "@/data/components";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ============================================
// FILTER TYPES & CONSTANTS
// ============================================

interface Filters {
  vramRange: [number, number];
  priceRange: [number, number];
  tflopsRange: [number, number];
  selectedManufacturers: string[];
  selectedCategories: Category[];
  searchQuery: string;
}

const MANUFACTURERS = ["NVIDIA", "AMD", "Intel", "ASUS", "MSI", "Gigabyte"];
const CATEGORIES: Category[] = ["GPU", "CPU", "Motherboard", "RAM", "Storage", "PSU", "Cooling"];

const VRAM_MIN = 0;
const VRAM_MAX = 80;
const PRICE_MIN = 0;
const PRICE_MAX = 30000;
const TFLOPS_MIN = 0;
const TFLOPS_MAX = 1000;

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractVram(specs: HardwareComponent["specs"]): number {
  if (!specs.vram) return 0;
  const match = specs.vram.match(/(\d+)GB/);
  return match ? parseInt(match[1], 10) : 0;
}

function extractTflops(specs: HardwareComponent["specs"]): number {
  if (!specs.tflops) return 0;
  const match = specs.tflops.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function getBestPriceLink(component: HardwareComponent): string {
  // Prefer direct links, fallback to affiliate search
  return component.directLinks?.amazon || component.affiliateLinks.amazon;
}

// ============================================
// POWER FILTER SIDEBAR COMPONENT
// ============================================

function PowerFilterSidebar({
  filters,
  setFilters,
  resultCount,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resultCount: number;
}) {
  const [expandedSections, setExpandedSections] = useState({
    vram: true,
    price: true,
    manufacturer: true,
    tflops: true,
    category: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({
      vramRange: [VRAM_MIN, VRAM_MAX],
      priceRange: [PRICE_MIN, PRICE_MAX],
      tflopsRange: [TFLOPS_MIN, TFLOPS_MAX],
      selectedManufacturers: [],
      selectedCategories: [],
      searchQuery: "",
    });
  };

  const hasActiveFilters = 
    filters.vramRange[0] > VRAM_MIN || 
    filters.vramRange[1] < VRAM_MAX ||
    filters.priceRange[0] > PRICE_MIN || 
    filters.priceRange[1] < PRICE_MAX ||
    filters.tflopsRange[0] > TFLOPS_MIN || 
    filters.tflopsRange[1] < TFLOPS_MAX ||
    filters.selectedManufacturers.length > 0 ||
    filters.selectedCategories.length > 0 ||
    filters.searchQuery.length > 0;

  return (
    <aside className="w-72 shrink-0 bg-[#0a0a0f] border-r border-white/10 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Power Filter
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-8 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3 h-3 text-zinc-500 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4 border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Category
          </span>
          {expandedSections.category ? (
            <ChevronUp className="w-3 h-3 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={filters.selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    setFilters((prev) => ({
                      ...prev,
                      selectedCategories: checked
                        ? [...prev.selectedCategories, category]
                        : prev.selectedCategories.filter((c) => c !== category),
                    }));
                  }}
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* VRAM Slider - GPU Only */}
      <div className="mb-4 border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection("vram")}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            VRAM (GB)
          </span>
          {expandedSections.vram ? (
            <ChevronUp className="w-3 h-3 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          )}
        </button>
        {expandedSections.vram && (
          <div className="space-y-3">
            <Slider
              value={filters.vramRange}
              min={VRAM_MIN}
              max={VRAM_MAX}
              step={1}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, vramRange: value as [number, number] }))
              }
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>{filters.vramRange[0]}GB</span>
              <span>{filters.vramRange[1]}GB</span>
            </div>
          </div>
        )}
      </div>

      {/* Price Slider */}
      <div className="mb-4 border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Price Range
          </span>
          {expandedSections.price ? (
            <ChevronUp className="w-3 h-3 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <Slider
              value={filters.priceRange}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
              }
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>${filters.priceRange[0].toLocaleString()}</span>
              <span>${filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* TFLOPS Slider - AI Performance */}
      <div className="mb-4 border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection("tflops")}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            AI Performance (TFLOPS)
          </span>
          {expandedSections.tflops ? (
            <ChevronUp className="w-3 h-3 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          )}
        </button>
        {expandedSections.tflops && (
          <div className="space-y-3">
            <Slider
              value={filters.tflopsRange}
              min={TFLOPS_MIN}
              max={TFLOPS_MAX}
              step={10}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, tflopsRange: value as [number, number] }))
              }
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>{filters.tflopsRange[0]}</span>
              <span>{filters.tflopsRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Manufacturer Checkboxes */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("manufacturer")}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Manufacturer
          </span>
          {expandedSections.manufacturer ? (
            <ChevronUp className="w-3 h-3 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          )}
        </button>
        {expandedSections.manufacturer && (
          <div className="space-y-2">
            {MANUFACTURERS.map((manufacturer) => (
              <label key={manufacturer} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={filters.selectedManufacturers.includes(manufacturer)}
                  onCheckedChange={(checked) => {
                    setFilters((prev) => ({
                      ...prev,
                      selectedManufacturers: checked
                        ? [...prev.selectedManufacturers, manufacturer]
                        : prev.selectedManufacturers.filter((m) => m !== manufacturer),
                    }));
                  }}
                />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {manufacturer}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-zinc-500 text-center">
          Showing <span className="text-emerald-400 font-semibold">{resultCount}</span> products
        </p>
      </div>
    </aside>
  );
}

// ============================================
// NASA-GRADE TABLE COMPONENT
// ============================================

function ProductTable({
  products,
}: {
  products: HardwareComponent[];
}) {
  const router = useRouter();

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="border-b border-white/10 hover:bg-transparent">
            <TableHead className="w-12 px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Rank
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Product
            </TableHead>
            <TableHead className="w-24 px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
              VRAM
            </TableHead>
            <TableHead className="w-24 px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
              CUDA
            </TableHead>
            <TableHead className="w-24 px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
              TDP
            </TableHead>
            <TableHead className="w-28 px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
              AI Score
            </TableHead>
            <TableHead className="w-24 px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">
              Price
            </TableHead>
            <TableHead className="w-36 px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            const vram = extractVram(product.specs);
            const tflops = extractTflops(product.specs);
            const isTopPick = index < 3;

            return (
              <TableRow
                key={product.id}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <TableCell className="px-4 py-3">
                  {isTopPick ? (
                    <span className={`
                      inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold
                      ${index === 0 ? "bg-yellow-500/20 text-yellow-400" : ""}
                      ${index === 1 ? "bg-zinc-500/20 text-zinc-300" : ""}
                      ${index === 2 ? "bg-amber-700/20 text-amber-600" : ""}
                    `}>
                      {index + 1}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600 font-mono">{index + 1}</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <Link
                        href={`/product/${product.id}`}
                        className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-zinc-500">{product.brand}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className="text-sm text-zinc-300 font-mono">
                    {vram > 0 ? `${vram}GB` : "-"}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className="text-sm text-zinc-300 font-mono">
                    {product.specs.cuda || "-"}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className="text-sm text-zinc-300 font-mono">
                    {product.specs.tdp || "-"}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${product.aiScore}%` }}
                      />
                    </div>
                    <span className="text-sm text-emerald-400 font-mono">
                      {product.aiScore}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-emerald-400 font-mono">
                    ${product.price.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={getBestPriceLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff9900] hover:bg-[#ff8800] text-white text-xs font-medium rounded transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      View Deal
                    </Link>
                    <Link
                      href={`/compare?id1=${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white rounded transition-colors"
                      title="Compare"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({
    vramRange: [VRAM_MIN, VRAM_MAX],
    priceRange: [PRICE_MIN, PRICE_MAX],
    tflopsRange: [TFLOPS_MIN, TFLOPS_MAX],
    selectedManufacturers: [],
    selectedCategories: [],
    searchQuery: "",
  });

  // Filter logic
  const filteredProducts = useMemo(() => {
    return hardwareComponents.filter((product) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(product.category)) return false;
      }

      // Manufacturer filter
      if (filters.selectedManufacturers.length > 0) {
        if (!filters.selectedManufacturers.includes(product.brand)) return false;
      }

      // VRAM filter (for GPUs)
      if (product.category === "GPU") {
        const vram = extractVram(product.specs);
        if (vram < filters.vramRange[0] || vram > filters.vramRange[1]) return false;
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // TFLOPS filter (for GPUs)
      if (product.category === "GPU") {
        const tflops = extractTflops(product.specs);
        if (tflops > 0 && (tflops < filters.tflopsRange[0] || tflops > filters.tflopsRange[1])) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Sort by AI Score descending
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.aiScore - a.aiScore);
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-lg font-bold text-white hover:text-emerald-400 transition-colors"
            >
              AI Forge
            </Link>
            <span className="text-zinc-600">/</span>
            <h1 className="text-sm font-medium text-zinc-300">
              PCPartPicker for AI Hardware
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/compare"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/builder"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Builder
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        <PowerFilterSidebar
          filters={filters}
          setFilters={setFilters}
          resultCount={sortedProducts.length}
        />

        <main className="flex-1 p-6 overflow-x-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              AI Hardware Database
            </h2>
            <p className="text-sm text-zinc-500">
              Professional-grade hardware comparison for AI/ML workloads. 
              Filter by VRAM, price, manufacturer, and AI performance.
            </p>
          </div>

          {sortedProducts.length > 0 ? (
            <ProductTable products={sortedProducts} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
              <p className="text-sm text-zinc-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
