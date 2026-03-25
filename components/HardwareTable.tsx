"use client";

import { useMemo, useState } from "react";
import { Cpu, Monitor, HardDrive, Zap, Package, Fan, Battery, Check } from "lucide-react";
import { hardwareComponents, type HardwareComponent, type Category } from "@/data/components";
import { useCompatibilityStore, filterBySocketCompatibility } from "@/lib/compatibility-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SIDEBAR_WIDTH = 260;
const GAP = 48;
const VRAM_BUCKETS = [8, 12, 16, 20, 24, 32, 48, 80];

function getVramValue(spec?: string): number | null {
  if (!spec) return null;
  const hit = spec.match(/\d+/);
  return hit ? Number(hit[0]) : null;
}

function getTdpValue(spec?: string): number | null {
  if (!spec) return null;
  const hit = spec.match(/\d+/);
  return hit ? Number(hit[0]) : null;
}

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  GPU: <Monitor className="h-4 w-4" strokeWidth={1.5} />,
  CPU: <Cpu className="h-4 w-4" strokeWidth={1.5} />,
  Motherboard: <HardDrive className="h-4 w-4" strokeWidth={1.5} />,
  RAM: <Zap className="h-4 w-4" strokeWidth={1.5} />,
  Storage: <HardDrive className="h-4 w-4" strokeWidth={1.5} />,
  PSU: <Battery className="h-4 w-4" strokeWidth={1.5} />,
  Cooling: <Fan className="h-4 w-4" strokeWidth={1.5} />,
  Workstation: <Package className="h-4 w-4" strokeWidth={1.5} />,
  MiniPC: <Monitor className="h-4 w-4" strokeWidth={1.5} />,
};

// 10px muted gray spec line for maximum density
function SpecLine({ product }: { product: HardwareComponent }) {
  const specs: string[] = [];
  if (product.specs.vram) specs.push(product.specs.vram);
  if (product.specs.cuda) specs.push(`${product.specs.cuda} CUDA`);
  if (product.specs.tdp) specs.push(product.specs.tdp);
  if (product.specs.socket) specs.push(product.specs.socket);
  if (product.specs.cores) specs.push(`${product.specs.cores}C/${product.specs.threads}T`);
  if (product.specs.memory) specs.push(product.specs.memory);
  if (product.specs.architecture) specs.push(product.specs.architecture);
  
  return (
    <span className="text-[10px] font-normal leading-[1.4] text-[#64748b] uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-mono)" }}>
      {specs.slice(0, 4).join(" / ")}
    </span>
  );
}

// Monochrome merchant logo component (max 22px height)
function MerchantLogo({ store }: { store: "Amazon" | "eBay" | "AliExpress" }) {
  const logos = {
    Amazon: (
      <svg viewBox="0 0 100 30" className="h-[22px] w-auto text-[#94a3b8]" fill="currentColor">
        <text x="0" y="22" fontSize="16" fontWeight="700" style={{ fontFamily: "var(--font-geist-sans)" }}>amazon</text>
      </svg>
    ),
    eBay: (
      <svg viewBox="0 0 50 30" className="h-[22px] w-auto text-[#94a3b8]" fill="currentColor">
        <text x="0" y="24" fontSize="20" fontWeight="800" style={{ fontFamily: "var(--font-geist-sans)" }}>eBay</text>
      </svg>
    ),
    AliExpress: (
      <svg viewBox="0 0 90 30" className="h-[22px] w-auto text-[#94a3b8]" fill="currentColor">
        <text x="0" y="20" fontSize="12" fontWeight="600" style={{ fontFamily: "var(--font-geist-sans)" }}>AliExpress</text>
      </svg>
    ),
  };
  return logos[store] || null;
}

export default function HardwareTable() {
  const [selectedVram, setSelectedVram] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [tdpRange, setTdpRange] = useState<[number, number]>([0, 500]);
  const { selectedCPU, filterBySocket, setSelectedCPU } = useCompatibilityStore();

  // Get all unique categories
  const categories = useMemo(() => {
    const cats = new Set(hardwareComponents.map(p => p.category));
    return Array.from(cats).sort();
  }, []);

  const rows = useMemo(() => {
    let filtered = hardwareComponents.filter((product) => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      
      // VRAM filter
      if (selectedVram.length > 0 && product.category === "GPU") {
        const vram = getVramValue(product.specs.vram);
        if (vram === null) return false;
        if (!selectedVram.includes(vram)) return false;
      }
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // TDP filter
      const tdp = getTdpValue(product.specs.tdp);
      if (tdp !== null && (tdp < tdpRange[0] || tdp > tdpRange[1])) {
        return false;
      }
      
      return true;
    });

    // Apply socket compatibility filter
    filtered = filterBySocketCompatibility(filtered, selectedCPU, filterBySocket);
    
    return filtered;
  }, [selectedVram, selectedCategories, priceRange, tdpRange, selectedCPU, filterBySocket]);

  const toggleVram = (vram: number) => {
    setSelectedVram((prev) =>
      prev.includes(vram) ? prev.filter((item) => item !== vram) : [...prev, vram]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  // Select CPU for compatibility engine
  const handleSelectCPU = (product: HardwareComponent) => {
    if (product.category === "CPU") {
      if (selectedCPU?.id === product.id) {
        setSelectedCPU(null);
      } else {
        setSelectedCPU(product as HardwareComponent);
      }
    }
  };

  return (
    <section id="hardware" className="bg-[#020617] min-h-screen">
      <div className="mx-auto flex max-w-[1800px]" style={{ gap: `${GAP}px` }}>
        {/* Sidebar with advanced filters */}
        <aside
          className="shrink-0 border-r border-[#1e293b] px-5 py-6"
          style={{ width: `${SIDEBAR_WIDTH}px` }}
        >
          <h2 className="mb-6 text-sm font-bold text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
            Parametric Filter
          </h2>
          
          {/* Smart Compatibility Engine Status */}
          {selectedCPU && (
            <div className="mb-6 border border-[#1e293b] bg-[#0f172a] p-3">
              <div className="mb-2 flex items-center gap-2">
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] uppercase tracking-wider text-emerald-500">Active Filter</span>
              </div>
              <p className="mb-1 text-xs text-white">{selectedCPU.name}</p>
              <p className="text-[10px] text-[#64748b]">Socket: {selectedCPU.specs.socket}</p>
              <p className="mt-2 text-[10px] text-[#64748b]">Motherboards filtered by socket compatibility</p>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Category</p>
            <div className="space-y-2">
              {categories.map((cat: string) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <span className="text-xs text-[#94a3b8]">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Slider */}
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Price Range</p>
            <div className="mb-2 flex justify-between text-[10px] text-[#94a3b8]" style={{ fontFamily: "var(--font-geist-mono)" }}>
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
            <Slider
              value={priceRange}
              min={0}
              max={25000}
              step={100}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="[&_[data-slot=slider-track]]:h-[2px] [&_[data-slot=slider-track]]:bg-[#1e293b] [&_[data-slot=slider-range]]:bg-[#334155] [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-[#475569] [&_[data-slot=slider-thumb]]:bg-[#64748b]"
            />
          </div>

          {/* VRAM Filter */}
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">VRAM (GPU Only)</p>
            <div className="space-y-2">
              {VRAM_BUCKETS.map((vram) => (
                <label key={vram} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedVram.includes(vram)}
                    onCheckedChange={() => toggleVram(vram)}
                  />
                  <span className="text-xs text-[#94a3b8]" style={{ fontFamily: "var(--font-geist-mono)" }}>{vram}GB</span>
                </label>
              ))}
            </div>
          </div>

          {/* TDP Slider */}
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">TDP Range</p>
            <div className="mb-2 flex justify-between text-[10px] text-[#94a3b8]" style={{ fontFamily: "var(--font-geist-mono)" }}>
              <span>{tdpRange[0]}W</span>
              <span>{tdpRange[1]}W</span>
            </div>
            <Slider
              value={tdpRange}
              min={0}
              max={500}
              step={10}
              onValueChange={(value) => setTdpRange(value as [number, number])}
              className="[&_[data-slot=slider-track]]:h-[2px] [&_[data-slot=slider-track]]:bg-[#1e293b] [&_[data-slot=slider-range]]:bg-[#334155] [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:border [&_[data-slot=slider-thumb]]:border-[#475569] [&_[data-slot=slider-thumb]]:bg-[#64748b]"
            />
          </div>
        </aside>

        {/* Main Table Area */}
        <div className="min-w-0 flex-1 py-6 pr-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
              AI Hardware Database
            </h1>
            <span className="text-xs text-[#64748b]" style={{ fontFamily: "var(--font-geist-mono)" }}>{rows.length} components</span>
          </div>

          <div className="overflow-x-auto border border-[#1e293b]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-[#020617]">
                <TableRow className="h-12 border-b border-[#1e293b] hover:bg-transparent">
                  <TableHead className="w-[140px] px-4 py-0 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                    Category
                  </TableHead>
                  <TableHead className="px-4 py-0 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                    Product
                  </TableHead>
                  <TableHead className="w-[180px] px-4 py-0 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                    Specs
                  </TableHead>
                  <TableHead className="w-[120px] px-4 py-0 text-right text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                    Price
                  </TableHead>
                  <TableHead className="w-[200px] px-4 py-0 text-right text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
                    Store
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((product: HardwareComponent) => (
                  <TableRow 
                    key={product.id} 
                    className="h-[56px] border-b border-[#1e293b] hover:bg-[#0f172a] cursor-pointer"
                    onClick={() => handleSelectCPU(product)}
                  >
                    <TableCell className="px-4 py-0 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748b]">{categoryIcons[product.category] || <Package className="h-4 w-4" />}</span>
                        <span className="text-xs text-[#94a3b8]">{product.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-0 align-middle">
                      <div className="min-w-0">
                        <p 
                          className="truncate text-[14px] font-bold leading-[1.4] text-white"
                          style={{ fontFamily: "var(--font-geist-sans)" }}
                        >
                          {product.name}
                        </p>
                        <p className="text-[10px] text-[#475569]">{product.brand}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-0 align-middle">
                      <SpecLine product={product} />
                    </TableCell>
                    <TableCell className="px-4 py-0 text-right align-middle">
                      <span 
                        className="text-[14px] font-semibold leading-[1.4] text-emerald-400"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        ${product.price.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-0 align-middle">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={product.affiliateLinks.amazon}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#94a3b8] hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MerchantLogo store="Amazon" />
                        </a>
                        <a
                          href={product.affiliateLinks.ebay}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#94a3b8] hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MerchantLogo store="eBay" />
                        </a>
                        <a
                          href={product.affiliateLinks.aliexpress}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#94a3b8] hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MerchantLogo store="AliExpress" />
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
