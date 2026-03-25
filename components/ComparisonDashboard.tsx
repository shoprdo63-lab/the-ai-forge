"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toPng } from "html-to-image";
import {
  X,
  Crown,
  Cpu,
  HardDrive,
  Zap,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  ExternalLink,
  Award,
  BarChart3,
  Sparkles,
  History,
  Share2,
  Download,
  Lightbulb,
  AlertTriangle,
  Check,
  ChevronRight,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import type { HardwareComponent } from "@/data/components";
import Link from "next/link";

// ============================================
// Types & Interfaces
// ============================================

interface ComparisonDashboardProps {
  products: HardwareComponent[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onAddToCompare?: (product: HardwareComponent) => void;
}

interface ComparisonHistoryItem {
  id: string;
  productIds: [string, string];
  productNames: [string, string];
  timestamp: number;
}

interface RadarDataPoint {
  metric: string;
  product1: number;
  product2: number;
  fullMark: number;
}

// ============================================
// Utility Functions
// ============================================

function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

function calculateVRAMPenalty(specs: { vram?: string }): number {
  const match = specs.vram?.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function calculateCUDAPenalty(specs: { cuda?: string }): number {
  if (!specs.cuda) return 0;
  const match = specs.cuda?.match(/([\d,]+)/);
  if (!match) return 0;
  const cuda = parseInt(match[1].replace(/,/g, ""));
  return Math.min(cuda / 100, 100); // Normalize to 0-100
}

function calculateEnergyEfficiency(price: number, specs: { tdp?: string }): number {
  const tdpMatch = specs.tdp?.match(/(\d+)/);
  const tdp = tdpMatch ? parseInt(tdpMatch[1]) : 350;
  // Higher score = more efficient (lower wattage per dollar)
  const efficiency = (price / tdp) * 10;
  return Math.min(efficiency, 100);
}

function calculatePriceToPerformance(price: number, aiScore: number): number {
  if (price === 0) return 0;
  const ratio = (aiScore / price) * 1000;
  return Math.min(ratio * 10, 100);
}

function normalizeScore(score: number, max: number): number {
  return Math.round((score / max) * 100);
}

// ============================================
// Radar Chart Component
// ============================================

function ComparisonRadarChart({
  c1,
  c2,
}: {
  c1: HardwareComponent;
  c2: HardwareComponent;
}) {
  // Calculate metrics
  const data: RadarDataPoint[] = [
    {
      metric: "VRAM",
      product1: normalizeScore(calculateVRAMPenalty(c1.specs), 80),
      product2: normalizeScore(calculateVRAMPenalty(c2.specs), 80),
      fullMark: 100,
    },
    {
      metric: "CUDA/Compute",
      product1: normalizeScore(calculateCUDAPenalty(c1.specs), 100),
      product2: normalizeScore(calculateCUDAPenalty(c2.specs), 100),
      fullMark: 100,
    },
    {
      metric: "Efficiency",
      product1: normalizeScore(calculateEnergyEfficiency(c1.price, c1.specs), 100),
      product2: normalizeScore(calculateEnergyEfficiency(c2.price, c2.specs), 100),
      fullMark: 100,
    },
    {
      metric: "Price/Perf",
      product1: normalizeScore(calculatePriceToPerformance(c1.price, c1.aiScore), 100),
      product2: normalizeScore(calculatePriceToPerformance(c2.price, c2.aiScore), 100),
      fullMark: 100,
    },
    {
      metric: "AI Score",
      product1: c1.aiScore,
      product2: c2.aiScore,
      fullMark: 100,
    },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
          <Radar
            name={c1.name}
            dataKey="product1"
            stroke="#10b981"
            strokeWidth={2}
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Radar
            name={c2.name}
            dataKey="product2"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900/95 backdrop-blur border border-slate-700 rounded-lg p-2 shadow-xl">
                    <p className="text-slate-300 text-xs mb-1">{payload[0].payload.metric}</p>
                    <p className="text-emerald-400 text-xs">{c1.name}: {payload[0].value}</p>
                    <p className="text-blue-400 text-xs">{c2.name}: {payload[1].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// Pros & Cons Analysis
// ============================================

interface ProsCons {
  pros: string[];
  cons: string[];
}

function analyzeProsCons(component: HardwareComponent): ProsCons {
  const pros: string[] = [];
  const cons: string[] = [];

  // VRAM Analysis
  const vramMatch = component.specs.vram?.match(/(\d+)/);
  const vram = vramMatch ? parseInt(vramMatch[1]) : 0;
  if (vram >= 24) {
    pros.push("High VRAM capacity for large models");
  } else if (vram < 16) {
    cons.push("Limited VRAM for large models");
  }

  // Price Analysis
  if (component.price < 1000) {
    pros.push("Budget-friendly price point");
  } else if (component.price > 2000) {
    cons.push("Premium price range");
  }

  // TDP Analysis
  const tdpMatch = component.specs.tdp?.match(/(\d+)/);
  const tdp = tdpMatch ? parseInt(tdpMatch[1]) : 0;
  if (tdp > 400) {
    cons.push("High power consumption (" + tdp + "W)");
  } else if (tdp < 250) {
    pros.push("Energy efficient (" + tdp + "W)");
  }

  // AI Score Analysis
  if (component.aiScore >= 90) {
    pros.push("Excellent AI performance score");
  } else if (component.aiScore < 70) {
    cons.push("Below average AI performance");
  }

  return { pros, cons };
}

// ============================================
// History Management
// ============================================

const HISTORY_KEY = "ai-forge-comparison-history";
const MAX_HISTORY = 3;

function saveComparison(c1: HardwareComponent, c2: HardwareComponent): void {
  try {
    const existing = getComparisonHistory();
    const newItem: ComparisonHistoryItem = {
      id: `${c1.id}-${c2.id}-${Date.now()}`,
      productIds: [c1.id, c2.id],
      productNames: [c1.name, c2.name],
      timestamp: Date.now(),
    };

    // Remove duplicates
    const filtered = existing.filter(
      (item) =>
        !(
          (item.productIds[0] === c1.id && item.productIds[1] === c2.id) ||
          (item.productIds[0] === c2.id && item.productIds[1] === c1.id)
        )
    );

    // Add new item at beginning
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Silent fail if localStorage not available
  }
}

function getComparisonHistory(): ComparisonHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Silent fail
  }
}

// ============================================
// Main Dashboard Component
// ============================================

export default function ComparisonDashboard({
  products,
  onClose,
  onRemove,
  onAddToCompare,
}: ComparisonDashboardProps) {
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ComparisonHistoryItem[]>([]);
  const [shareCopied, setShareCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(getComparisonHistory());
  }, []);

  // Save comparison when products change
  useEffect(() => {
    if (products.length === 2) {
      saveComparison(products[0], products[1]);
      setHistory(getComparisonHistory());
    }
  }, [products]);

  if (products.length !== 2) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-400">Select 2 products to compare</p>
      </div>
    );
  }

  const [c1, c2] = products;
  const isGPU = c1.category === "GPU";

  // Calculate all metrics
  const vram1 = calculateVRAMPenalty(c1.specs);
  const vram2 = calculateVRAMPenalty(c2.specs);
  const cuda1 = calculateCUDAPenalty(c1.specs);
  const cuda2 = calculateCUDAPenalty(c2.specs);
  const efficiency1 = calculateEnergyEfficiency(c1.price, c1.specs);
  const efficiency2 = calculateEnergyEfficiency(c2.price, c2.specs);
  const ptp1 = calculatePriceToPerformance(c1.price, c1.aiScore);
  const ptp2 = calculatePriceToPerformance(c2.price, c2.aiScore);

  // Determine winners
  const vramWinner = vram1 > vram2 ? 1 : vram2 > vram1 ? 2 : 0;
  const cudaWinner = cuda1 > cuda2 ? 1 : cuda2 > cuda1 ? 2 : 0;
  const efficiencyWinner = efficiency1 > efficiency2 ? 1 : efficiency2 > efficiency1 ? 2 : 0;
  const ptpWinner = ptp1 > ptp2 ? 1 : ptp2 > ptp1 ? 2 : 0;
  const aiWinner = c1.aiScore > c2.aiScore ? 1 : c2.aiScore > c1.aiScore ? 2 : 0;

  const c1Wins = [vramWinner, cudaWinner, efficiencyWinner, ptpWinner, aiWinner].filter(
    (w) => w === 1
  ).length;
  const c2Wins = [vramWinner, cudaWinner, efficiencyWinner, ptpWinner, aiWinner].filter(
    (w) => w === 2
  ).length;
  const overallWinner = c1Wins > c2Wins ? 1 : c2Wins > c1Wins ? 2 : 0;

  // Pros & Cons
  const c1Analysis = analyzeProsCons(c1);
  const c2Analysis = analyzeProsCons(c2);

  // Share URL
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/compare?p1=${c1.id}&p2=${c2.id}`;

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }, [shareUrl]);

  // Export to PNG
  const handleExport = useCallback(async () => {
    if (!dashboardRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(dashboardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#0f172a",
      });
      const link = document.createElement("a");
      link.download = `comparison-${c1.id}-vs-${c2.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  }, [c1.id, c2.id]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Dashboard */}
        <motion.div
          ref={dashboardRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-7xl max-h-[95vh] bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-700/50 shrink-0">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-emerald-500" />
              <h2 className="text-lg md:text-xl font-bold text-white">Comparison Dashboard</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle Highlight */}
              <button
                onClick={() => setHighlightDiffs(!highlightDiffs)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  highlightDiffs
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {highlightDiffs ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="hidden sm:inline">Differences</span>
              </button>

              {/* History Toggle */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showHistory
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  shareCopied
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{shareCopied ? "Copied!" : "Share"}</span>
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-slate-800 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{exporting ? "Exporting..." : "Export"}</span>
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6">
              {/* Product Headers with Winner */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 mb-6">
                {/* Product 1 */}
                <motion.div
                  className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all ${
                    overallWinner === 1
                      ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-800/50 border-slate-700/50"
                  }`}
                >
                  {overallWinner === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full">
                      <Crown className="w-3 h-3" />
                      Winner ({c1Wins}/5)
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded">
                      {c1.category}
                    </span>
                    <button
                      onClick={() => onRemove(c1.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-1">{c1.name}</h3>
                  <p className="text-sm text-slate-400">{c1.brand}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl md:text-2xl font-bold text-emerald-400">
                      {formatPrice(c1.price)}
                    </span>
                    <span className="text-xs text-slate-500">AI Score: {c1.aiScore}</span>
                  </div>
                </motion.div>

                {/* VS */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <span className="text-lg font-black text-white">VS</span>
                    </div>
                  </div>
                </div>

                {/* Product 2 */}
                <motion.div
                  className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all ${
                    overallWinner === 2
                      ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-800/50 border-slate-700/50"
                  }`}
                >
                  {overallWinner === 2 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full">
                      <Crown className="w-3 h-3" />
                      Winner ({c2Wins}/5)
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded">
                      {c2.category}
                    </span>
                    <button
                      onClick={() => onRemove(c2.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-1">{c2.name}</h3>
                  <p className="text-sm text-slate-400">{c2.brand}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl md:text-2xl font-bold text-emerald-400">
                      {formatPrice(c2.price)}
                    </span>
                    <span className="text-xs text-slate-500">AI Score: {c2.aiScore}</span>
                  </div>
                </motion.div>
              </div>

              {/* Radar Chart + Pros/Cons Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Radar Chart */}
                <div className="bg-slate-800/30 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Performance Comparison
                  </h3>
                  <ComparisonRadarChart c1={c1} c2={c2} />
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50 border-2 border-emerald-500" />
                      <span className="text-xs text-slate-400 truncate max-w-[120px]">{c1.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500/50 border-2 border-blue-500" />
                      <span className="text-xs text-slate-400 truncate max-w-[120px]">{c2.name}</span>
                    </div>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Product 1 Analysis */}
                  <div className="bg-slate-800/30 rounded-2xl p-4">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-3 truncate">{c1.name}</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-2">
                          <Check className="w-3 h-3" />
                          <span className="font-medium">Pros</span>
                        </div>
                        <ul className="space-y-1">
                          {c1Analysis.pros.map((pro, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                              <span className="text-emerald-500 mt-0.5">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-red-400 mb-2">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="font-medium">Cons</span>
                        </div>
                        <ul className="space-y-1">
                          {c1Analysis.cons.map((con, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                              <span className="text-red-500 mt-0.5">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Product 2 Analysis */}
                  <div className="bg-slate-800/30 rounded-2xl p-4">
                    <h4 className="text-sm font-semibold text-blue-400 mb-3 truncate">{c2.name}</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-2">
                          <Check className="w-3 h-3" />
                          <span className="font-medium">Pros</span>
                        </div>
                        <ul className="space-y-1">
                          {c2Analysis.pros.map((pro, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                              <span className="text-emerald-500 mt-0.5">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-red-400 mb-2">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="font-medium">Cons</span>
                        </div>
                        <ul className="space-y-1">
                          {c2Analysis.cons.map((con, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                              <span className="text-red-500 mt-0.5">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Specs Table */}
              <div className="bg-slate-800/30 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Detailed Specifications
                  </h3>
                </div>
                <div className="divide-y divide-slate-700/30">
                  {/* VRAM */}
                  {isGPU && (
                    <div
                      className={`grid grid-cols-3 gap-4 px-4 py-3 items-center ${
                        highlightDiffs && vramWinner !== 0 ? "bg-yellow-500/10" : ""
                      }`}
                    >
                      <div className="text-right">
                        <span
                          className={`text-base font-mono font-semibold ${
                            vramWinner === 1 ? "text-emerald-400" : "text-slate-400"
                          }`}
                        >
                          {vram1}GB
                        </span>
                        {vramWinner === 1 && <Crown className="w-4 h-4 text-emerald-500 inline-block ml-1" />}
                      </div>
                      <div className="text-center text-xs text-slate-500 uppercase">VRAM</div>
                      <div className="text-left">
                        <span
                          className={`text-base font-mono font-semibold ${
                            vramWinner === 2 ? "text-emerald-400" : "text-slate-400"
                          }`}
                        >
                          {vram2}GB
                        </span>
                        {vramWinner === 2 && <Crown className="w-4 h-4 text-emerald-500 inline-block ml-1" />}
                      </div>
                    </div>
                  )}

                  {/* AI Score */}
                  <div
                    className={`grid grid-cols-3 gap-4 px-4 py-3 items-center ${
                      highlightDiffs && aiWinner !== 0 ? "bg-yellow-500/10" : ""
                    }`}
                  >
                    <div className="text-right">
                      <span
                        className={`text-base font-mono font-semibold ${
                          aiWinner === 1 ? "text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        {c1.aiScore}
                      </span>
                      {aiWinner === 1 && <Crown className="w-4 h-4 text-emerald-500 inline-block ml-1" />}
                    </div>
                    <div className="text-center text-xs text-slate-500 uppercase">AI Score</div>
                    <div className="text-left">
                      <span
                        className={`text-base font-mono font-semibold ${
                          aiWinner === 2 ? "text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        {c2.aiScore}
                      </span>
                      {aiWinner === 2 && <Crown className="w-4 h-4 text-emerald-500 inline-block ml-1" />}
                    </div>
                  </div>

                  {/* Price */}
                  <div
                    className={`grid grid-cols-3 gap-4 px-4 py-3 items-center ${
                      highlightDiffs && c1.price !== c2.price ? "bg-yellow-500/10" : ""
                    }`}
                  >
                    <div className="text-right">
                      <span className="text-base font-mono font-semibold text-slate-400">
                        {formatPrice(c1.price)}
                      </span>
                    </div>
                    <div className="text-center text-xs text-slate-500 uppercase">Price</div>
                    <div className="text-left">
                      <span className="text-base font-mono font-semibold text-slate-400">
                        {formatPrice(c2.price)}
                      </span>
                    </div>
                  </div>

                  {/* TDP */}
                  <div
                    className={`grid grid-cols-3 gap-4 px-4 py-3 items-center ${
                      highlightDiffs && c1.specs.tdp !== c2.specs.tdp ? "bg-yellow-500/10" : ""
                    }`}
                  >
                    <div className="text-right">
                      <span className="text-base font-mono font-semibold text-slate-400">
                        {c1.specs.tdp || "N/A"}
                      </span>
                    </div>
                    <div className="text-center text-xs text-slate-500 uppercase">TDP</div>
                    <div className="text-left">
                      <span className="text-base font-mono font-semibold text-slate-400">
                        {c2.specs.tdp || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Affiliate Links */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={c1.affiliateLinks.amazon}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy {c1.name}
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link
                  href={c2.affiliateLinks.amazon}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy {c2.name}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* History Sidebar (Collapsible) */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-[73px] right-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl"
              >
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Comparisons
                  </h3>
                  {history.length > 0 && (
                    <button
                      onClick={() => {
                        clearHistory();
                        setHistory([]);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(95vh-140px)]">
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">No recent comparisons</p>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                      >
                        <div className="text-xs text-slate-400 mb-2">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-white truncate">{item.productNames[0]}</p>
                          <p className="text-sm text-slate-500 truncate">vs</p>
                          <p className="text-sm text-white truncate">{item.productNames[1]}</p>
                        </div>
                        <button
                          onClick={() => {
                            // Navigate to comparison
                            window.location.href = `/compare?p1=${item.productIds[0]}&p2=${item.productIds[1]}`;
                          }}
                          className="w-full py-1.5 text-xs bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1"
                        >
                          View Comparison
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
