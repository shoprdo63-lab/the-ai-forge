"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Search, 
  Menu, 
  X, 
  Zap,
  ShoppingCart,
  User,
  ChevronRight
} from "lucide-react";
import { hardwareComponents } from "@/data/components";

export default function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof hardwareComponents>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = hardwareComponents.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-[#1e293b]/50">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                <Zap className="h-2.5 w-2.5 text-[#0a0f1a]" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight">AI Forge</span>
              <span className="block text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Hardware Database</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "/", label: "Products", active: true },
              { href: "/builder", label: "System Builder" },
              { href: "/blog", label: "Blog" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${
                  link.active 
                    ? "text-white bg-[#1e293b]/50" 
                    : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/30"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center gap-2 px-3 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/50 rounded-lg transition-all"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:block text-[13px]">Search</span>
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-[400px] bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
                        <input
                          type="text"
                          placeholder="Search components..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-[#334155] rounded-lg text-[13px] text-white placeholder-[#64748b] focus:outline-none focus:border-emerald-500"
                          autoFocus
                        />
                      </div>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="border-t border-[#1e293b] max-h-64 overflow-y-auto">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/#${result.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#1e293b]/50 transition-colors"
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                          >
                            <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center text-[#64748b]">
                              <Cpu className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-white font-medium truncate">{result.name}</p>
                              <p className="text-[11px] text-[#64748b]">{result.category} · {result.brand}</p>
                            </div>
                            <span className="text-[13px] text-emerald-400 font-semibold">${result.price}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button className="relative flex items-center gap-2 px-3 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/50 rounded-lg transition-all">
              <ShoppingCart className="h-4 w-4" />
            </button>

            {/* User */}
            <button className="hidden md:flex items-center gap-2 px-3 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/50 rounded-lg transition-all">
              <User className="h-4 w-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/50 rounded-lg transition-all"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#1e293b]/50 bg-[#0a0f1a]/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-4 space-y-1">
              {[
                { href: "/", label: "Products" },
                { href: "/builder", label: "System Builder" },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-4 py-3 text-[14px] text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/30 rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

