"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  X, 
  Plus, 
  Scale, 
  Zap,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from "lucide-react";
import { hardwareComponents, type HardwareComponent } from "@/data/components";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ComparisonEngineProps {
  components?: HardwareComponent[];
  defaultSelected?: string[];
}

// Calculate AI Score based on weighted formula
function calculateAIScore(component: HardwareComponent): number {
  const vramMatch = component.specs.vram?.match(/(\d+)/);
  const vram = vramMatch ? parseInt(vramMatch[1]) : 0;
  
  const cudaMatch = component.specs.cuda?.replace(/,/g, "").match(/(\d+)/);
  const cuda = cudaMatch ? parseInt(cudaMatch[1]) : 0;
  
  const tdpMatch = component.specs.tdp?.match(/(\d+)/);
  const tdp = tdpMatch ? parseInt(tdpMatch[1]) : 0;
  
  // Formula: (vram * 3) + (cuda_cores * 0.01) + (tdp * 0.1)
  return Math.round((vram * 3) + (cuda * 0.01) + (tdp * 0.1));
}

// Get GPUs from components
function getGPUs(components: HardwareComponent[]): HardwareComponent[] {
  return components.filter(c => c.category === "GPU");
}

// Metric bar component
function MetricBar({ 
  value, 
  max, 
  color = "emerald" 
}: { 
  value: number; 
  max: number; 
  color?: "emerald" | "blue" | "purple" | "amber";
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  const colorClasses = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
  };
  
  return (
    <div className="h-1.5 w-full bg-[#1e293b] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`h-full ${colorClasses[color]}`}
      />
    </div>
  );
}

// Spec value formatter
function formatSpecValue(spec?: string): string {
  if (!spec) return "-";
  return spec;
}

// Comparison table row
function ComparisonRow({ 
  label, 
  values, 
  maxValue,
  color = "emerald",
  isNumeric = true,
  suffix = ""
}: { 
  label: string; 
  values: (string | number | undefined)[]; 
  maxValue?: number;
  color?: "emerald" | "blue" | "purple" | "amber";
  isNumeric?: boolean;
  suffix?: string;
}) {
  const numericValues = isNumeric 
    ? values.map(v => {
        if (typeof v === "number") return v;
        const match = String(v).match(/[\d,]+/);
        return match ? parseInt(match[0].replace(/,/g, "")) : 0;
      })
    : [];
  
  const max = maxValue || (isNumeric ? Math.max(...numericValues) : 0);
  
  return (
    <tr className="border-b border-[#1e293b] hover:bg-[#0f172a]/50">
      <td className="px-4 py-3 text-[11px] font-medium text-[#64748b] uppercase tracking-wider sticky left-0 bg-[#020617]">
        {label}
      </td>
      {values.map((value, idx) => {
        const numValue = isNumeric ? numericValues[idx] : 0;
        const isWinner = isNumeric && numValue === max && numValue > 0;
        
        return (
          <td key={idx} className="px-4 py-3">
            <div className="space-y-1">
              <span className={`text-[13px] ${isWinner ? "text-emerald-400 font-semibold" : "text-white"}`}>
                {formatSpecValue(value as string | undefined)}{suffix}
              </span>
              {isNumeric && <MetricBar value={numValue} max={max} color={color} />}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

export default function ComparisonEngine({ 
  components = hardwareComponents,
  defaultSelected = []
}: ComparisonEngineProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelected);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 5000]);
  
  const gpus = useMemo(() => getGPUs(components), [components]);
  
  const selectedGPUs = useMemo(() => {
    return selectedIds.map(id => gpus.find(g => g.id === id)).filter(Boolean) as HardwareComponent[];
  }, [selectedIds, gpus]);
  
  const filteredGPUs = useMemo(() => {
    return gpus.filter(gpu => 
      gpu.price >= priceFilter[0] && 
      gpu.price <= priceFilter[1] &&
      !selectedIds.includes(gpu.id)
    );
  }, [gpus, priceFilter, selectedIds]);
  
  const toggleGPU = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 4 
          ? [...prev, id]
          : prev
    );
  };
  
  const removeGPU = (id: string) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };
  
  const clearAll = () => setSelectedIds([]);
  
  // Calculate metrics for comparison
  const aiScores = selectedGPUs.map(calculateAIScore);
  const maxScore = Math.max(...aiScores, 0);
  
  const vramValues = selectedGPUs.map(g => {
    const match = g.specs.vram?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const maxVram = Math.max(...vramValues, 0);
  
  const cudaValues = selectedGPUs.map(g => {
    const match = g.specs.cuda?.replace(/,/g, "").match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const maxCuda = Math.max(...cudaValues, 0);
  
  const tdpValues = selectedGPUs.map(g => {
    const match = g.specs.tdp?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const maxTdp = Math.max(...tdpValues, 0);

  return (
    <div className="bg-[#020617] border border-[#1e293b] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/20">
            <Scale className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
              GPU Comparison Engine
            </h2>
            <p className="text-[11px] text-[#64748b]">
              Compare up to 4 GPUs with AI performance scoring
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-[11px] text-[#64748b] hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          )}
          <span className="text-[11px] text-[#475569] bg-[#0f172a] px-2 py-1">
            {selectedIds.length}/4 selected
          </span>
        </div>
      </div>

      {/* Selected GPUs Preview */}
      {selectedGPUs.length > 0 && (
        <div className="px-6 py-4 border-b border-[#1e293b] bg-[#0f172a]/30">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-500 uppercase tracking-wider">
              Selected for Comparison
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedGPUs.map((gpu) => (
              <motion.div
                key={gpu.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-[#334155] group"
              >
                <span className="text-[12px] text-white font-medium">{gpu.name}</span>
                <span className="text-[10px] text-[#64748b]">{formatPrice(gpu.price)}</span>
                <button
                  onClick={() => removeGPU(gpu.id)}
                  className="ml-1 p-0.5 text-[#64748b] hover:text-red-400 hover:bg-[#0f172a] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* GPU Selector */}
      <div className="border-b border-[#1e293b]">
        <button
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          className="flex items-center justify-between w-full px-6 py-3 text-left hover:bg-[#0f172a]/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-500" />
            <span className="text-[13px] text-white font-medium">
              {isSelectorOpen ? "Close Selector" : "Add GPUs to Compare"}
            </span>
          </div>
          {isSelectorOpen ? (
            <ChevronUp className="h-4 w-4 text-[#64748b]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#64748b]" />
          )}
        </button>
        
        <AnimatePresence>
          {isSelectorOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 py-4 border-t border-[#1e293b]">
                {/* Price Filter */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[#64748b] uppercase">Price Range</span>
                    <span className="text-[11px] text-[#94a3b8]" style={{ fontFamily: "var(--font-geist-mono)" }}>
                      {formatPrice(priceFilter[0])} - {formatPrice(priceFilter[1])}
                    </span>
                  </div>
                  <Slider
                    value={priceFilter}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={(v) => setPriceFilter(v as [number, number])}
                    className="[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-[#1e293b] [&_[data-slot=slider-range]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:bg-emerald-500"
                  />
                </div>
                
                {/* GPU Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {filteredGPUs.map((gpu) => {
                    const isSelected = selectedIds.includes(gpu.id);
                    const isDisabled = !isSelected && selectedIds.length >= 4;
                    
                    return (
                      <button
                        key={gpu.id}
                        onClick={() => !isDisabled && toggleGPU(gpu.id)}
                        disabled={isDisabled}
                        className={`p-3 text-left border transition-all ${
                          isSelected 
                            ? "border-emerald-500 bg-emerald-500/10" 
                            : isDisabled
                              ? "border-[#1e293b] opacity-40 cursor-not-allowed"
                              : "border-[#1e293b] hover:border-[#334155] hover:bg-[#0f172a]"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className={`text-[11px] font-medium ${isSelected ? "text-emerald-400" : "text-white"}`}>
                            {gpu.name}
                          </span>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-400" style={{ fontFamily: "var(--font-geist-mono)" }}>
                            {formatPrice(gpu.price)}
                          </span>
                          <span className="text-[10px] text-[#475569]">
                            {gpu.specs.vram}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {filteredGPUs.length === 0 && (
                  <div className="text-center py-8 text-[#64748b] text-[13px]">
                    No GPUs match your price filter
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comparison Table */}
      {selectedGPUs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="px-4 py-3 text-left text-[11px] font-medium text-[#64748b] uppercase tracking-wider sticky left-0 bg-[#020617] w-[140px]">
                  Metric
                </th>
                {selectedGPUs.map((gpu) => (
                  <th key={gpu.id} className="px-4 py-3 text-left min-w-[180px]">
                    <div className="space-y-1">
                      <div className="text-[13px] font-semibold text-white truncate">
                        {gpu.name}
                      </div>
                      <div className="text-[11px] text-emerald-400" style={{ fontFamily: "var(--font-geist-mono)" }}>
                        {formatPrice(gpu.price)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* AI Score Row */}
              <tr className="border-b border-[#1e293b] bg-emerald-500/5">
                <td className="px-4 py-3 text-[11px] font-medium text-emerald-500 uppercase tracking-wider sticky left-0 bg-[#020617]/95 backdrop-blur">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5" />
                    AI Score
                  </div>
                </td>
                {aiScores.map((score, idx) => {
                  const isWinner = score === maxScore && score > 0;
                  return (
                    <td key={idx} className="px-4 py-3">
                      <div className="space-y-1">
                        <span className={`text-xl font-bold ${isWinner ? "text-emerald-400" : "text-white"}`} style={{ fontFamily: "var(--font-geist-mono)" }}>
                          {score}
                        </span>
                        <MetricBar value={score} max={maxScore} color="emerald" />
                      </div>
                    </td>
                  );
                })}
              </tr>
              
              <ComparisonRow 
                label="VRAM" 
                values={selectedGPUs.map(g => g.specs.vram)} 
                maxValue={maxVram}
                color="blue"
              />
              <ComparisonRow 
                label="CUDA Cores" 
                values={selectedGPUs.map(g => g.specs.cuda)} 
                maxValue={maxCuda}
                color="purple"
              />
              <ComparisonRow 
                label="Tensor Cores" 
                values={selectedGPUs.map(g => g.specs.tensor)} 
                isNumeric={false}
              />
              <ComparisonRow 
                label="TDP" 
                values={selectedGPUs.map(g => g.specs.tdp)} 
                maxValue={maxTdp}
                color="amber"
                suffix="W"
              />
              <ComparisonRow 
                label="TFLOPS (FP16)" 
                values={selectedGPUs.map(g => g.specs.tflops)} 
                isNumeric={false}
              />
              <ComparisonRow 
                label="Architecture" 
                values={selectedGPUs.map(g => g.specs.architecture)} 
                isNumeric={false}
              />
              
              {/* Affiliate Links Row */}
              <tr className="border-b border-[#1e293b]">
                <td className="px-4 py-3 text-[11px] font-medium text-[#64748b] uppercase tracking-wider sticky left-0 bg-[#020617]">
                  Buy Links
                </td>
                {selectedGPUs.map((gpu, idx) => (
                  <td key={idx} className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <a
                        href={gpu.affiliateLinks.amazon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[10px] bg-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#334155] transition-colors flex items-center gap-1"
                      >
                        AMZ
                        <ArrowRight className="h-3 w-3" />
                      </a>
                      <a
                        href={gpu.affiliateLinks.ebay}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[10px] bg-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#334155] transition-colors flex items-center gap-1"
                      >
                        EBY
                        <ArrowRight className="h-3 w-3" />
                      </a>
                      <a
                        href={gpu.affiliateLinks.aliexpress}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[10px] bg-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#334155] transition-colors flex items-center gap-1"
                      >
                        ALI
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#0f172a] border border-[#1e293b]">
            <Scale className="h-7 w-7 text-[#334155]" />
          </div>
          <h3 className="text-[15px] font-medium text-white mb-2">
            No GPUs Selected
          </h3>
          <p className="text-[13px] text-[#64748b] max-w-sm mx-auto mb-4">
            Select up to 4 GPUs from the dropdown above to compare their AI performance metrics
          </p>
          <Button
            onClick={() => setIsSelectorOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-[#020617]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add GPUs
          </Button>
        </div>
      )}

      {/* Formula Note */}
      <div className="px-6 py-3 border-t border-[#1e293b] bg-[#0f172a]/30">
        <p className="text-[10px] text-[#475569]">
          <span className="text-emerald-500">AI Score Formula:</span>{" "}
          (VRAM × 3) + (CUDA Cores × 0.01) + (TDP × 0.1) = Weighted Performance Score
        </p>
      </div>
    </div>
  );
}

// Helper function
function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}
