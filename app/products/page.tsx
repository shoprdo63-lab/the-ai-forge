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
  X,
  Monitor,
  Cpu
} from "lucide-react";
import { hardwareComponents, type HardwareComponent } from "@/data/components";
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
  selectedMemory: string[];
  priceRange: [number, number];
  selectedManufacturers: string[];
  searchQuery: string;
}

const MANUFACTURERS = ["NVIDIA", "AMD", "Intel"];
const MEMORY_SIZES = ["8GB", "12GB", "16GB", "20GB", "24GB", "32GB", "48GB", "80GB"];

const PRICE_MIN = 0;
const PRICE_MAX = 30000;

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractVram(specs: HardwareComponent["specs"]): number {
  if (!specs.vram) return 0;
  const match = specs.vram.match(/(\d+)GB/);
  return match ? parseInt(match[1], 10) : 0;
}

function formatClockSpeed(specs: HardwareComponent["specs"]): string {
  if (specs.clock) return specs.clock;
  if (specs.cuda) return `${specs.cuda} CUDA`;
  return "-";
}

function formatTDP(specs: HardwareComponent["specs"]): string {
  return specs.tdp || "-";
}

// Amazon Logo SVG
function AmazonLogo() {
  return (
    <svg viewBox="0 0 100 30" className="h-4 w-auto" fill="currentColor">
      <text x="0" y="22" fontSize="14" fontWeight="700">amazon</text>
      <text x="58" y="12" fontSize="8" fill="#ff9900">prime</text>
    </svg>
  );
}

// AliExpress Logo SVG
function AliExpressLogo() {
  return (
    <svg viewBox="0 0 90 20" className="h-4 w-auto" fill="currentColor">
      <text x="0" y="14" fontSize="10" fontWeight="600">AliExpress</text>
    </svg>
  );
}

// ============================================
// PCPartPicker STYLE SIDEBAR
// ============================================

function FilterSidebar({
  filters,
  setFilters,
  resultCount,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resultCount: number;
}) {
  const [expandedSections, setExpandedSections] = useState({
    manufacturer: true,
    memory: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({
      selectedMemory: [],
      priceRange: [PRICE_MIN, PRICE_MAX],
      selectedManufacturers: [],
      searchQuery: "",
    });
  };

  const hasActiveFilters = 
    filters.selectedMemory.length > 0 ||
    filters.priceRange[0] > PRICE_MIN || 
    filters.priceRange[1] < PRICE_MAX ||
    filters.selectedManufacturers.length > 0 ||
    filters.searchQuery.length > 0;

  return (
    <aside className="w-64 shrink-0 bg-[#1a1a1f] border-r border-[#2a2a30] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2a30]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#00d4aa]" />
          <h2 className="text-sm font-semibold text-white">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#888] hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-8 py-2 bg-[#0a0a0f] border border-[#2a2a30] rounded text-sm text-white placeholder-[#666] focus:outline-none focus:border-[#00d4aa]"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3 h-3 text-[#666] hover:text-white" />
            </button>
          )}
        </div>

        {/* Manufacturer Filter */}
        <div className="border-b border-[#2a2a30] pb-4">
          <button
            onClick={() => toggleSection("manufacturer")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">
              Manufacturer
            </span>
            {expandedSections.manufacturer ? (
              <ChevronUp className="w-3 h-3 text-[#666]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#666]" />
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
                  <span className="text-sm text-[#aaa] group-hover:text-white transition-colors">
                    {manufacturer}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Memory Size Filter */}
        <div className="border-b border-[#2a2a30] pb-4">
          <button
            onClick={() => toggleSection("memory")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">
              Memory
            </span>
            {expandedSections.memory ? (
              <ChevronUp className="w-3 h-3 text-[#666]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#666]" />
            )}
          </button>
          {expandedSections.memory && (
            <div className="space-y-2">
              {MEMORY_SIZES.map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={filters.selectedMemory.includes(size)}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        selectedMemory: checked
                          ? [...prev.selectedMemory, size]
                          : prev.selectedMemory.filter((s) => s !== size),
                      }));
                    }}
                  />
                  <span className="text-sm text-[#aaa] group-hover:text-white transition-colors">
                    {size}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">
              Price
            </span>
            {expandedSections.price ? (
              <ChevronUp className="w-3 h-3 text-[#666]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#666]" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <Slider
                value={filters.priceRange}
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={100}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                }
              />
              <div className="flex justify-between text-xs text-[#666] font-mono">
                <span>${filters.priceRange[0].toLocaleString()}</span>
                <span>${filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="pt-4 border-t border-[#2a2a30]">
          <p className="text-xs text-[#666] text-center">
            {resultCount} items found
          </p>
        </div>
      </div>
    </aside>
  );
}

// ============================================
// HIGH-DENSITY PCPartPicker STYLE TABLE
// ============================================

function ProductTable({
  products,
}: {
  products: HardwareComponent[];
}) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-[#1a1a1f] rounded-lg border border-[#2a2a30]">
        <Search className="w-12 h-12 text-[#444] mb-4" />
        <p className="text-[#888]">No products match your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#2a2a30] hover:bg-transparent">
              <TableHead className="w-12 px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                
              </TableHead>
              <TableHead className="px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider text-left">
                Product
              </TableHead>
              <TableHead className="w-24 px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider text-center">
                Chipset
              </TableHead>
              <TableHead className="w-20 px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider text-center">
                Memory
              </TableHead>
              <TableHead className="w-24 px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider text-center">
                Core Clock
              </TableHead>
              <TableHead className="w-16 px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider text-center">
                TDP
              </TableHead>
              <TableHead className="w-28 px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider text-right">
                Price
              </TableHead>
              <TableHead className="w-24 px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider text-center">
                Vendor
              </TableHead>
              <TableHead className="w-20 px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const vram = extractVram(product.specs);
              const clockSpeed = formatClockSpeed(product.specs);
              const tdp = formatTDP(product.specs);
              const bestLink = product.directLinks?.amazon || product.affiliateLinks.amazon;
              const aliLink = product.directLinks?.aliexpress || product.affiliateLinks.aliexpress;

              return (
                <TableRow
                  key={product.id}
                  className="border-b border-[#252525] hover:bg-[#252529] transition-colors cursor-pointer group"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {/* Thumbnail */}
                  <TableCell className="px-3 py-2">
                    <div className="w-10 h-10 bg-[#252525] rounded flex items-center justify-center">
                      {product.category === "GPU" ? (
                        <Monitor className="w-5 h-5 text-[#666]" />
                      ) : (
                        <Cpu className="w-5 h-5 text-[#666]" />
                      )}
                    </div>
                  </TableCell>

                  {/* Product Name */}
                  <TableCell className="px-3 py-2">
                    <div className="flex flex-col">
                      <Link
                        href={`/product/${product.id}`}
                        className="text-[13px] font-medium text-white group-hover:text-[#00d4aa] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {product.name}
                      </Link>
                      <span className="text-[11px] text-[#666]">{product.brand}</span>
                    </div>
                  </TableCell>

                  {/* Chipset/Architecture */}
                  <TableCell className="px-3 py-2 text-center">
                    <span className="text-[12px] text-[#aaa]">
                      {product.specs.architecture || "-"}
                    </span>
                  </TableCell>

                  {/* Memory */}
                  <TableCell className="px-3 py-2 text-center">
                    <span className="text-[12px] text-[#aaa] font-mono">
                      {vram > 0 ? `${vram}GB` : "-"}
                    </span>
                  </TableCell>

                  {/* Core Clock */}
                  <TableCell className="px-3 py-2 text-center">
                    <span className="text-[12px] text-[#aaa] font-mono">
                      {clockSpeed}
                    </span>
                  </TableCell>

                  {/* TDP */}
                  <TableCell className="px-3 py-2 text-center">
                    <span className="text-[12px] text-[#aaa] font-mono">
                      {tdp}
                    </span>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="px-3 py-2 text-right">
                    <span className="text-[13px] font-semibold text-[#00d4aa] font-mono">
                      ${product.price.toLocaleString()}
                    </span>
                  </TableCell>

                  {/* Vendor Icons */}
                  <TableCell className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={bestLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#ff9900] hover:opacity-80 transition-opacity"
                        title="Amazon"
                      >
                        <AmazonLogo />
                      </Link>
                      <Link
                        href={aliLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#ff4747] hover:opacity-80 transition-opacity"
                        title="AliExpress"
                      >
                        <AliExpressLogo />
                      </Link>
                    </div>
                  </TableCell>

                  {/* Action Button */}
                  <TableCell className="px-3 py-2">
                    <Link
                      href={bestLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#2a2a30] hover:bg-[#00d4aa] hover:text-[#0a0a0f] text-[#aaa] text-[11px] font-medium rounded transition-all"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Buy
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden">
        {products.map((product) => {
          const vram = extractVram(product.specs);
          const bestLink = product.directLinks?.amazon || product.affiliateLinks.amazon;

          return (
            <div
              key={product.id}
              className="p-4 border-b border-[#2a2a30] hover:bg-[#252529] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#252525] rounded flex items-center justify-center shrink-0">
                  {product.category === "GPU" ? (
                    <Monitor className="w-6 h-6 text-[#666]" />
                  ) : (
                    <Cpu className="w-6 h-6 text-[#666]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${product.id}`}
                    className="text-sm font-medium text-white hover:text-[#00d4aa] transition-colors block truncate"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-[#666] mb-2">{product.brand}</p>
                  <div className="flex items-center gap-3 text-xs text-[#888]">
                    {vram > 0 && <span className="font-mono">{vram}GB</span>}
                    {product.specs.architecture && (
                      <span>{product.specs.architecture}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-semibold text-[#00d4aa] font-mono">
                      ${product.price.toLocaleString()}
                    </span>
                    <Link
                      href={bestLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#2a2a30] text-[#aaa] text-xs rounded"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({
    selectedMemory: [],
    priceRange: [PRICE_MIN, PRICE_MAX],
    selectedManufacturers: [],
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
          product.brand.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Manufacturer filter
      if (filters.selectedManufacturers.length > 0) {
        if (!filters.selectedManufacturers.includes(product.brand)) return false;
      }

      // Memory filter
      if (filters.selectedMemory.length > 0) {
        const vram = extractVram(product.specs);
        const hasMatchingMemory = filters.selectedMemory.some((mem) => {
          const memSize = parseInt(mem.replace("GB", ""), 10);
          return vram === memSize;
        });
        if (!hasMatchingMemory) return false;
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Sort by price ascending (PCPartPicker style)
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => a.price - b.price);
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f0f13]/95 backdrop-blur border-b border-[#2a2a30]">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-base font-bold text-white hover:text-[#00d4aa] transition-colors"
            >
              AI Forge
            </Link>
            <span className="text-[#444]">|</span>
            <h1 className="text-sm font-medium text-[#888]">
              Hardware Database
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/compare"
              className="text-sm text-[#888] hover:text-white transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/builder"
              className="text-sm text-[#888] hover:text-white transition-colors"
            >
              Builder
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          resultCount={sortedProducts.length}
        />

        <main className="flex-1 p-4 min-w-0">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-1">
              AI Hardware Components
            </h2>
            <p className="text-sm text-[#666]">
              Compare GPUs, CPUs, and components for AI/ML workloads
            </p>
          </div>

          <ProductTable products={sortedProducts} />
        </main>
      </div>
    </div>
  );
}
