export interface AIModel {
  id: string;
  name: string;
  vramRequired: number; // Minimum VRAM in GB
  vramRecommended: number; // Recommended VRAM for good performance
  ramRequired: number; // Minimum System RAM in GB
  description: string;
}

export const aiModels: AIModel[] = [
  {
    id: "llama-3-8b",
    name: "Llama 3 (8B)",
    vramRequired: 8,
    vramRecommended: 16,
    ramRequired: 16,
    description: "Meta's efficient 8B model. Excellent for general chat and local reasoning."
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 (70B)",
    vramRequired: 40,
    vramRecommended: 48,
    ramRequired: 64,
    description: "High-performance 70B model. Requires dual-GPU or high-end workstation setup."
  },
  {
    id: "mistral-7b",
    name: "Mistral (7B)",
    vramRequired: 6,
    vramRecommended: 12,
    ramRequired: 16,
    description: "Compact and powerful. Great for low-latency inference."
  },
  {
    id: "sdxl",
    name: "Stable Diffusion XL",
    vramRequired: 8,
    vramRecommended: 16,
    ramRequired: 32,
    description: "State-of-the-art image generation. VRAM is critical for high-resolution output."
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder (33B)",
    vramRequired: 20,
    vramRecommended: 24,
    ramRequired: 32,
    description: "Specialized for programming tasks. 24GB VRAM (RTX 3090/4090) recommended."
  }
];

export type UseCase = "Inference" | "Training" | "Fine-tuning";

export interface AIRequirement {
  vramMultiplier: number;
  ramMultiplier: number;
}

export const useCaseRequirements: Record<UseCase, AIRequirement> = {
  "Inference": { vramMultiplier: 1.0, ramMultiplier: 1.0 },
  "Fine-tuning": { vramMultiplier: 1.5, ramMultiplier: 2.0 },
  "Training": { vramMultiplier: 2.5, ramMultiplier: 4.0 }
};
