"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  TrendingUp,
  X,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { hardwareComponents, type HardwareComponent } from "@/data/components";
import Navbar from "@/components/Navbar";

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
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`h-full ${colorClasses[color]} rounded-full`}
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
      return <ArrowUpDown className="w-3 h-3 text-slate-600" />;
    }
    if (sortConfig.direction === "asc") {
      return <ChevronUp className="w-4 h-4 text-emerald-400" />;
    }
    if (sortConfig.direction === "desc") {
      return <ChevronDown className="w-4 h-4 text-emerald-400" />;
    }
    return <ArrowUpDown className="w-3 h-3 text-slate-600" />;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Full Specs Comparison
              </h1>
              <p className="text-slate-400 text-sm">
                Compare {hardwareComponents.length} AI hardware components side-by-side
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              {(["All", "GPU", "CPU"] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {cat === "All" ? (
                    <span className="flex items-center gap-1.5">
                      <Grid3X3 className="w-4 h-4" />
                      All
                    </span>
                  ) : cat === "GPU" ? (
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4" />
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
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                style={{ fontSize: "16px" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Toggle Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Columns</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2 space-y-1">
                  {columns.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => toggleColumn(col.key)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      {col.visible ? (
                        <Eye className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-600" />
                      )}
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-emerald-400 font-semibold">{filteredData.length}</span>
              <span>products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          {/* Horizontal scroll container */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              {/* Sticky Header */}
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
                  {visibleColumns.map((col, index) => (
                    <th
                      key={col.key}
                      className={`px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${
                        index === 0 ? "sticky left-0 z-30 bg-slate-950/95" : ""
                      } ${col.sortable ? "cursor-pointer hover:text-white" : ""}`}
                      style={{ minWidth: col.width }}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-2">
                        {col.label}
                        {col.sortable && getSortIcon(col.key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider sticky right-0 z-30 bg-slate-950/95">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filteredData.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.01 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {visibleColumns.map((col, colIndex) => {
                        // Product Name Column (Sticky)
                        if (col.key === "name") {
                          return (
                            <td
                              key={col.key}
                              className="px-4 py-4 sticky left-0 z-10 bg-slate-900/95 group-hover:bg-slate-900"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                                  {product.category === "GPU" ? (
                                    <HardDrive className="w-5 h-5 text-emerald-400" />
                                  ) : (
                                    <Cpu className="w-5 h-5 text-blue-400" />
                                  )}
                                </div>
                                <div>
                                  <Link
                                    href={`/product/${product.id}`}
                                    className="font-medium text-white hover:text-emerald-400 transition-colors"
                                  >
                                    {product.name}
                                  </Link>
                                  <p className="text-xs text-slate-500">{product.id}</p>
                                </div>
                              </div>
                            </td>
                          );
                        }

                        // Category Column
                        if (col.key === "category") {
                          return (
                            <td key={col.key} className="px-4 py-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  product.category === "GPU"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-blue-500/10 text-blue-400"
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
                            <td key={col.key} className="px-4 py-4">
                              <span className="text-sm text-slate-300">{product.brand}</span>
                            </td>
                          );
                        }

                        // Price Column with color coding
                        if (col.key === "price") {
                          return (
                            <td key={col.key} className="px-4 py-4">
                              <div>
                                <span className="font-semibold text-emerald-400">
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
                            <td key={col.key} className="px-4 py-4">
                              <div>
                                <span className="text-sm text-slate-300 font-medium">
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
                            <td key={col.key} className="px-4 py-4">
                              <div>
                                <span className="text-sm text-slate-300 font-medium">
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
                            <td key={col.key} className="px-4 py-4">
                              <div>
                                <span className="text-sm text-slate-300">
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
                            <td key={col.key} className="px-4 py-4">
                              <div>
                                <span
                                  className={`font-semibold ${
                                    product.aiScore >= 90
                                      ? "text-emerald-400"
                                      : product.aiScore >= 70
                                      ? "text-blue-400"
                                      : "text-slate-400"
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
                            <td key={col.key} className="px-4 py-4">
                              <span className="text-sm text-slate-300">
                                {product.specs.architecture || "N/A"}
                              </span>
                            </td>
                          );
                        }

                        return <td key={col.key} className="px-4 py-4">-</td>;
                      })}

                      {/* Actions Column (Sticky Right) */}
                      <td className="px-4 py-4 sticky right-0 z-10 bg-slate-900/95 group-hover:bg-slate-900">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${product.id}`}
                            className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded text-sm font-medium transition-colors"
                          >
                            View
                          </Link>
                          <a
                            href={product.affiliateLinks.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded text-sm transition-colors"
                          >
                            <DollarSign className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No products found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
