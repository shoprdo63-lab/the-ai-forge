import {
  hardwareComponents,
  type HardwareComponent,
  getGPUsByVram,
} from "@/data/components";

// ============================================
// Use Case Definitions
// ============================================

export type UseCase = "budget-llm" | "deep-learning-pro" | "creative-ai";

export interface UseCaseDefinition {
  id: UseCase;
  name: string;
  description: string;
  icon: string;
  minVram: number;
  recommendedVram: number;
  minBudget: number;
  optimalBudget: number;
  priority: "vram" | "tensor-cores" | "raw-performance";
}

export const useCases: UseCaseDefinition[] = [
  {
    id: "budget-llm",
    name: "Budget LLM",
    description: "Run 8B parameter models efficiently on a tight budget",
    icon: "MessageSquare",
    minVram: 8,
    recommendedVram: 12,
    minBudget: 800,
    optimalBudget: 1500,
    priority: "vram",
  },
  {
    id: "deep-learning-pro",
    name: "Deep Learning Pro",
    description: "Train heavy models with maximum performance",
    icon: "Brain",
    minVram: 24,
    recommendedVram: 48,
    minBudget: 3000,
    optimalBudget: 8000,
    priority: "tensor-cores",
  },
  {
    id: "creative-ai",
    name: "Creative AI",
    description: "Generate images with Stable Diffusion and FLUX",
    icon: "Palette",
    minVram: 12,
    recommendedVram: 24,
    minBudget: 1200,
    optimalBudget: 2500,
    priority: "raw-performance",
  },
];

// ============================================
// Build Configuration Types
// ============================================

export interface BuildPreferences {
  budget: number;
  useCase: UseCase;
  brandPreference: "nvidia-only" | "no-preference";
}

export interface RecommendedBuild {
  gpu: HardwareComponent;
  cpu: HardwareComponent;
  motherboard: HardwareComponent;
  ram: HardwareComponent;
  storage: HardwareComponent;
  psu: HardwareComponent;
  cooling: HardwareComponent;
  totalPrice: number;
  aiScore: number;
  totalVram: number;
  estimatedWattage: number;
  reasoning: string[];
}

// ============================================
// Scoring Functions
// ============================================

function calculateGPUScore(
  gpu: HardwareComponent,
  useCase: UseCaseDefinition,
  budget: number
): number {
  let score = 0;
  const vramMatch = gpu.specs.vram?.match(/(\d+)/);
  const vram = vramMatch ? parseInt(vramMatch[1]) : 0;

  // VRAM scoring (0-40 points)
  if (vram >= useCase.recommendedVram) {
    score += 40;
  } else if (vram >= useCase.minVram) {
    score += 25;
  } else {
    score += (vram / useCase.minVram) * 20;
  }

  // AI Score weighting (0-30 points)
  score += (gpu.aiScore / 100) * 30;

  // Price efficiency (0-30 points)
  const priceRatio = gpu.price / budget;
  if (priceRatio <= 0.4) {
    score += 30;
  } else if (priceRatio <= 0.6) {
    score += 20;
  } else if (priceRatio <= 0.8) {
    score += 10;
  }

  // Use case specific bonuses
  if (useCase.id === "deep-learning-pro" && gpu.brand === "NVIDIA") {
    score += 10; // Bonus for NVIDIA in training
  }

  if (useCase.id === "creative-ai" && vram >= 16) {
    score += 5; // Bonus for high VRAM in image generation
  }

  return Math.min(100, Math.round(score));
}

function calculateCPUScore(
  cpu: HardwareComponent,
  gpu: HardwareComponent,
  useCase: UseCaseDefinition
): number {
  let score = 0;

  // Core count scoring
  const coresMatch = cpu.specs.cores?.match(/(\d+)/);
  const cores = coresMatch ? parseInt(coresMatch[1]) : 0;

  if (cores >= 16) {
    score += 40;
  } else if (cores >= 8) {
    score += 30;
  } else {
    score += (cores / 8) * 25;
  }

  // AI Score weighting
  score += (cpu.aiScore / 100) * 30;

  // Balance with GPU (0-30 points)
  const gpuPrice = gpu.price;
  const cpuPrice = cpu.price;
  const balanceRatio = cpuPrice / gpuPrice;

  // Ideal CPU is 15-25% of GPU cost for AI workloads
  if (balanceRatio >= 0.15 && balanceRatio <= 0.35) {
    score += 30;
  } else if (balanceRatio >= 0.1 && balanceRatio <= 0.5) {
    score += 20;
  } else {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}

// ============================================
// Component Matching Logic
// ============================================

function findBestGPU(
  budget: number,
  useCase: UseCaseDefinition,
  brandPreference: "nvidia-only" | "no-preference"
): HardwareComponent {
  const gpus = hardwareComponents.filter((c) => c.category === "GPU");

  const filteredGPUs = gpus.filter((gpu) => {
    // Budget constraint: GPU should be 40-70% of total budget
    const gpuBudgetMax = budget * 0.7;
    const gpuBudgetMin = budget * 0.3;

    if (gpu.price > gpuBudgetMax || gpu.price < gpuBudgetMin) {
      return false;
    }

    // Brand preference
    if (brandPreference === "nvidia-only" && gpu.brand !== "NVIDIA") {
      return false;
    }

    // Minimum VRAM requirement
    const vramMatch = gpu.specs.vram?.match(/(\d+)/);
    const vram = vramMatch ? parseInt(vramMatch[1]) : 0;
    if (vram < useCase.minVram) {
      return false;
    }

    return true;
  });

  if (filteredGPUs.length === 0) {
    // Fallback: just find any GPU within budget with min VRAM
    const fallback = gpus.filter((gpu) => {
      const vramMatch = gpu.specs.vram?.match(/(\d+)/);
      const vram = vramMatch ? parseInt(vramMatch[1]) : 0;
      return gpu.price <= budget * 0.8 && vram >= useCase.minVram;
    });

    if (fallback.length === 0) {
      // Ultimate fallback: RTX 4060 Ti 16GB
      return (
        gpus.find((g) => g.id === "rtx-4060-ti-16gb") || gpus[0]
      );
    }

    return fallback.sort((a, b) => b.aiScore - a.aiScore)[0];
  }

  // Score and sort all candidates
  const scoredGPUs = filteredGPUs.map((gpu) => ({
    gpu,
    score: calculateGPUScore(gpu, useCase, budget),
  }));

  return scoredGPUs.sort((a, b) => b.score - a.score)[0].gpu;
}

function findBestCPU(
  budget: number,
  gpu: HardwareComponent,
  useCase: UseCaseDefinition
): HardwareComponent {
  const cpus = hardwareComponents.filter((c) => c.category === "CPU");
  const remainingBudget = budget - gpu.price;
  const cpuBudget = remainingBudget * 0.25; // 25% of remaining for CPU

  const filteredCPUs = cpus.filter((cpu) => {
    // CPU should fit in budget
    if (cpu.price > cpuBudget * 1.3) {
      return false;
    }

    // Minimum cores for use case
    const coresMatch = cpu.specs.cores?.match(/(\d+)/);
    const cores = coresMatch ? parseInt(coresMatch[1]) : 0;

    if (useCase.id === "deep-learning-pro" && cores < 12) {
      return false;
    }
    if (useCase.id === "creative-ai" && cores < 6) {
      return false;
    }

    return true;
  });

  if (filteredCPUs.length === 0) {
    // Fallback: any CPU within budget
    const fallback = cpus.filter((cpu) => cpu.price <= cpuBudget * 1.5);
    if (fallback.length === 0) {
      return cpus.find((c) => c.id === "ryzen-5-7600x") || cpus[0];
    }
    return fallback.sort((a, b) => b.aiScore - a.aiScore)[0];
  }

  const scoredCPUs = filteredCPUs.map((cpu) => ({
    cpu,
    score: calculateCPUScore(cpu, gpu, useCase),
  }));

  return scoredCPUs.sort((a, b) => b.score - a.score)[0].cpu;
}

function findCompatibleMotherboard(
  cpu: HardwareComponent,
  gpu: HardwareComponent,
  budget: number
): HardwareComponent {
  const motherboards = hardwareComponents.filter(
    (c) => c.category === "Motherboard"
  );
  const cpuSocket = cpu.specs.socket;

  // Find boards with matching socket
  const compatible = motherboards.filter((mb) => {
    const matchesSocket = mb.specs.socket === cpuSocket;
    const fitsBudget = mb.price <= 350; // Cap for motherboard
    return matchesSocket && fitsBudget;
  });

  if (compatible.length === 0) {
    return (
      motherboards.find((m) => m.id === "b650-aorus-elite") ||
      motherboards[0]
    );
  }

  // Prefer boards with good VRM for high-power GPUs
  return compatible.sort((a, b) => b.aiScore - a.aiScore)[0];
}

function findBestRAM(
  useCase: UseCaseDefinition,
  cpu: HardwareComponent,
  budget: number
): HardwareComponent {
  const rams = hardwareComponents.filter((c) => c.category === "RAM");
  const remainingBudget = budget * 0.1; // ~10% for RAM

  // Determine capacity needed based on use case
  let minCapacity = 64;
  if (useCase.id === "deep-learning-pro") {
    minCapacity = 128;
  } else if (useCase.id === "creative-ai") {
    minCapacity = 64;
  }

  const suitable = rams.filter((ram) => {
    const capacityMatch = ram.specs.capacity?.match(/(\d+)/);
    const capacity = capacityMatch ? parseInt(capacityMatch[1]) : 0;
    return capacity >= minCapacity && ram.price <= remainingBudget * 1.5;
  });

  if (suitable.length === 0) {
    return (
      rams.find((r) => r.id === "vengeance-64gb-5600") || rams[0]
    );
  }

  return suitable.sort((a, b) => b.aiScore - a.aiScore)[0];
}

function findBestStorage(
  useCase: UseCaseDefinition,
  budget: number
): HardwareComponent {
  const storage = hardwareComponents.filter(
    (c) => c.category === "Storage"
  );

  // AI workloads need fast NVMe
  const suitable = storage.filter((s) => {
    const isFast = s.specs.readSpeed?.includes("7,000") ||
                   s.specs.readSpeed?.includes("6,900") ||
                   s.specs.readSpeed?.includes("5,000");
    return isFast && s.price <= budget * 0.08;
  });

  if (suitable.length === 0) {
    return (
      storage.find((s) => s.id === "990-pro-4tb") || storage[0]
    );
  }

  // Prefer larger capacity for training workloads
  if (useCase.id === "deep-learning-pro") {
    return suitable.sort((a, b) => b.aiScore - a.aiScore)[0];
  }

  return suitable.sort((a, b) => a.price - b.price)[0];
}

function findBestPSU(
  gpu: HardwareComponent,
  cpu: HardwareComponent,
  budget: number
): HardwareComponent {
  const psus = hardwareComponents.filter((c) => c.category === "PSU");

  // Calculate power requirements
  const gpuTdpMatch = gpu.specs.tdp?.match(/(\d+)/);
  const gpuTdp = gpuTdpMatch ? parseInt(gpuTdpMatch[1]) : 350;
  const cpuTdpMatch = cpu.specs.tdp?.match(/(\d+)/);
  const cpuTdp = cpuTdpMatch ? parseInt(cpuTdpMatch[1]) : 125;

  const systemWattage = gpuTdp + cpuTdp + 150; // +150 for rest of system
  const recommendedWattage = Math.ceil(systemWattage * 1.2); // 20% headroom

  // Round to common PSU sizes
  const targetWattage =
    recommendedWattage <= 850
      ? 850
      : recommendedWattage <= 1000
      ? 1000
      : recommendedWattage <= 1200
      ? 1200
      : 1600;

  const suitable = psus.filter((psu) => {
    const wattageMatch = psu.specs.wattage?.match(/(\d+)/);
    const wattage = wattageMatch ? parseInt(wattageMatch[1]) : 0;
    return wattage >= targetWattage && psu.price <= budget * 0.1;
  });

  if (suitable.length === 0) {
    return psus.find((p) => p.specs.wattage?.includes("1000")) || psus[0];
  }

  // Prefer higher efficiency
  return suitable.sort((a, b) => b.aiScore - a.aiScore)[0];
}

function findBestCooling(
  cpu: HardwareComponent,
  gpu: HardwareComponent,
  budget: number
): HardwareComponent {
  const coolers = hardwareComponents.filter(
    (c) => c.category === "Cooling"
  );

  const cpuTdpMatch = cpu.specs.tdp?.match(/(\d+)/);
  const cpuTdp = cpuTdpMatch ? parseInt(cpuTdpMatch[1]) : 125;

  // High TDP CPUs need serious cooling
  const needsHighEndCooling = cpuTdp > 200 || cpu.specs.cores?.includes("64");

  const suitable = coolers.filter((c) => {
    const fitsBudget = c.price <= budget * 0.06;
    const canHandleTdp = needsHighEndCooling
      ? c.aiScore >= 80
      : c.aiScore >= 60;
    return fitsBudget && canHandleTdp;
  });

  if (suitable.length === 0) {
    return (
      coolers.find((c) => c.id === "nh-d15-g2") || coolers[0]
    );
  }

  return suitable.sort((a, b) => b.aiScore - a.aiScore)[0];
}

// ============================================
// Main Recommendation Function
// ============================================

export function recommendBuild(
  preferences: BuildPreferences
): RecommendedBuild {
  const useCase = useCases.find((uc) => uc.id === preferences.useCase);
  if (!useCase) {
    throw new Error(`Unknown use case: ${preferences.useCase}`);
  }

  // Step 1: Find best GPU (most important for AI)
  const gpu = findBestGPU(
    preferences.budget,
    useCase,
    preferences.brandPreference
  );

  // Step 2: Find compatible CPU
  const cpu = findBestCPU(preferences.budget, gpu, useCase);

  // Step 3: Find compatible motherboard
  const motherboard = findCompatibleMotherboard(
    cpu,
    gpu,
    preferences.budget
  );

  // Step 4: Find RAM
  const ram = findBestRAM(useCase, cpu, preferences.budget);

  // Step 5: Find Storage
  const storage = findBestStorage(useCase, preferences.budget);

  // Step 6: Find PSU
  const psu = findBestPSU(gpu, cpu, preferences.budget);

  // Step 7: Find Cooling
  const cooling = findBestCooling(cpu, gpu, preferences.budget);

  // Calculate totals
  const totalPrice =
    gpu.price +
    cpu.price +
    motherboard.price +
    ram.price +
    storage.price +
    psu.price +
    cooling.price;

  // Calculate AI Score (weighted average)
  const aiScore = Math.round(
    gpu.aiScore * 0.5 +
    cpu.aiScore * 0.2 +
    motherboard.aiScore * 0.1 +
    ram.aiScore * 0.1 +
    storage.aiScore * 0.05 +
    psu.aiScore * 0.025 +
    cooling.aiScore * 0.025
  );

  // Calculate total VRAM
  const vramMatch = gpu.specs.vram?.match(/(\d+)/);
  const totalVram = vramMatch ? parseInt(vramMatch[1]) : 0;

  // Calculate estimated wattage
  const gpuTdp = parseInt(gpu.specs.tdp?.match(/(\d+)/)?.[0] || "350");
  const cpuTdp = parseInt(cpu.specs.tdp?.match(/(\d+)/)?.[0] || "125");
  const estimatedWattage = gpuTdp + cpuTdp + 150;

  // Generate reasoning
  const reasoning: string[] = [];
  reasoning.push(
    `${gpu.name} selected for ${useCase.name} with ${totalVram}GB VRAM`
  );
  reasoning.push(
    `${cpu.name} provides optimal host processing for ${gpu.brand} GPU`
  );
  reasoning.push(
    `System designed for ${estimatedWattage}W peak power draw`
  );
  if (totalPrice > preferences.budget) {
    reasoning.push(
      `Build exceeds budget by $${(totalPrice - preferences.budget).toLocaleString()} for optimal performance`
    );
  } else if (totalPrice < preferences.budget * 0.9) {
    reasoning.push(
      `Build under budget - upgrade recommendations available`
    );
  }

  return {
    gpu,
    cpu,
    motherboard,
    ram,
    storage,
    psu,
    cooling,
    totalPrice,
    aiScore,
    totalVram,
    estimatedWattage,
    reasoning,
  };
}

// ============================================
// Build URL Encoding/Decoding
// ============================================

export interface BuildURLParams {
  budget: number;
  useCase: UseCase;
  brandPreference: "nvidia-only" | "no-preference";
}

export function encodeBuildToURL(params: BuildURLParams): string {
  const encoded = btoa(
    JSON.stringify({
      b: params.budget,
      u: params.useCase,
      p: params.brandPreference === "nvidia-only" ? "n" : "a",
    })
  );
  return `?build=${encoded}`;
}

export function decodeURLToBuild(searchParams: {
  [key: string]: string | string[] | undefined;
}): BuildURLParams | null {
  const buildParam = searchParams.build;
  if (typeof buildParam !== "string") {
    return null;
  }

  try {
    const decoded = JSON.parse(atob(buildParam));
    return {
      budget: decoded.b,
      useCase: decoded.u,
      brandPreference: decoded.p === "n" ? "nvidia-only" : "no-preference",
    };
  } catch {
    return null;
  }
}

// ============================================
// Affiliate Link Generation
// ============================================

export interface AffiliateLinkGroup {
  store: "Amazon" | "eBay" | "AliExpress";
  links: { name: string; url: string; price: number }[];
  totalPrice: number;
}

export function generateAffiliateLinksForBuild(
  build: RecommendedBuild
): AffiliateLinkGroup[] {
  const components = [
    build.gpu,
    build.cpu,
    build.motherboard,
    build.ram,
    build.storage,
    build.psu,
    build.cooling,
  ];

  const stores: ("Amazon" | "eBay" | "AliExpress")[] = [
    "Amazon",
    "eBay",
    "AliExpress",
  ];

  return stores.map((store) => {
    const links = components.map((component) => ({
      name: component.name,
      url: component.affiliateLinks[store.toLowerCase() as keyof typeof component.affiliateLinks],
      price: component.price,
    }));

    const totalPrice = links.reduce((sum, link) => sum + link.price, 0);

    return {
      store,
      links,
      totalPrice,
    };
  });
}
