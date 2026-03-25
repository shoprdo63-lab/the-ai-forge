// System Validation Engine
// Validates AI build configurations for compatibility and safety

import type { GPU, CPU, Motherboard, RAM, PSU } from "./compatibility";

export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  category: "power" | "thermal" | "compatibility" | "performance" | "memory";
  title: string;
  description: string;
  affectedComponents: string[];
  suggestedFix?: string;
}

export interface BuildConfiguration {
  cpus: CPU[];
  gpus: GPU[];
  motherboards: Motherboard[];
  rams: RAM[];
  psus: PSU[];
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  powerConsumption: {
    total: number;
    gpu: number;
    cpu: number;
    headroom: number;
    percentUtilized: number;
  };
  recommendations: string[];
}

/**
 * Validates a complete AI build configuration
 * @param build - The build configuration to validate
 * @returns Validation result with issues and recommendations
 */
export function validateBuild(build: BuildConfiguration): ValidationResult {
  const issues: ValidationIssue[] = [];
  const recommendations: string[] = [];
  
  // Power validation
  const powerValidation = validatePowerSupply(build);
  issues.push(...powerValidation.issues);
  
  // Thermal validation
  const thermalValidation = validateThermalDesign(build);
  issues.push(...thermalValidation.issues);
  
  // Compatibility validation
  const compatibilityValidation = validateComponentCompatibility(build);
  issues.push(...compatibilityValidation.issues);
  
  // Memory validation
  const memoryValidation = validateMemoryConfiguration(build);
  issues.push(...memoryValidation.issues);
  
  // Performance recommendations
  const perfRecs = generatePerformanceRecommendations(build);
  recommendations.push(...perfRecs);
  
  // Calculate power consumption
  const powerConsumption = calculatePowerConsumption(build);
  
  const isValid = !issues.some(i => i.severity === "error");
  
  return {
    isValid,
    issues,
    powerConsumption,
    recommendations,
  };
}

/**
 * Validates power supply adequacy for multi-GPU builds
 * Specifically checks: 2+ GPUs require 1000W+ PSU
 */
function validatePowerSupply(build: BuildConfiguration): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  
  if (build.gpus.length === 0) {
    issues.push({
      id: "power-001",
      severity: "error",
      category: "power",
      title: "No GPU Selected",
      description: "AI workloads require at least one GPU. Please select a compatible graphics card.",
      affectedComponents: ["gpu"],
      suggestedFix: "Add a GPU with at least 16GB VRAM for training workloads.",
    });
    return { issues };
  }
  
  const totalGpuTdp = build.gpus.reduce((sum, gpu) => sum + gpu.tdp, 0);
  const cpuTdp = build.cpus[0]?.tdp || 150;
  const systemOverhead = 100; // Fans, storage, motherboard
  const recommendedHeadroom = 1.2; // 20% headroom
  
  const estimatedConsumption = (totalGpuTdp + cpuTdp + systemOverhead) * recommendedHeadroom;
  
  if (build.psus.length === 0) {
    // No PSU selected - recommend based on GPU count
    const recommendedWattage = Math.ceil(estimatedConsumption / 100) * 100;
    
    if (build.gpus.length >= 2) {
      issues.push({
        id: "power-002",
        severity: "warning",
        category: "power",
        title: "Multi-GPU Power Requirement",
        description: `${build.gpus.length} GPUs detected. A ${recommendedWattage}W or higher PSU is strongly recommended. Minimum 1000W required for multi-GPU stability.`,
        affectedComponents: ["psu"],
        suggestedFix: `Select a PSU with at least ${Math.max(1000, recommendedWattage)}W capacity for ${build.gpus.length}x GPU configuration.`,
      });
    }
    
    return { issues };
  }
  
  const psu = build.psus[0];
  
  // Critical: Multi-GPU with under 1000W PSU
  if (build.gpus.length >= 2 && psu.wattage < 1000) {
    issues.push({
      id: "power-003",
      severity: "error",
      category: "power",
      title: "Insufficient Power for Multi-GPU",
      description: `Your ${psu.wattage}W PSU is insufficient for ${build.gpus.length} GPUs (estimated need: ${Math.ceil(estimatedConsumption)}W). System will be unstable under load and may damage components.`,
      affectedComponents: ["psu", ...build.gpus.map(g => g.id)],
      suggestedFix: `Upgrade to a ${Math.ceil(estimatedConsumption / 100) * 100}W or higher PSU (minimum 1000W for multi-GPU).`,
    });
  }
  // Warning: Single high-end GPU with borderline PSU
  else if (build.gpus.length === 1 && build.gpus[0].tdp >= 400 && psu.wattage < 850) {
    issues.push({
      id: "power-004",
      severity: "warning",
      category: "power",
      title: "Borderline Power Supply",
      description: `Your ${psu.wattage}W PSU may struggle with a ${build.gpus[0].name} (${build.gpus[0].tdp}W TDP) under sustained AI workloads.`,
      affectedComponents: ["psu", build.gpus[0].id],
      suggestedFix: "Consider a 1000W+ PSU for sustained AI training loads to ensure stability.",
    });
  }
  // General power check
  else if (psu.wattage < estimatedConsumption) {
    issues.push({
      id: "power-005",
      severity: "error",
      category: "power",
      title: "Power Supply Undersized",
      description: `Estimated power draw (${Math.ceil(estimatedConsumption)}W) exceeds PSU capacity (${psu.wattage}W).`,
      affectedComponents: ["psu"],
      suggestedFix: `Upgrade to a ${Math.ceil(estimatedConsumption / 100) * 100}W PSU or higher.`,
    });
  }
  
  // Check PCIe connectors
  const required8Pin = build.gpus.filter(g => g.tdp > 320).length * 3; // High-end GPUs need 3x8pin
  const required12VHPWR = build.gpus.filter(g => g.powerConnectors.some(p => p.includes("12VHPWR"))).length;
  
  if (required12VHPWR > psu.pcie12vhpwrConnectors && required12VHPWR > 0) {
    issues.push({
      id: "power-006",
      severity: "warning",
      category: "power",
      title: "Insufficient 12VHPWR Connectors",
      description: `Need ${required12VHPWR} 12VHPWR connector(s), but PSU only has ${psu.pcie12vhpwrConnectors}.`,
      affectedComponents: ["psu"],
      suggestedFix: "Use included adapters or select a PSU with more native 12VHPWR connectors.",
    });
  }
  
  return { issues };
}

/**
 * Validates thermal design for sustained AI workloads
 */
function validateThermalDesign(build: BuildConfiguration): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  
  const totalTdp = build.gpus.reduce((sum, gpu) => sum + gpu.tdp, 0) + 
                   (build.cpus[0]?.tdp || 0);
  
  // Sustained AI workloads generate more heat than gaming
  const aiLoadMultiplier = 1.15; // 15% more heat under sustained AI load
  const adjustedTdp = totalTdp * aiLoadMultiplier;
  
  if (adjustedTdp > 800 && build.gpus.length >= 2) {
    issues.push({
      id: "thermal-001",
      severity: "warning",
      category: "thermal",
      title: "High Thermal Load",
      description: `System will dissipate ~${Math.round(adjustedTdp)}W under sustained AI training. Ensure adequate case airflow or liquid cooling.`,
      affectedComponents: ["cooling"],
      suggestedFix: "Consider a case with 3+ intake fans or custom loop liquid cooling for multi-GPU setups.",
    });
  }
  
  if (build.gpus.some(g => g.tdp >= 450)) {
    issues.push({
      id: "thermal-002",
      severity: "info",
      category: "thermal",
      title: "Flagship GPU Thermal Management",
      description: "450W+ GPUs require excellent case airflow. Maintain 2-3 slot spacing between GPUs.",
      affectedComponents: build.gpus.filter(g => g.tdp >= 450).map(g => g.id),
      suggestedFix: "Use PCIe riser cables or liquid-cooled GPU variants for compact builds.",
    });
  }
  
  return { issues };
}

/**
 * Validates component compatibility (socket, PCIe lanes, etc.)
 */
function validateComponentCompatibility(build: BuildConfiguration): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  
  // Socket compatibility
  if (build.cpus.length > 0 && build.motherboards.length > 0) {
    const cpuSocket = build.cpus[0].socket;
    const mbSocket = build.motherboards[0].socket;
    
    if (cpuSocket !== mbSocket) {
      issues.push({
        id: "compat-001",
        severity: "error",
        category: "compatibility",
        title: "Socket Mismatch",
        description: `CPU socket (${cpuSocket}) does not match motherboard socket (${mbSocket}).`,
        affectedComponents: [build.cpus[0].id, build.motherboards[0].id],
        suggestedFix: `Select a motherboard with ${cpuSocket} socket for your ${build.cpus[0].name}.`,
      });
    }
  }
  
  // PCIe lane check for multi-GPU
  if (build.gpus.length >= 2 && build.motherboards.length > 0 && build.cpus.length > 0) {
    const mb = build.motherboards[0];
    const requiredSlots = build.gpus.length;
    
    if (!mb.supportsMultiGpu) {
      issues.push({
        id: "compat-002",
        severity: "error",
        category: "compatibility",
        title: "Multi-GPU Not Supported",
        description: `Motherboard does not support ${build.gpus.length} GPUs simultaneously.`,
        affectedComponents: [mb.id, ...build.gpus.map(g => g.id)],
        suggestedFix: "Select a workstation motherboard with support for multiple x16 slots.",
      });
    }
    
    if (mb.pciSlots.x16 < requiredSlots) {
      issues.push({
        id: "compat-003",
        severity: "warning",
        category: "compatibility",
        title: "Limited PCIe x16 Slots",
        description: `Need ${requiredSlots} x16 slots, but motherboard only has ${mb.pciSlots.x16}. GPUs may run at reduced bandwidth.`,
        affectedComponents: [mb.id],
        suggestedFix: "Consider a Threadripper workstation board for full x16 bandwidth on all GPUs.",
      });
    }
  }
  
  // NVLink check for multi-GPU training
  if (build.gpus.length >= 2) {
    const nvlinkSupport = build.gpus.filter(g => g.supportsNvlink).length;
    if (nvlinkSupport === 0) {
      issues.push({
        id: "compat-004",
        severity: "info",
        category: "performance",
        title: "NVLink Not Available",
        description: "Selected GPUs do not support NVLink. Multi-GPU training will use PCIe which may bottleneck large model training.",
        affectedComponents: build.gpus.map(g => g.id),
        suggestedFix: "Consider RTX 3090 Ti or A6000 Ada for NVLink support in multi-GPU training.",
      });
    } else if (nvlinkSupport < build.gpus.length) {
      issues.push({
        id: "compat-005",
        severity: "info",
        category: "performance",
        title: "Partial NVLink Support",
        description: `Only ${nvlinkSupport} of ${build.gpus.length} GPUs support NVLink.`,
        affectedComponents: build.gpus.map(g => g.id),
        suggestedFix: "Use identical GPU models for optimal NVLink performance.",
      });
    }
  }
  
  return { issues };
}

/**
 * Validates memory configuration for AI workloads
 */
function validateMemoryConfiguration(build: BuildConfiguration): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  
  if (build.rams.length === 0) {
    return { issues };
  }
  
  const totalRam = build.rams.reduce((sum, ram) => sum + ram.totalCapacity, 0);
  const totalVram = build.gpus.reduce((sum, gpu) => sum + gpu.vramGb, 0);
  
  // AI model size to RAM ratio recommendation
  // For every 1GB of VRAM, ideally have 4-8GB of system RAM
  const recommendedRam = totalVram * 4;
  
  if (totalRam < recommendedRam && build.gpus.length > 0) {
    issues.push({
      id: "memory-001",
      severity: "warning",
      category: "memory",
      title: "Suboptimal RAM-to-VRAM Ratio",
      description: `System has ${totalRam}GB RAM for ${totalVram}GB VRAM. Recommended: ${recommendedRam}GB+ for large model training.`,
      affectedComponents: build.rams.map(r => r.id),
      suggestedFix: `Upgrade to ${recommendedRam}GB or more system memory to prevent CPU bottlenecks during data loading.`,
    });
  }
  
  // Check for ECC on workstation builds
  if (build.cpus.some(c => c.supportsEcc) && !build.rams.some(r => r.hasEcc)) {
    const mb = build.motherboards[0];
    if (mb && mb.memorySlots >= 8) { // Likely workstation
      issues.push({
        id: "memory-002",
        severity: "info",
        category: "memory",
        title: "ECC Memory Recommended",
        description: "Workstation CPU detected without ECC memory. Consider ECC for long training runs.",
        affectedComponents: build.rams.map(r => r.id),
        suggestedFix: "Use ECC UDIMM or RDIMM modules for enhanced stability in 24/7 AI workloads.",
      });
    }
  }
  
  return { issues };
}

/**
 * Generates performance recommendations based on build configuration
 */
function generatePerformanceRecommendations(build: BuildConfiguration): string[] {
  const recommendations: string[] = [];
  
  if (build.gpus.length === 1 && build.gpus[0].vramGb >= 24) {
    recommendations.push("24GB+ VRAM allows training 7B parameter models with LoRA or 13B models for inference.");
  }
  
  if (build.gpus.length >= 2) {
    recommendations.push(`Multi-GPU setup detected. Use PyTorch DistributedDataParallel or DeepSpeed for optimal scaling across ${build.gpus.length} GPUs.`);
  }
  
  if (build.gpus.some(g => g.vramGb >= 48)) {
    recommendations.push("48GB+ VRAM enables full fine-tuning of 13B models or 70B model inference with quantization.");
  }
  
  if (build.cpus.some(c => c.cores >= 32)) {
    recommendations.push("High core count CPU detected. Excellent for data preprocessing and ETL pipelines before GPU training.");
  }
  
  if (build.rams.reduce((sum, r) => sum + r.totalCapacity, 0) >= 128) {
    recommendations.push("128GB+ system RAM enables loading large datasets entirely in memory, reducing storage I/O bottlenecks.");
  }
  
  return recommendations;
}

/**
 * Calculates estimated power consumption
 */
function calculatePowerConsumption(build: BuildConfiguration): ValidationResult["powerConsumption"] {
  const gpu = build.gpus.reduce((sum, g) => sum + g.tdp, 0);
  const cpu = build.cpus[0]?.tdp || 150;
  const other = 100; // Storage, fans, pumps, etc.
  
  const total = gpu + cpu + other;
  const headroom = build.psus[0] ? build.psus[0].wattage - total : 0;
  const percentUtilized = build.psus[0] ? (total / build.psus[0].wattage) * 100 : 0;
  
  return {
    total,
    gpu,
    cpu,
    headroom,
    percentUtilized,
  };
}

// Quick validation helpers
export const hasCriticalErrors = (result: ValidationResult): boolean => 
  result.issues.some(i => i.severity === "error");

export const getCriticalIssues = (result: ValidationResult): ValidationIssue[] => 
  result.issues.filter(i => i.severity === "error");

export const getWarnings = (result: ValidationResult): ValidationIssue[] => 
  result.issues.filter(i => i.severity === "warning");
