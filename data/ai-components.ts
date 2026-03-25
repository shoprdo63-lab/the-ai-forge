// AI Forge Hardware Database v2 - PC Part Picker Style
// Specific product URLs for Amazon & eBay with affiliate tracking

import { wrapAffiliateLink, type AffiliateProvider } from "@/lib/affiliate";

export type Category = "GPU" | "CPU" | "Motherboard" | "RAM" | "Storage" | "PSU" | "Cooling";
export type BudgetTier = "Entry" | "Enthusiast" | "Workstation" | "Datacenter";

export interface Specs {
  // GPU specs
  vram?: string;
  cuda?: string;
  tensor?: string;
  tflops?: string;
  // CPU specs
  cores?: string;
  threads?: string;
  clock?: string;
  socket?: string;
  // Motherboard specs
  chipset?: string;
  memorySupport?: string;
  formFactor?: string;
  // RAM specs
  capacity?: string;
  speed?: string;
  latency?: string;
  // Storage specs
  type?: string;
  readSpeed?: string;
  writeSpeed?: string;
  // PSU specs
  wattage?: string;
  efficiency?: string;
  // Cooling specs
  radiator?: string;
  // Common
  tdp?: string;
  architecture?: string;
  memory?: string;
}

export interface ProductLinks {
  // Specific product URLs (preferred)
  amazonAsin?: string;  // e.g., "B0B8PQ3324" - will build https://amazon.com/dp/{asin}
  ebayItemId?: string;  // e.g., "123456789" - will build https://ebay.com/itm/{id}
  // Search URLs (fallback)
  amazonSearch?: string;
  ebaySearch?: string;
  aliexpressSearch?: string;
}

export interface HardwareComponent {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  msrp: number;
  specs: Specs;
  description: string;
  tags: string[];
  aiScore: number;
  budgetTier: BudgetTier;
  productLinks: ProductLinks;
  inStock: boolean;
  releaseDate?: string;
  imageUrl?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getImageUrl(brand: string, name: string, category: Category): string {
  const encodedName = encodeURIComponent(name.substring(0, 15));
  const brandColors: Record<string, string> = {
    NVIDIA: "1a1a2e/76b900",
    AMD: "1a1a2e/ed1c24",
    Intel: "1a1a2e/0071c5",
    ASUS: "1a1a2e/ff0022",
    MSI: "1a1a2e/ff0000",
    Gigabyte: "1a1a2e/ff6600",
    ASRock: "1a1a2e/0099ff",
    Corsair: "1a1a2e/f3e03b",
    "be quiet!": "1a1a2e/ba0c2f",
    Noctua: "1a1a2e/bf8f4f",
    Arctic: "1a1a2e/00b4e6",
    NZXT: "1a1a2e/51007a",
    Samsung: "1a1a2e/1428a0",
    Kingston: "1a1a2e/ff0000",
    Seagate: "1a1a2e/6ebd00",
    "Western Digital": "1a1a2e/005195",
    Crucial: "1a1a2e/00a4e4",
    Sabrent: "1a1a2e/ff6b00",
    EVGA: "1a1a2e/00a4e4",
    Seasonic: "1a1a2e/0066b3",
    DeepCool: "1a1a2e/00a8e8",
    "Cooler Master": "1a1a2e/941919",
    "G.Skill": "1a1a2e/ff0066",
    IceGiant: "1a1a2e/00ffff",
    Watercool: "1a1a2e/0066cc",
  };
  const colors = brandColors[brand] || "1a1a2e/888888";
  return `https://placehold.co/80x80/${colors}?text=${encodedName}`;
}

/**
 * Generates the actual affiliate URL for a product
 * Uses specific product URL if available, falls back to search
 */
export function getAffiliateUrl(component: HardwareComponent, platform: AffiliateProvider): string {
  const { productLinks } = component;
  
  if (platform === "amazon") {
    if (productLinks.amazonAsin) {
      return wrapAffiliateLink(`https://www.amazon.com/dp/${productLinks.amazonAsin}`, "amazon");
    }
    if (productLinks.amazonSearch) {
      return wrapAffiliateLink(productLinks.amazonSearch, "amazon");
    }
  }
  
  if (platform === "ebay") {
    if (productLinks.ebayItemId) {
      return wrapAffiliateLink(`https://www.ebay.com/itm/${productLinks.ebayItemId}`, "ebay");
    }
    if (productLinks.ebaySearch) {
      return wrapAffiliateLink(productLinks.ebaySearch, "ebay");
    }
  }
  
  if (platform === "aliexpress" && productLinks.aliexpressSearch) {
    return wrapAffiliateLink(productLinks.aliexpressSearch, "aliexpress");
  }
  
  // Final fallback - generate search from product name
  const encoded = encodeURIComponent(component.name).replace(/%20/g, "+");
  if (platform === "amazon") {
    return wrapAffiliateLink(`https://www.amazon.com/s?k=${encoded}`, "amazon");
  }
  if (platform === "ebay") {
    return wrapAffiliateLink(`https://www.ebay.com/sch/i.html?_nkw=${encoded}`, "ebay");
  }
  return wrapAffiliateLink(`https://www.aliexpress.com/wholesale?SearchText=${encoded}`, "aliexpress");
}

// ============================================
// GPU DATABASE - 16 Components
// ============================================

const GPUs: HardwareComponent[] = [
  // DATACENTER TIER
  {
    id: "h100-80gb",
    name: "NVIDIA H100 80GB PCIe",
    category: "GPU",
    brand: "NVIDIA",
    price: 29999,
    msrp: 29999,
    imageUrl: getImageUrl("NVIDIA", "H100 80GB", "GPU"),
    specs: {
      vram: "80GB HBM3",
      cuda: "14592",
      tensor: "456",
      tdp: "350W",
      tflops: "989 FP8",
      architecture: "Hopper",
    },
    description: "Next-gen data center GPU with transformer engine",
    tags: ["Datacenter", "80GB", "Transformer Engine"],
    aiScore: 100,
    budgetTier: "Datacenter",
    productLinks: {
      // Enterprise - requires special ordering
      amazonSearch: "https://www.amazon.com/s?k=NVIDIA+H100+80GB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=NVIDIA+H100+80GB",
    },
    inStock: false,
  },
  {
    id: "a100-80gb",
    name: "NVIDIA A100 80GB PCIe",
    category: "GPU",
    brand: "NVIDIA",
    price: 14999,
    msrp: 14999,
    imageUrl: getImageUrl("NVIDIA", "A100 80GB", "GPU"),
    specs: {
      vram: "80GB HBM2e",
      cuda: "6912",
      tensor: "432",
      tdp: "300W",
      tflops: "312 FP16",
      architecture: "Ampere",
    },
    description: "Data center GPU for large-scale AI training",
    tags: ["Datacenter", "80GB", "HBM2e"],
    aiScore: 99,
    budgetTier: "Datacenter",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=NVIDIA+A100+80GB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=NVIDIA+A100+80GB",
    },
    inStock: true,
  },
  
  // WORKSTATION TIER
  {
    id: "rtx-6000-ada",
    name: "NVIDIA RTX 6000 Ada Generation",
    category: "GPU",
    brand: "NVIDIA",
    price: 8999,
    msrp: 8999,
    imageUrl: getImageUrl("NVIDIA", "RTX 6000", "GPU"),
    specs: {
      vram: "48GB GDDR6 ECC",
      cuda: "18176",
      tensor: "568",
      tdp: "300W",
      tflops: "91 FP16",
      architecture: "Ada Lovelace",
    },
    description: "48GB workstation GPU for professional AI development",
    tags: ["Workstation", "48GB", "ECC"],
    aiScore: 98,
    budgetTier: "Workstation",
    productLinks: {
      amazonAsin: "B0B7HR8VMY", // Example ASIN - needs verification
      amazonSearch: "https://www.amazon.com/s?k=NVIDIA+RTX+6000+Ada",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=NVIDIA+RTX+6000+Ada",
    },
    inStock: true,
  },
  {
    id: "l40s",
    name: "NVIDIA L40S",
    category: "GPU",
    brand: "NVIDIA",
    price: 7999,
    msrp: 7999,
    imageUrl: getImageUrl("NVIDIA", "L40S", "GPU"),
    specs: {
      vram: "48GB GDDR6 ECC",
      cuda: "18176",
      tensor: "568",
      tdp: "350W",
      tflops: "91.6 FP16",
      architecture: "Ada Lovelace",
    },
    description: "Data center visualization and AI inference GPU",
    tags: ["Datacenter", "48GB", "Inference"],
    aiScore: 90,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=NVIDIA+L40S",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=NVIDIA+L40S",
    },
    inStock: true,
  },
  {
    id: "a6000",
    name: "NVIDIA RTX A6000",
    category: "GPU",
    brand: "NVIDIA",
    price: 4299,
    msrp: 4299,
    imageUrl: getImageUrl("NVIDIA", "RTX A6000", "GPU"),
    specs: {
      vram: "48GB GDDR6 ECC",
      cuda: "10752",
      tensor: "336",
      tdp: "300W",
      tflops: "38.7 FP16",
      architecture: "Ampere",
    },
    description: "48GB workstation card for professional visualization",
    tags: ["Workstation", "48GB", "ECC"],
    aiScore: 85,
    budgetTier: "Workstation",
    productLinks: {
      amazonAsin: "B08P5ZD6HK",
      amazonSearch: "https://www.amazon.com/s?k=NVIDIA+RTX+A6000",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=NVIDIA+RTX+A6000",
    },
    inStock: true,
  },
  {
    id: "a40",
    name: "NVIDIA A40",
    category: "GPU",
    brand: "NVIDIA",
    price: 3499,
    msrp: 3499,
    imageUrl: getImageUrl("NVIDIA", "A40", "GPU"),
    specs: {
      vram: "48GB GDDR6 ECC",
      cuda: "10752",
      tensor: "336",
      tdp: "300W",
      tflops: "37.4 FP16",
      architecture: "Ampere",
    },
    description: "48GB passive cooling for dense server configs",
    tags: ["Datacenter", "48GB", "Passive"],
    aiScore: 80,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=NVIDIA+A40+GPU",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=NVIDIA+A40+GPU",
    },
    inStock: true,
  },
  
  // FLAGSHIP ENTHUSIAST
  {
    id: "rtx-5090",
    name: "NVIDIA GeForce RTX 5090",
    category: "GPU",
    brand: "NVIDIA",
    price: 1999,
    msrp: 1999,
    imageUrl: getImageUrl("NVIDIA", "RTX 5090", "GPU"),
    specs: {
      vram: "32GB GDDR7",
      cuda: "21760",
      tensor: "680",
      tdp: "450W",
      tflops: "125 FP16",
      architecture: "Blackwell 2.0",
    },
    description: "Next-gen flagship with 32GB GDDR7 for massive AI models",
    tags: ["Flagship", "32GB", "AI Training"],
    aiScore: 100,
    budgetTier: "Enthusiast",
    productLinks: {
      // Placeholder - new release
      amazonSearch: "https://www.amazon.com/s?k=RTX+5090",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RTX+5090",
    },
    inStock: false,
    releaseDate: "2025-03",
  },
  {
    id: "rtx-4090",
    name: "NVIDIA GeForce RTX 4090",
    category: "GPU",
    brand: "NVIDIA",
    price: 1599,
    msrp: 1599,
    imageUrl: getImageUrl("NVIDIA", "RTX 4090", "GPU"),
    specs: {
      vram: "24GB GDDR6X",
      cuda: "16384",
      tensor: "512",
      tdp: "450W",
      tflops: "82.6 FP16",
      architecture: "Ada Lovelace",
    },
    description: "Current flagship with 24GB VRAM for large models",
    tags: ["Flagship", "24GB", "Popular"],
    aiScore: 95,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonAsin: "B0B8PQ3324",
      amazonSearch: "https://www.amazon.com/s?k=RTX+4090",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RTX+4090",
    },
    inStock: true,
  },
  {
    id: "rtx-3090-ti",
    name: "NVIDIA GeForce RTX 3090 Ti",
    category: "GPU",
    brand: "NVIDIA",
    price: 1099,
    msrp: 1999,
    imageUrl: getImageUrl("NVIDIA", "RTX 3090 Ti", "GPU"),
    specs: {
      vram: "24GB GDDR6X",
      cuda: "10752",
      tensor: "336",
      tdp: "450W",
      tflops: "40 FP16",
      architecture: "Ampere",
    },
    description: "Previous-gen flagship, excellent value on used market",
    tags: ["Used Market", "24GB", "NVLink"],
    aiScore: 70,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=RTX+3090+Ti",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RTX+3090+Ti",
    },
    inStock: true,
  },
  {
    id: "rx-7900-xtx",
    name: "AMD Radeon RX 7900 XTX",
    category: "GPU",
    brand: "AMD",
    price: 999,
    msrp: 999,
    imageUrl: getImageUrl("AMD", "RX 7900 XTX", "GPU"),
    specs: {
      vram: "24GB GDDR6",
      cuda: "6144",
      tensor: "192",
      tdp: "355W",
      tflops: "61 FP16",
      architecture: "RDNA 3",
    },
    description: "24GB RDNA 3 flagship for ROCm workflows",
    tags: ["AMD", "ROCm", "24GB"],
    aiScore: 78,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonAsin: "B0BNLZZ1R1",
      amazonSearch: "https://www.amazon.com/s?k=RX+7900+XTX",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RX+7900+XTX",
    },
    inStock: true,
  },
  {
    id: "rtx-4080-super",
    name: "NVIDIA GeForce RTX 4080 SUPER",
    category: "GPU",
    brand: "NVIDIA",
    price: 999,
    msrp: 999,
    imageUrl: getImageUrl("NVIDIA", "RTX 4080S", "GPU"),
    specs: {
      vram: "16GB GDDR6X",
      cuda: "10240",
      tensor: "320",
      tdp: "320W",
      tflops: "52.2 FP16",
      architecture: "Ada Lovelace",
    },
    description: "High-performance GPU for professional AI inference",
    tags: ["Prosumer", "16GB", "Inference"],
    aiScore: 82,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=RTX+4080+SUPER",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RTX+4080+SUPER",
    },
    inStock: true,
  },
  {
    id: "rx-7900-xt",
    name: "AMD Radeon RX 7900 XT",
    category: "GPU",
    brand: "AMD",
    price: 849,
    msrp: 899,
    imageUrl: getImageUrl("AMD", "RX 7900 XT", "GPU"),
    specs: {
      vram: "20GB GDDR6",
      cuda: "5376",
      tensor: "168",
      tdp: "300W",
      tflops: "52 FP16",
      architecture: "RDNA 3",
    },
    description: "20GB card for AI inference on open stacks",
    tags: ["AMD", "ROCm", "20GB"],
    aiScore: 72,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonAsin: "B0BNLXZHHB",
      amazonSearch: "https://www.amazon.com/s?k=RX+7900+XT",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RX+7900+XT",
    },
    inStock: true,
  },
  {
    id: "rtx-4070-ti-super",
    name: "NVIDIA GeForce RTX 4070 Ti SUPER",
    category: "GPU",
    brand: "NVIDIA",
    price: 799,
    msrp: 799,
    imageUrl: getImageUrl("NVIDIA", "RTX 4070Ti", "GPU"),
    specs: {
      vram: "16GB GDDR6X",
      cuda: "8448",
      tensor: "264",
      tdp: "285W",
      tflops: "40.1 FP16",
      architecture: "Ada Lovelace",
    },
    description: "Sweet spot for AI enthusiasts with 16GB VRAM",
    tags: ["Enthusiast", "16GB", "Value"],
    aiScore: 75,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=RTX+4070+Ti+SUPER",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RTX+4070+Ti+SUPER",
    },
    inStock: true,
  },
  
  // ENTRY LEVEL
  {
    id: "rx-7800-xt",
    name: "AMD Radeon RX 7800 XT",
    category: "GPU",
    brand: "AMD",
    price: 499,
    msrp: 499,
    imageUrl: getImageUrl("AMD", "RX 7800 XT", "GPU"),
    specs: {
      vram: "16GB GDDR6",
      cuda: "3840",
      tensor: "120",
      tdp: "263W",
      tflops: "37 FP16",
      architecture: "RDNA 3",
    },
    description: "16GB mid-range AMD option for budget AI",
    tags: ["AMD", "ROCm", "16GB"],
    aiScore: 65,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B0CHWV2WYK",
      amazonSearch: "https://www.amazon.com/s?k=RX+7800+XT",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RX+7800+XT",
    },
    inStock: true,
  },
  {
    id: "rtx-4060-ti-16gb",
    name: "NVIDIA GeForce RTX 4060 Ti 16GB",
    category: "GPU",
    brand: "NVIDIA",
    price: 449,
    msrp: 499,
    imageUrl: getImageUrl("NVIDIA", "RTX 4060 Ti", "GPU"),
    specs: {
      vram: "16GB GDDR6",
      cuda: "4352",
      tensor: "136",
      tdp: "165W",
      tflops: "23 FP16",
      architecture: "Ada Lovelace",
    },
    description: "Efficient entry AI card with 16GB frame buffer",
    tags: ["Entry", "16GB", "Efficient"],
    aiScore: 60,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=RTX+4060+Ti+16GB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RTX+4060+Ti+16GB",
    },
    inStock: true,
  },
];

// ============================================
// CPU DATABASE - 10 Components
// ============================================

const CPUs: HardwareComponent[] = [
  // WORKSTATION/HEDT
  {
    id: "tr-pro-7995wx",
    name: "AMD Ryzen Threadripper PRO 7995WX",
    category: "CPU",
    brand: "AMD",
    price: 4999,
    msrp: 4999,
    imageUrl: getImageUrl("AMD", "TR PRO 7995WX", "CPU"),
    specs: {
      cores: "96",
      threads: "192",
      clock: "2.5 / 5.1 GHz",
      tdp: "350W",
      socket: "sTR5",
      architecture: "Zen 4",
      memory: "8-Channel DDR5",
    },
    description: "96-core workstation CPU for massive AI preprocessing",
    tags: ["Workstation", "96-Core", "HEDT"],
    aiScore: 98,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Threadripper+PRO+7995WX",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Threadripper+PRO+7995WX",
    },
    inStock: true,
  },
  {
    id: "tr-7980x",
    name: "AMD Ryzen Threadripper 7980X",
    category: "CPU",
    brand: "AMD",
    price: 2999,
    msrp: 2999,
    imageUrl: getImageUrl("AMD", "TR 7980X", "CPU"),
    specs: {
      cores: "64",
      threads: "128",
      clock: "3.2 / 5.1 GHz",
      tdp: "350W",
      socket: "sTR5",
      architecture: "Zen 4",
      memory: "Quad DDR5",
    },
    description: "64-core enthusiast CPU for multi-GPU setups",
    tags: ["Enthusiast", "64-Core", "HEDT"],
    aiScore: 92,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Threadripper+7980X",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Threadripper+7980X",
    },
    inStock: true,
  },
  {
    id: "epyc-9654",
    name: "AMD EPYC 9654",
    category: "CPU",
    brand: "AMD",
    price: 11805,
    msrp: 11805,
    imageUrl: getImageUrl("AMD", "EPYC 9654", "CPU"),
    specs: {
      cores: "96",
      threads: "192",
      clock: "2.4 / 3.7 GHz",
      tdp: "360W",
      socket: "SP5",
      architecture: "Zen 4",
      memory: "12-Channel DDR5",
    },
    description: "96-core server CPU for massive parallel workloads",
    tags: ["Server", "96-Core", "Enterprise"],
    aiScore: 95,
    budgetTier: "Datacenter",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=AMD+EPYC+9654",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=AMD+EPYC+9654",
    },
    inStock: true,
  },
  
  // HIGH-END DESKTOP
  {
    id: "ryzen-9-9950x",
    name: "AMD Ryzen 9 9950X",
    category: "CPU",
    brand: "AMD",
    price: 649,
    msrp: 649,
    imageUrl: getImageUrl("AMD", "R9 9950X", "CPU"),
    specs: {
      cores: "16",
      threads: "32",
      clock: "4.3 / 5.7 GHz",
      tdp: "170W",
      socket: "AM5",
      architecture: "Zen 5",
      memory: "Dual DDR5",
    },
    description: "16-core Zen 5 flagship with best single-thread perf",
    tags: ["Gaming", "16-Core", "Zen 5"],
    aiScore: 85,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Ryzen+9+9950X",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Ryzen+9+9950X",
    },
    inStock: true,
  },
  {
    id: "core-ultra-9-285k",
    name: "Intel Core Ultra 9 285K",
    category: "CPU",
    brand: "Intel",
    price: 589,
    msrp: 589,
    imageUrl: getImageUrl("Intel", "Ultra 9 285K", "CPU"),
    specs: {
      cores: "24",
      threads: "24",
      clock: "3.7 / 5.7 GHz",
      tdp: "125W",
      socket: "LGA1851",
      architecture: "Arrow Lake",
      memory: "Dual DDR5-6400",
    },
    description: "24-core CPU with integrated NPU for AI acceleration",
    tags: ["NPU", "AI Acceleration", "Hybrid"],
    aiScore: 82,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Core+Ultra+9+285K",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Core+Ultra+9+285K",
    },
    inStock: true,
  },
  {
    id: "core-i9-14900k",
    name: "Intel Core i9-14900K",
    category: "CPU",
    brand: "Intel",
    price: 589,
    msrp: 589,
    imageUrl: getImageUrl("Intel", "i9-14900K", "CPU"),
    specs: {
      cores: "24",
      threads: "32",
      clock: "3.2 / 6.0 GHz",
      tdp: "125W",
      socket: "LGA1700",
      architecture: "Raptor Lake",
      memory: "Dual DDR5",
    },
    description: "High-frequency desktop CPU for single-GPU setups",
    tags: ["Gaming", "High Frequency", "Desktop"],
    aiScore: 80,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonAsin: "B0BCF6S4JD",
      amazonSearch: "https://www.amazon.com/s?k=i9-14900K",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=i9-14900K",
    },
    inStock: true,
  },
  
  // MID-RANGE
  {
    id: "core-i7-14700k",
    name: "Intel Core i7-14700K",
    category: "CPU",
    brand: "Intel",
    price: 419,
    msrp: 419,
    imageUrl: getImageUrl("Intel", "i7-14700K", "CPU"),
    specs: {
      cores: "20",
      threads: "28",
      clock: "3.4 / 5.6 GHz",
      tdp: "125W",
      socket: "LGA1700",
      architecture: "Raptor Lake",
      memory: "Dual DDR5",
    },
    description: "20-core desktop CPU for balanced AI workloads",
    tags: ["Desktop", "Balanced", "Performance"],
    aiScore: 75,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B0BCF7Z6ZF",
      amazonSearch: "https://www.amazon.com/s?k=i7-14700K",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=i7-14700K",
    },
    inStock: true,
  },
  {
    id: "ryzen-7-7800x3d",
    name: "AMD Ryzen 7 7800X3D",
    category: "CPU",
    brand: "AMD",
    price: 369,
    msrp: 449,
    imageUrl: getImageUrl("AMD", "R7 7800X3D", "CPU"),
    specs: {
      cores: "8",
      threads: "16",
      clock: "4.2 / 5.0 GHz",
      tdp: "120W",
      socket: "AM5",
      architecture: "Zen 4",
      memory: "Dual DDR5",
    },
    description: "8-core 3D V-Cache for low-latency inference",
    tags: ["Gaming", "3D V-Cache", "Efficient"],
    aiScore: 72,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B0BTK6S9X3",
      amazonSearch: "https://www.amazon.com/s?k=7800X3D",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=7800X3D",
    },
    inStock: true,
  },
  {
    id: "core-i5-14600k",
    name: "Intel Core i5-14600K",
    category: "CPU",
    brand: "Intel",
    price: 329,
    msrp: 329,
    imageUrl: getImageUrl("Intel", "i5-14600K", "CPU"),
    specs: {
      cores: "14",
      threads: "20",
      clock: "3.5 / 5.3 GHz",
      tdp: "125W",
      socket: "LGA1700",
      architecture: "Raptor Lake",
      memory: "Dual DDR5",
    },
    description: "14-core value Intel option for entry AI workstations",
    tags: ["Value", "Entry", "LGA1700"],
    aiScore: 65,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B0BCF7Z6ZG",
      amazonSearch: "https://www.amazon.com/s?k=i5-14600K",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=i5-14600K",
    },
    inStock: true,
  },
  {
    id: "ryzen-5-7600x",
    name: "AMD Ryzen 5 7600X",
    category: "CPU",
    brand: "AMD",
    price: 199,
    msrp: 299,
    imageUrl: getImageUrl("AMD", "R5 7600X", "CPU"),
    specs: {
      cores: "6",
      threads: "12",
      clock: "4.7 / 5.3 GHz",
      tdp: "105W",
      socket: "AM5",
      architecture: "Zen 4",
      memory: "Dual DDR5",
    },
    description: "6-core budget AM5 option for single-GPU stations",
    tags: ["Budget", "Entry", "AM5"],
    aiScore: 60,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B0BHJF2VH2",
      amazonSearch: "https://www.amazon.com/s?k=7600X",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=7600X",
    },
    inStock: true,
  },
];

// ============================================
// MOTHERBOARD DATABASE - 12 Components
// ============================================

const Motherboards: HardwareComponent[] = [
  // WORKSTATION sTR5
  {
    id: "wrx90-sage",
    name: "ASUS Pro WS WRX90E-SAGE SE",
    category: "Motherboard",
    brand: "ASUS",
    price: 1899,
    msrp: 1899,
    imageUrl: getImageUrl("ASUS", "WRX90-SAGE", "Motherboard"),
    specs: {
      socket: "sTR5",
      chipset: "WRX90",
      memorySupport: "DDR5-5200 2TB ECC",
      formFactor: "E-ATX",
    },
    description: "Dual-socket workstation board for Threadripper PRO",
    tags: ["Workstation", "Dual Socket", "ECC"],
    aiScore: 98,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=ASUS+WRX90E-SAGE",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=ASUS+WRX90E-SAGE",
    },
    inStock: true,
  },
  {
    id: "trx50-sage-wifi",
    name: "ASUS Pro WS TRX50-SAGE WIFI",
    category: "Motherboard",
    brand: "ASUS",
    price: 1299,
    msrp: 1299,
    imageUrl: getImageUrl("ASUS", "TRX50-SAGE", "Motherboard"),
    specs: {
      socket: "sTR5",
      chipset: "TRX50",
      memorySupport: "DDR5-8000 2TB",
      formFactor: "E-ATX",
    },
    description: "Workstation board for Threadripper PRO with octa-channel",
    tags: ["Workstation", "sTR5", "Octa-Channel"],
    aiScore: 95,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=TRX50-SAGE+WIFI",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=TRX50-SAGE",
    },
    inStock: true,
  },
  
  // ENTHUSIAST AM5
  {
    id: "x670e-godlike",
    name: "MSI MEG X670E GODLIKE",
    category: "Motherboard",
    brand: "MSI",
    price: 899,
    msrp: 1299,
    imageUrl: getImageUrl("MSI", "X670E GODLIKE", "Motherboard"),
    specs: {
      socket: "AM5",
      chipset: "X670E",
      memorySupport: "DDR5-8000 256GB",
      formFactor: "E-ATX",
    },
    description: "Ultimate AM5 motherboard for dual GPU setups",
    tags: ["Enthusiast", "AM5", "Dual GPU"],
    aiScore: 88,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=X670E+GODLIKE",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=X670E+GODLIKE",
    },
    inStock: true,
  },
  {
    id: "x870-taichi",
    name: "ASRock X870 Taichi",
    category: "Motherboard",
    brand: "ASRock",
    price: 499,
    msrp: 549,
    imageUrl: getImageUrl("ASRock", "X870 Taichi", "Motherboard"),
    specs: {
      socket: "AM5",
      chipset: "X870",
      memorySupport: "DDR5-8000 192GB",
      formFactor: "ATX",
    },
    description: "Premium AM5 board with reinforced PCIe 5.0 slots",
    tags: ["AM5", "Premium", "PCIe 5.0"],
    aiScore: 80,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=X870+Taichi",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=X870+Taichi",
    },
    inStock: true,
  },
  {
    id: "b650-aorus-elite",
    name: "Gigabyte B650 AORUS Elite AX",
    category: "Motherboard",
    brand: "Gigabyte",
    price: 189,
    msrp: 229,
    imageUrl: getImageUrl("Gigabyte", "B650 Elite", "Motherboard"),
    specs: {
      socket: "AM5",
      chipset: "B650",
      memorySupport: "DDR5-6400 128GB",
      formFactor: "ATX",
    },
    description: "Cost-effective AM5 board with PCIe 4.0 x16",
    tags: ["Value", "AM5", "Budget"],
    aiScore: 68,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B0BHJF2L2B",
      amazonSearch: "https://www.amazon.com/s?k=B650+AORUS+Elite",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=B650+AORUS+Elite",
    },
    inStock: true,
  },
  
  // INTEL LGA1700
  {
    id: "z790-aorus-xtreme",
    name: "Gigabyte Z790 AORUS XTREME X",
    category: "Motherboard",
    brand: "Gigabyte",
    price: 699,
    msrp: 699,
    imageUrl: getImageUrl("Gigabyte", "Z790 XTREME", "Motherboard"),
    specs: {
      socket: "LGA1700",
      chipset: "Z790",
      memorySupport: "DDR5-8266 192GB",
      formFactor: "E-ATX",
    },
    description: "Flagship Intel board with Thunderbolt 5",
    tags: ["Flagship", "LGA1700", "Thunderbolt 5"],
    aiScore: 85,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Z790+AORUS+XTREME",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Z790+XTREME",
    },
    inStock: true,
  },
  {
    id: "z790-apex-encore",
    name: "ASUS ROG Maximus Z790 APEX Encore",
    category: "Motherboard",
    brand: "ASUS",
    price: 599,
    msrp: 599,
    imageUrl: getImageUrl("ASUS", "Z790 APEX", "Motherboard"),
    specs: {
      socket: "LGA1700",
      chipset: "Z790",
      memorySupport: "DDR5-8400+ 64GB",
      formFactor: "ATX",
    },
    description: "Overclocking focused board optimized for memory speed",
    tags: ["Overclocking", "LGA1700", "Memory OC"],
    aiScore: 78,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Z790+APEX+Encore",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Z790+APEX",
    },
    inStock: true,
  },
  {
    id: "pro-z790-a",
    name: "MSI PRO Z790-A WIFI",
    category: "Motherboard",
    brand: "MSI",
    price: 219,
    msrp: 249,
    imageUrl: getImageUrl("MSI", "PRO Z790-A", "Motherboard"),
    specs: {
      socket: "LGA1700",
      chipset: "Z790",
      memorySupport: "DDR5-6800 128GB",
      formFactor: "ATX",
    },
    description: "Reliable LGA1700 board for Core i7/i9 builds",
    tags: ["Mainstream", "LGA1700", "Reliable"],
    aiScore: 72,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B0BHF8F4CZ",
      amazonSearch: "https://www.amazon.com/s?k=PRO+Z790-A",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=PRO+Z790-A",
    },
    inStock: true,
  },
  
  // INTEL LGA1851 (Next-Gen)
  {
    id: "z890-hero",
    name: "ASUS ROG Maximus Z890 HERO",
    category: "Motherboard",
    brand: "ASUS",
    price: 699,
    msrp: 699,
    imageUrl: getImageUrl("ASUS", "Z890 HERO", "Motherboard"),
    specs: {
      socket: "LGA1851",
      chipset: "Z890",
      memorySupport: "DDR5-9066 192GB",
      formFactor: "ATX",
    },
    description: "Next-gen Intel board with Arrow Lake support",
    tags: ["Next-Gen", "LGA1851", "Arrow Lake"],
    aiScore: 88,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Z890+HERO",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Z890+HERO",
    },
    inStock: true,
  },
];

// ============================================
// RAM DATABASE - 10 Components
// ============================================

const RAMs: HardwareComponent[] = [
  // WORKSTATION ECC
  {
    id: "kingston-ecc-256gb",
    name: "Kingston Server Premier ECC 256GB (8x32GB) DDR5-5600",
    category: "RAM",
    brand: "Kingston",
    price: 899,
    msrp: 999,
    imageUrl: getImageUrl("Kingston", "ECC 256GB", "RAM"),
    specs: {
      capacity: "256GB (8x32GB)",
      speed: "DDR5-5600",
      latency: "CL46",
      type: "RDIMM ECC",
    },
    description: "ECC memory for workstation stability and data integrity",
    tags: ["ECC", "Workstation", "256GB"],
    aiScore: 92,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Kingston+ECC+DDR5+32GB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Kingston+ECC+DDR5",
    },
    inStock: true,
  },
  
  // HIGH CAPACITY
  {
    id: "trident-z5-96gb",
    name: "G.Skill Trident Z5 RGB 96GB (2x48GB) DDR5-6400",
    category: "RAM",
    brand: "G.Skill",
    price: 449,
    msrp: 499,
    imageUrl: getImageUrl("G.Skill", "Trident Z5 96GB", "RAM"),
    specs: {
      capacity: "96GB (2x48GB)",
      speed: "DDR5-6400",
      latency: "CL32",
      type: "UDIMM",
    },
    description: "High-capacity DDR5 kit for large model inference",
    tags: ["High Capacity", "RGB", "Performance"],
    aiScore: 85,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Trident+Z5+96GB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Trident+Z5+96GB",
    },
    inStock: true,
  },
  {
    id: "vengeance-128gb",
    name: "Corsair Vengeance 128GB (4x32GB) DDR5-5600",
    category: "RAM",
    brand: "Corsair",
    price: 379,
    msrp: 429,
    imageUrl: getImageUrl("Corsair", "Vengeance 128GB", "RAM"),
    specs: {
      capacity: "128GB (4x32GB)",
      speed: "DDR5-5600",
      latency: "CL40",
      type: "UDIMM",
    },
    description: "High-capacity kit for multi-GPU workstations",
    tags: ["High Capacity", "128GB", "Workstation"],
    aiScore: 80,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Corsair+Vengeance+128GB+DDR5",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Corsair+128GB+DDR5",
    },
    inStock: true,
  },
  
  // PERFORMANCE
  {
    id: "dominator-titanium-64gb",
    name: "Corsair Dominator Titanium 64GB (2x32GB) DDR5-7200",
    category: "RAM",
    brand: "Corsair",
    price: 329,
    msrp: 349,
    imageUrl: getImageUrl("Corsair", "Dominator 64GB", "RAM"),
    specs: {
      capacity: "64GB (2x32GB)",
      speed: "DDR5-7200",
      latency: "CL34",
      type: "UDIMM",
    },
    description: "Premium high-speed kit for enthusiast builds",
    tags: ["Premium", "High Speed", "64GB"],
    aiScore: 88,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Dominator+Titanium+64GB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Dominator+Titanium",
    },
    inStock: true,
  },
  {
    id: "trident-z5-64gb-7200",
    name: "G.Skill Trident Z5 64GB (2x32GB) DDR5-7200",
    category: "RAM",
    brand: "G.Skill",
    price: 289,
    msrp: 319,
    imageUrl: getImageUrl("G.Skill", "Trident Z5 64GB", "RAM"),
    specs: {
      capacity: "64GB (2x32GB)",
      speed: "DDR5-7200",
      latency: "CL34",
      type: "UDIMM",
    },
    description: "Fast 64GB kit optimized for AM5 platforms",
    tags: ["Performance", "64GB", "AM5 Optimized"],
    aiScore: 82,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Trident+Z5+64GB+DDR5-7200",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Trident+Z5+64GB",
    },
    inStock: true,
  },
  
  // VALUE TIER
  {
    id: "fury-renegade-64gb",
    name: "Kingston FURY Renegade 64GB (2x32GB) DDR5-7200",
    category: "RAM",
    brand: "Kingston",
    price: 269,
    msrp: 299,
    imageUrl: getImageUrl("Kingston", "Fury Renegade", "RAM"),
    specs: {
      capacity: "64GB (2x32GB)",
      speed: "DDR5-7200",
      latency: "CL38",
      type: "UDIMM",
    },
    description: "Low-latency high-speed DDR5 for gaming and AI",
    tags: ["Low Latency", "64GB", "High Speed"],
    aiScore: 78,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Fury+Renegade+64GB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Fury+Renegade",
    },
    inStock: true,
  },
  {
    id: "vengeance-64gb-5600",
    name: "Corsair Vengeance 64GB (2x32GB) DDR5-5600",
    category: "RAM",
    brand: "Corsair",
    price: 189,
    msrp: 219,
    imageUrl: getImageUrl("Corsair", "Vengeance 64GB", "RAM"),
    specs: {
      capacity: "64GB (2x32GB)",
      speed: "DDR5-5600",
      latency: "CL40",
      type: "UDIMM",
    },
    description: "Standard 64GB kit for budget AI workstations",
    tags: ["Budget", "64GB", "Reliable"],
    aiScore: 70,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B0BJM5CPTS",
      amazonSearch: "https://www.amazon.com/s?k=Corsair+Vengeance+64GB+DDR5",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Corsair+64GB+DDR5",
    },
    inStock: true,
  },
  {
    id: "trident-z5-rgb-32gb",
    name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-7200",
    category: "RAM",
    brand: "G.Skill",
    price: 149,
    msrp: 169,
    imageUrl: getImageUrl("G.Skill", "Trident Z5 32GB", "RAM"),
    specs: {
      capacity: "32GB (2x16GB)",
      speed: "DDR5-7200",
      latency: "CL34",
      type: "UDIMM",
    },
    description: "High-speed entry kit for compact builds",
    tags: ["Entry", "RGB", "High Speed"],
    aiScore: 65,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Trident+Z5+32GB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Trident+Z5+32GB",
    },
    inStock: true,
  },
];

// ============================================
// STORAGE DATABASE - 10 Components
// ============================================

const Storage: HardwareComponent[] = [
  // HIGH PERFORMANCE NVMe Gen5
  {
    id: "t700-4tb",
    name: "Crucial T700 4TB NVMe Gen5",
    category: "Storage",
    brand: "Crucial",
    price: 449,
    msrp: 499,
    imageUrl: getImageUrl("Crucial", "T700 4TB", "Storage"),
    specs: {
      type: "NVMe Gen5",
      capacity: "4TB",
      readSpeed: "12,400 MB/s",
      writeSpeed: "11,800 MB/s",
    },
    description: "PCIe 5.0 SSD for extreme ingest throughput",
    tags: ["NVMe", "Gen5", "PCIe 5.0"],
    aiScore: 92,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Crucial+T700+4TB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Crucial+T700",
    },
    inStock: true,
  },
  
  // HIGH CAPACITY
  {
    id: "rocket-4-plus-8tb",
    name: "Sabrent Rocket 4 Plus 8TB NVMe",
    category: "Storage",
    brand: "Sabrent",
    price: 899,
    msrp: 1099,
    imageUrl: getImageUrl("Sabrent", "Rocket 8TB", "Storage"),
    specs: {
      type: "NVMe Gen4",
      capacity: "8TB",
      readSpeed: "7,100 MB/s",
      writeSpeed: "6,600 MB/s",
    },
    description: "Massive 8TB capacity for large model storage",
    tags: ["NVMe", "8TB", "High Capacity"],
    aiScore: 88,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Sabrent+Rocket+8TB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Sabrent+Rocket+8TB",
    },
    inStock: true,
  },
  
  // TOP TIER Gen4
  {
    id: "990-pro-4tb",
    name: "Samsung 990 PRO 4TB NVMe Gen4",
    category: "Storage",
    brand: "Samsung",
    price: 349,
    msrp: 399,
    imageUrl: getImageUrl("Samsung", "990 PRO 4TB", "Storage"),
    specs: {
      type: "NVMe Gen4",
      capacity: "4TB",
      readSpeed: "7,450 MB/s",
      writeSpeed: "6,900 MB/s",
    },
    description: "Top-tier Gen4 SSD for AI dataset storage",
    tags: ["NVMe", "Gen4", "4TB"],
    aiScore: 90,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonAsin: "B0BHJJ9Y77",
      amazonSearch: "https://www.amazon.com/s?k=990+PRO+4TB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=990+PRO+4TB",
    },
    inStock: true,
  },
  {
    id: "sn850x-4tb",
    name: "WD Black SN850X 4TB NVMe Gen4",
    category: "Storage",
    brand: "Western Digital",
    price: 279,
    msrp: 349,
    imageUrl: getImageUrl("Western Digital", "SN850X 4TB", "Storage"),
    specs: {
      type: "NVMe Gen4",
      capacity: "4TB",
      readSpeed: "7,300 MB/s",
      writeSpeed: "6,600 MB/s",
    },
    description: "High-performance gaming SSD excellent for AI datasets",
    tags: ["NVMe", "Gen4", "Gaming"],
    aiScore: 85,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonAsin: "B0B7CMF8LW",
      amazonSearch: "https://www.amazon.com/s?k=SN850X+4TB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=SN850X+4TB",
    },
    inStock: true,
  },
  {
    id: "firecuda-530-4tb",
    name: "Seagate FireCuda 530 4TB NVMe",
    category: "Storage",
    brand: "Seagate",
    price: 349,
    msrp: 449,
    imageUrl: getImageUrl("Seagate", "FireCuda 530", "Storage"),
    specs: {
      type: "NVMe Gen4",
      capacity: "4TB",
      readSpeed: "7,300 MB/s",
      writeSpeed: "6,900 MB/s",
    },
    description: "Reliable high-speed SSD with long warranty",
    tags: ["NVMe", "Reliable", "5yr Warranty"],
    aiScore: 84,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=FireCuda+530+4TB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=FireCuda+530",
    },
    inStock: true,
  },
  {
    id: "mp600-pro-xt-4tb",
    name: "Corsair MP600 PRO XT 4TB NVMe",
    category: "Storage",
    brand: "Corsair",
    price: 329,
    msrp: 389,
    imageUrl: getImageUrl("Corsair", "MP600 XT", "Storage"),
    specs: {
      type: "NVMe Gen4",
      capacity: "4TB",
      readSpeed: "7,100 MB/s",
      writeSpeed: "6,800 MB/s",
    },
    description: "High-performance SSD with heatsink option",
    tags: ["NVMe", "Heatsink", "Performance"],
    aiScore: 82,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=MP600+PRO+XT+4TB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=MP600+PRO+XT",
    },
    inStock: true,
  },
  
  // BUDGET OPTIONS
  {
    id: "980-pro-2tb",
    name: "Samsung 980 PRO 2TB NVMe Gen4",
    category: "Storage",
    brand: "Samsung",
    price: 179,
    msrp: 249,
    imageUrl: getImageUrl("Samsung", "980 PRO 2TB", "Storage"),
    specs: {
      type: "NVMe Gen4",
      capacity: "2TB",
      readSpeed: "7,000 MB/s",
      writeSpeed: "5,100 MB/s",
    },
    description: "Reliable Gen4 SSD for OS and applications",
    tags: ["NVMe", "OS Drive", "Reliable"],
    aiScore: 78,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B08RK2SR23",
      amazonSearch: "https://www.amazon.com/s?k=980+PRO+2TB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=980+PRO+2TB",
    },
    inStock: true,
  },
  {
    id: "kc3000-2tb",
    name: "Kingston KC3000 2TB NVMe Gen4",
    category: "Storage",
    brand: "Kingston",
    price: 159,
    msrp: 199,
    imageUrl: getImageUrl("Kingston", "KC3000 2TB", "Storage"),
    specs: {
      type: "NVMe Gen4",
      capacity: "2TB",
      readSpeed: "7,000 MB/s",
      writeSpeed: "7,000 MB/s",
    },
    description: "Budget-friendly high-speed NVMe option",
    tags: ["NVMe", "Budget", "Value"],
    aiScore: 75,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B09K3LT6FK",
      amazonSearch: "https://www.amazon.com/s?k=KC3000+2TB",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=KC3000+2TB",
    },
    inStock: true,
  },
];

// ============================================
// PSU DATABASE - 12 Components
// ============================================

const PSUs: HardwareComponent[] = [
  // EXTREME POWER
  {
    id: "ax1600i",
    name: "Corsair AX1600i Digital ATX",
    category: "PSU",
    brand: "Corsair",
    price: 599,
    msrp: 699,
    imageUrl: getImageUrl("Corsair", "AX1600i", "PSU"),
    specs: {
      wattage: "1600W",
      efficiency: "80+ Titanium",
      type: "ATX 3.0",
    },
    description: "1600W Titanium PSU for multi-GPU AI workstations",
    tags: ["1600W", "Titanium", "Digital"],
    aiScore: 95,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=AX1600i",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=AX1600i",
    },
    inStock: true,
  },
  {
    id: "prime-tx-1600",
    name: "Seasonic PRIME TX-1600",
    category: "PSU",
    brand: "Seasonic",
    price: 499,
    msrp: 549,
    imageUrl: getImageUrl("Seasonic", "TX-1600", "PSU"),
    specs: {
      wattage: "1600W",
      efficiency: "80+ Titanium",
      type: "ATX 3.0",
    },
    description: "Premium 1600W unit with 12-year warranty",
    tags: ["1600W", "Titanium", "12yr Warranty"],
    aiScore: 92,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Seasonic+TX-1600",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Seasonic+TX-1600",
    },
    inStock: true,
  },
  {
    id: "supernova-1600-t2",
    name: "EVGA SuperNOVA 1600 T2",
    category: "PSU",
    brand: "EVGA",
    price: 549,
    msrp: 599,
    imageUrl: getImageUrl("EVGA", "1600 T2", "PSU"),
    specs: {
      wattage: "1600W",
      efficiency: "80+ Titanium",
      type: "ATX 2.4",
    },
    description: "Legacy 1600W Titanium PSU for 4-GPU builds",
    tags: ["1600W", "Legacy", "Multi-GPU"],
    aiScore: 88,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=EVGA+1600+T2",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=EVGA+1600+T2",
    },
    inStock: true,
  },
  
  // HIGH POWER
  {
    id: "dark-power-13-1000",
    name: "be quiet! Dark Power 13 1000W",
    category: "PSU",
    brand: "be quiet!",
    price: 329,
    msrp: 369,
    imageUrl: getImageUrl("be quiet!", "Dark Power", "PSU"),
    specs: {
      wattage: "1000W",
      efficiency: "80+ Titanium",
      type: "ATX 3.0",
    },
    description: "Silent Titanium PSU for noise-sensitive AI labs",
    tags: ["1000W", "Titanium", "Silent"],
    aiScore: 85,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Dark+Power+13+1000W",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Dark+Power+13",
    },
    inStock: true,
  },
  {
    id: "rm1200x-shift",
    name: "Corsair RM1200x SHIFT",
    category: "PSU",
    brand: "Corsair",
    price: 249,
    msrp: 299,
    imageUrl: getImageUrl("Corsair", "RM1200x", "PSU"),
    specs: {
      wattage: "1200W",
      efficiency: "80+ Gold",
      type: "ATX 3.0",
    },
    description: "Side-connect 1200W for cleaner cable management",
    tags: ["1200W", "Side Connect", "Gold"],
    aiScore: 80,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=RM1200x+SHIFT",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=RM1200x+SHIFT",
    },
    inStock: true,
  },
  {
    id: "thor-1200p",
    name: "ASUS ROG Thor 1200P",
    category: "PSU",
    brand: "ASUS",
    price: 399,
    msrp: 449,
    imageUrl: getImageUrl("ASUS", "Thor 1200P", "PSU"),
    specs: {
      wattage: "1200W",
      efficiency: "80+ Platinum",
      type: "ATX 2.4",
    },
    description: "1200W PSU with OLED power display",
    tags: ["1200W", "OLED", "Premium"],
    aiScore: 82,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=ROG+Thor+1200P",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=ROG+Thor+1200P",
    },
    inStock: true,
  },
  
  // STANDARD POWER
  {
    id: "focus-gx-1000",
    name: "Seasonic FOCUS GX-1000",
    category: "PSU",
    brand: "Seasonic",
    price: 179,
    msrp: 199,
    imageUrl: getImageUrl("Seasonic", "FOCUS GX", "PSU"),
    specs: {
      wattage: "1000W",
      efficiency: "80+ Gold",
      type: "ATX 2.4",
    },
    description: "Reliable 1000W for single high-end GPU builds",
    tags: ["1000W", "Gold", "Reliable"],
    aiScore: 78,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B07X2PQFT2",
      amazonSearch: "https://www.amazon.com/s?k=Seasonic+FOCUS+GX-1000",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Seasonic+FOCUS+GX-1000",
    },
    inStock: true,
  },
  {
    id: "straight-power-12-850",
    name: "be quiet! Straight Power 12 850W",
    category: "PSU",
    brand: "be quiet!",
    price: 199,
    msrp: 219,
    imageUrl: getImageUrl("be quiet!", "Straight Power", "PSU"),
    specs: {
      wattage: "850W",
      efficiency: "80+ Platinum",
      type: "ATX 3.0",
    },
    description: "850W Platinum for mid-range AI workstations",
    tags: ["850W", "Platinum", "Quiet"],
    aiScore: 75,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Straight+Power+12+850W",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Straight+Power+12+850W",
    },
    inStock: true,
  },
  {
    id: "supernova-850-g7",
    name: "EVGA SuperNOVA 850 G7",
    category: "PSU",
    brand: "EVGA",
    price: 139,
    msrp: 159,
    imageUrl: getImageUrl("EVGA", "850 G7", "PSU"),
    specs: {
      wattage: "850W",
      efficiency: "80+ Gold",
      type: "ATX 2.4",
    },
    description: "850W Gold for budget single-GPU builds",
    tags: ["850W", "Gold", "Budget"],
    aiScore: 70,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=EVGA+850+G7",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=EVGA+850+G7",
    },
    inStock: true,
  },
  
  // COMPACT
  {
    id: "loki-1000-sfx",
    name: "ASUS ROG Loki 1000W SFX-L",
    category: "PSU",
    brand: "ASUS",
    price: 269,
    msrp: 299,
    imageUrl: getImageUrl("ASUS", "Loki 1000W", "PSU"),
    specs: {
      wattage: "1000W",
      efficiency: "80+ Platinum",
      type: "SFX-L",
    },
    description: "Compact SFX-L PSU for small form factor builds",
    tags: ["1000W", "SFX-L", "Compact"],
    aiScore: 80,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=ROG+Loki+1000W",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=ROG+Loki+1000W",
    },
    inStock: true,
  },
];

// ============================================
// COOLING DATABASE - 12 Components
// ============================================

const Cooling: HardwareComponent[] = [
  // EXTREME WORKSTATION
  {
    id: "mora-420",
    name: "Watercool MO-RA IV 420 Core",
    category: "Cooling",
    brand: "Watercool",
    price: 399,
    msrp: 449,
    imageUrl: getImageUrl("Watercool", "MO-RA 420", "Cooling"),
    specs: {
      radiator: "420mm External",
      type: "External",
      tdp: "1000W+",
    },
    description: "External 420mm radiator for custom loops",
    tags: ["External", "420mm", "Custom Loop"],
    aiScore: 92,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=MO-RA+IV+420",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=MO-RA+IV+420",
    },
    inStock: true,
  },
  {
    id: "prosiphon-360",
    name: "IceGiant Prosiphon Elite 360",
    category: "Cooling",
    brand: "IceGiant",
    price: 349,
    msrp: 399,
    imageUrl: getImageUrl("IceGiant", "Prosiphon", "Cooling"),
    specs: {
      radiator: "Tower",
      type: "Thermosiphon",
      tdp: "500W",
    },
    description: "Thermosiphon cooler for extreme workstation CPUs",
    tags: ["Thermosiphon", "500W", "Workstation"],
    aiScore: 90,
    budgetTier: "Workstation",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=IceGiant+Prosiphon",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=IceGiant+Prosiphon",
    },
    inStock: true,
  },
  
  // HIGH-END AIO
  {
    id: "liquid-freezer-iii-420",
    name: "ARCTIC Liquid Freezer III 420",
    category: "Cooling",
    brand: "ARCTIC",
    price: 169,
    msrp: 179,
    imageUrl: getImageUrl("ARCTIC", "LF3 420", "Cooling"),
    specs: {
      radiator: "420mm",
      type: "AIO",
      tdp: "420W+",
    },
    description: "420mm AIO for high-TDP Threadripper CPUs",
    tags: ["AIO", "420mm", "High TDP"],
    aiScore: 88,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Liquid+Freezer+III+420",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Liquid+Freezer+III+420",
    },
    inStock: true,
  },
  {
    id: "h170i-elite-lcd",
    name: "Corsair iCUE H170i ELITE LCD XT",
    category: "Cooling",
    brand: "Corsair",
    price: 289,
    msrp: 329,
    imageUrl: getImageUrl("Corsair", "H170i LCD", "Cooling"),
    specs: {
      radiator: "420mm",
      type: "AIO",
      tdp: "350W+",
    },
    description: "420mm AIO with LCD display for Threadripper",
    tags: ["AIO", "LCD", "420mm"],
    aiScore: 86,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=H170i+ELITE+LCD",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=H170i+ELITE+LCD",
    },
    inStock: true,
  },
  {
    id: "nh-d15-g2",
    name: "Noctua NH-D15 G2",
    category: "Cooling",
    brand: "Noctua",
    price: 149,
    msrp: 149,
    imageUrl: getImageUrl("Noctua", "NH-D15 G2", "Cooling"),
    specs: {
      radiator: "Dual Tower",
      type: "Air",
      tdp: "250W",
    },
    description: "Premium dual-tower air cooler with exceptional reliability",
    tags: ["Air", "Quiet", "Premium"],
    aiScore: 85,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=NH-D15+G2",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=NH-D15+G2",
    },
    inStock: true,
  },
  {
    id: "kraken-elite-360",
    name: "NZXT Kraken Elite 360",
    category: "Cooling",
    brand: "NZXT",
    price: 279,
    msrp: 299,
    imageUrl: getImageUrl("NZXT", "Kraken 360", "Cooling"),
    specs: {
      radiator: "360mm",
      type: "AIO",
      tdp: "280W+",
    },
    description: "360mm AIO with customizable display",
    tags: ["AIO", "Display", "RGB"],
    aiScore: 82,
    budgetTier: "Enthusiast",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Kraken+Elite+360",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Kraken+Elite+360",
    },
    inStock: true,
  },
  
  // STANDARD AIO
  {
    id: "liquid-freezer-iii-360",
    name: "ARCTIC Liquid Freezer III 360",
    category: "Cooling",
    brand: "ARCTIC",
    price: 119,
    msrp: 129,
    imageUrl: getImageUrl("ARCTIC", "LF3 360", "Cooling"),
    specs: {
      radiator: "360mm",
      type: "AIO",
      tdp: "300W",
    },
    description: "Value 360mm AIO for high-end desktop CPUs",
    tags: ["AIO", "360mm", "Value"],
    aiScore: 80,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=Liquid+Freezer+III+360",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=Liquid+Freezer+III+360",
    },
    inStock: true,
  },
  {
    id: "masterliquid-360",
    name: "Cooler Master MasterLiquid 360 Atmos",
    category: "Cooling",
    brand: "Cooler Master",
    price: 149,
    msrp: 179,
    imageUrl: getImageUrl("Cooler Master", "ML360", "Cooling"),
    specs: {
      radiator: "360mm",
      type: "AIO",
      tdp: "300W",
    },
    description: "Reliable 360mm AIO with dual-chamber pump",
    tags: ["AIO", "360mm", "Reliable"],
    aiScore: 76,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=MasterLiquid+360+Atmos",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=MasterLiquid+360",
    },
    inStock: true,
  },
  
  // AIR COOLING
  {
    id: "deepcool-assassin-4",
    name: "DeepCool Assassin 4",
    category: "Cooling",
    brand: "DeepCool",
    price: 89,
    msrp: 99,
    imageUrl: getImageUrl("DeepCool", "Assassin 4", "Cooling"),
    specs: {
      radiator: "Dual Tower",
      type: "Air",
      tdp: "280W",
    },
    description: "Budget dual-tower with competitive performance",
    tags: ["Air", "Budget", "Dual Tower"],
    aiScore: 75,
    budgetTier: "Entry",
    productLinks: {
      amazonSearch: "https://www.amazon.com/s?k=DeepCool+Assassin+4",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=DeepCool+Assassin+4",
    },
    inStock: true,
  },
  {
    id: "u12a-chromax",
    name: "Noctua NH-U12A chromax.black",
    category: "Cooling",
    brand: "Noctua",
    price: 129,
    msrp: 129,
    imageUrl: getImageUrl("Noctua", "NH-U12A", "Cooling"),
    specs: {
      radiator: "Single Tower",
      type: "Air",
      tdp: "220W",
    },
    description: "Compact high-performance air cooler in black",
    tags: ["Air", "Compact", "Black"],
    aiScore: 78,
    budgetTier: "Entry",
    productLinks: {
      amazonAsin: "B07Y5XK3LJ",
      amazonSearch: "https://www.amazon.com/s?k=NH-U12A+chromax",
      ebaySearch: "https://www.ebay.com/sch/i.html?_nkw=NH-U12A+chromax",
    },
    inStock: true,
  },
];

// ============================================
// COMBINED DATABASE
// ============================================

export const hardwareComponents: HardwareComponent[] = [
  ...GPUs,
  ...CPUs,
  ...Motherboards,
  ...RAMs,
  ...Storage,
  ...PSUs,
  ...Cooling,
];

// Statistics
export const componentStats = {
  total: hardwareComponents.length,
  byCategory: {
    GPU: GPUs.length,
    CPU: CPUs.length,
    Motherboard: Motherboards.length,
    RAM: RAMs.length,
    Storage: Storage.length,
    PSU: PSUs.length,
    Cooling: Cooling.length,
  },
  byTier: {
    Entry: hardwareComponents.filter(c => c.budgetTier === "Entry").length,
    Enthusiast: hardwareComponents.filter(c => c.budgetTier === "Enthusiast").length,
    Workstation: hardwareComponents.filter(c => c.budgetTier === "Workstation").length,
    Datacenter: hardwareComponents.filter(c => c.budgetTier === "Datacenter").length,
  },
  inStock: hardwareComponents.filter(c => c.inStock).length,
};

// Helper functions
export function getComponentById(id: string): HardwareComponent | undefined {
  return hardwareComponents.find((c) => c.id === id);
}

export function getComponentsByCategory(category: Category): HardwareComponent[] {
  return hardwareComponents.filter((c) => c.category === category);
}

export function getComponentsByBudgetTier(tier: BudgetTier): HardwareComponent[] {
  return hardwareComponents.filter((c) => c.budgetTier === tier);
}

export function getComponentsByTag(tag: string): HardwareComponent[] {
  return hardwareComponents.filter((c) => 
    c.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getInStockComponents(): HardwareComponent[] {
  return hardwareComponents.filter((c) => c.inStock);
}

export function getRecommendedComponents(minScore: number = 80): HardwareComponent[] {
  return hardwareComponents.filter((c) => c.aiScore >= minScore);
}

export function getCompatibleMotherboards(socket: string): HardwareComponent[] {
  return hardwareComponents.filter(
    (c) => c.category === "Motherboard" && c.specs.socket === socket
  );
}

export function searchComponents(query: string): HardwareComponent[] {
  const lowerQuery = query.toLowerCase();
  return hardwareComponents.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.brand.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

export function sortByPrice(ascending: boolean = true): HardwareComponent[] {
  return [...hardwareComponents].sort((a, b) => 
    ascending ? a.price - b.price : b.price - a.price
  );
}

export function sortByAiScore(ascending: boolean = false): HardwareComponent[] {
  return [...hardwareComponents].sort((a, b) => 
    ascending ? a.aiScore - b.aiScore : b.aiScore - a.aiScore
  );
}

// Export individual categories
export { GPUs, CPUs, Motherboards, RAMs, Storage, PSUs, Cooling };
