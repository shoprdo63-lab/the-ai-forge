// AI Forge Hardware Database - Data Layer
// 35 AI-optimized hardware components with affiliate links

export type Category = "GPU" | "CPU";
export type Brand = "NVIDIA" | "AMD" | "Intel";
export type AITier = "S-Tier" | "A-Tier" | "B-Tier" | "C-Tier" | "D-Tier";

export interface Specs {
  vram?: string;
  cuda?: string;
  tensor?: string;
  tflops?: string;
  tdp?: string;
  architecture?: string;
  cores?: string;
  threads?: string;
  clock?: string;
  socket?: string;
}

export interface AffiliateLinks {
  amazon: string;
  ebay: string;
  aliexpress: string;
}

export interface UserReview {
  id: string;
  username: string;
  date: string;
  rating: number;
  text: string;
  verified: boolean;
}

export interface AIIntelligence {
  vramPerDollar: number;
  llama3Tps: number;
  aiTier: AITier;
  inferenceScore: number;
  trainingScore: number;
  efficiencyScore: number;
}

export interface HardwareComponent {
  id: string;
  name: string;
  category: Category;
  brand: Brand;
  price: number;
  msrp: number;
  specs: Specs;
  description: string;
  tags: string[];
  aiScore: number;
  aiIntelligence: AIIntelligence;
  affiliateLinks: AffiliateLinks;
  inStock: boolean;
  releaseDate?: string;
  imageUrl?: string;
  vram?: number; // Direct number access for GPUs
  cudaCores?: number; // Direct number access for GPUs
  wattage: number; // Direct number access
  rating?: number; // Average rating (0-5)
  reviewCount?: number; // Number of reviews
  userReviews?: UserReview[]; // User reviews array
}

// Affiliate ID Constants
const AMAZON_TAG = "aiforge-20";
const EBAY_CAMPAIGN = "5339146149";
const ALIEXPRESS_ID = "528438";

// Helper function to generate affiliate links
function generateAffiliateLinks(productName: string): AffiliateLinks {
  const encoded = encodeURIComponent(productName).replace(/%20/g, "+");
  return {
    amazon: `https://www.amazon.com/s?k=${encoded}&tag=${AMAZON_TAG}`,
    ebay: `https://www.ebay.com/sch/i.html?_nkw=${encoded}&campid=${EBAY_CAMPAIGN}&toolid=20001`,
    aliexpress: `https://www.aliexpress.com/wholesale?SearchText=${encoded}&aff_id=${ALIEXPRESS_ID}&scm=affiliate`,
  };
}

// Helper functions for AI calculations
function extractVram(vramString?: string): number {
  if (!vramString) return 0;
  const match = vramString.match(/(\d+)GB/);
  return match ? parseInt(match[1], 10) : 0;
}

function calculateVramPerDollar(price: number, vramString?: string): number {
  const vram = extractVram(vramString);
  return vram > 0 ? Math.round((vram / price) * 1000) / 1000 : 0;
}

function estimateLlama3Tps(gpuModel: string): number {
  const tpsMap: Record<string, number> = {
    "RTX 4090": 72, "RTX 4080 SUPER": 55, "RTX 4070 Ti SUPER": 48, "RTX 4070 SUPER": 38, "RTX 4070": 32,
    "RTX 3090 Ti": 42, "RTX 3090": 40, "RTX 3080 Ti": 36, "RTX 3080": 32, "RTX 4060 Ti": 28,
    "RTX 6000": 68, "A100": 95, "H100": 140, "A6000": 38, "L40S": 70, "A40": 32,
    "RX 7900 XTX": 52, "RX 7900 XT": 45, "RX 7800 XT": 35, "RX 7700 XT": 30,
  };
  for (const [key, tps] of Object.entries(tpsMap)) {
    if (gpuModel.includes(key)) return tps;
  }
  return 30;
}

function determineAITier(aiScore: number, vram?: string): AITier {
  const vramGb = extractVram(vram);
  if (aiScore >= 95 && vramGb >= 24) return "S-Tier";
  if (aiScore >= 85 && vramGb >= 16) return "A-Tier";
  if (aiScore >= 70 && vramGb >= 12) return "B-Tier";
  if (aiScore >= 60) return "C-Tier";
  return "D-Tier";
}

function createAIIntelligence(price: number, aiScore: number, vramStr: string, name: string): AIIntelligence {
  const vramGb = extractVram(vramStr);
  const vramPerDollar = calculateVramPerDollar(price, vramStr);
  const llama3Tps = vramGb > 0 ? estimateLlama3Tps(name) : 0;
  const aiTier = determineAITier(aiScore, vramStr);
  return {
    vramPerDollar,
    llama3Tps,
    aiTier,
    inferenceScore: Math.min(100, Math.round((aiScore * 0.6) + (vramGb * 0.8))),
    trainingScore: Math.min(100, Math.round((aiScore * 0.7) + (vramGb * 1.2))),
    efficiencyScore: vramGb > 0 ? Math.min(100, Math.round((aiScore * 0.8) / (vramGb * 0.1))) : 60,
  };
}

function createMinimalAIIntelligence(category: Category): AIIntelligence {
  return {
    vramPerDollar: 0, llama3Tps: 0,
    aiTier: category === "CPU" ? "B-Tier" : "C-Tier",
    inferenceScore: category === "CPU" ? 70 : 50,
    trainingScore: category === "CPU" ? 75 : 50,
    efficiencyScore: 60,
  };
}

function getImageUrl(brand: string, name: string): string {
  const encodedName = encodeURIComponent(name.substring(0, 15));
  const brandColors: Record<string, string> = {
    NVIDIA: "0f172a/76b900", AMD: "0f172a/ed1c24", Intel: "0f172a/0071c5",
  };
  const colors = brandColors[brand] || "0f172a/64748b";
  return `https://placehold.co/120x120/${colors}?text=${encodedName}`;
}

// Helper function to generate mock reviews for popular products
function generateMockReviews(productName: string, count: number): UserReview[] {
  const reviewTemplates = [
    { text: "Absolutely incredible performance for LLM inference. Running Llama 3 70B smoothly!", rating: 5 },
    { text: "Great value for the VRAM capacity. Perfect for Stable Diffusion XL workflows.", rating: 5 },
    { text: "Solid build quality and runs cool under load. Highly recommended for AI workstations.", rating: 4 },
    { text: "Best purchase for my AI research setup. Training times cut in half.", rating: 5 },
    { text: "Good performance but runs a bit hot. Make sure you have adequate cooling.", rating: 4 },
    { text: "Excellent for multi-GPU setups. The NVLink support is a game changer.", rating: 5 },
    { text: "Decent card for the price. Handles most AI workloads without issues.", rating: 4 },
    { text: "Power hungry but worth every watt for the performance you get.", rating: 5 },
    { text: "Perfect for fine-tuning models. The 24GB VRAM is essential.", rating: 5 },
    { text: "Great alternative to NVIDIA for open-source AI stacks with ROCm.", rating: 4 },
  ];
  
  const usernames = ["AI_Enthusiast", "ML_Researcher", "DataScientist", "GPU_Miner", "TechReviewer", "DevOps_Guru", "NeuralNet_Ninja", "TensorFlow_Pro", "PyTorch_Fan", "LLM_Wizard"];
  
  const reviews: UserReview[] = [];
  const baseDate = new Date("2024-12-01");
  
  for (let i = 0; i < count; i++) {
    const template = reviewTemplates[i % reviewTemplates.length];
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i * 3);
    
    reviews.push({
      id: `review-${productName.replace(/\s+/g, '-').toLowerCase()}-${i}`,
      username: usernames[i % usernames.length],
      date: date.toISOString().split('T')[0],
      rating: template.rating,
      text: template.text,
      verified: i % 3 !== 0, // 2/3 of reviews are verified
    });
  }
  
  return reviews;
}

// Helper function to calculate average rating from reviews
function calculateAverageRating(reviews: UserReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

// ==================== GPUs (20 units) ====================

const GPUs: HardwareComponent[] = [
  {
    id: "rtx-4070",
    name: "NVIDIA GeForce RTX 4070",
    category: "GPU",
    brand: "NVIDIA",
    price: 599,
    msrp: 599,
    specs: { vram: "12GB GDDR6X", cuda: "5888", tensor: "184", tdp: "200W", tflops: "29.1 FP16", architecture: "Ada Lovelace" },
    description: "Efficient Ada Lovelace with 12GB for AI inference",
    tags: ["Ada Lovelace", "12GB", "Efficient"],
    aiScore: 62,
    aiIntelligence: createAIIntelligence(599, 62, "12GB GDDR6X", "RTX 4070"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4070"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 4070"),
    vram: 12,
    cudaCores: 5888,
    wattage: 200,
  },
  {
    id: "rtx-4090",
    name: "NVIDIA GeForce RTX 4090",
    category: "GPU",
    brand: "NVIDIA",
    price: 1599,
    msrp: 1599,
    specs: { vram: "24GB GDDR6X", cuda: "16384", tensor: "512", tdp: "450W", tflops: "82.6 FP16", architecture: "Ada Lovelace" },
    description: "Current flagship with 24GB VRAM for large models",
    tags: ["Flagship", "24GB", "Popular"],
    aiScore: 95,
    aiIntelligence: createAIIntelligence(1599, 95, "24GB GDDR6X", "RTX 4090"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4090"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 4090"),
    vram: 24,
    cudaCores: 16384,
    wattage: 450,
    userReviews: generateMockReviews("NVIDIA GeForce RTX 4090", 128),
    reviewCount: 128,
    rating: 4.8,
  },
  {
    id: "rtx-4080-super",
    name: "NVIDIA GeForce RTX 4080 SUPER",
    category: "GPU",
    brand: "NVIDIA",
    price: 999,
    msrp: 999,
    specs: { vram: "16GB GDDR6X", cuda: "10240", tensor: "320", tdp: "320W", tflops: "52.2 FP16", architecture: "Ada Lovelace" },
    description: "High-performance GPU for professional AI inference",
    tags: ["Prosumer", "16GB", "Inference"],
    aiScore: 82,
    aiIntelligence: createAIIntelligence(999, 82, "16GB GDDR6X", "RTX 4080 SUPER"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4080 SUPER"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 4080S"),
    vram: 16,
    cudaCores: 10240,
    wattage: 320,
    userReviews: generateMockReviews("NVIDIA GeForce RTX 4080 SUPER", 86),
    reviewCount: 86,
    rating: 4.6,
  },
  {
    id: "rtx-4070-ti-super",
    name: "NVIDIA GeForce RTX 4070 Ti SUPER",
    category: "GPU",
    brand: "NVIDIA",
    price: 799,
    msrp: 799,
    specs: { vram: "16GB GDDR6X", cuda: "8448", tensor: "264", tdp: "285W", tflops: "40.1 FP16", architecture: "Ada Lovelace" },
    description: "Sweet spot for AI enthusiasts with 16GB VRAM",
    tags: ["Enthusiast", "16GB", "Value"],
    aiScore: 75,
    aiIntelligence: createAIIntelligence(799, 75, "16GB GDDR6X", "RTX 4070 Ti SUPER"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4070 Ti SUPER"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 4070Ti"),
    vram: 16,
    cudaCores: 8448,
    wattage: 285,
    userReviews: generateMockReviews("NVIDIA GeForce RTX 4070 Ti SUPER", 64),
    reviewCount: 64,
    rating: 4.5,
  },
  {
    id: "rtx-3090-ti",
    name: "NVIDIA GeForce RTX 3090 Ti",
    category: "GPU",
    brand: "NVIDIA",
    price: 1099,
    msrp: 1999,
    specs: { vram: "24GB GDDR6X", cuda: "10752", tensor: "336", tdp: "450W", tflops: "40 FP16", architecture: "Ampere" },
    description: "Previous-gen flagship, excellent value on used market",
    tags: ["Used Market", "24GB", "NVLink"],
    aiScore: 70,
    aiIntelligence: createAIIntelligence(1099, 70, "24GB GDDR6X", "RTX 3090 Ti"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 3090 Ti"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 3090 Ti"),
    vram: 24,
    cudaCores: 10752,
    wattage: 450,
  },
  {
    id: "rtx-3080-ti",
    name: "NVIDIA GeForce RTX 3080 Ti",
    category: "GPU",
    brand: "NVIDIA",
    price: 899,
    msrp: 1199,
    specs: { vram: "12GB GDDR6X", cuda: "10240", tensor: "320", tdp: "350W", tflops: "34.1 FP16", architecture: "Ampere" },
    description: "High-end Ampere with 12GB for AI workflows",
    tags: ["Ampere", "12GB", "Performance"],
    aiScore: 68,
    aiIntelligence: createAIIntelligence(899, 68, "12GB GDDR6X", "RTX 3080 Ti"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 3080 Ti"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 3080 Ti"),
    vram: 12,
    cudaCores: 10240,
    wattage: 350,
  },
  {
    id: "rtx-4070-super",
    name: "NVIDIA GeForce RTX 4070 SUPER",
    category: "GPU",
    brand: "NVIDIA",
    price: 599,
    msrp: 599,
    specs: { vram: "12GB GDDR6X", cuda: "7168", tensor: "224", tdp: "220W", tflops: "29 FP16", architecture: "Ada Lovelace" },
    description: "Efficient mid-range with 12GB for inference",
    tags: ["Mid-range", "12GB", "Efficient"],
    aiScore: 65,
    aiIntelligence: createAIIntelligence(599, 65, "12GB GDDR6X", "RTX 4070 SUPER"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4070 SUPER"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 4070S"),
    vram: 12,
    cudaCores: 7168,
    wattage: 220,
  },
  {
    id: "rtx-4060-ti-16gb",
    name: "NVIDIA GeForce RTX 4060 Ti 16GB",
    category: "GPU",
    brand: "NVIDIA",
    price: 449,
    msrp: 499,
    specs: { vram: "16GB GDDR6", cuda: "4352", tensor: "136", tdp: "165W", tflops: "23 FP16", architecture: "Ada Lovelace" },
    description: "Efficient entry AI card with 16GB frame buffer",
    tags: ["Entry", "16GB", "Efficient"],
    aiScore: 60,
    aiIntelligence: createAIIntelligence(449, 60, "16GB GDDR6", "RTX 4060 Ti"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4060 Ti 16GB"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 4060 Ti"),
    vram: 16,
    cudaCores: 4352,
    wattage: 165,
  },
  {
    id: "rtx-3090",
    name: "NVIDIA GeForce RTX 3090",
    category: "GPU",
    brand: "NVIDIA",
    price: 999,
    msrp: 1499,
    specs: { vram: "24GB GDDR6X", cuda: "10496", tensor: "328", tdp: "350W", tflops: "35.6 FP16", architecture: "Ampere" },
    description: "Last-gen flagship, great for 24GB AI workloads",
    tags: ["Ampere", "24GB", "NVLink"],
    aiScore: 72,
    aiIntelligence: createAIIntelligence(999, 72, "24GB GDDR6X", "RTX 3090"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 3090"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 3090"),
    vram: 24,
    cudaCores: 10496,
    wattage: 350,
  },
  {
    id: "rtx-3080",
    name: "NVIDIA GeForce RTX 3080",
    category: "GPU",
    brand: "NVIDIA",
    price: 699,
    msrp: 699,
    specs: { vram: "10GB GDDR6X", cuda: "8704", tensor: "272", tdp: "320W", tflops: "29.8 FP16", architecture: "Ampere" },
    description: "Solid Ampere performer for AI inference",
    tags: ["Ampere", "10GB", "Value"],
    aiScore: 58,
    aiIntelligence: createAIIntelligence(699, 58, "10GB GDDR6X", "RTX 3080"),
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 3080"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 3080"),
    vram: 10,
    cudaCores: 8704,
    wattage: 320,
  },
  {
    id: "rtx-6000-ada",
    name: "NVIDIA RTX 6000 Ada Generation",
    category: "GPU",
    brand: "NVIDIA",
    price: 8999,
    msrp: 8999,
    specs: { vram: "48GB GDDR6 ECC", cuda: "18176", tensor: "568", tdp: "300W", tflops: "91 FP16", architecture: "Ada Lovelace" },
    description: "48GB workstation GPU for professional AI development",
    tags: ["Workstation", "48GB", "ECC"],
    aiScore: 98,
    aiIntelligence: createAIIntelligence(8999, 98, "48GB GDDR6", "RTX 6000"),
    affiliateLinks: generateAffiliateLinks("NVIDIA RTX 6000 Ada Generation"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "RTX 6000"),
    vram: 48,
    cudaCores: 18176,
    wattage: 300,
  },
  {
    id: "a100-80gb",
    name: "NVIDIA A100 80GB PCIe",
    category: "GPU",
    brand: "NVIDIA",
    price: 14999,
    msrp: 14999,
    specs: { vram: "80GB HBM2e", cuda: "6912", tensor: "432", tdp: "300W", tflops: "312 FP16", architecture: "Ampere" },
    description: "Data center GPU for large-scale AI training",
    tags: ["Datacenter", "80GB", "HBM2e"],
    aiScore: 99,
    aiIntelligence: createAIIntelligence(14999, 99, "80GB HBM2e", "A100"),
    affiliateLinks: generateAffiliateLinks("NVIDIA A100 80GB"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "A100 80GB"),
    vram: 80,
    cudaCores: 6912,
    wattage: 300,
  },
  {
    id: "h100-80gb",
    name: "NVIDIA H100 80GB PCIe",
    category: "GPU",
    brand: "NVIDIA",
    price: 29999,
    msrp: 29999,
    specs: { vram: "80GB HBM3", cuda: "14592", tensor: "456", tdp: "350W", tflops: "989 FP8", architecture: "Hopper" },
    description: "Next-gen data center GPU with transformer engine",
    tags: ["Datacenter", "80GB", "Transformer Engine"],
    aiScore: 100,
    aiIntelligence: createAIIntelligence(29999, 100, "80GB HBM3", "H100"),
    affiliateLinks: generateAffiliateLinks("NVIDIA H100 80GB"),
    inStock: false,
    imageUrl: getImageUrl("NVIDIA", "H100 80GB"),
    vram: 80,
    cudaCores: 14592,
    wattage: 350,
  },
  {
    id: "a6000",
    name: "NVIDIA RTX A6000",
    category: "GPU",
    brand: "NVIDIA",
    price: 4299,
    msrp: 4299,
    specs: { vram: "48GB GDDR6 ECC", cuda: "10752", tensor: "336", tdp: "300W", tflops: "38.7 FP16", architecture: "Ampere" },
    description: "48GB workstation card for professional visualization",
    tags: ["Workstation", "48GB", "ECC"],
    aiScore: 85,
    aiIntelligence: createAIIntelligence(4299, 85, "48GB GDDR6", "A6000"),
    affiliateLinks: generateAffiliateLinks("NVIDIA RTX A6000"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "A6000"),
    vram: 48,
    cudaCores: 10752,
    wattage: 300,
  },
  {
    id: "rx-7900-xtx",
    name: "AMD Radeon RX 7900 XTX",
    category: "GPU",
    brand: "AMD",
    price: 999,
    msrp: 999,
    specs: { vram: "24GB GDDR6", cuda: "6144", tensor: "192", tdp: "355W", tflops: "61 FP16", architecture: "RDNA 3" },
    description: "24GB RDNA 3 flagship for ROCm workflows",
    tags: ["AMD", "ROCm", "24GB"],
    aiScore: 78,
    aiIntelligence: createAIIntelligence(999, 78, "24GB GDDR6", "RX 7900 XTX"),
    affiliateLinks: generateAffiliateLinks("AMD Radeon RX 7900 XTX"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "RX 7900 XTX"),
    vram: 24,
    cudaCores: 6144,
    wattage: 355,
    userReviews: generateMockReviews("AMD Radeon RX 7900 XTX", 52),
    reviewCount: 52,
    rating: 4.3,
  },
  {
    id: "rx-7900-xt",
    name: "AMD Radeon RX 7900 XT",
    category: "GPU",
    brand: "AMD",
    price: 849,
    msrp: 899,
    specs: { vram: "20GB GDDR6", cuda: "5376", tensor: "168", tdp: "300W", tflops: "52 FP16", architecture: "RDNA 3" },
    description: "20GB card for AI inference on open stacks",
    tags: ["AMD", "ROCm", "20GB"],
    aiScore: 72,
    aiIntelligence: createAIIntelligence(849, 72, "20GB GDDR6", "RX 7900 XT"),
    affiliateLinks: generateAffiliateLinks("AMD Radeon RX 7900 XT"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "RX 7900 XT"),
    vram: 20,
    cudaCores: 5376,
    wattage: 300,
  },
  {
    id: "rx-7800-xt",
    name: "AMD Radeon RX 7800 XT",
    category: "GPU",
    brand: "AMD",
    price: 499,
    msrp: 499,
    specs: { vram: "16GB GDDR6", cuda: "3840", tensor: "120", tdp: "263W", tflops: "37 FP16", architecture: "RDNA 3" },
    description: "16GB mid-range AMD option for budget AI",
    tags: ["AMD", "ROCm", "16GB"],
    aiScore: 65,
    aiIntelligence: createAIIntelligence(499, 65, "16GB GDDR6", "RX 7800 XT"),
    affiliateLinks: generateAffiliateLinks("AMD Radeon RX 7800 XT"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "RX 7800 XT"),
    vram: 16,
    cudaCores: 3840,
    wattage: 263,
  },
  {
    id: "rx-7700-xt",
    name: "AMD Radeon RX 7700 XT",
    category: "GPU",
    brand: "AMD",
    price: 449,
    msrp: 449,
    specs: { vram: "12GB GDDR6", cuda: "3456", tensor: "108", tdp: "245W", tflops: "35 FP16", architecture: "RDNA 3" },
    description: "12GB entry AMD card for basic AI inference",
    tags: ["AMD", "ROCm", "12GB"],
    aiScore: 55,
    aiIntelligence: createAIIntelligence(449, 55, "12GB GDDR6", "RX 7700 XT"),
    affiliateLinks: generateAffiliateLinks("AMD Radeon RX 7700 XT"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "RX 7700 XT"),
    vram: 12,
    cudaCores: 3456,
    wattage: 245,
  },
  {
    id: "l40s",
    name: "NVIDIA L40S",
    category: "GPU",
    brand: "NVIDIA",
    price: 7999,
    msrp: 7999,
    specs: { vram: "48GB GDDR6 ECC", cuda: "18176", tensor: "568", tdp: "350W", tflops: "91.6 FP16", architecture: "Ada Lovelace" },
    description: "Data center visualization and AI inference GPU",
    tags: ["Datacenter", "48GB", "Inference"],
    aiScore: 90,
    aiIntelligence: createAIIntelligence(7999, 90, "48GB GDDR6", "L40S"),
    affiliateLinks: generateAffiliateLinks("NVIDIA L40S"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "L40S"),
    vram: 48,
    cudaCores: 18176,
    wattage: 350,
  },
  {
    id: "a40",
    name: "NVIDIA A40",
    category: "GPU",
    brand: "NVIDIA",
    price: 3499,
    msrp: 3499,
    specs: { vram: "48GB GDDR6 ECC", cuda: "10752", tensor: "336", tdp: "300W", tflops: "37.4 FP16", architecture: "Ampere" },
    description: "48GB passive cooling for dense server configs",
    tags: ["Datacenter", "48GB", "Passive"],
    aiScore: 80,
    aiIntelligence: createAIIntelligence(3499, 80, "48GB GDDR6", "A40"),
    affiliateLinks: generateAffiliateLinks("NVIDIA A40"),
    inStock: true,
    imageUrl: getImageUrl("NVIDIA", "A40"),
    vram: 48,
    cudaCores: 10752,
    wattage: 300,
  },
];

// ==================== CPUs (15 units) ====================

const CPUs: HardwareComponent[] = [
  {
    id: "tr-pro-7995wx",
    name: "AMD Ryzen Threadripper PRO 7995WX",
    category: "CPU",
    brand: "AMD",
    price: 4999,
    msrp: 4999,
    specs: { cores: "96", threads: "192", clock: "2.5 / 5.1 GHz", tdp: "350W", socket: "sTR5", architecture: "Zen 4" },
    description: "96-core workstation CPU for massive AI preprocessing",
    tags: ["Workstation", "96-Core", "HEDT"],
    aiScore: 98,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("AMD Ryzen Threadripper PRO 7995WX"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "TR PRO 7995WX"),
    wattage: 350,
  },
  {
    id: "tr-7980x",
    name: "AMD Ryzen Threadripper 7980X",
    category: "CPU",
    brand: "AMD",
    price: 2999,
    msrp: 2999,
    specs: { cores: "64", threads: "128", clock: "3.2 / 5.1 GHz", tdp: "350W", socket: "sTR5", architecture: "Zen 4" },
    description: "64-core enthusiast CPU for multi-GPU setups",
    tags: ["Enthusiast", "64-Core", "HEDT"],
    aiScore: 92,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("AMD Ryzen Threadripper 7980X"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "TR 7980X"),
    wattage: 350,
  },
  {
    id: "tr-7970x",
    name: "AMD Ryzen Threadripper 7970X",
    category: "CPU",
    brand: "AMD",
    price: 2499,
    msrp: 2499,
    specs: { cores: "32", threads: "64", clock: "4.0 / 5.3 GHz", tdp: "350W", socket: "sTR5", architecture: "Zen 4" },
    description: "32-core high-frequency Threadripper for AI",
    tags: ["Enthusiast", "32-Core", "HEDT"],
    aiScore: 88,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("AMD Ryzen Threadripper 7970X"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "TR 7970X"),
    wattage: 350,
  },
  {
    id: "ryzen-9-9950x",
    name: "AMD Ryzen 9 9950X",
    category: "CPU",
    brand: "AMD",
    price: 649,
    msrp: 649,
    specs: { cores: "16", threads: "32", clock: "4.3 / 5.7 GHz", tdp: "170W", socket: "AM5", architecture: "Zen 5" },
    description: "16-core Zen 5 flagship with best single-thread perf",
    tags: ["Gaming", "16-Core", "Zen 5"],
    aiScore: 85,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("AMD Ryzen 9 9950X"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "R9 9950X"),
    wattage: 170,
    userReviews: generateMockReviews("AMD Ryzen 9 9950X", 42),
    reviewCount: 42,
    rating: 4.7,
  },
  {
    id: "ryzen-9-9900x",
    name: "AMD Ryzen 9 9900X",
    category: "CPU",
    brand: "AMD",
    price: 549,
    msrp: 549,
    specs: { cores: "12", threads: "24", clock: "4.4 / 5.6 GHz", tdp: "120W", socket: "AM5", architecture: "Zen 5" },
    description: "12-core Zen 5 for high-performance AI workstations",
    tags: ["Gaming", "12-Core", "Zen 5"],
    aiScore: 82,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("AMD Ryzen 9 9900X"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "R9 9900X"),
    wattage: 120,
  },
  {
    id: "ryzen-7-7800x3d",
    name: "AMD Ryzen 7 7800X3D",
    category: "CPU",
    brand: "AMD",
    price: 369,
    msrp: 449,
    specs: { cores: "8", threads: "16", clock: "4.2 / 5.0 GHz", tdp: "120W", socket: "AM5", architecture: "Zen 4" },
    description: "8-core 3D V-Cache for low-latency inference",
    tags: ["Gaming", "3D V-Cache", "Efficient"],
    aiScore: 72,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("AMD Ryzen 7 7800X3D"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "R7 7800X3D"),
    wattage: 120,
  },
  {
    id: "ryzen-5-7600x",
    name: "AMD Ryzen 5 7600X",
    category: "CPU",
    brand: "AMD",
    price: 199,
    msrp: 299,
    specs: { cores: "6", threads: "12", clock: "4.7 / 5.3 GHz", tdp: "105W", socket: "AM5", architecture: "Zen 4" },
    description: "6-core budget AM5 option for single-GPU stations",
    tags: ["Budget", "Entry", "AM5"],
    aiScore: 60,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("AMD Ryzen 5 7600X"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "R5 7600X"),
    wattage: 105,
  },
  {
    id: "core-ultra-9-285k",
    name: "Intel Core Ultra 9 285K",
    category: "CPU",
    brand: "Intel",
    price: 589,
    msrp: 589,
    specs: { cores: "24", threads: "24", clock: "3.7 / 5.7 GHz", tdp: "125W", socket: "LGA1851", architecture: "Arrow Lake" },
    description: "24-core CPU with integrated NPU for AI acceleration",
    tags: ["NPU", "AI Acceleration", "Hybrid"],
    aiScore: 82,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("Intel Core Ultra 9 285K"),
    inStock: true,
    imageUrl: getImageUrl("Intel", "Ultra 9 285K"),
    wattage: 125,
  },
  {
    id: "core-ultra-7-265k",
    name: "Intel Core Ultra 7 265K",
    category: "CPU",
    brand: "Intel",
    price: 439,
    msrp: 439,
    specs: { cores: "20", threads: "20", clock: "3.9 / 5.5 GHz", tdp: "125W", socket: "LGA1851", architecture: "Arrow Lake" },
    description: "20-core Arrow Lake with NPU for AI workloads",
    tags: ["NPU", "AI Acceleration", "Arrow Lake"],
    aiScore: 78,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("Intel Core Ultra 7 265K"),
    inStock: true,
    imageUrl: getImageUrl("Intel", "Ultra 7 265K"),
    wattage: 125,
  },
  {
    id: "core-i9-14900k",
    name: "Intel Core i9-14900K",
    category: "CPU",
    brand: "Intel",
    price: 589,
    msrp: 589,
    specs: { cores: "24", threads: "32", clock: "3.2 / 6.0 GHz", tdp: "125W", socket: "LGA1700", architecture: "Raptor Lake" },
    description: "High-frequency desktop CPU for single-GPU setups",
    tags: ["Gaming", "High Frequency", "Desktop"],
    aiScore: 80,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("Intel Core i9-14900K"),
    inStock: true,
    imageUrl: getImageUrl("Intel", "i9-14900K"),
    wattage: 125,
  },
  {
    id: "core-i7-14700k",
    name: "Intel Core i7-14700K",
    category: "CPU",
    brand: "Intel",
    price: 419,
    msrp: 419,
    specs: { cores: "20", threads: "28", clock: "3.4 / 5.6 GHz", tdp: "125W", socket: "LGA1700", architecture: "Raptor Lake" },
    description: "20-core desktop CPU for balanced AI workloads",
    tags: ["Desktop", "Balanced", "Performance"],
    aiScore: 75,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("Intel Core i7-14700K"),
    inStock: true,
    imageUrl: getImageUrl("Intel", "i7-14700K"),
    wattage: 125,
  },
  {
    id: "core-i5-14600k",
    name: "Intel Core i5-14600K",
    category: "CPU",
    brand: "Intel",
    price: 329,
    msrp: 329,
    specs: { cores: "14", threads: "20", clock: "3.5 / 5.3 GHz", tdp: "125W", socket: "LGA1700", architecture: "Raptor Lake" },
    description: "14-core value Intel option for entry AI workstations",
    tags: ["Value", "Entry", "LGA1700"],
    aiScore: 65,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("Intel Core i5-14600K"),
    inStock: true,
    imageUrl: getImageUrl("Intel", "i5-14600K"),
    wattage: 125,
  },
  {
    id: "core-i9-13900k",
    name: "Intel Core i9-13900K",
    category: "CPU",
    brand: "Intel",
    price: 499,
    msrp: 589,
    specs: { cores: "24", threads: "32", clock: "3.0 / 5.8 GHz", tdp: "125W", socket: "LGA1700", architecture: "Raptor Lake" },
    description: "Previous-gen flagship with 24 cores for AI",
    tags: ["Desktop", "24-Core", "Raptor Lake"],
    aiScore: 78,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("Intel Core i9-13900K"),
    inStock: true,
    imageUrl: getImageUrl("Intel", "i9-13900K"),
    wattage: 125,
  },
  {
    id: "core-i7-13700k",
    name: "Intel Core i7-13700K",
    category: "CPU",
    brand: "Intel",
    price: 349,
    msrp: 409,
    specs: { cores: "16", threads: "24", clock: "3.4 / 5.4 GHz", tdp: "125W", socket: "LGA1700", architecture: "Raptor Lake" },
    description: "16-core previous-gen for value AI workstations",
    tags: ["Value", "16-Core", "Raptor Lake"],
    aiScore: 72,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("Intel Core i7-13700K"),
    inStock: true,
    imageUrl: getImageUrl("Intel", "i7-13700K"),
    wattage: 125,
  },
  {
    id: "epyc-9654",
    name: "AMD EPYC 9654",
    category: "CPU",
    brand: "AMD",
    price: 11805,
    msrp: 11805,
    specs: { cores: "96", threads: "192", clock: "2.4 / 3.7 GHz", tdp: "360W", socket: "SP5", architecture: "Zen 4" },
    description: "96-core server CPU for massive parallel workloads",
    tags: ["Server", "96-Core", "Enterprise"],
    aiScore: 95,
    aiIntelligence: createMinimalAIIntelligence("CPU"),
    affiliateLinks: generateAffiliateLinks("AMD EPYC 9654"),
    inStock: true,
    imageUrl: getImageUrl("AMD", "EPYC 9654"),
    wattage: 360,
  },
];

// ==================== Combined Array ====================

export const hardwareComponents: HardwareComponent[] = [...GPUs, ...CPUs];

// Export individual categories for convenience
export { GPUs, CPUs };

// Export affiliate constants for reference
export { AMAZON_TAG, EBAY_CAMPAIGN, ALIEXPRESS_ID };

// Additional exports for component compatibility
export const AI_TIERS: AITier[] = ["S-Tier", "A-Tier", "B-Tier", "C-Tier", "D-Tier"];
export const CATEGORIES: Category[] = ["GPU", "CPU"];
export const VRAM_BUCKETS = [8, 12, 16, 20, 24, 32, 48, 80];

export const TIER_COLORS: Record<AITier, { bg: string; text: string; border: string }> = {
  "S-Tier": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "A-Tier": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "B-Tier": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  "C-Tier": { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" },
  "D-Tier": { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/30" },
};

// Helper functions
export function getComponentById(id: string): HardwareComponent | undefined {
  return hardwareComponents.find((c) => c.id === id);
}

export function getComponentsByCategory(category: Category): HardwareComponent[] {
  return hardwareComponents.filter((c) => c.category === category);
}

export function getComponentsByBrand(brand: Brand): HardwareComponent[] {
  return hardwareComponents.filter((c) => c.brand === brand);
}

export function getGPUsByMinVram(minVram: number): HardwareComponent[] {
  return hardwareComponents.filter(
    (c) => c.category === "GPU" && c.vram && c.vram >= minVram
  );
}

export function getTotalWattage(componentIds: string[]): number {
  return componentIds.reduce((total, id) => {
    const component = getComponentById(id);
    return total + (component?.wattage || 0);
  }, 0);
}
