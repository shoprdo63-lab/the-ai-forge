"use client";

import { Cpu, Database, BookOpen, Wrench } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import ScrollProgressBar from "./ScrollProgressBar";

export default function Navbar() {
  return (
    <>
      <ScrollProgressBar />
      <nav className="sticky top-0 left-0 right-0 z-50 navbar-glass transition-colors duration-500">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                <Cpu className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-lg font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">
                AI Forge
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/components"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded-lg transition-all"
              >
                <Database className="w-4 h-4" />
                Database
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded-lg transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Guides
              </Link>
              <Link
                href="/builder"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded-lg transition-all"
              >
                <Wrench className="w-4 h-4" />
                Build Configurator
              </Link>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
