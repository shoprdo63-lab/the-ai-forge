"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Grid3X3,
  Cpu,
  Scale,
  Zap,
  Menu,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Explore", href: "/", icon: Grid3X3 },
  { label: "Builder", href: "/builder", icon: Cpu },
  { label: "Compare", href: "/compare", icon: Scale },
  { label: "Wattage", href: "/wattage", icon: Zap },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [activeTouch, setActiveTouch] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphism background with safe area support */}
      <div
        className="relative bg-slate-950/80 backdrop-blur-xl border-t border-white/10"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Glow effect at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isPressed = activeTouch === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onTouchStart={() => setActiveTouch(item.href)}
                onTouchEnd={() => setActiveTouch(null)}
                onMouseDown={() => setActiveTouch(item.href)}
                onMouseUp={() => setActiveTouch(null)}
                onMouseLeave={() => setActiveTouch(null)}
                className="relative flex flex-col items-center gap-1 p-2 min-w-[64px]"
              >
                <motion.div
                  animate={{
                    scale: isPressed ? 0.92 : 1,
                    y: isPressed ? 1 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    active
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800/50 text-slate-400"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  
                  <Icon className="w-5 h-5 relative z-10" strokeWidth={active ? 2.5 : 2} />
                </motion.div>

                <span
                  className={`text-xs font-medium transition-colors ${
                    active ? "text-emerald-400" : "text-slate-400"
                  }`}
                  style={{ fontSize: "11px" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
