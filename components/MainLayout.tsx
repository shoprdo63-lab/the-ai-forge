"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Plus, Check, ChevronDown, ChevronUp, ExternalLink, ShoppingCart, Cpu, Zap, Layers } from "lucide-react";
import { hardwareComponents, type HardwareComponent, type Category } from "@/data/components";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AmazonLogo, EbayLogo, AliExpressLogo } from "./MerchantLogos";

const SIDEBAR_WIDTH = 300;

// Product Image with actual image support
function ProductImage({ category, imageUrl, name }: { category: Category; imageUrl?: string; name: string }) {
  const [error, setError] = useState(false);
  
  const gradients: Record<Category, string> = {
    GPU: "from-purple-600/30 to-blue-600/30 border-purple-500/30",
    CPU: "from-emerald-600/30 to-cyan-600/30 border-emerald-500/30",
    Motherboard: "from-amber-600/30 to-orange-600/30 border-amber-500/30",
    RAM: "from-pink-600/30 to-rose-600/30 border-pink-500/30",
    Storage: "from-slate-600/30 to-gray-600/30 border-slate-500/30",
    PSU: "from-yellow-600/30 to-amber-600/30 border-yellow-500/30",
    Cooling: "from-cyan-600/30 to-blue-600/30 border-cyan-500/30",
  };

  // If we have an image URL and no error, show the image
  if (imageUrl && !error) {
    return (
      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#1e293b] bg-[#0f172a] group-hover:border-emerald-500/30 transition-all duration-300 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-contain p-1"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  // Fallback to gradient placeholder with icon
  const icons = {
    GPU: <Cpu className="h-7 w-7" />,
    CPU: <Zap className="h-7 w-7" />,
    Motherboard: <Layers className="h-7 w-7" />,
    RAM: <Layers className="h-7 w-7" />,
    Storage: <Layers className="h-7 w-7" />,
    PSU: <Zap className="h-7 w-7" />,
    Cooling: <Cpu className="h-7 w-7" />,
  };

  return (
    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradients[category]} border flex items-center justify-center text-white/80 group-hover:scale-105 transition-all duration-300`}>
      {icons[category]}
    </div>
  );
}

function getUniqueBrands(components: HardwareComponent[]): string[] {
  return Array.from(new Set(components.map((c) => c.brand))).sort();
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

// Rating Component
function Rating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`text-xs ${i <= Math.round(score / 20) ? "text-emerald-500" : "text-[#334155]"}`}>★</span>
        ))}
      </div>
      <span className="text-[10px] text-[#64748b]">({score})</span>
    </div>
  );
}

// Merchant Price Button - Fixed with visible styling
function MerchantPrice({ merchant, price, url }: { merchant: "amazon" | "ebay" | "aliexpress"; price: string; url: string }) {
  const config = {
    amazon: { 
      Logo: AmazonLogo, 
      bg: "bg-[#ff9900] hover:bg-[#ff9900]/90", 
      text: "text-[#131921]",
      border: "border-[#ff9900]/50"
    },
    ebay: { 
      Logo: EbayLogo, 
      bg: "bg-white hover:bg-gray-100", 
      text: "text-[#0064d2]",
      border: "border-white/50"
    },
    aliexpress: { 
      Logo: AliExpressLogo, 
      bg: "bg-[#e43225] hover:bg-[#e43225]/90", 
      text: "text-white",
      border: "border-[#e43225]/50"
    },
  };
  const { Logo, bg, text, border } = config[merchant];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg ${bg} ${text} text-[11px] font-bold transition-all duration-200 shadow-sm hover:shadow-md ${border} border min-w-[85px] hover:scale-105 active:scale-95`}
      onClick={(e) => e.stopPropagation()}
    >
      <Logo className="h-3.5 w-auto" />
      <span className="whitespace-nowrap">{price}</span>
    </a>
  );
}

// Component Row - PC Part Picker Style
function ComponentRow({
  component,
  isSelected,
  onToggle,
  onClick,
}: {
  component: HardwareComponent;
  isSelected: boolean;
  onToggle: () => void;
  onClick: () => void;
}) {
  const specs: string[] = [];
  if (component.specs.vram) specs.push(component.specs.vram);
  if (component.specs.cuda) specs.push(`${component.specs.cuda} CUDA`);
  if (component.specs.tdp) specs.push(component.specs.tdp);
  if (component.specs.cores) specs.push(`${component.specs.cores}-Core`);
  if (component.specs.socket) specs.push(component.specs.socket);
  if (component.specs.speed) specs.push(component.specs.speed);
  if (component.specs.capacity) specs.push(component.specs.capacity);
  const specsText = specs.join(" · ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`group border-b border-[#1e293b] transition-all duration-150 ${
        isSelected ? "bg-emerald-500/5" : "hover:bg-[#0f172a]"
      }`}
    >
      <div className="grid grid-cols-[50px_70px_1fr_100px_90px_90px_90px_60px] items-center px-4 py-3 gap-3">
        {/* Add Button */}
        <button
          onClick={onToggle}
          className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${
            isSelected
              ? "bg-emerald-500 border-emerald-500 text-[#020617]"
              : "border-[#334155] text-[#64748b] hover:border-emerald-500 hover:text-emerald-500"
          }`}
        >
          {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>

        {/* Product Image */}
        <ProductImage category={component.category} imageUrl={component.imageUrl} name={component.name} />

        {/* Product Info */}
        <div className="min-w-0">
          <button
            onClick={onClick}
            className="text-[14px] text-[#60a5fa] hover:text-[#93c5fd] hover:underline font-semibold truncate text-left block"
          >
            {component.name}
          </button>
          <div className="flex items-center gap-2 mt-1">
            {specsText && (
              <span className="text-[11px] text-[#64748b] truncate" style={{ fontFamily: "var(--font-geist-mono)" }}>
                {specsText}
              </span>
            )}
            <Rating score={component.aiScore} />
          </div>
        </div>

        {/* Merchant Prices */}
        <MerchantPrice merchant="amazon" price={formatPrice(component.price)} url={component.affiliateLinks.amazon} />
        <MerchantPrice merchant="ebay" price={formatPrice(component.price * 0.95)} url={component.affiliateLinks.ebay} />
        <MerchantPrice merchant="aliexpress" price={formatPrice(component.price * 0.9)} url={component.affiliateLinks.aliexpress} />

        {/* Actions */}
        <div className="flex items-center justify-end gap-1">
          <a
            href={component.affiliateLinks.amazon}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#64748b] hover:text-emerald-400 transition-colors"
            title="Buy Now"
          >
            <ShoppingCart className="h-4 w-4" />
          </a>
          <button
            onClick={onClick}
            className="p-1.5 text-[#64748b] hover:text-emerald-400 transition-colors"
            title="View Details"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Filter Section
function FilterSection({ title, children, isOpen, onToggle }: { title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#1e293b]">
      <button onClick={onToggle} className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-[#0f172a] transition-colors">
        <span className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wider">{title}</span>
        <span className="text-[#64748b]">{isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Component Detail Modal
function ComponentModal({ component, isOpen, onClose }: { component: HardwareComponent | null; isOpen: boolean; onClose: () => void }) {
  if (!component) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#020617] border-[#1e293b] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{component.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[200px_1fr] gap-6 mt-4">
          <div className="w-full aspect-square bg-[#0f172a] border border-[#1e293b] flex items-center justify-center">
            <ProductImage category={component.category} imageUrl={component.imageUrl} name={component.name} />
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-[12px] text-[#64748b] uppercase">Category</span>
              <p className="text-[14px] text-white">{component.category}</p>
            </div>
            <div>
              <span className="text-[12px] text-[#64748b] uppercase">Brand</span>
              <p className="text-[14px] text-white">{component.brand}</p>
            </div>
            <div>
              <span className="text-[12px] text-[#64748b] uppercase">AI Score</span>
              <div className="flex items-center gap-2">
                <Rating score={component.aiScore} />
                <span className="text-emerald-400 font-bold">{component.aiScore}/100</span>
              </div>
            </div>
            <div className="pt-4 border-t border-[#1e293b]">
              <span className="text-[12px] text-[#64748b] uppercase block mb-2">Specifications</span>
              <div className="grid grid-cols-2 gap-2 text-[13px]">
                {Object.entries(component.specs).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex justify-between">
                      <span className="text-[#64748b]">{key}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[#1e293b]">
              <span className="text-[12px] text-[#64748b] uppercase block mb-2">Best Prices</span>
              <div className="flex gap-2">
                <MerchantPrice merchant="amazon" price={formatPrice(component.price)} url={component.affiliateLinks.amazon} />
                <MerchantPrice merchant="ebay" price={formatPrice(component.price * 0.95)} url={component.affiliateLinks.ebay} />
                <MerchantPrice merchant="aliexpress" price={formatPrice(component.price * 0.9)} url={component.affiliateLinks.aliexpress} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Layout
export default function MainLayout() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [viewingComponent, setViewingComponent] = useState<HardwareComponent | null>(null);
  const [openSections, setOpenSections] = useState({ category: true, brand: true, price: true });

  const categories: Category[] = ["GPU", "CPU", "Motherboard", "RAM", "Storage", "PSU", "Cooling"];
  const brands = useMemo(() => getUniqueBrands(hardwareComponents), []);

  const filteredComponents = useMemo(() => {
    return hardwareComponents.filter((c) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(c.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(c.brand)) return false;
      if (c.price < priceRange[0] || c.price > priceRange[1]) return false;
      return true;
    });
  }, [selectedCategories, selectedBrands, priceRange]);

  const toggleCategory = useCallback((cat: Category) => {
    setSelectedCategories((p) => p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat]);
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((p) => p.includes(brand) ? p.filter((b) => b !== brand) : [...p, brand]);
  }, []);

  const toggleComponent = useCallback((id: string) => {
    setSelectedComponents((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 30000]);
  }, []);

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + (priceRange[0] > 0 || priceRange[1] < 30000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Sidebar */}
      <aside className="shrink-0 border-r border-[#1e293b] bg-[#020617] overflow-y-auto" style={{ width: SIDEBAR_WIDTH }}>
        <div className="sticky top-0 z-10 bg-[#020617] border-b border-[#1e293b] px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-white">Filters</h2>
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-[11px] text-[#64748b] hover:text-white flex items-center gap-1 transition-colors">
                <X className="h-3 w-3" />Clear ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        <FilterSection title="Category" isOpen={openSections.category} onToggle={() => setOpenSections((p) => ({ ...p, category: !p.category }))}>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox checked={selectedCategories.includes(cat)} onCheckedChange={() => toggleCategory(cat)} />
                <span className="text-[13px] text-[#94a3b8] group-hover:text-white transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Brand" isOpen={openSections.brand} onToggle={() => setOpenSections((p) => ({ ...p, brand: !p.brand }))}>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox checked={selectedBrands.includes(brand)} onCheckedChange={() => toggleBrand(brand)} />
                <span className="text-[13px] text-[#94a3b8] group-hover:text-white transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price Range" isOpen={openSections.price} onToggle={() => setOpenSections((p) => ({ ...p, price: !p.price }))}>
          <div className="space-y-4">
            <div className="flex justify-between text-[12px] text-[#64748b]" style={{ fontFamily: "var(--font-geist-mono)" }}>
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <Slider
              value={priceRange}
              min={0}
              max={30000}
              step={100}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              className="[&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-[#1e293b] [&_[data-slot=slider-range]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[#020617]"
            />
          </div>
        </FilterSection>

        <div className="p-4 border-t border-[#1e293b]">
          <div className="text-[12px] text-[#64748b] space-y-2">
            <div className="flex justify-between"><span>Showing</span><span className="text-white font-semibold">{filteredComponents.length}</span></div>
            <div className="flex justify-between"><span>Total Database</span><span className="text-white font-semibold">{hardwareComponents.length}</span></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617]">
        {/* Header - PC Part Picker Style */}
        <div className="grid grid-cols-[50px_70px_1fr_100px_90px_90px_90px_60px] items-center px-4 py-3 bg-[#0f172a] border-b border-[#1e293b] text-[11px] font-bold text-[#64748b] uppercase tracking-wider gap-3">
          <span></span>
          <span></span>
          <span>Component</span>
          <span className="text-center">Amazon</span>
          <span className="text-center">eBay</span>
          <span className="text-center">Ali</span>
          <span></span>
        </div>

        {/* Component List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredComponents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-[#64748b] text-sm">No components match your filters</p>
                <button onClick={clearFilters} className="mt-3 text-emerald-500 text-sm hover:underline">Clear all filters</button>
              </div>
            ) : (
              filteredComponents.map((c) => (
                <ComponentRow
                  key={c.id}
                  component={c}
                  isSelected={selectedComponents.has(c.id)}
                  onToggle={() => toggleComponent(c.id)}
                  onClick={() => setViewingComponent(c)}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1e293b] px-4 py-3 bg-[#0f172a]">
          <div className="flex items-center justify-between text-[11px] text-[#475569]">
            <span>AI Forge Hardware Database · {filteredComponents.length} components displayed</span>
            <span className="flex items-center gap-1">
              Prices updated live <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </div>
      </main>

      {/* Component Detail Modal */}
      <ComponentModal component={viewingComponent} isOpen={!!viewingComponent} onClose={() => setViewingComponent(null)} />
    </div>
  );
}
