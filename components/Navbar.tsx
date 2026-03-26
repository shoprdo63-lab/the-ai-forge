"use client";

import { useState } from "react";
import { Cpu, Database, BookOpen, Wrench, Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/products", label: "Products", icon: Database },
  { href: "/compare", label: "Compare", icon: ShoppingCart },
  { href: "/builder", label: "Builder", icon: Wrench },
  { href: "/blog", label: "Guides", icon: BookOpen },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#e5e5e5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-[#0d9488]/10 rounded-xl group-hover:bg-[#0d9488]/20 transition-colors">
                <Cpu className="w-5 h-5 text-[#0d9488]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#0a0a0a] leading-tight">
                  AI Forge
                </span>
                <span className="text-[10px] text-[#737373] uppercase tracking-wider hidden sm:block">
                  Hardware Database
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
                      active
                        ? "text-[#0d9488] bg-[#0d9488]/10 font-medium"
                        : "text-[#525252] hover:text-[#0a0a0a] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Side - CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Browse Products
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#525252] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e5e5e5] bg-white/98 backdrop-blur">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? "text-[#0d9488] bg-[#0d9488]/10 font-medium"
                        : "text-[#525252] hover:text-[#0a0a0a] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-[#e5e5e5] mt-4">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#0d9488] text-white font-medium rounded-lg"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
