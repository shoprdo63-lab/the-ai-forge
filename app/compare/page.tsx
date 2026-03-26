"use client";

// ============================================
// Route Segment Config
// Dynamic rendering for URL-driven state
// ============================================
export const dynamic = 'force-dynamic';

import { useState, useMemo, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Plus, 
  X, 
  Search, 
  ArrowLeft, 
  Zap, 
  TrendingUp,
  Award,
  ChevronRight,
  Crown,
  Sparkles,
  BarChart3,
  Share2,
  Download
} from "lucide-react";
import { products, Product, getProductById } from "@/lib/products";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { AIRadarChart } from "@/components/compare/AIRadarChart";
import { HardwareSilhouette } from "@/components/compare/HardwareSilhouette";
import { EnterpriseScaleWarning } from "@/components/enterprise/EnterpriseScaleWarning";
import { toPng } from "html-to-image";

// ============================================
// Product Slot Component (Glassmorphism)
// ============================================

function ProductSlot({
  slot,
  product,
  onSelect,
  onRemove,
  isWinner,
}: {
  slot: number;
  product: Product | null;
  onSelect: (slot: number) => void;
  onRemove: (slot: number) => void;
  isWinner?: boolean;
}) {
  if (!product) {
    return (
      <motion.button
        onClick={() => onSelect(slot)}
        className="group relative w-full h-full min-h-[200px] rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col items-center justify-center gap-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
          <Plus className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
        </div>
        <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
          Add Product {slot}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      className={`relative w-full rounded-2xl overflow-hidden transition-all duration-300 ${
        isWinner
          ? "bg-emerald-500/[0.08] border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          : "bg-white/[0.03] backdrop-blur-md border border-white/10"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Winner Badge */}
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full z-10">
          <Crown className="w-3 h-3" />
          Winner
        </div>
      )}

      {/* Remove Button */}
      <button
        onClick={() => onRemove(slot)}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/[0.05] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all z-10"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Product Content */}
      <div className="p-6">
        <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium uppercase tracking-wider bg-white/[0.05] text-zinc-400 rounded mb-3">
          {product.category}
        </span>

        <div className="flex justify-center mb-4">
          <HardwareSilhouette 
            category={product.category} 
            className="w-24 h-24 text-zinc-600" 
          />
        </div>

        <h3 className="font-sans text-lg font-semibold text-white text-center mb-1 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-zinc-500 text-center mb-4">{product.brand}</p>

        <div className="flex items-center justify-center gap-4">
          <span className="text-2xl font-bold text-emerald-400">
            ${product.price.toLocaleString()}
          </span>
          {product.aiScore && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Award className="w-3 h-3 text-emerald-500" />
              AI: {product.aiScore}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Mobile Swipeable Card View
// ============================================

function MobileCardView({
  products,
  winner,
}: {
  products: (Product | null)[];
  winner: number | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const validProducts = products.filter(Boolean) as Product[];

  if (validProducts.length === 0) return null;

  return (
    <div className="lg:hidden">
      <div className="flex justify-center gap-2 mb-4">
        {validProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === activeIndex ? "w-6 bg-emerald-500" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className={`rounded-2xl overflow-hidden ${
            winner === activeIndex + 1
              ? "bg-emerald-500/[0.08] border-2 border-emerald-500/50"
              : "bg-white/[0.03] border border-white/10"
          }`}
        >
          {winner === activeIndex + 1 && (
            <div className="px-4 py-2 bg-emerald-500/20 flex items-center justify-center gap-1">
              <Crown className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Winner</span>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <HardwareSilhouette 
                category={validProducts[activeIndex].category} 
                className="w-32 h-32 text-zinc-600" 
              />
            </div>
            
            <h3 className="font-sans text-xl font-semibold text-white text-center mb-1">
              {validProducts[activeIndex].name}
            </h3>
            <p className="text-sm text-zinc-500 text-center mb-6">
              {validProducts[activeIndex].brand}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03]">
                <p className="text-[10px] text-zinc-500 uppercase">Price</p>
                <p className="text-lg font-bold text-emerald-400">
                  ${validProducts[activeIndex].price.toLocaleString()}
                </p>
              </div>
              {validProducts[activeIndex].aiScore && (
                <div className="p-3 rounded-xl bg-white/[0.03]">
                  <p className="text-[10px] text-zinc-500 uppercase">AI Score</p>
                  <p className="text-lg font-bold text-white">
                    {validProducts[activeIndex].aiScore}
                  </p>
                </div>
              )}
              {validProducts[activeIndex].specs.vram && (
                <div className="p-3 rounded-xl bg-white/[0.03]">
                  <p className="text-[10px] text-zinc-500 uppercase">VRAM</p>
                  <p className="text-lg font-bold text-white">
                    {validProducts[activeIndex].specs.vram}
                  </p>
                </div>
              )}
              {validProducts[activeIndex].specs.cuda && (
                <div className="p-3 rounded-xl bg-white/[0.03]">
                  <p className="text-[10px] text-zinc-500 uppercase">CUDA</p>
                  <p className="text-lg font-bold text-white">
                    {validProducts[activeIndex].specs.cuda}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Product Search Modal
// ============================================

function ProductSearchModal({
  isOpen,
  onClose,
  onSelect,
  selectedIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  selectedIds: string[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedIds.includes(product.id)) return false;
      
      const matchesSearch = 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = category === "all" || product.category === category;
      
      return matchesSearch && matchesCategory;
    });
  }, [search, category, selectedIds]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl max-h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-sans text-lg font-semibold text-white">Select Product</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                autoFocus
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                    category === cat
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:border-white/10"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[50vh] p-4 space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Cpu className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No products found</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.button
                  key={product.id}
                  onClick={() => onSelect(product)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all group"
                  whileHover={{ x: 4 }}
                >
                  <HardwareSilhouette 
                    category={product.category} 
                    className="w-10 h-10 text-zinc-600 group-hover:text-emerald-500/50 transition-colors" 
                  />
                  <div className="flex-1 text-left">
                    <h4 className="font-sans text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      {product.brand} • {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-emerald-400">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.aiScore && (
                      <p className="text-[10px] text-zinc-500">AI: {product.aiScore}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </motion.button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================
// Main Compare Page Component
// ============================================

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Parse URL parameters (id1, id2, id3)
  const selectedProducts = useMemo(() => {
    const slots: (Product | null)[] = [null, null, null];
    const id1 = searchParams.get("id1");
    const id2 = searchParams.get("id2");
    const id3 = searchParams.get("id3");

    if (id1) slots[0] = getProductById(id1) || null;
    if (id2) slots[1] = getProductById(id2) || null;
    if (id3) slots[2] = getProductById(id3) || null;

    return slots;
  }, [searchParams]);

  // Calculate winner based on AI Score
  const winner = useMemo(() => {
    const valid = selectedProducts.filter(Boolean) as Product[];
    if (valid.length < 2) return null;

    let maxScore = -1;
    let winnerIdx = -1;

    valid.forEach((product, idx) => {
      const score = product.aiScore || 0;
      if (score > maxScore) {
        maxScore = score;
        winnerIdx = idx;
      }
    });

    return winnerIdx >= 0 ? winnerIdx + 1 : null;
  }, [selectedProducts]);

  // Update URL when products change
  const updateUrl = (newProducts: (Product | null)[]) => {
    const params = new URLSearchParams();
    if (newProducts[0]) params.set("id1", newProducts[0].id);
    if (newProducts[1]) params.set("id2", newProducts[1].id);
    if (newProducts[2]) params.set("id3", newProducts[2].id);
    
    router.replace(`/compare?${params.toString()}`, { scroll: false });
  };

  const handleSelect = (slot: number) => {
    setActiveSlot(slot);
    setSearchModalOpen(true);
  };

  const handleProductSelect = (product: Product) => {
    if (activeSlot === null) return;
    
    const newProducts = [...selectedProducts];
    newProducts[activeSlot - 1] = product;
    updateUrl(newProducts);
    
    setSearchModalOpen(false);
    setActiveSlot(null);
  };

  const handleRemove = (slot: number) => {
    const newProducts = [...selectedProducts];
    newProducts[slot - 1] = null;
    updateUrl(newProducts);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#050505",
      });
      const link = document.createElement("a");
      link.download = `comparison-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const selectedIds = selectedProducts
    .filter(Boolean)
    .map((p) => p!.id);

  const validProducts = selectedProducts.filter(Boolean) as Product[];

  return (
    <div className="min-h-screen bg-[#050505]" ref={exportRef}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h1 className="font-sans text-lg font-semibold text-white">
                    Hardware Compare
                  </h1>
                  <p className="text-xs text-zinc-500 hidden sm:block">
                    Professional benchmarking tool
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  shareCopied
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300"
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {shareCopied ? "Copied!" : "Share"}
                </span>
              </button>
              <button
                onClick={handleExport}
                disabled={exporting || validProducts.length < 2}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {exporting ? "Exporting..." : "Export"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Slots */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Select Products
            </h2>
            <span className="text-xs text-zinc-600">
              {validProducts.length}/3 selected
            </span>
          </div>

          {/* Desktop Slots */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {[1, 2, 3].map((slot) => (
              <ProductSlot
                key={slot}
                slot={slot}
                product={selectedProducts[slot - 1]}
                onSelect={handleSelect}
                onRemove={handleRemove}
                isWinner={winner === slot}
              />
            ))}
          </div>

          {/* Mobile Swipeable View */}
          <MobileCardView products={selectedProducts} winner={winner} />
        </section>

        {validProducts.length >= 2 && (
          <>
            {/* Enterprise Scale Warning */}
            <EnterpriseScaleWarning products={validProducts} />
            
            {/* AI Radar Chart */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="font-sans text-lg font-semibold text-white">
                  AI Capability Analysis
                </h2>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <AIRadarChart products={validProducts} />
              </div>
            </section>

            {/* Comparison Table */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="font-sans text-lg font-semibold text-white">
                  Technical Specifications
                </h2>
              </div>
              <ComparisonTable products={validProducts} winner={winner} />
            </section>
          </>
        )}

        {validProducts.length < 2 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="font-sans text-xl font-semibold text-white mb-2">
              Select at least 2 products
            </h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              Add products from the slots above to see detailed comparisons, AI capability analysis, and spec highlights.
            </p>
          </div>
        )}
      </main>

      {/* Search Modal */}
      <ProductSearchModal
        isOpen={searchModalOpen}
        onClose={() => {
          setSearchModalOpen(false);
          setActiveSlot(null);
        }}
        onSelect={handleProductSelect}
        selectedIds={selectedIds}
      />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <Cpu className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
