"use client";

import { Product } from "@/lib/products";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Crown, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Cpu,
  HardDrive,
  Thermometer,
  DollarSign,
  Award,
  Layers,
  TrendingUp
} from "lucide-react";

interface ComparisonTableProps {
  products: Product[];
  winner: number | null;
}

interface SpecRow {
  label: string;
  key: string;
  icon: React.ReactNode;
  getValue: (p: Product) => string | number;
  higherIsBetter: boolean;
  format?: (val: string | number) => string;
  highlight?: boolean;
}

export function ComparisonTable({ products, winner }: ComparisonTableProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    performance: true,
    specs: true,
    features: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Define spec rows based on product category
  const specRows: SpecRow[] = useMemo(() => {
    const isGPU = products[0]?.category === "GPU";
    const isCPU = products[0]?.category === "CPU";

    const commonRows: SpecRow[] = [
      {
        label: "Price",
        key: "price",
        icon: <DollarSign className="w-4 h-4" />,
        getValue: (p) => p.price,
        higherIsBetter: false,
        format: (val) => `$${Number(val).toLocaleString()}`,
        highlight: true,
      },
      {
        label: "AI Score",
        key: "aiScore",
        icon: <Award className="w-4 h-4" />,
        getValue: (p) => p.aiScore || 0,
        higherIsBetter: true,
        format: (val) => val.toString(),
        highlight: true,
      },
      {
        label: "TDP",
        key: "tdp",
        icon: <Thermometer className="w-4 h-4" />,
        getValue: (p) => {
          const match = p.specs.tdp?.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        },
        higherIsBetter: false,
        format: (val) => `${val}W`,
        highlight: true,
      },
    ];

    if (isGPU) {
      return [
        ...commonRows,
        {
          label: "VRAM",
          key: "vram",
          icon: <Layers className="w-4 h-4" />,
          getValue: (p) => {
            const match = p.specs.vram?.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          },
          higherIsBetter: true,
          format: (val) => `${val}GB`,
          highlight: true,
        },
        {
          label: "CUDA Cores",
          key: "cuda",
          icon: <Cpu className="w-4 h-4" />,
          getValue: (p) => {
            const match = p.specs.cuda?.match(/([\d,]+)/);
            return match ? parseInt(match[1].replace(/,/g, "")) : 0;
          },
          higherIsBetter: true,
          format: (val) => Number(val).toLocaleString(),
          highlight: true,
        },
        {
          label: "Tensor Cores",
          key: "tensor",
          icon: <Zap className="w-4 h-4" />,
          getValue: (p) => {
            const match = p.specs.tensor?.match(/([\d,]+)/);
            return match ? parseInt(match[1].replace(/,/g, "")) : 0;
          },
          higherIsBetter: true,
          format: (val) => Number(val).toLocaleString(),
          highlight: true,
        },
        {
          label: "TFLOPS (FP16)",
          key: "tflops",
          icon: <Zap className="w-4 h-4" />,
          getValue: (p) => {
            const match = p.specs.tflops?.match(/([\d.]+)/);
            return match ? parseFloat(match[1]) : 0;
          },
          higherIsBetter: true,
          format: (val) => `${val} TFLOPS`,
          highlight: true,
        },
        {
          label: "Architecture",
          key: "architecture",
          icon: <Cpu className="w-4 h-4" />,
          getValue: (p) => p.specs.architecture || "N/A",
          higherIsBetter: false,
          format: (val) => val.toString(),
          highlight: false,
        },
        // Enterprise GPU specs
        {
          label: "HBM3e",
          key: "hbmCapacity",
          icon: <Layers className="w-4 h-4" />,
          getValue: (p) => p.specs.hbmCapacity || "N/A",
          higherIsBetter: true,
          format: (val) => val.toString(),
          highlight: true,
        },
        {
          label: "NVLink",
          key: "nvlinkVersion",
          icon: <Zap className="w-4 h-4" />,
          getValue: (p) => p.specs.nvlinkVersion || "N/A",
          higherIsBetter: true,
          format: (val) => val.toString(),
          highlight: false,
        },
        {
          label: "FP8 Perf",
          key: "fp8Performance",
          icon: <TrendingUp className="w-4 h-4" />,
          getValue: (p) => {
            const match = p.specs.fp8Performance?.match(/([\d.]+)/);
            return match ? parseFloat(match[1]) : 0;
          },
          higherIsBetter: true,
          format: (val) => val ? `${val} PFLOPS` : "N/A",
          highlight: true,
        },
        {
          label: "FP16 Perf",
          key: "fp16Performance",
          icon: <TrendingUp className="w-4 h-4" />,
          getValue: (p) => {
            const match = p.specs.fp16Performance?.match(/([\d.]+)/);
            return match ? parseFloat(match[1]) : 0;
          },
          higherIsBetter: true,
          format: (val) => val ? `${val} PFLOPS` : "N/A",
          highlight: true,
        },
      ];
    }

    if (isCPU) {
      return [
        ...commonRows,
        {
          label: "Cores",
          key: "cores",
          icon: <Cpu className="w-4 h-4" />,
          getValue: (p) => {
            const match = p.specs.cores?.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          },
          higherIsBetter: true,
          format: (val) => `${val} cores`,
          highlight: true,
        },
        {
          label: "Threads",
          key: "threads",
          icon: <Layers className="w-4 h-4" />,
          getValue: (p) => {
            const match = p.specs.threads?.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          },
          higherIsBetter: true,
          format: (val) => `${val} threads`,
          highlight: true,
        },
        {
          label: "Boost Clock",
          key: "boostClock",
          icon: <Zap className="w-4 h-4" />,
          getValue: (p) => p.specs.boostClock || "N/A",
          higherIsBetter: true,
          format: (val) => val.toString(),
          highlight: false,
        },
        {
          label: "Socket",
          key: "socket",
          icon: <HardDrive className="w-4 h-4" />,
          getValue: (p) => p.specs.socket || "N/A",
          higherIsBetter: false,
          format: (val) => val.toString(),
          highlight: false,
        },
      ];
    }

    // Generic fallback
    return [
      ...commonRows,
      {
        label: "Memory",
        key: "memory",
        icon: <Layers className="w-4 h-4" />,
        getValue: (p) => p.specs.memory || "N/A",
        higherIsBetter: true,
        format: (val) => val.toString(),
        highlight: false,
      },
    ];
  }, [products]);

  // Calculate winners for each spec
  const winners = useMemo(() => {
    const result: Record<string, number[]> = {};

    specRows.forEach((row) => {
      if (!row.highlight) return;

      const values = products.map((p) => ({
        product: p,
        value: row.getValue(p),
      }));

      // Filter out N/A or 0 values for comparison
      const validValues = values.filter((v) => v.value !== "N/A" && v.value !== 0);
      if (validValues.length === 0) return;

      // Find best value
      const numericValues = validValues.map((v) =>
        typeof v.value === "string" ? parseFloat(v.value) || 0 : v.value
      );

      const bestValue = row.higherIsBetter
        ? Math.max(...numericValues)
        : Math.min(...numericValues);

      // Find all products with best value (handle ties)
      const winnerIndices = validValues
        .filter((v) => {
          const numVal =
            typeof v.value === "string" ? parseFloat(v.value) || 0 : v.value;
          return numVal === bestValue;
        })
        .map((v) => products.findIndex((p) => p.id === v.product.id));

      result[row.key] = winnerIndices;
    });

    return result;
  }, [products, specRows]);

  // Group specs into sections
  const sections = useMemo(() => {
    return {
      performance: {
        title: "Performance Metrics",
        rows: specRows.filter((r) => r.highlight),
      },
      specs: {
        title: "Technical Specifications",
        rows: specRows.filter((r) => !r.highlight),
      },
    };
  }, [specRows]);

  return (
    <div className="space-y-4">
      {Object.entries(sections).map(([sectionKey, section]) => (
        <div
          key={sectionKey}
          className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden"
        >
          {/* Section Header */}
          <button
            onClick={() => toggleSection(sectionKey)}
            className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <span className="font-sans text-sm font-medium text-white">
              {section.title}
            </span>
            {expandedSections[sectionKey] ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* Section Content */}
          {expandedSections[sectionKey] && (
            <div className="divide-y divide-white/5">
              {section.rows.map((row, rowIdx) => {
                const rowWinners = winners[row.key] || [];
                const values = products.map((p) => row.getValue(p));

                return (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: rowIdx * 0.05 }}
                    className="grid"
                    style={{
                      gridTemplateColumns: `120px repeat(${products.length}, 1fr)`,
                    }}
                  >
                    {/* Label Cell */}
                    <div className="p-4 flex items-center gap-2 border-r border-white/5">
                      <span className="text-zinc-500">{row.icon}</span>
                      <span className="text-xs text-zinc-400 uppercase tracking-wider">
                        {row.label}
                      </span>
                    </div>

                    {/* Value Cells */}
                    {products.map((product, idx) => {
                      const value = values[idx];
                      const formattedValue = row.format
                        ? row.format(value)
                        : value.toString();
                      const isWinner = rowWinners.includes(idx);

                      return (
                        <div
                          key={product.id}
                          className={`p-4 flex items-center justify-center ${
                            isWinner
                              ? "bg-emerald-500/[0.08]"
                              : ""
                          }`}
                        >
                          <div className="text-center">
                            <span
                              className={`font-mono text-sm ${
                                isWinner
                                  ? "text-emerald-400 font-semibold"
                                  : "text-zinc-300"
                              }`}
                            >
                              {formattedValue}
                            </span>
                            {isWinner && (
                              <div className="flex items-center justify-center gap-1 mt-1">
                                <Crown className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] text-emerald-500 uppercase tracking-wider">
                                  Best
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {products.map((product, idx) => {
          const productWins = Object.values(winners).filter((w) =>
            w.includes(idx)
          ).length;
          const isOverallWinner = winner === idx + 1;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-2xl border ${
                isOverallWinner
                  ? "bg-emerald-500/[0.08] border-emerald-500/30"
                  : "bg-white/[0.02] border-white/10"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-zinc-500 uppercase mb-1">
                    {product.category}
                  </p>
                  <h4 className="font-sans text-sm font-medium text-white line-clamp-1">
                    {product.name}
                  </h4>
                </div>
                {isOverallWinner && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full">
                    <Crown className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-medium text-emerald-400">
                      Winner
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Specs Won:</span>
                <span
                  className={`font-mono font-semibold ${
                    productWins > 0 ? "text-emerald-400" : "text-zinc-600"
                  }`}
                >
                  {productWins}/{specRows.filter((r) => r.highlight).length}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-zinc-500">AI Score:</span>
                <span className="font-mono font-semibold text-white">
                  {product.aiScore || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/5">
                <span className="text-zinc-500">Price:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  ${product.price.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
