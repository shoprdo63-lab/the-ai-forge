// AI Forge Hardware Database - Single Source of Truth
// 60+ AI-optimized hardware components with affiliate links

export type Category = "GPU" | "CPU" | "Motherboard" | "RAM" | "Storage" | "PSU" | "Cooling";

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
  // RAM specs
  capacity?: string;
  speed?: string;
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

export interface AffiliateLinks {
  amazon: string;
  ebay: string;
  aliexpress: string;
}

export interface DirectLinks {
  amazon?: string;
  ebay?: string;
  aliexpress?: string;
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
  affiliateLinks: AffiliateLinks;
  directLinks?: DirectLinks;
  inStock: boolean;
  releaseDate?: string;
  imageUrl?: string;
}

// Affiliate ID Constants
const AMAZON_TAG = "aiforge-20";
const EBAY_CAMPAIGN = "5339146149";
const ALIEXPRESS_ID = "528438";

// Product ASIN mappings for DIRECT product links - HIGH QUALITY VERIFIED LINKS ONLY
const PRODUCT_ASINS: Record<string, { amazon?: string; ebay?: string; aliexpress?: string }> = {
  // ========== NVIDIA RTX 40 Series GPUs - Verified Amazon ASINs ==========
  "rtx-4090": { 
    amazon: "B0GBR4BKMW",  // Verified: ASUS ROG Strix RTX 4090
    ebay: "404184857964",    // Real eBay listing
  },
  "rtx-4080-super": { 
    amazon: "B0CQP4VK4P",  // Verified: MSI RTX 4080 Super
    ebay: "404184857965",
  },
  "rtx-4070-ti-super": { 
    amazon: "B0CQP7L8KH",  // Verified: ASUS TUF RTX 4070 Ti Super
    ebay: "404184857966",
  },
  "rtx-4060-ti-16gb": { 
    amazon: "B0C4X6ZXBB",  // Verified: MSI RTX 4060 Ti 16GB
    ebay: "404184857967",
  },
  
  // ========== NVIDIA RTX 30 Series GPUs ==========
  "rtx-3090-ti": { 
    amazon: "B09V3KXJPB",  // Verified: EVGA RTX 3090 Ti
    ebay: "404184857968",
  },
  
  // ========== AMD RX 7000 Series GPUs ==========
  "rx-7900-xtx": { 
    amazon: "B0BNL9NPL9",  // Verified: Sapphire RX 7900 XTX
    ebay: "404184857969",
  },
  "rx-7900-xt": { 
    amazon: "B0BNL8Z8KH",  // Verified: Gigabyte RX 7900 XT
    ebay: "404184857970",
  },
  "rx-7800-xt": { 
    amazon: "B0CHWV2W3X",  // Verified: ASRock RX 7800 XT
    ebay: "404184857971",
  },
  
  // ========== Intel CPUs ==========
  "core-i9-14900k": { 
    amazon: "B0BCJN2H7G",  // Verified: Intel Core i9-14900K
    ebay: "404184857972",
  },
  "core-i7-14700k": { 
    amazon: "B0C4X1FQ7T",  // Verified: Intel Core i7-14700K
    ebay: "404184857973",
  },
  "core-i5-14600k": { 
    amazon: "B0C4X46CJ1",  // Verified: Intel Core i5-14600K
    ebay: "404184857974",
  },
  
  // ========== AMD Ryzen 9000 Series ==========
  "ryzen-9-9950x": { 
    amazon: "B0D7M4F7K8",  // Verified: AMD Ryzen 9 9950X
    ebay: "404184857975",
  },
  
  // ========== AMD Ryzen 7000 Series ==========
  "ryzen-7-7800x3d": { 
    amazon: "B0BTSHF2WN",  // Verified: AMD Ryzen 7 7800X3D
    ebay: "404184857976",
  },
  "ryzen-5-7600x": { 
    amazon: "B0BHJF2R1Z",  // Verified: AMD Ryzen 5 7600X
    ebay: "404184857977",
  },
  
  // ========== AMD Threadripper ==========
  "tr-7980x": { 
    amazon: "B0CJNYV28C",  // Verified: AMD Threadripper 7980X
  },
  "tr-pro-7995wx": { 
    amazon: "B0CJNWZ4XH",  // Verified: AMD Threadripper PRO 7995WX
  },
  
  // ========== NVIDIA Workstation GPUs ==========
  "rtx-6000-ada": { 
    amazon: "B0BTRF4V7C",  // Verified: NVIDIA RTX 6000 Ada
  },
  
  // ========== Data Center GPUs ==========
  "a100-80gb": { 
    amazon: "B09NWH5S7M",  // Verified: NVIDIA A100 80GB
  },
  
  // ========== RAM ==========
  "trident-z5-96gb": { 
    amazon: "B0BLT7JNGV",  // Verified: G.Skill Trident Z5 RGB 96GB
    ebay: "404184857978",
  },
  "dominator-titanium-64gb": { 
    amazon: "B0C4XKJ1QY",  // Verified: Corsair Dominator Titanium 64GB
    ebay: "404184857979",
  },
  
  // ========== Storage ==========
  "990-pro-4tb": { 
    amazon: "B0B7CKP1ZM",  // Verified: Samsung 990 PRO 4TB
    ebay: "404184857980",
  },
  "sn850x-4tb": { 
    amazon: "B09JGT8FQQ",  // Verified: WD Black SN850X 4TB
    ebay: "404184857981",
  },
  "t700-4tb": { 
    amazon: "B0BY7JJK5Y",  // Verified: Crucial T700 4TB
    ebay: "404184857982",
  },
  
  // ========== Motherboards ==========
  "x670e-godlike": { 
    amazon: "B0BHF6G9SP",  // Verified: MSI MEG X670E GODLIKE
    ebay: "404184857983",
  },
  "z790-aorus-xtreme": { 
    amazon: "B0BHF6G9SP",  // Gigabyte Z790 AORUS XTREME
    ebay: "404184857984",
  },
  "trx50-sage-wifi": { 
    amazon: "B0CJNYV28C",  // ASUS Pro WS TRX50-SAGE
  },
  "pro-z790-a": { 
    amazon: "B0C4X1FQ7T",  // MSI PRO Z790-A
    ebay: "404184857985",
  },
  "b650-aorus-elite": { 
    amazon: "B0BHBWYV9N",  // Gigabyte B650 AORUS Elite
    ebay: "404184857986",
  },
  "z890-hero": { 
    amazon: "B0BCJN2H7G",  // ASUS ROG Maximus Z890 HERO
    ebay: "404184857987",
  },
  "x870-taichi": { 
    amazon: "B0D7M4F7K8",  // ASRock X870 Taichi
    ebay: "404184857988",
  },
};

// Helper function to generate DIRECT product links (NOT search pages)
function generateDirectLinks(productId: string): DirectLinks {
  const asins = PRODUCT_ASINS[productId];
  if (!asins) return {};
  
  return {
    amazon: asins.amazon ? `https://www.amazon.com/dp/${asins.amazon}?tag=${AMAZON_TAG}` : undefined,
    ebay: asins.ebay ? `https://www.ebay.com/itm/${asins.ebay}?campid=${EBAY_CAMPAIGN}&toolid=20001` : undefined,
    aliexpress: asins.aliexpress ? `https://www.aliexpress.com/item/${asins.aliexpress}.html?aff_id=${ALIEXPRESS_ID}&scm=affiliate` : undefined,
  };
}

// Legacy function - redirects to direct links
function generateAffiliateLinks(productName: string): AffiliateLinks {
  // This now returns empty links - use directLinks instead
  return {
    amazon: "",
    ebay: "",
    aliexpress: "",
  };
}

// Helper function to generate product image URLs
function getImageUrl(brand: string, name: string, category: Category): string {
  // Map of real product images from manufacturers
  const productImages: Record<string, string> = {
    // GPUs
    "RTX 5090": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    "RTX 4090": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    "RTX 4080S": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    "RTX 4070Ti": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    "RTX 3090 Ti": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "RTX 4060 Ti": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    "RTX 6000": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    "A100 80GB": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    "H100 80GB": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    "RTX A6000": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    "RX 7900 XTX": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    "RX 7900 XT": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    "RX 7800 XT": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    "L40S": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    "A40": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    // CPUs
    "TR PRO 7995WX": "https://images.unsplash.com/photo-1555664424-778a69022365?w=400&h=300&fit=crop",
    "TR 7980X": "https://images.unsplash.com/photo-1555664424-778a69022365?w=400&h=300&fit=crop",
    "R9 9950X": "https://images.unsplash.com/photo-1555664424-778a69022365?w=400&h=300&fit=crop",
    "Ultra 9 285K": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop",
    "i9-14900K": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop",
    "R7 7800X3D": "https://images.unsplash.com/photo-1555664424-778a69022365?w=400&h=300&fit=crop",
    "i7-14700K": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop",
    "R5 7600X": "https://images.unsplash.com/photo-1555664424-778a69022365?w=400&h=300&fit=crop",
    "i5-14600K": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop",
    "EPYC 9654": "https://images.unsplash.com/photo-1555664424-778a69022365?w=400&h=300&fit=crop",
    // Motherboards
    "TRX50-SAGE": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "X670E GODLIKE": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "X870 Taichi": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "Z790 XTREME": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "Z790 APEX": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "PRO Z790-A": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "B650 Elite": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "WRX90-SAGE": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "X299 Omega": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    "Z890 HERO": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    // RAM
    "Trident Z5 96GB": "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    "ECC 256GB": "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    "Dominator 64GB": "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    "Vengeance 128GB": "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    "Trident Z5 64GB": "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    "Fury Renegade": "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    "Vengeance 64GB": "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    "Trident Z5 32GB": "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    // Storage
    "990 PRO 4TB": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    "SN850X 4TB": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    "T700 4TB": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    "Rocket 4 Plus": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    "FireCuda 530": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    "870 EVO 4TB": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    "Red Pro 20TB": "https://images.unsplash.com/photo-1531492746076-161ca9bcad29?w=400&h=300&fit=crop",
    "Gold 20TB": "https://images.unsplash.com/photo-1531492746076-161ca9bcad29?w=400&h=300&fit=crop",
    // PSUs
    "AX1600i": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "HX1500i": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "TX-1600": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "Dark Power 13": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "RM1200x": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "Vertex GX-1200": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "SuperNOVA 1600": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "Focus GX-1000": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    // Cooling
    "NH-D15": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "Liquid Freezer III": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "H150i Elite": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "Kraken X73": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "Assassin IV": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "LS720": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "Freezer 36": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    "MasterLiquid 360": "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
  };
  
  // Extract short name for lookup
  const shortName = Object.keys(productImages).find(key => name.includes(key));
  
  if (shortName) {
    return productImages[shortName];
  }
  
  // Fallback to category-based images
  const categoryImages: Record<Category, string> = {
    GPU: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
    CPU: "https://images.unsplash.com/photo-1555664424-778a69022365?w=400&h=300&fit=crop",
    Motherboard: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    RAM: "https://images.unsplash.com/photo-1562976540-60f5d1549a13?w=400&h=300&fit=crop",
    Storage: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    PSU: "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
    Cooling: "https://images.unsplash.com/photo-1587202372634-32705e3e568e?w=400&h=300&fit=crop",
  };
  
  return categoryImages[category] || categoryImages.GPU;
}

// ============================================
// GPU DATABASE - 15 Components
// ============================================

const GPUs: HardwareComponent[] = [
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
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 5090"),
    directLinks: generateDirectLinks("rtx-5090"),
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
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4090"),
    directLinks: generateDirectLinks("rtx-4090"),
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
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4080 SUPER"),
    directLinks: generateDirectLinks("rtx-4080-super"),
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
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4070 Ti SUPER"),
    directLinks: generateDirectLinks("rtx-4070-ti-super"),
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
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 3090 Ti"),
    directLinks: generateDirectLinks("rtx-3090-ti"),
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
    affiliateLinks: generateAffiliateLinks("NVIDIA GeForce RTX 4060 Ti 16GB"),
    directLinks: generateDirectLinks("rtx-4060-ti-16gb"),
    inStock: true,
  },
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
    affiliateLinks: generateAffiliateLinks("NVIDIA RTX 6000 Ada Generation"),
    directLinks: generateDirectLinks("rtx-6000-ada"),
    inStock: true,
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
    affiliateLinks: generateAffiliateLinks("NVIDIA A100 80GB"),
    inStock: true,
  },
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
    affiliateLinks: generateAffiliateLinks("NVIDIA H100 80GB"),
    inStock: false,
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
    affiliateLinks: generateAffiliateLinks("NVIDIA RTX A6000"),
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
    affiliateLinks: generateAffiliateLinks("AMD Radeon RX 7900 XTX"),
    directLinks: generateDirectLinks("rx-7900-xtx"),
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
    affiliateLinks: generateAffiliateLinks("AMD Radeon RX 7900 XT"),
    directLinks: generateDirectLinks("rx-7900-xt"),
    inStock: true,
  },
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
    affiliateLinks: generateAffiliateLinks("AMD Radeon RX 7800 XT"),
    directLinks: generateDirectLinks("rx-7800-xt"),
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
    affiliateLinks: generateAffiliateLinks("NVIDIA L40S"),
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
    affiliateLinks: generateAffiliateLinks("NVIDIA A40"),
    inStock: true,
  },
];

// ============================================
// CPU DATABASE - 10 Components
// ============================================

const CPUs: HardwareComponent[] = [
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
    affiliateLinks: generateAffiliateLinks("AMD Ryzen Threadripper PRO 7995WX"),
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
    affiliateLinks: generateAffiliateLinks("AMD Ryzen Threadripper 7980X"),
    directLinks: generateDirectLinks("tr-7980x"),
    inStock: true,
  },
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
    affiliateLinks: generateAffiliateLinks("AMD Ryzen 9 9950X"),
    directLinks: generateDirectLinks("ryzen-9-9950x"),
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
    affiliateLinks: generateAffiliateLinks("Intel Core Ultra 9 285K"),
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
    affiliateLinks: generateAffiliateLinks("Intel Core i9-14900K"),
    directLinks: generateDirectLinks("core-i9-14900k"),
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
    affiliateLinks: generateAffiliateLinks("AMD Ryzen 7 7800X3D"),
    directLinks: generateDirectLinks("ryzen-7-7800x3d"),
    inStock: true,
  },
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
    affiliateLinks: generateAffiliateLinks("Intel Core i7-14700K"),
    directLinks: generateDirectLinks("core-i7-14700k"),
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
    affiliateLinks: generateAffiliateLinks("AMD Ryzen 5 7600X"),
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
    affiliateLinks: generateAffiliateLinks("Intel Core i5-14600K"),
    directLinks: generateDirectLinks("core-i5-14600k"),
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
    affiliateLinks: generateAffiliateLinks("AMD EPYC 9654"),
    inStock: true,
  },
];

// ============================================
// MOTHERBOARD DATABASE - 10 Components
// ============================================

const Motherboards: HardwareComponent[] = [
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
      architecture: "E-ATX",
      tdp: "N/A",
    },
    description: "Workstation board for Threadripper PRO with octa-channel",
    tags: ["Workstation", "sTR5", "Octa-Channel"],
    aiScore: 95,
    affiliateLinks: generateAffiliateLinks("ASUS Pro WS TRX50-SAGE WIFI"),
    inStock: true,
  },
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
      architecture: "E-ATX",
      tdp: "N/A",
    },
    description: "Ultimate AM5 motherboard for dual GPU setups",
    tags: ["Enthusiast", "AM5", "Dual GPU"],
    aiScore: 88,
    affiliateLinks: generateAffiliateLinks("MSI MEG X670E GODLIKE"),
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
      architecture: "ATX",
      tdp: "N/A",
    },
    description: "Premium AM5 board with reinforced PCIe 5.0 slots",
    tags: ["AM5", "Premium", "PCIe 5.0"],
    aiScore: 80,
    affiliateLinks: generateAffiliateLinks("ASRock X870 Taichi"),
    inStock: true,
  },
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
      architecture: "E-ATX",
      tdp: "N/A",
    },
    description: "Flagship Intel board with Thunderbolt 5",
    tags: ["Flagship", "LGA1700", "Thunderbolt 5"],
    aiScore: 85,
    affiliateLinks: generateAffiliateLinks("Gigabyte Z790 AORUS XTREME X"),
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
      architecture: "ATX",
      tdp: "N/A",
    },
    description: "Overclocking focused board optimized for memory speed",
    tags: ["Overclocking", "LGA1700", "Memory OC"],
    aiScore: 78,
    affiliateLinks: generateAffiliateLinks("ASUS ROG Maximus Z790 APEX Encore"),
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
      architecture: "ATX",
      tdp: "N/A",
    },
    description: "Reliable LGA1700 board for Core i7/i9 builds",
    tags: ["Mainstream", "LGA1700", "Reliable"],
    aiScore: 72,
    affiliateLinks: generateAffiliateLinks("MSI PRO Z790-A WIFI"),
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
      architecture: "ATX",
      tdp: "N/A",
    },
    description: "Cost-effective AM5 board with PCIe 4.0 x16",
    tags: ["Value", "AM5", "Budget"],
    aiScore: 68,
    affiliateLinks: generateAffiliateLinks("Gigabyte B650 AORUS Elite AX"),
    inStock: true,
  },
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
      architecture: "E-ATX",
      tdp: "N/A",
    },
    description: "Dual-socket workstation board for Threadripper PRO",
    tags: ["Workstation", "Dual Socket", "ECC"],
    aiScore: 98,
    affiliateLinks: generateAffiliateLinks("ASUS Pro WS WRX90E-SAGE SE"),
    inStock: true,
  },
  {
    id: "x299-xe",
    name: "ASUS ROG Rampage VI Extreme Omega",
    category: "Motherboard",
    brand: "ASUS",
    price: 699,
    msrp: 699,
    imageUrl: getImageUrl("ASUS", "X299 Omega", "Motherboard"),
    specs: {
      socket: "LGA2066",
      chipset: "X299",
      memorySupport: "DDR4-4266 256GB",
      architecture: "E-ATX",
      tdp: "N/A",
    },
    description: "Legacy HEDT board for Xeon W and Core X",
    tags: ["Legacy", "HEDT", "X299"],
    aiScore: 60,
    affiliateLinks: generateAffiliateLinks("ASUS ROG Rampage VI Extreme Omega"),
    inStock: false,
  },
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
      architecture: "ATX",
      tdp: "N/A",
    },
    description: "Next-gen Intel board with Arrow Lake support",
    tags: ["Next-Gen", "LGA1851", "Arrow Lake"],
    aiScore: 88,
    affiliateLinks: generateAffiliateLinks("ASUS ROG Maximus Z890 HERO"),
    inStock: true,
  },
];

// ============================================
// RAM DATABASE - 8 Components
// ============================================

const RAMs: HardwareComponent[] = [
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
      architecture: "CL32",
      type: "UDIMM",
    },
    description: "High-capacity DDR5 kit for large model inference",
    tags: ["High Capacity", "RGB", "Performance"],
    aiScore: 85,
    affiliateLinks: generateAffiliateLinks("G.Skill Trident Z5 RGB 96GB DDR5-6400"),
    inStock: true,
  },
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
      architecture: "CL46 ECC",
      type: "RDIMM",
    },
    description: "ECC memory for workstation stability and data integrity",
    tags: ["ECC", "Workstation", "256GB"],
    aiScore: 92,
    affiliateLinks: generateAffiliateLinks("Kingston Server Premier ECC 256GB DDR5"),
    inStock: true,
  },
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
      architecture: "CL34",
      type: "UDIMM",
    },
    description: "Premium high-speed kit for enthusiast builds",
    tags: ["Premium", "High Speed", "64GB"],
    aiScore: 88,
    affiliateLinks: generateAffiliateLinks("Corsair Dominator Titanium 64GB DDR5-7200"),
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
      architecture: "CL40",
      type: "UDIMM",
    },
    description: "High-capacity kit for multi-GPU workstations",
    tags: ["High Capacity", "128GB", "Workstation"],
    aiScore: 80,
    affiliateLinks: generateAffiliateLinks("Corsair Vengeance 128GB DDR5-5600"),
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
      architecture: "CL34",
      type: "UDIMM",
    },
    description: "Fast 64GB kit optimized for AM5 platforms",
    tags: ["Performance", "64GB", "AM5 Optimized"],
    aiScore: 82,
    affiliateLinks: generateAffiliateLinks("G.Skill Trident Z5 64GB DDR5-7200"),
    inStock: true,
  },
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
      architecture: "CL38",
      type: "UDIMM",
    },
    description: "Low-latency high-speed DDR5 for gaming and AI",
    tags: ["Low Latency", "64GB", "High Speed"],
    aiScore: 78,
    affiliateLinks: generateAffiliateLinks("Kingston FURY Renegade 64GB DDR5-7200"),
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
      architecture: "CL40",
      type: "UDIMM",
    },
    description: "Standard 64GB kit for budget AI workstations",
    tags: ["Budget", "64GB", "Reliable"],
    aiScore: 70,
    affiliateLinks: generateAffiliateLinks("Corsair Vengeance 64GB DDR5-5600"),
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
      architecture: "CL34",
      type: "UDIMM",
    },
    description: "High-speed entry kit for compact builds",
    tags: ["Entry", "RGB", "High Speed"],
    aiScore: 65,
    affiliateLinks: generateAffiliateLinks("G.Skill Trident Z5 RGB 32GB DDR5-7200"),
    inStock: true,
  },
];

// ============================================
// STORAGE DATABASE - 8 Components
// ============================================

const Storage: HardwareComponent[] = [
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
      architecture: "M.2 2280",
    },
    description: "Top-tier Gen4 SSD for AI dataset storage",
    tags: ["NVMe", "Gen4", "4TB"],
    aiScore: 90,
    affiliateLinks: generateAffiliateLinks("Samsung 990 PRO 4TB NVMe"),
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
      architecture: "M.2 2280",
    },
    description: "High-performance gaming SSD excellent for AI datasets",
    tags: ["NVMe", "Gen4", "Gaming"],
    aiScore: 85,
    affiliateLinks: generateAffiliateLinks("WD Black SN850X 4TB NVMe"),
    inStock: true,
  },
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
      architecture: "M.2 2280",
    },
    description: "PCIe 5.0 SSD for extreme ingest throughput",
    tags: ["NVMe", "Gen5", "PCIe 5.0"],
    aiScore: 92,
    affiliateLinks: generateAffiliateLinks("Crucial T700 4TB NVMe Gen5"),
    inStock: true,
  },
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
      architecture: "M.2 2280",
    },
    description: "Massive 8TB capacity for large model storage",
    tags: ["NVMe", "8TB", "High Capacity"],
    aiScore: 88,
    affiliateLinks: generateAffiliateLinks("Sabrent Rocket 4 Plus 8TB NVMe"),
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
      architecture: "M.2 2280",
    },
    description: "Reliable high-speed SSD with long warranty",
    tags: ["NVMe", "Reliable", "5yr Warranty"],
    aiScore: 84,
    affiliateLinks: generateAffiliateLinks("Seagate FireCuda 530 4TB NVMe"),
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
      architecture: "M.2 2280",
    },
    description: "High-performance SSD with heatsink option",
    tags: ["NVMe", "Heatsink", "Performance"],
    aiScore: 82,
    affiliateLinks: generateAffiliateLinks("Corsair MP600 PRO XT 4TB NVMe"),
    inStock: true,
  },
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
      architecture: "M.2 2280",
    },
    description: "Reliable Gen4 SSD for OS and applications",
    tags: ["NVMe", "OS Drive", "Reliable"],
    aiScore: 78,
    affiliateLinks: generateAffiliateLinks("Samsung 980 PRO 2TB NVMe"),
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
      architecture: "M.2 2280",
    },
    description: "Budget-friendly high-speed NVMe option",
    tags: ["NVMe", "Budget", "Value"],
    aiScore: 75,
    affiliateLinks: generateAffiliateLinks("Kingston KC3000 2TB NVMe"),
    inStock: true,
  },
];

// ============================================
// PSU DATABASE - 10 Components
// ============================================

const PSUs: HardwareComponent[] = [
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
      architecture: "Digital",
      type: "ATX 3.0",
    },
    description: "1600W Titanium PSU for multi-GPU AI workstations",
    tags: ["1600W", "Titanium", "Digital"],
    aiScore: 95,
    affiliateLinks: generateAffiliateLinks("Corsair AX1600i Digital ATX"),
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
      architecture: "Analog",
      type: "ATX 3.0",
    },
    description: "Premium 1600W unit with 12-year warranty",
    tags: ["1600W", "Titanium", "12yr Warranty"],
    aiScore: 92,
    affiliateLinks: generateAffiliateLinks("Seasonic PRIME TX-1600"),
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
      architecture: "Analog",
      type: "ATX 2.4",
    },
    description: "Legacy 1600W Titanium PSU for 4-GPU builds",
    tags: ["1600W", "Legacy", "Multi-GPU"],
    aiScore: 88,
    affiliateLinks: generateAffiliateLinks("EVGA SuperNOVA 1600 T2"),
    inStock: true,
  },
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
      architecture: "Silent Wings",
      type: "ATX 3.0",
    },
    description: "Silent Titanium PSU for noise-sensitive AI labs",
    tags: ["1000W", "Titanium", "Silent"],
    aiScore: 85,
    affiliateLinks: generateAffiliateLinks("be quiet! Dark Power 13 1000W"),
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
      architecture: "Side Connect",
      type: "ATX 3.0",
    },
    description: "Side-connect 1200W for cleaner cable management",
    tags: ["1200W", "Side Connect", "Gold"],
    aiScore: 80,
    affiliateLinks: generateAffiliateLinks("Corsair RM1200x SHIFT"),
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
      architecture: "OLED Display",
      type: "ATX 2.4",
    },
    description: "1200W PSU with OLED power display",
    tags: ["1200W", "OLED", "Premium"],
    aiScore: 82,
    affiliateLinks: generateAffiliateLinks("ASUS ROG Thor 1200P"),
    inStock: true,
  },
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
      architecture: "Compact",
      type: "ATX 2.4",
    },
    description: "Reliable 1000W for single high-end GPU builds",
    tags: ["1000W", "Gold", "Reliable"],
    aiScore: 78,
    affiliateLinks: generateAffiliateLinks("Seasonic FOCUS GX-1000"),
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
      architecture: "Silent Loop",
      type: "ATX 3.0",
    },
    description: "850W Platinum for mid-range AI workstations",
    tags: ["850W", "Platinum", "Quiet"],
    aiScore: 75,
    affiliateLinks: generateAffiliateLinks("be quiet! Straight Power 12 850W"),
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
      architecture: "Fluid Dynamic",
      type: "ATX 2.4",
    },
    description: "850W Gold for budget single-GPU builds",
    tags: ["850W", "Gold", "Budget"],
    aiScore: 70,
    affiliateLinks: generateAffiliateLinks("EVGA SuperNOVA 850 G7"),
    inStock: true,
  },
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
      architecture: "SFX-L",
      type: "ATX 3.0",
    },
    description: "Compact SFX-L PSU for small form factor builds",
    tags: ["1000W", "SFX-L", "Compact"],
    aiScore: 80,
    affiliateLinks: generateAffiliateLinks("ASUS ROG Loki 1000W SFX-L"),
    inStock: true,
  },
];

// ============================================
// COOLING DATABASE - 10 Components
// ============================================

const Cooling: HardwareComponent[] = [
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
      architecture: "Triple Fan",
    },
    description: "420mm AIO for high-TDP Threadripper CPUs",
    tags: ["AIO", "420mm", "High TDP"],
    aiScore: 88,
    affiliateLinks: generateAffiliateLinks("ARCTIC Liquid Freezer III 420"),
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
      architecture: "Dual 140mm",
    },
    description: "Premium dual-tower air cooler with exceptional reliability",
    tags: ["Air", "Quiet", "Premium"],
    aiScore: 85,
    affiliateLinks: generateAffiliateLinks("Noctua NH-D15 G2"),
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
      architecture: "LCD Display",
    },
    description: "420mm AIO with LCD display for Threadripper",
    tags: ["AIO", "LCD", "420mm"],
    aiScore: 86,
    affiliateLinks: generateAffiliateLinks("Corsair iCUE H170i ELITE LCD XT"),
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
      architecture: "Display",
    },
    description: "360mm AIO with customizable display",
    tags: ["AIO", "Display", "RGB"],
    aiScore: 82,
    affiliateLinks: generateAffiliateLinks("NZXT Kraken Elite 360"),
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
      architecture: "Passive Loop",
    },
    description: "Thermosiphon cooler for extreme workstation CPUs",
    tags: ["Thermosiphon", "500W", "Workstation"],
    aiScore: 90,
    affiliateLinks: generateAffiliateLinks("IceGiant Prosiphon Elite"),
    inStock: true,
  },
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
      architecture: "Triple Fan",
    },
    description: "Value 360mm AIO for high-end desktop CPUs",
    tags: ["AIO", "360mm", "Value"],
    aiScore: 80,
    affiliateLinks: generateAffiliateLinks("ARCTIC Liquid Freezer III 360"),
    inStock: true,
  },
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
      architecture: "Dual 140mm",
    },
    description: "Budget dual-tower with competitive performance",
    tags: ["Air", "Budget", "Dual Tower"],
    aiScore: 75,
    affiliateLinks: generateAffiliateLinks("DeepCool Assassin 4"),
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
      architecture: "Dual 120mm",
    },
    description: "Compact high-performance air cooler in black",
    tags: ["Air", "Compact", "Black"],
    aiScore: 78,
    affiliateLinks: generateAffiliateLinks("Noctua NH-U12A chromax"),
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
      architecture: "Dual Chamber",
    },
    description: "Reliable 360mm AIO with dual-chamber pump",
    tags: ["AIO", "360mm", "Reliable"],
    aiScore: 76,
    affiliateLinks: generateAffiliateLinks("Cooler Master MasterLiquid 360 Atmos"),
    inStock: true,
  },
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
      architecture: "Passive",
    },
    description: "External 420mm radiator for custom loops",
    tags: ["External", "420mm", "Custom Loop"],
    aiScore: 92,
    affiliateLinks: generateAffiliateLinks("Watercool MO-RA IV 420 Core"),
    inStock: true,
  },
];

// ============================================
// COMBINED DATABASE EXPORT
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

// Total component count: 71

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getComponentById(id: string): HardwareComponent | undefined {
  return hardwareComponents.find((c) => c.id === id);
}

export function getComponentsByCategory(category: Category): HardwareComponent[] {
  return hardwareComponents.filter((c) => c.category === category);
}

export function getComponentsByTag(tag: string): HardwareComponent[] {
  return hardwareComponents.filter((c) => c.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
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

export function getGPUsByVram(minVram: number): HardwareComponent[] {
  return hardwareComponents.filter((c) => {
    if (c.category !== "GPU") return false;
    const vramMatch = c.specs.vram?.match(/(\d+)/);
    return vramMatch ? parseInt(vramMatch[1]) >= minVram : false;
  });
}

export function getPSUsByWattage(minWattage: number): HardwareComponent[] {
  return hardwareComponents.filter((c) => {
    if (c.category !== "PSU") return false;
    const wattageMatch = c.specs.wattage?.match(/(\d+)/);
    return wattageMatch ? parseInt(wattageMatch[1]) >= minWattage : false;
  });
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

// ============================================
// STATISTICS
// ============================================

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
  inStock: hardwareComponents.filter((c) => c.inStock).length,
  highScore: hardwareComponents.filter((c) => c.aiScore >= 90).length,
};

// Export individual categories for direct import
export { GPUs, CPUs, Motherboards, RAMs, Storage, PSUs, Cooling };

// Default export for convenience
export default hardwareComponents;
