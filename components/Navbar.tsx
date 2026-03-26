"use client";

import { useState } from "react";
import { Cpu, Database, BookOpen, Wrench, Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import ScrollProgressBar from "./ScrollProgressBar";

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
      <ScrollProgressBar />
      <nav className="sticky top-0 left-0 right-0 z-50 bg-[#0f0f13]/95 backdrop-blur-xl border-b border-[#2a2a30]">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-[#1a1a1f] border border-[#2a2a30] rounded-lg group-hover:border-[#00d4aa] transition-colors">
                <Cpu className="w-5 h-5 text-[#00d4aa]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">
                  AI Forge
                </span>
                <span className="text-[10px] text-[#666] uppercase tracking-wider hidden sm:block">
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
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all ${
                      active
                        ? "text-[#00d4aa] bg-[#00d4aa]/10 border border-[#00d4aa]/20"
                        : "text-[#aaa] hover:text-white hover:bg-[#1a1a1f]"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#aaa] hover:text-white hover:bg-[#1a1a1f] rounded-md transition-colors"
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
          <div className="md:hidden border-t border-[#2a2a30] bg-[#0f0f13]/98 backdrop-blur">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                      active
                        ? "text-[#00d4aa] bg-[#00d4aa]/10 border border-[#00d4aa]/20"
                        : "text-[#aaa] hover:text-white hover:bg-[#1a1a1f]"
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
