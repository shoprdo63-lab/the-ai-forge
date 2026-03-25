import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { HardwareComponent } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper functions for comparison calculations

/**
 * Calculate percentage difference between two values
 * @returns Object with diff percentage and which value is higher
 */
export function calculateDiff(val1: number, val2: number): {
  diff: number;
  higher: 1 | 2 | null;
  diffPercent: number;
} {
  if (val1 === val2) {
    return { diff: 0, higher: null, diffPercent: 0 };
  }
  const higher = val1 > val2 ? 1 : 2;
  const diff = Math.abs(val1 - val2);
  const diffPercent = Math.round((diff / Math.max(val1, val2)) * 100);
  return { diff, higher, diffPercent };
}

/**
 * Determine which component wins in a specific category
 */
export function getBetterComponent(
  c1: HardwareComponent,
  c2: HardwareComponent,
  category: "vram" | "cuda" | "wattage" | "price" | "aiScore"
): { winner: 1 | 2 | "tie"; diff: number; diffPercent: number } {
  let val1: number;
  let val2: number;

  switch (category) {
    case "vram":
      val1 = c1.vram || 0;
      val2 = c2.vram || 0;
      // More VRAM is better
      const vramDiff = calculateDiff(val1, val2);
      return {
        winner: vramDiff.higher || "tie",
        diff: vramDiff.diff,
        diffPercent: vramDiff.diffPercent,
      };

    case "cuda":
      val1 = parseInt(c1.specs.cuda || "0");
      val2 = parseInt(c2.specs.cuda || "0");
      // More CUDA cores is better
      const cudaDiff = calculateDiff(val1, val2);
      return {
        winner: cudaDiff.higher || "tie",
        diff: cudaDiff.diff,
        diffPercent: cudaDiff.diffPercent,
      };

    case "wattage":
      val1 = c1.wattage || 0;
      val2 = c2.wattage || 0;
      // Lower wattage is better (more efficient)
      if (val1 === val2) return { winner: "tie", diff: 0, diffPercent: 0 };
      const wattageWinner = val1 < val2 ? 1 : 2;
      const wattageDiff = Math.abs(val1 - val2);
      const wattageDiffPercent = Math.round((wattageDiff / Math.max(val1, val2)) * 100);
      return {
        winner: wattageWinner,
        diff: wattageDiff,
        diffPercent: wattageDiffPercent,
      };

    case "price":
      val1 = c1.price;
      val2 = c2.price;
      // Lower price is better
      if (val1 === val2) return { winner: "tie", diff: 0, diffPercent: 0 };
      const priceWinner = val1 < val2 ? 1 : 2;
      const priceDiff = Math.abs(val1 - val2);
      const priceDiffPercent = Math.round((priceDiff / Math.max(val1, val2)) * 100);
      return {
        winner: priceWinner,
        diff: priceDiff,
        diffPercent: priceDiffPercent,
      };

    case "aiScore":
      val1 = c1.aiScore;
      val2 = c2.aiScore;
      // Higher AI score is better
      const scoreDiff = calculateDiff(val1, val2);
      return {
        winner: scoreDiff.higher || "tie",
        diff: scoreDiff.diff,
        diffPercent: scoreDiff.diffPercent,
      };

    default:
      return { winner: "tie", diff: 0, diffPercent: 0 };
  }
}

/**
 * Get overall winner based on AI performance
 */
export function getOverallWinner(
  c1: HardwareComponent,
  c2: HardwareComponent
): { winner: 1 | 2 | "tie"; score1: number; score2: number } {
  // Weight different factors
  const vramWeight = 0.3;
  const cudaWeight = 0.3;
  const aiScoreWeight = 0.4;

  const vram1 = c1.vram || 0;
  const vram2 = c2.vram || 0;
  const cuda1 = parseInt(c1.specs.cuda || "0");
  const cuda2 = parseInt(c2.specs.cuda || "0");

  // Normalize scores (0-100 scale)
  const maxVram = Math.max(vram1, vram2) || 1;
  const maxCuda = Math.max(cuda1, cuda2) || 1;

  const score1 =
    (vram1 / maxVram) * vramWeight * 100 +
    (cuda1 / maxCuda) * cudaWeight * 100 +
    (c1.aiScore / 100) * aiScoreWeight * 100;

  const score2 =
    (vram2 / maxVram) * vramWeight * 100 +
    (cuda2 / maxCuda) * cudaWeight * 100 +
    (c2.aiScore / 100) * aiScoreWeight * 100;

  if (Math.abs(score1 - score2) < 1) {
    return { winner: "tie", score1, score2 };
  }

  return {
    winner: score1 > score2 ? 1 : 2,
    score1: Math.round(score1),
    score2: Math.round(score2),
  };
}

/**
 * Format price with currency
 */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

/**
 * Get winner color class
 */
export function getWinnerColor(isWinner: boolean, isTie: boolean): string {
  if (isTie) return "text-slate-400";
  return isWinner ? "text-[#10b981]" : "text-slate-400";
}
