"use client";

// ============================================
// Route Segment Config
// Static Generation with ISR for data freshness
// ============================================
export const dynamic = 'force-static';

import { useState, useMemo, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Battery, Zap, RotateCcw, Scale, Cpu, Monitor, HardDrive } from "lucide-react";
import { hardwareComponents, type HardwareComponent } from "@/data/components";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Head from "next/head";

// Dynamic imports for heavy components
const ComparisonOverlay = lazy(() => import("@/components/ComparisonOverlay"));

// Categories
const CATEGORIES = ["GPU", "CPU", "Motherboard", "RAM", "Storage", "PSU", "Cooling"];
const BRANDS = ["NVIDIA", "AMD", "Intel", "ASUS", "MSI", "Gigabyte", "ASRock"];

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

export default function Home() {
  // Filter state
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(30000);

  // Selected products for wattage counter
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Comparison state (max 2 products)
  const [comparisonList, setComparisonList] = useState<HardwareComponent[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Add to comparison
  const addToComparison = (component: HardwareComponent) => {
    if (comparisonList.length >= 2) return;
    if (comparisonList.find(c => c.id === component.id)) return;
    
    const newList = [...comparisonList, component];
    setComparisonList(newList);
    
    if (newList.length === 2) {
      setShowComparison(true);
    }
  };

  // Remove from comparison
  const removeFromComparison = (id: string) => {
    setComparisonList(prev => prev.filter(c => c.id !== id));
  };

  // Clear comparison
  const clearComparison = () => {
    setComparisonList([]);
    setShowComparison(false);
  };

  // Real-time filtering engine
  const filteredComponents = useMemo(() => {
    return hardwareComponents.filter((component) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const nameMatch = component.name.toLowerCase().includes(searchLower);
        const brandMatch = component.brand.toLowerCase().includes(searchLower);
        if (!nameMatch && !brandMatch) return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(component.category)) {
        return false;
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(component.brand)) {
        return false;
      }

      if (component.price < priceMin || component.price > priceMax) {
        return false;
      }

      return true;
    });
  }, [search, selectedCategories, selectedBrands, priceMin, priceMax]);

  // Calculate total wattage
  const totalWattage = useMemo(() => {
    let total = 0;
    selectedProducts.forEach((productId) => {
      const product = hardwareComponents.find((c) => c.id === productId);
      if (product?.specs?.wattage) {
        total += parseInt(product.specs.wattage) || 0;
      }
    });
    return total;
  }, [selectedProducts]);

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    search !== "" ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceMin !== 0 ||
    priceMax !== 30000;

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceMin(0);
    setPriceMax(30000);
  };

  // Star Rating Component
  const StarRating = ({ score }: { score: number }) => {
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
        <span className="ml-1 text-xs text-[#6b7280]">({Math.round(score / 2)})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Head>
        <link rel="canonical" href="https://theaiforge.ai/" />
      </Head>
      
      {/* Blue Header - PCPartPicker Style */}
      <header className="bg-[#4f46e5] text-white">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">AI Forge Hardware Database</h1>
                <p className="text-sm text-white/70">
                  {filteredComponents.length} Compatible Products
                </p>
              </div>
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
      
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            {/* Part List Box */}
            <div className="bg-white border border-[#d1d5db] rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#4f46e5] rounded flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#374151]">Build Power</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Parts:</span>
                  <span className="font-medium text-[#374151]">{selectedProducts.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Total:</span>
                  <span className="font-medium text-[#0d9488]">
                    ${Array.from(selectedProducts).reduce((sum, id) => {
                      const p = hardwareComponents.find(c => c.id === id);
                      return sum + (p?.price || 0);
                    }, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9ca3af]">Est. Wattage:</span>
                  <span className="text-[#9ca3af]">{totalWattage}W</span>
                </div>
                {selectedProducts.size > 0 && (
                  <button 
                    onClick={() => setSelectedProducts(new Set())}
                    className="w-full mt-2 py-1.5 bg-[#4f46e5] text-white text-xs font-medium rounded hover:bg-[#4338ca] transition-colors"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>

            {/* Merchants / Pricing */}
            <div className="bg-white border border-[#d1d5db] rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#374151] mb-3">Merchants / Pricing</h3>
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
            </div>

            {/* Filters */}
            <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
                <h3 className="text-sm font-semibold text-[#374151]">Filters</h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Search */}
                <div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#4f46e5]"
                  />
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[#374151] uppercase mb-2">Price</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceMin || ""}
                      onChange={(e) => setPriceMin(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#4f46e5]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceMax || ""}
                      onChange={(e) => setPriceMax(parseInt(e.target.value) || 30000)}
                      className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:border-[#4f46e5]"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[#374151] uppercase mb-2">Category</h4>
                  <div className="space-y-1">
                    {CATEGORIES.map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            setSelectedCategories(prev =>
                              checked
                                ? [...prev, category]
                                : prev.filter(c => c !== category)
                            );
                          }}
                        />
                        <span className="text-sm text-[#4b5563]">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[#374151] uppercase mb-2">Brand</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {BRANDS.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            setSelectedBrands(prev =>
                              checked
                                ? [...prev, brand]
                                : prev.filter(b => b !== brand)
                            );
                          }}
                        />
                        <span className="text-sm text-[#4b5563]">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 px-2">
              <p className="text-xs text-[#6b7280]">
                Showing <span className="font-medium text-[#374151]">{filteredComponents.length}</span> compatible products
              </p>
            </div>
          </aside>
          
          {/* Product Grid */}
          <section className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between bg-white p-3 rounded-lg border border-[#d1d5db] shadow-sm">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedProducts(new Set(filteredComponents.map(c => c.id)))}
                  className="px-3 py-1.5 text-sm text-[#374151] bg-[#f9fafb] border border-[#d1d5db] rounded hover:bg-[#f3f4f6]"
                >
                  Select All
                </button>
                <button 
                  onClick={() => setSelectedProducts(new Set())}
                  className="px-3 py-1.5 text-sm text-[#374151] bg-[#f9fafb] border border-[#d1d5db] rounded hover:bg-[#f3f4f6]"
                >
                  Select None
                </button>
                {selectedProducts.size > 0 && (
                  <span className="text-sm text-[#6b7280]">
                    {selectedProducts.size} selected
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#4f46e5] hover:bg-[#f9fafb] rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden shadow-sm">
              <div className="divide-y divide-[#e5e7eb]">
                {filteredComponents.map((component) => (
                  <div
                    key={component.id}
                    className="p-4 hover:bg-[#f9fafb] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <Checkbox
                        checked={selectedProducts.has(component.id)}
                        onCheckedChange={() => toggleProductSelection(component.id)}
                        className="mt-1"
                      />

                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-[#f3f4f6] rounded flex items-center justify-center overflow-hidden shrink-0">
                        {component.imageUrl ? (
                          <img
                            src={component.imageUrl}
                            alt={component.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          component.category === "GPU" ? (
                            <Monitor className="w-8 h-8 text-[#9ca3af]" />
                          ) : component.category === "CPU" ? (
                            <Cpu className="w-8 h-8 text-[#9ca3af]" />
                          ) : (
                            <HardDrive className="w-8 h-8 text-[#9ca3af]" />
                          )
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              href={`/product/${component.id}`}
                              className="text-sm font-medium text-[#4f46e5] hover:text-[#3730a3] hover:underline transition-colors"
                            >
                              {component.name}
                            </Link>
                            <p className="text-xs text-[#6b7280]">{component.brand} • {component.category}</p>
                            <div className="mt-1">
                              <StarRating score={component.aiScore} />
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-[#0d9488]">
                              ${component.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Specs Row */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-[#6b7280]">
                          {component.specs.vram && (
                            <span>{component.specs.vram} VRAM</span>
                          )}
                          {component.specs.cores && (
                            <span>{component.specs.cores} Cores</span>
                          )}
                          {component.specs.tdp && (
                            <span>{component.specs.tdp} TDP</span>
                          )}
                        </div>

                        {/* Merchant Buy Buttons */}
                        <div className="flex items-center gap-2 mt-3">
                          {MERCHANTS.slice(0, 3).map((merchant) => (
                            <Link
                              key={merchant.id}
                              href={component.directLinks?.[merchant.id as keyof typeof component.directLinks] || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 text-xs font-medium rounded transition-colors bg-[#16a34a] hover:bg-[#15803d] text-white"
                            >
                              {merchant.name}
                            </Link>
                          ))}
                          <button
                            onClick={() => addToComparison(component)}
                            disabled={comparisonList.length >= 2 || comparisonList.some(c => c.id === component.id)}
                            className="px-2 py-1 text-xs font-medium rounded transition-colors bg-[#f9fafb] hover:bg-[#f3f4f6] text-[#374151] border border-[#d1d5db] disabled:opacity-50"
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredComponents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="p-6 bg-[#f9fafb] rounded-2xl mb-8">
                    <Zap className="w-10 h-10 text-[#9ca3af]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-medium text-[#374151] mb-3">
                    No hardware matches your criteria
                  </h3>
                  <p className="text-sm text-[#6b7280] max-w-md mb-8">
                    Try adjusting your filters to find components that match your requirements.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#f9fafb] text-[#374151] border border-[#d1d5db] rounded-xl hover:bg-[#f3f4f6] transition-all"
                  >
                    <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Comparison Mini-Widget */}
      <AnimatePresence>
        {comparisonList.length > 0 && !showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-40"
          >
            <div className="bg-white border border-[#d1d5db] rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="w-4 h-4 text-[#4f46e5]" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#374151]">
                  Compare ({comparisonList.length}/2)
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {comparisonList.map((product) => (
                  <div key={product.id} className="flex items-center gap-2 text-xs">
                    <span className="text-[#6b7280] truncate w-32">{product.name}</span>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
              {comparisonList.length === 2 ? (
                <button
                  onClick={() => setShowComparison(true)}
                  className="w-full px-4 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium text-sm rounded-xl transition-colors"
                >
                  Compare Now
                </button>
              ) : (
                <p className="text-xs text-[#9ca3af]">Select 1 more product</p>
              )}
              <button
                onClick={clearComparison}
                className="w-full mt-2 text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Overlay with Suspense */}
      {showComparison && comparisonList.length === 2 && (
        <Suspense fallback={
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f3f4f6]/90">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#6b7280]">Loading...</p>
            </div>
          </div>
        }>
          <ComparisonOverlay
            products={comparisonList}
            onClose={() => setShowComparison(false)}
            onRemove={(id) => {
              removeFromComparison(id);
              if (comparisonList.length <= 2) {
                setShowComparison(false);
              }
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
