// AI Forge Builder Logic - Client-Side Version
// Static export compatible - no "use server" directives

import { hardwareComponents } from "@/data/components";
import type { HardwareComponent } from "@/data/components";

// ============================================
// Builder Configuration Constants
// ============================================

export const PLANS = [
  {
    id: "entry",
    name: "Entry AI",
    description: "Perfect for beginners and small model inference",
    minBudget: 800,
    maxBudget: 1500,
    minVram: 8,
    recommendedVram: 12,
    tier: "budget",
    icon: "Cpu",
  },
  {
    id: "enthusiast",
    name: "Enthusiast",
    description: "Balanced performance for inference and light training",
    minBudget: 1500,
    maxBudget: 3000,
    minVram: 16,
    recommendedVram: 24,
    tier: "mid-range",
    icon: "Zap",
  },
  {
    id: "professional",
    name: "Professional",
    description: "High-performance for serious AI workloads",
    minBudget: 3000,
    maxBudget: 6000,
    minVram: 24,
    recommendedVram: 48,
    tier: "high-end",
    icon: "Brain",
  },
  {
    id: "ultra",
    name: "Ultra-Advanced",
    description: "Maximum performance for demanding training tasks",
    minBudget: 6000,
    maxBudget: 50000,
    minVram: 48,
    recommendedVram: 80,
    tier: "flagship",
    icon: "Crown",
  },
] as const;

export const CATEGORIES = [
  { id: "llm", name: "Large Language Models", icon: "MessageSquare", minVram: 16 },
  { id: "image", name: "Image Generation", icon: "Palette", minVram: 12 },
  { id: "multimodal", name: "Multimodal Training", icon: "Layers", minVram: 24 },
  { id: "inference", name: "API Inference", icon: "Server", minVram: 8 },
  { id: "training", name: "Model Training", icon: "GraduationCap", minVram: 48 },
] as const;

export const OS_OPTIONS = [
  { id: "ubuntu", name: "Ubuntu Server", icon: "Linux", description: "Industry standard for AI development" },
  { id: "windows", name: "Windows 11 Pro", icon: "Monitor", description: "Best for compatibility with creative tools" },
  { id: "wsl", name: "Windows + WSL2", icon: "Terminal", description: "Best of both worlds" },
  { id: "proxmox", name: "Proxmox VE", icon: "Cloud", description: "Virtualization for multiple workloads" },
] as const;

// ============================================
// State Types
// ============================================

export interface BuilderState {
  step: number;
  plan: string | null;
  category: string | null;
  os: string | null;
  recommendedGPU: HardwareComponent | null;
  totalPrice: number;
  shareableUrl: string;
}

export interface BuilderAction {
  type: "SET_PLAN" | "SET_CATEGORY" | "SET_OS" | "GENERATE_BUILD" | "RESET";
  payload?: string | null;
}

// ============================================
// Server Actions
// ============================================

export function updateBuilderState(
  currentState: BuilderState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    case "SET_PLAN": {
      const plan = PLANS.find((p) => p.id === action.payload);
      if (!plan) return currentState;

      return {
        ...currentState,
        step: 2,
        plan: action.payload as string,
        recommendedGPU: null,
      };
    }

    case "SET_CATEGORY": {
      const category = CATEGORIES.find((c) => c.id === action.payload);
      if (!category) return currentState;

      // Find best GPU based on plan and category constraints
      const recommendedGPU = findOptimalGPU(
        currentState.plan!,
        action.payload as string
      );

      return {
        ...currentState,
        step: 3,
        category: action.payload as string,
        recommendedGPU,
      };
    }

    case "SET_OS": {
      const totalPrice = calculateBuildPrice(
        currentState.recommendedGPU,
        currentState.plan!
      );

      const shareableUrl = generateShareableUrl({
        plan: currentState.plan!,
        category: currentState.category!,
        os: action.payload as string,
        gpu: currentState.recommendedGPU?.id || "",
      });

      return {
        ...currentState,
        step: 4,
        os: action.payload as string,
        totalPrice,
        shareableUrl,
      };
    }

    case "GENERATE_BUILD": {
      return currentState;
    }

    case "RESET": {
      return {
        step: 1,
        plan: null,
        category: null,
        os: null,
        recommendedGPU: null,
        totalPrice: 0,
        shareableUrl: "",
      };
    }

    default:
      return currentState;
  }
}

// ============================================
// Helper Functions
// ============================================

function findOptimalGPU(
  planId: string,
  categoryId: string
): HardwareComponent | null {
  const plan = PLANS.find((p) => p.id === planId);
  const category = CATEGORIES.find((c) => c.id === categoryId);
  
  if (!plan || !category) return null;

  // Filter GPUs by VRAM requirement
  const suitableGPUs = hardwareComponents.filter((component) => {
    if (component.category !== "GPU") return false;
    
    const vramMatch = component.specs.vram?.match(/(\d+)/);
    const vram = vramMatch ? parseInt(vramMatch[1]) : 0;
    
    // Must meet minimum VRAM for category
    if (vram < category.minVram) return false;
    
    // Must fit within plan budget (GPU is ~60% of build)
    const gpuBudget = plan.maxBudget * 0.65;
    if (component.price > gpuBudget) return false;
    
    return true;
  });

  if (suitableGPUs.length === 0) return null;

  // Score GPUs based on plan and category
  const scoredGPUs = suitableGPUs.map((gpu) => {
    let score = 0;
    const vramMatch = gpu.specs.vram?.match(/(\d+)/);
    const vram = vramMatch ? parseInt(vramMatch[1]) : 0;

    // VRAM scoring (0-40 points)
    if (vram >= plan.recommendedVram) {
      score += 40;
    } else if (vram >= plan.minVram) {
      score += 25;
    } else {
      score += Math.max(0, (vram / plan.minVram) * 20);
    }

    // AI Score weighting (0-30 points)
    score += (gpu.aiScore / 100) * 30;

    // Price efficiency (0-30 points)
    const priceRatio = gpu.price / plan.maxBudget;
    if (priceRatio <= 0.4) {
      score += 30;
    } else if (priceRatio <= 0.5) {
      score += 20;
    } else if (priceRatio <= 0.65) {
      score += 10;
    }

    // Category-specific bonuses
    if (categoryId === "training" && gpu.brand === "NVIDIA") {
      score += 10; // CUDA advantage for training
    }
    if (categoryId === "inference" && gpu.specs.tdp) {
      const tdp = parseInt(gpu.specs.tdp) || 450;
      if (tdp < 300) score += 5; // Efficiency bonus
    }

    return { gpu, score: Math.min(100, Math.round(score)) };
  });

  // Return highest scored GPU
  const best = scoredGPUs.sort((a, b) => b.score - a.score)[0];
  return best?.gpu || null;
}

function calculateBuildPrice(
  gpu: HardwareComponent | null,
  planId: string
): number {
  if (!gpu) return 0;
  
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return 0;

  // Estimate other components based on GPU selection
  const gpuPrice = gpu.price;
  
  // Typical ratios for AI workstation
  const cpuRatio = 0.25;      // CPU is ~25% of GPU cost
  const motherboardRatio = 0.15; // Motherboard ~15% of GPU
  const ramRatio = 0.15;      // RAM ~15% of GPU
  const storageRatio = 0.08;   // Storage ~8% of GPU
  const psuRatio = 0.12;     // PSU ~12% of GPU
  const coolingRatio = 0.08;  // Cooling ~8% of GPU

  const estimatedTotal = Math.round(
    gpuPrice * (1 + cpuRatio + motherboardRatio + ramRatio + storageRatio + psuRatio + coolingRatio)
  );

  // Cap at plan max budget
  return Math.min(estimatedTotal, plan.maxBudget);
}

function generateShareableUrl(params: {
  plan: string;
  category: string;
  os: string;
  gpu: string;
}): string {
  const queryParams = new URLSearchParams({
    plan: params.plan,
    category: params.category,
    os: params.os,
    gpu: params.gpu,
  });

  return `?${queryParams.toString()}`;
}

// ============================================
// Build Validation & URL Decoding
// ============================================

export function decodeBuilderUrl(
  searchParams: Record<string, string | string[] | undefined>
): Partial<BuilderState> | null {
  const plan = searchParams.plan as string;
  const category = searchParams.category as string;
  const os = searchParams.os as string;
  const gpu = searchParams.gpu as string;

  if (!plan || !category) return null;

  // Validate plan
  const validPlan = PLANS.find((p) => p.id === plan);
  if (!validPlan) return null;

  // Validate category
  const validCategory = CATEGORIES.find((c) => c.id === category);
  if (!validCategory) return null;

  // Validate OS
  const validOS = OS_OPTIONS.find((o) => o.id === os);
  
  // Find GPU if specified
  let recommendedGPU: HardwareComponent | null = null;
  if (gpu) {
    recommendedGPU = hardwareComponents.find((c) => c.id === gpu && c.category === "GPU") || null;
  }

  // Calculate step based on what's filled
  let step = 1;
  if (plan) step = 2;
  if (plan && category) step = 3;
  if (plan && category && os) step = 4;

  const totalPrice = calculateBuildPrice(recommendedGPU, plan);

  return {
    step,
    plan,
    category,
    os: validOS ? os : null,
    recommendedGPU,
    totalPrice,
  };
}
