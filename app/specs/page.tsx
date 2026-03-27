"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Filter,
  Grid3X3,
  Cpu,
  HardDrive,
  Zap,
  DollarSign,
  X,
  ArrowUpDown,
  Monitor,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { hardwareComponents, type HardwareComponent } from "@/data/components";

// ============================================
// Types & Interfaces
// ============================================

type Category = "GPU" | "CPU" | "All";
type SortDirection = "asc" | "desc" | null;

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width: string;
}

// ============================================
// Helper Functions
// ============================================

function extractNumber(value: string | undefined): number {
  if (!value) return 0;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

function fuzzySearch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  let queryIndex = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length;
}

// ============================================
// Mini Progress Bar Component
// ============================================

function MiniProgressBar({
  value,
  max,
  color = "emerald",
}: {
  value: number;
  max: number;
  color?: "emerald" | "blue" | "amber";
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  const colorClasses = {
    emerald: "bg-[#16a34a]",
    blue: "bg-[#4f46e5]",
    amber: "bg-[#f59e0b]",
  };

  return (
    <div className="w-full h-1 bg-[#e5e7eb] rounded-full overflow-hidden mt-1">
      <div
        className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// ============================================
// Main Specs Page Component
// ============================================

export default function SpecsPage() {
  // Category filter
  const [category, setCategory] = useState<Category>("All");

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });

  // Column visibility
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "name", label: "Product", visible: true, sortable: true, width: "200px" },
    { key: "category", label: "Type", visible: true, sortable: true, width: "80px" },
    { key: "brand", label: "Brand", visible: true, sortable: true, width: "100px" },
    { key: "price", label: "Price", visible: true, sortable: true, width: "120px" },
    { key: "vram", label: "VRAM", visible: true, sortable: true, width: "100px" },
    { key: "cuda", label: "CUDA Cores", visible: true, sortable: true, width: "120px" },
    { key: "tdp", label: "TDP", visible: true, sortable: true, width: "80px" },
    { key: "aiScore", label: "AI Score", visible: true, sortable: true, width: "100px" },
    { key: "architecture", label: "Arch", visible: false, sortable: true, width: "100px" },
  ]);

  // Toggle column visibility
  const toggleColumn = useCallback((key: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  }, []);

  // Handle sorting
  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : prev.direction === "desc" ? null : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...hardwareComponents];

    // Category filter
    if (category !== "All") {
      data = data.filter((item) => item.category === category);
    }

    // Search filter (fuzzy)
    if (searchQuery) {
      data = data.filter(
        (item) =>
          fuzzySearch(item.name, searchQuery) ||
          fuzzySearch(item.brand, searchQuery) ||
          fuzzySearch(item.category, searchQuery) ||
          fuzzySearch(item.description, searchQuery)
      );
    }

    // Sorting
    if (sortConfig.key && sortConfig.direction) {
      data.sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (sortConfig.key) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "category":
            aValue = a.category;
            bValue = b.category;
            break;
          case "brand":
            aValue = a.brand;
            bValue = b.brand;
            break;
          case "price":
            aValue = a.price;
            bValue = b.price;
            break;
          case "vram":
            aValue = extractNumber(a.specs.vram);
            bValue = extractNumber(b.specs.vram);
            break;
          case "cuda":
            aValue = extractNumber(a.specs.cuda);
            bValue = extractNumber(b.specs.cuda);
            break;
          case "tdp":
            aValue = extractNumber(a.specs.tdp);
            bValue = extractNumber(b.specs.tdp);
            break;
          case "aiScore":
            aValue = a.aiScore;
            bValue = b.aiScore;
            break;
          case "architecture":
            aValue = a.specs.architecture || "";
            bValue = b.specs.architecture || "";
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue as string)
            : (bValue as string).localeCompare(aValue);
        }

        return sortConfig.direction === "asc" ? aValue - (bValue as number) : (bValue as number) - aValue;
      });
    }

    return data;
  }, [category, searchQuery, sortConfig]);

  // Calculate max values for progress bars
  const maxValues = useMemo(() => {
    const categoryData = category === "All" ? hardwareComponents : hardwareComponents.filter((i) => i.category === category);
    return {
      vram: Math.max(...categoryData.map((i) => extractNumber(i.specs.vram)), 1),
      cuda: Math.max(...categoryData.map((i) => extractNumber(i.specs.cuda)), 1),
      tdp: Math.max(...categoryData.map((i) => extractNumber(i.specs.tdp)), 1),
      aiScore: Math.max(...categoryData.map((i) => i.aiScore), 1),
      price: Math.max(...categoryData.map((i) => i.price), 1),
    };
  }, [category]);

  // Visible columns
  const visibleColumns = columns.filter((col) => col.visible);

  // Get sort icon
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 text-[#9ca3af]" />;
    }
    if (sortConfig.direction === "asc") {
      return <ChevronUp className="w-4 h-4 text-[#4f46e5]" />;
    }
    if (sortConfig.direction === "desc") {
      return <ChevronDown className="w-4 h-4 text-[#4f46e5]" />;
    }
    return <ArrowUpDown className="w-3 h-3 text-[#9ca3af]" />;
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Blue Header - PCPartPicker Style */}
      <header className="bg-[#4f46e5] text-white">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Full Specs Comparison</h1>
                <p className="text-sm text-white/70">Compare {hardwareComponents.length} AI hardware components</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#d1d5db] shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              {(["All", "GPU", "CPU"] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-[#4f46e5] text-white"
                      : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
                  }`}
                >
                  {cat === "All" ? (
                    <span className="flex items-center gap-1.5">
                      <Grid3X3 className="w-4 h-4" />
                      All
                    </span>
                  ) : cat === "GPU" ? (
                    <span className="flex items-center gap-1.5">
                      <Monitor className="w-4 h-4" />
                      GPUs
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      CPUs
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-9 py-2 bg-white border border-[#d1d5db] rounded-lg text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:border-[#4f46e5] text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Toggle Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#d1d5db] rounded-lg text-[#374151] hover:bg-[#f9fafb] transition-colors text-sm">
                <Filter className="w-4 h-4" />
                <span>Columns</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#d1d5db] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2 space-y-1">
                  {columns.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => toggleColumn(col.key)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                    >
                      {col.visible ? (
                        <Eye className="w-4 h-4 text-[#16a34a]" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-[#9ca3af]" />
                      )}
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
              <span className="text-[#4f46e5] font-semibold">{filteredData.length}</span>
              <span>products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="relative bg-white border border-[#d1d5db] rounded-lg overflow-hidden shadow-sm">
          {/* Horizontal scroll container */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              {/* Sticky Header */}
              <thead className="sticky top-0 z-20">
                <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  {visibleColumns.map((col, index) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-left text-xs font-semibold text-[#374151] uppercase tracking-wider ${
                        index === 0 ? "sticky left-0 z-30 bg-[#f9fafb]" : ""
                      } ${col.sortable ? "cursor-pointer hover:text-[#4f46e5]" : ""}`}
                      style={{ minWidth: col.width }}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-2">
                        {col.label}
                        {col.sortable && getSortIcon(col.key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#374151] uppercase tracking-wider sticky right-0 z-30 bg-[#f9fafb]">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#e5e7eb]">
                {filteredData.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#f9fafb] transition-colors group"
                  >
                    {visibleColumns.map((col, colIndex) => {
                      // Product Name Column (Sticky)
                      if (col.key === "name") {
                        return (
                          <td
                            key={col.key}
                            className="px-4 py-3 sticky left-0 z-10 bg-white group-hover:bg-[#f9fafb]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] flex items-center justify-center">
                                {product.category === "GPU" ? (
                                  <Monitor className="w-5 h-5 text-[#4f46e5]" />
                                ) : (
                                  <Cpu className="w-5 h-5 text-[#0d9488]" />
                                )}
                              </div>
                              <div>
                                <Link
                                  href={`/product/${product.id}`}
                                  className="font-medium text-[#374151] hover:text-[#4f46e5] transition-colors text-sm"
                                >
                                  {product.name}
                                </Link>
                                <p className="text-xs text-[#9ca3af]">{product.id}</p>
                              </div>
                            </div>
                          </td>
                        );
                      }

                      // Category Column
                      if (col.key === "category") {
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                product.category === "GPU"
                                  ? "bg-[#f5f3ff] text-[#4f46e5]"
                                  : "bg-[#f0fdf4] text-[#16a34a]"
                              }`}
                            >
                              {product.category}
                            </span>
                          </td>
                        );
                      }

                      // Brand Column
                      if (col.key === "brand") {
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <span className="text-sm text-[#374151]">{product.brand}</span>
                          </td>
                        );
                      }

                      // Price Column with progress bar
                      if (col.key === "price") {
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <div>
                              <span className="font-semibold text-[#0d9488] text-sm">
                                {formatPrice(product.price)}
                              </span>
                              <MiniProgressBar
                                value={product.price}
                                max={maxValues.price}
                                color="amber"
                              />
                            </div>
                          </td>
                        );
                      }

                      // VRAM Column with progress bar
                      if (col.key === "vram") {
                        const vramValue = extractNumber(product.specs.vram);
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <div>
                              <span className="text-sm text-[#374151] font-medium">
                                {vramValue > 0 ? `${vramValue}GB` : "N/A"}
                              </span>
                              {vramValue > 0 && (
                                <MiniProgressBar
                                  value={vramValue}
                                  max={maxValues.vram}
                                  color="blue"
                                />
                              )}
                            </div>
                          </td>
                        );
                      }

                      // CUDA Cores Column with progress bar
                      if (col.key === "cuda") {
                        const cudaValue = extractNumber(product.specs.cuda);
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <div>
                              <span className="text-sm text-[#374151] font-medium">
                                {cudaValue > 0 ? cudaValue.toLocaleString() : "N/A"}
                              </span>
                              {cudaValue > 0 && (
                                <MiniProgressBar
                                  value={cudaValue}
                                  max={maxValues.cuda}
                                  color="emerald"
                                />
                              )}
                            </div>
                          </td>
                        );
                      }

                      // TDP Column
                      if (col.key === "tdp") {
                        const tdpValue = extractNumber(product.specs.tdp);
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <div>
                              <span className="text-sm text-[#374151]">
                                {tdpValue > 0 ? `${tdpValue}W` : "N/A"}
                              </span>
                              {tdpValue > 0 && (
                                <MiniProgressBar
                                  value={tdpValue}
                                  max={maxValues.tdp}
                                  color="amber"
                                />
                              )}
                            </div>
                          </td>
                        );
                      }

                      // AI Score Column
                      if (col.key === "aiScore") {
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <div>
                              <span
                                className={`font-semibold text-sm ${
                                  product.aiScore >= 90
                                    ? "text-[#16a34a]"
                                    : product.aiScore >= 70
                                    ? "text-[#4f46e5]"
                                    : "text-[#6b7280]"
                                }`}
                              >
                                {product.aiScore}
                              </span>
                              <MiniProgressBar
                                value={product.aiScore}
                                max={100}
                                color="emerald"
                              />
                            </div>
                          </td>
                        );
                      }

                      // Architecture Column
                      if (col.key === "architecture") {
                        return (
                          <td key={col.key} className="px-4 py-3">
                            <span className="text-sm text-[#374151]">
                              {product.specs.architecture || "N/A"}
                            </span>
                          </td>
                        );
                      }

                      return <td key={col.key} className="px-4 py-3">-</td>;
                    })}

                    {/* Actions Column (Sticky Right) */}
                    <td className="px-4 py-3 sticky right-0 z-10 bg-white group-hover:bg-[#f9fafb]">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="px-3 py-1.5 bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded text-sm font-medium transition-colors"
                        >
                          View
                        </Link>
                        <a
                          href={product.affiliateLinks.amazon}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb] rounded text-sm transition-colors"
                        >
                          <DollarSign className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-[#d1d5db] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#374151] mb-2">No products found</h3>
              <p className="text-sm text-[#6b7280]">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
