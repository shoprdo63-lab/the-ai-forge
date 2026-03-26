"use client";

import { Cpu, Database, BookOpen, Wrench } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import ScrollProgressBar from "./ScrollProgressBar";

export default function Navbar() {
  return (
    <>
      <ScrollProgressBar />
      <nav className="sticky top-0 left-0 right-0 z-50 navbar">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg">
                <Cpu className="w-5 h-5 text-[var(--accent)]" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                AI Forge
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/components"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded-md transition-colors"
              >
                <Database className="w-4 h-4" strokeWidth={1.5} />
                Database
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded-md transition-colors"
              >
                <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                Guides
              </Link>
              <Link
                href="/builder"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded-md transition-colors"
              >
                <Wrench className="w-4 h-4" strokeWidth={1.5} />
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
