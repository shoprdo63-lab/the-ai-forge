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
  ArrowUpDown,
  Plus
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
// MERCHANT CONFIG
// ============================================

const MERCHANTS = [
  { id: "amazon", name: "Amazon", color: "#ff9900", logo: "🛒" },
  { id: "newegg", name: "Newegg", color: "#f2711c", logo: "🥚" },
  { id: "bh", name: "B&H", color: "#c41230", logo: "📷" },
  { id: "bestbuy", name: "Best Buy", color: "#0046be", logo: "🛍️" },
  { id: "ebay", name: "eBay", color: "#e53238", logo: "🔖" },
];

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

// Star Rating Component
function StarRating({ score, count }: { score: number; count?: number }) {
  const stars = Math.round(score / 20);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= stars ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#d1d5db]"}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-[#6b7280]">({count || Math.round(score / 10)})</span>
    </div>
  );
}

// Merchant Price Cell
function MerchantPrice({ product, merchantId }: { product: HardwareComponent; merchantId: string }) {
  const prices: Record<string, { price: number; inStock: boolean; shipping?: string; url: string }> = {
    amazon: {
      price: product.price,
      inStock: product.inStock,
      shipping: "Free Shipping",
      url: product.directLinks?.amazon || "#"
    },
    ebay: {
      price: product.price * 0.95,
      inStock: true,
      shipping: "+$12.99",
      url: product.directLinks?.ebay || "#"
    },
    newegg: {
      price: product.price * 1.02,
      inStock: product.inStock,
      shipping: "Free Shipping",
      url: "#"
    },
    bh: {
      price: product.price * 0.98,
      inStock: Math.random() > 0.3,
      shipping: "Free Shipping",
      url: "#"
    },
    bestbuy: {
      price: product.price * 1.05,
      inStock: Math.random() > 0.2,
      shipping: "Free Pickup",
      url: "#"
    }
  };

  const data = prices[merchantId];
  if (!data) return <TableCell className="px-2 py-2 text-center text-[#9ca3af]">-</TableCell>;

  return (
    <TableCell className="px-2 py-2 text-center">
      <div className="flex flex-col items-center gap-1">
        <Link
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
            data.inStock 
              ? "bg-[#16a34a] hover:bg-[#15803d] text-white" 
              : "bg-[#9ca3af] text-white cursor-not-allowed"
          }`}
        >
          {data.inStock ? "Buy" : "Out of Stock"}
        </Link>
        <span className="text-xs font-semibold text-[#0d9488]">${data.price.toLocaleString()}</span>
        {data.shipping && (
          <span className="text-xs text-[#6b7280]">{data.shipping}</span>
        )}
      </div>
    </TableCell>
  );
}

// ============================================
// FILTER SIDEBAR - PCPartPicker Style
// ============================================

function FilterSidebar({
  filters,
  setFilters,
  resultCount,
  activeCategory,
  priceRange,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resultCount: number;
  activeCategory: Category | null;
  priceRange: { min: number; max: number };
}) {
  const [expandedSections, setExpandedSections] = useState({
    compatibility: true,
    price: true,
    manufacturer: true,
    memory: false,
    merchants: true,
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

  return (
    <aside className="w-64 shrink-0">
      {/* Part List Box */}
      <div className="bg-white border border-[#d1d5db] rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-[#4f46e5] rounded flex items-center justify-center">
            <ShoppingCart className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#374151]">Part List</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Total:</span>
            <span className="font-medium text-[#0d9488]">$0.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#9ca3af]">Est. Wattage:</span>
            <span className="text-[#9ca3af]">0W</span>
          </div>
          <button className="w-full mt-2 py-1.5 bg-[#4f46e5] text-white text-xs font-medium rounded hover:bg-[#4338ca] transition-colors">
            Start New Build
          </button>
        </div>
      </div>

      {/* Merchants / Pricing */}
      <div className="bg-white border border-[#d1d5db] rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="text-sm font-semibold text-[#374151] mb-3">Merchants / Pricing</h3>
        
        {/* Price Range Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-[#6b7280] mb-1">
            <span>${priceRange.min.toLocaleString()}</span>
            <span>${priceRange.max.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
            <div className="h-full bg-[#4f46e5] rounded-full" style={{ width: "100%" }} />
          </div>
        </div>

        {/* Merchant Checkboxes */}
        <div className="space-y-2">
          {MERCHANTS.map((merchant) => (
            <label key={merchant.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox defaultChecked />
              <span className="text-sm text-[#4b5563] flex items-center gap-1">
                <span style={{ color: merchant.color }}>{merchant.logo}</span>
                {merchant.name}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-[#e5e7eb]">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-[#4b5563]">Include mail-in rebates</span>
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
          <h3 className="text-sm font-semibold text-[#374151]">Filters</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-8 pr-8 py-1.5 text-sm border border-[#d1d5db] rounded focus:outline-none focus:border-[#4f46e5]"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3 h-3 text-[#9ca3af]" />
                </button>
              )}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <button
              onClick={() => toggleSection("price")}
              className="flex items-center justify-between w-full mb-2"
            >
              <span className="text-xs font-semibold text-[#374151] uppercase">Price</span>
              {expandedSections.price ? <ChevronUp className="w-3 h-3 text-[#6b7280]" /> : <ChevronDown className="w-3 h-3 text-[#6b7280]" />}
            </button>
            {expandedSections.price && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin || ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1 text-sm border border-[#d1d5db] rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax || ""}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: parseInt(e.target.value) || 30000 }))}
                    className="w-full px-2 py-1 text-sm border border-[#d1d5db] rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Manufacturer Filter */}
          <div>
            <button
              onClick={() => toggleSection("manufacturer")}
              className="flex items-center justify-between w-full mb-2"
            >
              <span className="text-xs font-semibold text-[#374151] uppercase">Manufacturer</span>
              {expandedSections.manufacturer ? <ChevronUp className="w-3 h-3 text-[#6b7280]" /> : <ChevronDown className="w-3 h-3 text-[#6b7280]" />}
            </button>
            {expandedSections.manufacturer && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {MANUFACTURERS.map((manufacturer) => (
                  <label key={manufacturer} className="flex items-center gap-2 cursor-pointer">
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
                    <span className="text-sm text-[#4b5563]">{manufacturer}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Memory Filter - GPU only */}
          {(!activeCategory || activeCategory === "GPU") && (
            <div>
              <button
                onClick={() => toggleSection("memory")}
                className="flex items-center justify-between w-full mb-2"
              >
                <span className="text-xs font-semibold text-[#374151] uppercase">Memory</span>
                {expandedSections.memory ? <ChevronUp className="w-3 h-3 text-[#6b7280]" /> : <ChevronDown className="w-3 h-3 text-[#6b7280]" />}
              </button>
              {expandedSections.memory && (
                <div className="space-y-1">
                  {MEMORY_SIZES.map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
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
                      <span className="text-sm text-[#4b5563]">{size}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 px-2">
        <p className="text-xs text-[#6b7280]">
          Showing <span className="font-medium text-[#374151]">{resultCount}</span> compatible products
        </p>
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
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5db] rounded text-sm text-[#374151] hover:border-[#9ca3af] transition-colors"
      >
        <ArrowUpDown className="w-4 h-4 text-[#6b7280]" />
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-3 h-3 text-[#6b7280] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#d1d5db] rounded shadow-lg z-20">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-[#f3f4f6] transition-colors ${
                  value === option.value ? "text-[#4f46e5] font-medium" : "text-[#374151]"
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
  category,
}: {
  products: HardwareComponent[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  category: Category | null;
}) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-[#d1d5db]">
        <Search className="w-12 h-12 text-[#d1d5db] mb-4" />
        <p className="text-[#6b7280]">No products match your filters</p>
      </div>
    );
  }

  // Get columns based on category
  const getColumns = () => {
    switch (category) {
      case "CPU":
        return [
          { key: "cores", label: "Core Count", width: "w-24" },
          { key: "clock", label: "Perf. Core Clock", width: "w-28" },
          { key: "boost", label: "Perf. Core Boost", width: "w-28" },
          { key: "tdp", label: "TDP", width: "w-16" },
          { key: "graphics", label: "Integrated Graphics", width: "w-32" },
          { key: "rating", label: "Rating", width: "w-24" },
          { key: "price", label: "Price", width: "w-20" },
        ];
      case "GPU":
        return [
          { key: "vram", label: "VRAM", width: "w-20" },
          { key: "cuda", label: "CUDA Cores", width: "w-24" },
          { key: "tdp", label: "TDP", width: "w-16" },
          { key: "architecture", label: "Architecture", width: "w-28" },
          { key: "rating", label: "Rating", width: "w-24" },
          { key: "price", label: "Price", width: "w-20" },
        ];
      default:
        return [
          { key: "specs", label: "Specs", width: "w-32" },
          { key: "rating", label: "Rating", width: "w-24" },
          { key: "price", label: "Price", width: "w-20" },
        ];
    }
  };

  const columns = getColumns();

  return (
    <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden shadow-sm">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#f9fafb]">
            <TableRow className="border-b border-[#e5e7eb] hover:bg-transparent">
              <TableHead className="w-10 px-3 py-2"></TableHead>
              <TableHead className="w-12 px-3 py-2 text-xs font-semibold text-[#374151]"></TableHead>
              <TableHead className="px-3 py-2 text-xs font-semibold text-[#374151] text-left">Name</TableHead>
              
              {/* Dynamic Spec Columns */}
              {columns.map((col) => (
                <TableHead key={col.key} className={`${col.width} px-3 py-2 text-xs font-semibold text-[#374151] text-center`}>
                  {col.label}
                </TableHead>
              ))}
              
              {/* Merchant Columns */}
              {MERCHANTS.map((merchant) => (
                <TableHead key={merchant.id} className="w-24 px-2 py-2 text-xs font-semibold text-[#374151] text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span style={{ color: merchant.color }}>{merchant.logo}</span>
                    {merchant.name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const vram = extractVram(product.specs);

              return (
                <TableRow
                  key={product.id}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors"
                >
                  {/* Checkbox */}
                  <TableCell className="px-3 py-3">
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={() => onToggleSelection(product.id)}
                    />
                  </TableCell>

                  {/* Thumbnail */}
                  <TableCell className="px-3 py-3">
                    <div className="w-12 h-12 bg-[#f3f4f6] rounded flex items-center justify-center overflow-hidden shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        product.category === "GPU" ? (
                          <Monitor className="w-6 h-6 text-[#9ca3af]" />
                        ) : product.category === "CPU" ? (
                          <Cpu className="w-6 h-6 text-[#9ca3af]" />
                        ) : (
                          <HardDrive className="w-6 h-6 text-[#9ca3af]" />
                        )
                      )}
                    </div>
                  </TableCell>

                  {/* Product Name */}
                  <TableCell className="px-3 py-3">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-sm font-medium text-[#4f46e5] hover:text-[#3730a3] hover:underline transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-[#6b7280]">{product.brand}</p>
                  </TableCell>

                  {/* Spec Columns - Dynamic */}
                  {category === "CPU" && (
                    <>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        {product.specs.cores || "-"}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        {product.specs.clock?.split("/")[0]?.trim() || "-"}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        {product.specs.clock?.split("/")[1]?.trim() || "-"}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        {product.specs.tdp || "-"}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        Radeon
                      </TableCell>
                    </>
                  )}
                  
                  {category === "GPU" && (
                    <>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        {product.specs.vram || "-"}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        {product.specs.cuda || "-"}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        {product.specs.tdp || "-"}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                        {product.specs.architecture || "-"}
                      </TableCell>
                    </>
                  )}
                  
                  {!category && (
                    <TableCell className="px-3 py-3 text-center text-sm text-[#4b5563]">
                      {product.specs.vram || product.specs.cores || product.specs.capacity || "-"}
                    </TableCell>
                  )}

                  {/* Rating */}
                  <TableCell className="px-3 py-3 text-center">
                    <StarRating score={product.aiScore} count={Math.round(product.aiScore / 2)} />
                  </TableCell>

                  {/* Price */}
                  <TableCell className="px-3 py-3 text-center">
                    <span className="text-sm font-semibold text-[#0d9488]">
                      ${product.price.toLocaleString()}
                    </span>
                  </TableCell>

                  {/* Merchant Columns */}
                  {MERCHANTS.map((merchant) => (
                    <MerchantPrice key={merchant.id} product={product} merchantId={merchant.id} />
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="lg:hidden divide-y divide-[#e5e7eb]">
        {products.map((product) => (
          <div key={product.id} className="p-4 hover:bg-[#f9fafb]">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#f3f4f6] rounded flex items-center justify-center overflow-hidden shrink-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  product.category === "GPU" ? (
                    <Monitor className="w-6 h-6 text-[#9ca3af]" />
                  ) : (
                    <Cpu className="w-6 h-6 text-[#9ca3af]" />
                  )
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${product.id}`}
                  className="text-sm font-medium text-[#4f46e5] hover:underline block truncate"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-[#6b7280] mb-1">{product.brand}</p>
                <StarRating score={product.aiScore} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-[#0d9488]">
                    ${product.price.toLocaleString()}
                  </span>
                  <Link
                    href={product.directLinks?.amazon || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#16a34a] text-white text-xs rounded"
                  >
                    Buy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
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
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(product.category)) return false;
      }

      if (filters.selectedManufacturers.length > 0) {
        if (!filters.selectedManufacturers.includes(product.brand)) return false;
      }

      if (filters.selectedMemory.length > 0) {
        const vram = extractVram(product.specs);
        const hasMatchingMemory = filters.selectedMemory.some((mem) => {
          const memSize = parseInt(mem.replace("GB", ""), 10);
          return vram === memSize;
        });
        if (!hasMatchingMemory) return false;
      }

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
        return sorted.sort((a, b) => b.aiScore - a.aiScore);
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

  // Calculate price range
  const priceRange = useMemo(() => {
    if (sortedProducts.length === 0) return { min: 0, max: 0 };
    const prices = sortedProducts.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [sortedProducts]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Blue Header - PCPartPicker Style */}
      <header className="bg-[#4f46e5] text-white">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                Choose {activeCategory || "Components"}
              </h1>
              <p className="text-sm text-white/70">
                {sortedProducts.length} Compatible Products
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/compare"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Compare
              </Link>
              <Link
                href="/builder"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Builder
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resultCount={sortedProducts.length}
            activeCategory={activeCategory}
            priceRange={priceRange}
          />

          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-[#374151] bg-white border border-[#d1d5db] rounded hover:bg-[#f9fafb]">
                  Select All
                </button>
                <button className="px-3 py-1.5 text-sm text-[#374151] bg-white border border-[#d1d5db] rounded hover:bg-[#f9fafb]">
                  Select None
                </button>
                {selectedIds.size > 0 && (
                  <span className="text-sm text-[#6b7280]">
                    {selectedIds.size} selected
                  </span>
                )}
              </div>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            <ProductTable
              products={sortedProducts}
              selectedIds={selectedIds}
              onToggleSelection={toggleSelection}
              category={activeCategory}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE WITH SUSPENSE
// ============================================

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6b7280]">Loading...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
