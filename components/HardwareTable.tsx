"use client";

import { useMemo, useState } from "react";
import { Package, Plus, Check, Star } from "lucide-react";
import { hardwareComponents, type HardwareComponent } from "@/data/components";
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

const SIDEBAR_WIDTH = 280;
const GAP = 32;
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

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

// Spec columns for table
function SpecColumns({ product }: { product: HardwareComponent }) {
  const isGPU = product.category === "GPU";
  const isCPU = product.category === "CPU";
  
  if (isGPU) {
    return (
      <>
        <TableCell className="px-3 py-2 text-sm text-gray-600">
          {product.specs.vram || "-"}
        </TableCell>
        <TableCell className="px-3 py-2 text-sm text-gray-600">
          {product.specs.cuda || "-"}
        </TableCell>
        <TableCell className="px-3 py-2 text-sm text-gray-600">
          {product.specs.tdp || "-"}
        </TableCell>
        <TableCell className="px-3 py-2 text-sm text-gray-600">
          {product.specs.architecture || "-"}
        </TableCell>
      </>
    );
  }
  
  if (isCPU) {
    return (
      <>
        <TableCell className="px-3 py-2 text-sm text-gray-600">
          {product.specs.cores ? `${product.specs.cores}C/${product.specs.threads}T` : "-"}
        </TableCell>
        <TableCell className="px-3 py-2 text-sm text-gray-600">
          {product.specs.socket || "-"}
        </TableCell>
        <TableCell className="px-3 py-2 text-sm text-gray-600">
          {product.specs.tdp || "-"}
        </TableCell>
        <TableCell className="px-3 py-2 text-sm text-gray-600">
          -
        </TableCell>
      </>
    );
  }
  
  return (
    <>
      <TableCell className="px-3 py-2 text-sm text-gray-600">-</TableCell>
      <TableCell className="px-3 py-2 text-sm text-gray-600">-</TableCell>
      <TableCell className="px-3 py-2 text-sm text-gray-600">-</TableCell>
      <TableCell className="px-3 py-2 text-sm text-gray-600">-</TableCell>
    </>
  );
}

export default function HardwareTable() {
  const [selectedVram, setSelectedVram] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [tdpRange, setTdpRange] = useState<[number, number]>([0, 500]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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

    return filtered;
  }, [selectedVram, selectedCategories, priceRange, tdpRange]);

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

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get unique spec columns based on category
  const activeCategory = selectedCategories.length === 1 ? selectedCategories[0] : null;

  return (
    <section className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto flex max-w-[1600px]" style={{ gap: `${GAP}px` }}>
        {/* Sidebar Filters */}
        <aside
          className="shrink-0 bg-white border-r border-gray-200 px-4 py-4"
          style={{ width: `${SIDEBAR_WIDTH}px` }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Filters
          </h2>
          
          {/* Price Range */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="mb-3 text-sm font-semibold text-gray-700">Price Range</p>
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
            <Slider
              value={priceRange}
              min={0}
              max={25000}
              step={100}
              onValueChange={(value) => setPriceRange(value as [number, number])}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="mb-3 text-sm font-semibold text-gray-700">Category</p>
            <div className="space-y-2">
              {categories.map((cat: string) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <span className="text-sm text-gray-600">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* VRAM Filter */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="mb-3 text-sm font-semibold text-gray-700">VRAM</p>
            <div className="space-y-2">
              {VRAM_BUCKETS.map((vram) => (
                <label key={vram} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedVram.includes(vram)}
                    onCheckedChange={() => toggleVram(vram)}
                  />
                  <span className="text-sm text-gray-600">{vram}GB</span>
                </label>
              ))}
            </div>
          </div>

          {/* TDP Range */}
          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">TDP Range</p>
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>{tdpRange[0]}W</span>
              <span>{tdpRange[1]}W</span>
            </div>
            <Slider
              value={tdpRange}
              min={0}
              max={500}
              step={10}
              onValueChange={(value) => setTdpRange(value as [number, number])}
            />
          </div>
        </aside>

        {/* Main Table Area */}
        <div className="min-w-0 flex-1 py-4 pr-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {activeCategory || "All Components"}
            </h1>
            <span className="text-sm text-gray-500">{rows.length} items</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-gray-200 hover:bg-transparent">
                  <TableHead className="w-12 px-3 py-3"></TableHead>
                  <TableHead className="w-16 px-3 py-3 text-sm font-semibold text-gray-700">Image</TableHead>
                  <TableHead className="px-3 py-3 text-sm font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="w-24 px-3 py-3 text-sm font-semibold text-gray-700 text-center">
                    {activeCategory === "CPU" ? "Cores" : "VRAM"}
                  </TableHead>
                  <TableHead className="w-24 px-3 py-3 text-sm font-semibold text-gray-700 text-center">
                    {activeCategory === "CPU" ? "Socket" : "CUDA"}
                  </TableHead>
                  <TableHead className="w-20 px-3 py-3 text-sm font-semibold text-gray-700 text-center">TDP</TableHead>
                  <TableHead className="w-32 px-3 py-3 text-sm font-semibold text-gray-700">Architecture</TableHead>
                  <TableHead className="w-24 px-3 py-3 text-sm font-semibold text-gray-700 text-right">Price</TableHead>
                  <TableHead className="w-24 px-3 py-3 text-sm font-semibold text-gray-700 text-center">Rating</TableHead>
                  <TableHead className="w-20 px-3 py-3"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((product: HardwareComponent) => (
                  <TableRow 
                    key={product.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-3 py-2">
                      <span className="text-gray-400"><Package className="h-4 w-4" /></span>
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-400">IMG</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <SpecColumns product={product} />
                    <TableCell className="px-3 py-2 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        ${product.price.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-center">
                      <StarRating rating={Math.floor(Math.random() * 2) + 4} />
                      <p className="text-xs text-gray-400 mt-0.5">({Math.floor(Math.random() * 500) + 50})</p>
                    </TableCell>
                    <TableCell className="px-3 py-2">
                      <button
                        onClick={() => toggleItem(product.id)}
                        className={`w-full h-8 flex items-center justify-center gap-1 rounded text-sm font-medium transition-all ${
                          selectedItems.has(product.id)
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {selectedItems.has(product.id) ? (
                          <>
                            <Check className="w-4 h-4" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add
                          </>
                        )}
                      </button>
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
