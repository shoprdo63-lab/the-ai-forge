"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ExternalLink, 
  ShoppingCart, 
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Monitor,
  Cpu,
  HardDrive,
  Zap,
  Scale,
  ArrowUpDown
} from "lucide-react";
import { hardwareComponents, type HardwareComponent, type Category } from "@/data/components";
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
// FILTER & SORT TYPES
// ============================================

type SortOption = 
  | "popular" 
  | "price-asc" 
  | "price-desc" 
  | "name-asc" 
  | "name-desc"
  | "vram-asc"
  | "vram-desc"
  | "rating-asc"
  | "rating-desc";

interface Filters {
  selectedCategories: Category[];
  selectedManufacturers: string[];
  selectedMemory: string[];
  priceMin: number;
  priceMax: number;
  searchQuery: string;
}

const MANUFACTURERS = ["NVIDIA", "AMD", "Intel", "ASUS", "MSI", "Gigabyte", "ASRock", "Corsair", "G.Skill", "Kingston", "Samsung", "Western Digital"];
const MEMORY_SIZES = ["8GB", "12GB", "16GB", "20GB", "24GB", "32GB", "48GB", "80GB", "96GB", "256GB"];
const CATEGORIES: Category[] = ["GPU", "CPU", "Motherboard", "RAM", "Storage", "PSU", "Cooling"];

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractVram(specs: HardwareComponent["specs"]): number {
  if (!specs.vram) return 0;
  const match = specs.vram.match(/(\d+)GB/);
  return match ? parseInt(match[1], 10) : 0;
}

function formatPricePerGB(price: number, vram: number): string {
  if (vram === 0) return "-";
  return `$${(price / vram).toFixed(2)}`;
}

// Category-specific column definitions (PCPartPicker style)
const GPU_COLUMNS = [
  { key: "select", label: "", width: "w-8" },
  { key: "name", label: "Name", width: "flex-1" },
  { key: "chipset", label: "Chipset", width: "w-28", align: "center" },
  { key: "memory", label: "Memory", width: "w-20", align: "center" },
  { key: "coreClock", label: "Core Clock", width: "w-28", align: "center" },
  { key: "boostClock", label: "Boost Clock", width: "w-28", align: "center" },
  { key: "tdp", label: "TDP", width: "w-16", align: "center" },
  { key: "rating", label: "Rating", width: "w-20", align: "center" },
  { key: "price", label: "Price", width: "w-24", align: "right" },
  { key: "buy", label: "", width: "w-20", align: "center" },
];

const CPU_COLUMNS = [
  { key: "select", label: "", width: "w-8" },
  { key: "name", label: "Name", width: "flex-1" },
  { key: "coreCount", label: "Core Count", width: "w-24", align: "center" },
  { key: "coreClock", label: "Perf. Core Clock", width: "w-32", align: "center" },
  { key: "boostClock", label: "Boost Clock", width: "w-28", align: "center" },
  { key: "microarchitecture", label: "Microarchitecture", width: "w-28", align: "center" },
  { key: "tdp", label: "TDP", width: "w-16", align: "center" },
  { key: "rating", label: "Rating", width: "w-20", align: "center" },
  { key: "price", label: "Price", width: "w-24", align: "right" },
  { key: "buy", label: "", width: "w-20", align: "center" },
];

const RAM_COLUMNS = [
  { key: "select", label: "", width: "w-8" },
  { key: "name", label: "Name", width: "flex-1" },
  { key: "speed", label: "Speed", width: "w-24", align: "center" },
  { key: "modules", label: "Modules", width: "w-24", align: "center" },
  { key: "pricePerGB", label: "Price / GB", width: "w-24", align: "center" },
  { key: "color", label: "Color", width: "w-20", align: "center" },
  { key: "casLatency", label: "CAS Latency", width: "w-24", align: "center" },
  { key: "rating", label: "Rating", width: "w-20", align: "center" },
  { key: "price", label: "Price", width: "w-24", align: "right" },
  { key: "buy", label: "", width: "w-20", align: "center" },
];

const GENERIC_COLUMNS = [
  { key: "select", label: "", width: "w-8" },
  { key: "name", label: "Name", width: "flex-1" },
  { key: "specs", label: "Specs", width: "w-48", align: "center" },
  { key: "rating", label: "Rating", width: "w-20", align: "center" },
  { key: "price", label: "Price", width: "w-24", align: "right" },
  { key: "buy", label: "", width: "w-20", align: "center" },
];

// ============================================
// FILTER SIDEBAR
// ============================================

function FilterSidebar({
  filters,
  setFilters,
  resultCount,
  activeCategory,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resultCount: number;
  activeCategory: Category | null;
}) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    manufacturer: true,
    memory: false,
    price: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({
      selectedCategories: [],
      selectedManufacturers: [],
      selectedMemory: [],
      priceMin: 0,
      priceMax: 30000,
      searchQuery: "",
    });
  };

  const hasActiveFilters = 
    filters.selectedCategories.length > 0 ||
    filters.selectedManufacturers.length > 0 ||
    filters.selectedMemory.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 30000 ||
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

        {/* Category Filter */}
        <div className="border-b border-[#2a2a30] pb-4">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">
              Category
            </span>
            {expandedSections.category ? (
              <ChevronUp className="w-3 h-3 text-[#666]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#666]" />
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
                  <span className="text-sm text-[#aaa] group-hover:text-white transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
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

        {/* Memory Size Filter - Show only for GPU or when no category selected */}
        {(!activeCategory || activeCategory === "GPU") && (
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
        )}

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
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin || ""}
                  onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1.5 bg-[#0a0a0f] border border-[#2a2a30] rounded text-sm text-white placeholder-[#666]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax || ""}
                  onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: parseInt(e.target.value) || 30000 }))}
                  className="w-full px-2 py-1.5 bg-[#0a0a0f] border border-[#2a2a30] rounded text-sm text-white placeholder-[#666]"
                />
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
// SORT DROPDOWN
// ============================================

function SortDropdown({ value, onChange }: { value: SortOption; onChange: (value: SortOption) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: SortOption; label: string }[] = [
    { value: "popular", label: "Most Popular" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "vram-desc", label: "VRAM (High to Low)" },
    { value: "rating-desc", label: "Rating (High to Low)" },
  ];

  const selectedLabel = options.find((o) => o.value === value)?.label || "Sort";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded text-sm text-white hover:border-[#00d4aa] transition-colors"
      >
        <ArrowUpDown className="w-4 h-4 text-[#666]" />
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-3 h-3 text-[#666] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a1f] border border-[#2a2a30] rounded shadow-xl z-20">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-[#252525] transition-colors ${
                  value === option.value ? "text-[#00d4aa]" : "text-[#aaa]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// PCPartPicker STYLE TABLE
// ============================================

function ProductTable({
  products,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  allSelected,
  sortBy,
}: {
  products: HardwareComponent[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  sortBy: SortOption;
}) {
  const router = useRouter();

  // Determine active category based on products
  const activeCategory = useMemo(() => {
    if (products.length === 0) return null;
    const categories = new Set(products.map((p) => p.category));
    if (categories.size === 1) return Array.from(categories)[0];
    return null;
  }, [products]);

  // Get columns based on active category
  const columns = useMemo(() => {
    switch (activeCategory) {
      case "GPU": return GPU_COLUMNS;
      case "CPU": return CPU_COLUMNS;
      case "RAM": return RAM_COLUMNS;
      default: return GENERIC_COLUMNS;
    }
  }, [activeCategory]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-[#1a1a1f] rounded-lg border border-[#2a2a30]">
        <Search className="w-12 h-12 text-[#444] mb-4" />
        <p className="text-[#888]">No products match your filters</p>
      </div>
    );
  }

  // Generate star rating display
  const StarRating = ({ score }: { score: number }) => {
    const stars = Math.round(score / 20); // Convert 0-100 to 0-5 stars
    return (
      <div className="flex items-center justify-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= stars ? "text-yellow-500 fill-yellow-500" : "text-[#444]"}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1f] border border-[#2a2a30] rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#2a2a30] hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${col.width} px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider ${
                    col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.key === "select" ? (
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={onSelectAll}
                    />
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const vram = extractVram(product.specs);
              const bestLink = product.directLinks?.amazon || product.affiliateLinks.amazon;
              const rating = Math.floor(Math.random() * 30) + 70; // Mock rating 70-100

              return (
                <TableRow
                  key={product.id}
                  className="border-b border-[#252525] hover:bg-[#252529] transition-colors cursor-pointer group"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {/* Select Checkbox */}
                  <TableCell className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={() => onToggleSelection(product.id)}
                    />
                  </TableCell>

                  {/* Product Name with Icon */}
                  <TableCell className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#252525] rounded flex items-center justify-center shrink-0">
                        {product.category === "GPU" ? (
                          <Monitor className="w-5 h-5 text-[#666]" />
                        ) : product.category === "CPU" ? (
                          <Cpu className="w-5 h-5 text-[#666]" />
                        ) : product.category === "RAM" ? (
                          <Zap className="w-5 h-5 text-[#666]" />
                        ) : product.category === "Storage" ? (
                          <HardDrive className="w-5 h-5 text-[#666]" />
                        ) : (
                          <Monitor className="w-5 h-5 text-[#666]" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/product/${product.id}`}
                          className="text-[13px] font-medium text-white group-hover:text-[#00d4aa] transition-colors truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {product.name}
                        </Link>
                        <span className="text-[11px] text-[#666]">{product.brand}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category-specific columns */}
                  {activeCategory === "GPU" && (
                    <>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa]">{product.specs.architecture || "-"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{vram > 0 ? `${vram}GB` : "-"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{product.specs.cuda || "-"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">-</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{product.specs.tdp || "-"}</span>
                      </TableCell>
                    </>
                  )}

                  {activeCategory === "CPU" && (
                    <>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{product.specs.cores || "-"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{product.specs.clock || "-"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">-</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa]">{product.specs.architecture || "-"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{product.specs.tdp || "-"}</span>
                      </TableCell>
                    </>
                  )}

                  {activeCategory === "RAM" && (
                    <>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{product.specs.speed || "-"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{product.specs.capacity || "-"}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{formatPricePerGB(product.price, extractVram(product.specs))}</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa]">-</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center">
                        <span className="text-[12px] text-[#aaa] font-mono">{product.specs.architecture || "-"}</span>
                      </TableCell>
                    </>
                  )}

                  {(!activeCategory || (activeCategory !== "GPU" && activeCategory !== "CPU" && activeCategory !== "RAM")) && (
                    <TableCell className="px-3 py-2 text-center">
                      <span className="text-[12px] text-[#aaa]">
                        {product.specs.vram || product.specs.cores || product.specs.capacity || "-"}
                      </span>
                    </TableCell>
                  )}

                  {/* Rating */}
                  <TableCell className="px-3 py-2">
                    <StarRating score={product.aiScore} />
                  </TableCell>

                  {/* Price */}
                  <TableCell className="px-3 py-2 text-right">
                    <span className="text-[13px] font-semibold text-[#00d4aa] font-mono">
                      ${product.price.toLocaleString()}
                    </span>
                  </TableCell>

                  {/* Buy Button */}
                  <TableCell className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={bestLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#ff9900] hover:bg-[#ff8800] text-white text-[11px] font-medium rounded transition-all"
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
                  ) : product.category === "CPU" ? (
                    <Cpu className="w-6 h-6 text-[#666]" />
                  ) : (
                    <HardDrive className="w-6 h-6 text-[#666]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/product/${product.id}`}
                        className="text-sm font-medium text-white hover:text-[#00d4aa] transition-colors block truncate"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-[#666] mb-2">{product.brand}</p>
                    </div>
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={() => onToggleSelection(product.id)}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#888] mb-2">
                    {vram > 0 && <span className="font-mono">{vram}GB</span>}
                    {product.specs.architecture && <span>{product.specs.architecture}</span>}
                    {product.specs.cores && <span className="font-mono">{product.specs.cores} cores</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#00d4aa] font-mono">
                      ${product.price.toLocaleString()}
                    </span>
                    <Link
                      href={bestLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#ff9900] text-white text-xs rounded"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Buy
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
// MAIN PAGE - WRAPPED IN SUSPENSE
// ============================================

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#666]">Loading...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}

// ============================================
// MAIN PAGE CONTENT
// ============================================

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    selectedCategories: [],
    selectedManufacturers: [],
    selectedMemory: [],
    priceMin: 0,
    priceMax: 30000,
    searchQuery: "",
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  // Get active category from URL or filters
  const activeCategory = useMemo(() => {
    const categoryParam = searchParams.get("category") as Category | null;
    if (categoryParam && CATEGORIES.includes(categoryParam)) return categoryParam;
    if (filters.selectedCategories.length === 1) return filters.selectedCategories[0];
    return null;
  }, [searchParams, filters.selectedCategories]);

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

      // Category filter
      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(product.category)) return false;
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
      if (product.price < filters.priceMin || product.price > filters.priceMax) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "vram-desc":
        return sorted.sort((a, b) => extractVram(b.specs) - extractVram(a.specs));
      case "rating-desc":
        return sorted.sort((a, b) => b.aiScore - a.aiScore);
      default:
        return sorted.sort((a, b) => b.aiScore - a.aiScore); // Most popular = highest AI score
    }
  }, [filteredProducts, sortBy]);

  // Selection handlers
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === sortedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedProducts.map((p) => p.id)));
    }
  };

  const allSelected = sortedProducts.length > 0 && selectedIds.size === sortedProducts.length;

  // Compare handler
  const handleCompare = () => {
    const ids = Array.from(selectedIds).slice(0, 3); // Max 3 products
    if (ids.length >= 2) {
      const params = new URLSearchParams();
      ids.forEach((id, index) => {
        params.set(`id${index + 1}`, id);
      });
      router.push(`/compare?${params.toString()}`);
    }
  };

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
              {activeCategory ? `Choose ${activeCategory}` : "Choose Components"}
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

      {/* Compare Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-[#1a1a1f] border-b border-[#2a2a30] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#888]">
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-[#666] hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCompare}
                disabled={selectedIds.size < 2}
                className="flex items-center gap-2 px-4 py-2 bg-[#00d4aa] hover:bg-[#00b894] disabled:bg-[#2a2a30] disabled:text-[#666] text-[#0a0a0f] text-sm font-medium rounded transition-colors"
              >
                <Scale className="w-4 h-4" />
                Compare Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          resultCount={sortedProducts.length}
          activeCategory={activeCategory}
        />

        <main className="flex-1 p-4 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {activeCategory || "All Components"}
              </h2>
              <p className="text-sm text-[#666]">
                {sortedProducts.length} items
              </p>
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          <ProductTable
            products={sortedProducts}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onSelectAll={selectAll}
            allSelected={allSelected}
            sortBy={sortBy}
          />
        </main>
      </div>
    </div>
  );
}
