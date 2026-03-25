// AI Workload Compatibility Engine - Proprietary Logic
// Component database with AI-specific metrics and compatibility rules

export type ComponentType = "cpu" | "gpu" | "motherboard" | "ram" | "psu" | "storage" | "cooling";
export type WorkloadType = "training_large" | "training_medium" | "inference_enterprise" | "inference_small" | "edge_ai" | "multimodal";
export type StoreType = "amazon" | "aliexpress" | "ebay";

export interface StorePrice {
  store: StoreType;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  lastUpdated: string;
}

export interface BaseComponent {
  id: string;
  name: string;
  brand: string;
  category: ComponentType;
  description: string;
  aiPerformanceScore: number; // 0-100 proprietary AI benchmark
  prices: StorePrice[];
  tags: string[];
  releaseDate: string;
  msrp: number;
  imageUrl?: string;
}

// GPU Component with AI-specific specs
export interface GPU extends BaseComponent {
  category: "gpu";
  vramGb: number;
  vramType: "GDDR6" | "GDDR6X" | "GDDR7" | "HBM2e" | "HBM3";
  cudaCores: number;
  tensorCores: number;
  rtCores: number;
  pciLanes: number;
  tdp: number;
  tflopsFp16: number;
  tflopsFp32: number;
  tensorFLOPs: number;
  architecture: string;
  processNode: string;
  supportsNvlink: boolean;
  maxDisplayResolution: string;
  powerConnectors: string[];
  aiCapabilities: string[]; // e.g., ["transformer_engine", "dlss3", "nvenc_av1"]
  recommendedWorkloads: WorkloadType[];
}

// CPU Component with AI inference optimization
export interface CPU extends BaseComponent {
  category: "cpu";
  cores: number;
  threads: number;
  baseClock: number; // GHz
  boostClock: number; // GHz
  tdp: number;
  pciLanes: number;
  supportsPcie5: boolean;
  maxMemoryChannels: number;
  maxMemorySpeed: number; // MHz
  supportsEcc: boolean;
  hasNpu: boolean;
  npuTops?: number; // AI TOPS for integrated NPU
  architecture: string;
  processNode: string;
  socket: string;
  aiCapabilities: string[];
  recommendedWorkloads: WorkloadType[];
}

// Motherboard with compatibility matrix
export interface Motherboard extends BaseComponent {
  category: "motherboard";
  socket: string;
  chipset: string;
  formFactor: "ATX" | "E-ATX" | "mATX" | "ITX";
  memorySlots: number;
  maxMemory: number; // GB
  memoryType: "DDR4" | "DDR5";
  maxMemorySpeed: number; // MHz
  pciSlots: {
    x16: number;
    x8: number;
    x4: number;
    x1: number;
  };
  m2Slots: number;
  sataPorts: number;
  supportsPcie5: boolean;
  supportsNvmeRaid: boolean;
  hasThunderbolt: boolean;
  has10gbe: boolean;
  vrmPhases: number;
  maxPcieLanesFromCpu: number;
  supportsMultiGpu: boolean;
  maxGpuLength: number; // mm
  cpuPowerConnectors: string[];
  aiFeatures: string[];
}

// RAM optimized for AI workloads
export interface RAM extends BaseComponent {
  category: "ram";
  capacity: number; // GB per stick
  totalCapacity: number; // GB for kit
  type: "DDR4" | "DDR5";
  speed: number; // MHz
  casLatency: number;
  voltage: number;
  modules: number; // Number of sticks in kit
  hasEcc: boolean;
  isBuffered: boolean;
  heatSpreader: boolean;
  recommendedChannels: number;
  aiPerformanceImpact: number; // 0-10 score
}

// PSU with multi-GPU support calculations
export interface PSU extends BaseComponent {
  category: "psu";
  wattage: number;
  efficiency: "80+" | "80+ Bronze" | "80+ Silver" | "80+ Gold" | "80+ Platinum" | "80+ Titanium";
  modular: "Non-Modular" | "Semi-Modular" | "Full-Modular";
  formFactor: "ATX" | "SFX" | "SFX-L" | "TFX";
  pcie8pinConnectors: number;
  pcie12vhpwrConnectors: number;
  eps8pinConnectors: number;
  sataConnectors: number;
  molexConnectors: number;
  maxCombined12v: number; // Watts on 12V rail
  supportsAtx3: boolean;
  supportsPcie5: boolean;
  noiseLevel: number; // dB at 50% load
  fanSize: number; // mm
  warranty: number; // years
  calculatedHeadroom: number; // Dynamic headroom for AI builds
}

// Storage for AI datasets
export interface Storage extends BaseComponent {
  category: "storage";
  type: "NVMe SSD" | "SATA SSD" | "HDD";
  capacity: number; // GB
  interface: "PCIe 4.0 x4" | "PCIe 3.0 x4" | "PCIe 5.0 x4" | "SATA III";
  readSpeed: number; // MB/s
  writeSpeed: number; // MB/s
  iopsRead: number;
  iopsWrite: number;
  nandType: "TLC" | "QLC" | "MLC";
  hasDram: boolean;
  endurance: number; // TBW
  formFactor: "M.2 2280" | "M.2 22110" | "2.5\"" | "3.5\"";
  aiSuitabilityScore: number; // 0-10
}

// Cooling system
export interface Cooling extends BaseComponent {
  category: "cooling";
  type: "Air" | "AIO" | "Custom Loop";
  socketSupport: string[];
  tdpRating: number; // Watts
  fanSize: number[]; // mm
  fanCount: number;
  noiseLevel: number; // dB
  radiatorSize?: string; // For AIO
  hasRgb: boolean;
  aiThermalHeadroom: number; // Extra capacity for sustained AI workloads
}

// Component database
export const gpuDatabase: GPU[] = [
  {
    id: "nvidia-rtx-5090",
    name: "GeForce RTX 5090",
    brand: "NVIDIA",
    category: "gpu",
    description: "Next-generation flagship GPU with Blackwell 2.0 architecture",
    aiPerformanceScore: 100,
    vramGb: 32,
    vramType: "GDDR7",
    cudaCores: 21760,
    tensorCores: 680,
    rtCores: 212,
    pciLanes: 16,
    tdp: 450,
    tflopsFp16: 125.0,
    tflopsFp32: 62.5,
    tensorFLOPs: 2500,
    architecture: "Blackwell 2.0",
    processNode: "3nm",
    supportsNvlink: true,
    maxDisplayResolution: "8K@120Hz",
    powerConnectors: ["1x 16-pin 12VHPWR"],
    aiCapabilities: ["transformer_engine_3.0", "dlss4", "nvenc_av1", "fp8_support", "5th_gen_tensor_cores"],
    recommendedWorkloads: ["training_large", "inference_enterprise", "multimodal"],
    prices: [
      { store: "amazon", price: 1999, currency: "USD", url: "https://amazon.com/rtx-5090", inStock: false, lastUpdated: "2024-01-01" },
      { store: "aliexpress", price: 1899, currency: "USD", url: "https://aliexpress.com/rtx-5090", inStock: false, lastUpdated: "2024-01-01" },
      { store: "ebay", price: 2200, currency: "USD", url: "https://ebay.com/rtx-5090", inStock: false, lastUpdated: "2024-01-01" },
    ],
    tags: ["flagship", "next-gen", "ai-training", "nvlink"],
    releaseDate: "2025-03-01",
    msrp: 1999,
  },
  {
    id: "nvidia-rtx-4090",
    name: "GeForce RTX 4090",
    brand: "NVIDIA",
    category: "gpu",
    description: "Current flagship with massive 24GB VRAM for large models",
    aiPerformanceScore: 85,
    vramGb: 24,
    vramType: "GDDR6X",
    cudaCores: 16384,
    tensorCores: 512,
    rtCores: 128,
    pciLanes: 16,
    tdp: 450,
    tflopsFp16: 82.6,
    tflopsFp32: 41.3,
    tensorFLOPs: 1650,
    architecture: "Ada Lovelace",
    processNode: "4nm",
    supportsNvlink: false,
    maxDisplayResolution: "8K@60Hz",
    powerConnectors: ["1x 16-pin 12VHPWR"],
    aiCapabilities: ["transformer_engine_2.0", "dlss3", "nvenc_av1", "fp8_support", "4th_gen_tensor_cores"],
    recommendedWorkloads: ["training_large", "training_medium", "inference_enterprise", "multimodal"],
    prices: [
      { store: "amazon", price: 1599, currency: "USD", url: "https://amazon.com/rtx-4090", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 1549, currency: "USD", url: "https://aliexpress.com/rtx-4090", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 1450, currency: "USD", url: "https://ebay.com/rtx-4090", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["flagship", "ai-workhorse", "24gb-vram", "popular"],
    releaseDate: "2022-10-12",
    msrp: 1599,
  },
  {
    id: "nvidia-rtx-4080-super",
    name: "GeForce RTX 4080 SUPER",
    brand: "NVIDIA",
    category: "gpu",
    description: "High-performance GPU for professional AI inference",
    aiPerformanceScore: 70,
    vramGb: 16,
    vramType: "GDDR6X",
    cudaCores: 10240,
    tensorCores: 320,
    rtCores: 80,
    pciLanes: 16,
    tdp: 320,
    tflopsFp16: 52.2,
    tflopsFp32: 26.1,
    tensorFLOPs: 1040,
    architecture: "Ada Lovelace",
    processNode: "4nm",
    supportsNvlink: false,
    maxDisplayResolution: "4K@240Hz",
    powerConnectors: ["1x 16-pin 12VHPWR"],
    aiCapabilities: ["transformer_engine", "dlss3", "nvenc_av1", "4th_gen_tensor_cores"],
    recommendedWorkloads: ["training_medium", "inference_enterprise", "multimodal"],
    prices: [
      { store: "amazon", price: 999, currency: "USD", url: "https://amazon.com/rtx-4080-super", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 959, currency: "USD", url: "https://aliexpress.com/rtx-4080-super", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 899, currency: "USD", url: "https://ebay.com/rtx-4080-super", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["prosumer", "inference", "16gb-vram"],
    releaseDate: "2024-01-31",
    msrp: 999,
  },
  {
    id: "nvidia-rtx-4070-ti-super",
    name: "GeForce RTX 4070 Ti SUPER",
    brand: "NVIDIA",
    category: "gpu",
    description: "Sweet spot for AI enthusiasts with 16GB VRAM",
    aiPerformanceScore: 60,
    vramGb: 16,
    vramType: "GDDR6X",
    cudaCores: 8448,
    tensorCores: 264,
    rtCores: 66,
    pciLanes: 16,
    tdp: 285,
    tflopsFp16: 40.1,
    tflopsFp32: 20.0,
    tensorFLOPs: 800,
    architecture: "Ada Lovelace",
    processNode: "4nm",
    supportsNvlink: false,
    maxDisplayResolution: "4K@240Hz",
    powerConnectors: ["1x 16-pin 12VHPWR"],
    aiCapabilities: ["dlss3", "nvenc_av1", "4th_gen_tensor_cores"],
    recommendedWorkloads: ["training_medium", "inference_small", "multimodal"],
    prices: [
      { store: "amazon", price: 799, currency: "USD", url: "https://amazon.com/rtx-4070-ti-super", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 769, currency: "USD", url: "https://aliexpress.com/rtx-4070-ti-super", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 749, currency: "USD", url: "https://ebay.com/rtx-4070-ti-super", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["enthusiast", "value", "16gb-vram"],
    releaseDate: "2024-01-24",
    msrp: 799,
  },
  {
    id: "nvidia-rtx-3090-ti",
    name: "GeForce RTX 3090 Ti",
    brand: "NVIDIA",
    category: "gpu",
    description: "Previous-gen flagship, excellent value on used market",
    aiPerformanceScore: 55,
    vramGb: 24,
    vramType: "GDDR6X",
    cudaCores: 10752,
    tensorCores: 336,
    rtCores: 84,
    pciLanes: 16,
    tdp: 450,
    tflopsFp16: 40.0,
    tflopsFp32: 20.0,
    tensorFLOPs: 640,
    architecture: "Ampere",
    processNode: "8nm",
    supportsNvlink: true,
    maxDisplayResolution: "8K@60Hz",
    powerConnectors: ["1x 16-pin 12VHPWR"],
    aiCapabilities: ["dlss2", "nvenc", "3rd_gen_tensor_cores"],
    recommendedWorkloads: ["training_large", "training_medium", "inference_enterprise"],
    prices: [
      { store: "amazon", price: 1099, currency: "USD", url: "https://amazon.com/rtx-3090-ti", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 999, currency: "USD", url: "https://aliexpress.com/rtx-3090-ti", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 850, currency: "USD", url: "https://ebay.com/rtx-3090-ti", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["used-market", "value", "24gb-vram", "nvlink"],
    releaseDate: "2022-03-29",
    msrp: 1999,
  },
];

export const cpuDatabase: CPU[] = [
  {
    id: "amd-tr-pro-7995wx",
    name: "Ryzen Threadripper PRO 7995WX",
    brand: "AMD",
    category: "cpu",
    description: "96-core workstation CPU for massive parallel AI preprocessing",
    aiPerformanceScore: 95,
    cores: 96,
    threads: 192,
    baseClock: 2.5,
    boostClock: 5.1,
    tdp: 350,
    pciLanes: 128,
    supportsPcie5: true,
    maxMemoryChannels: 8,
    maxMemorySpeed: 5200,
    supportsEcc: true,
    hasNpu: false,
    architecture: "Zen 4",
    processNode: "5nm",
    socket: "sTR5",
    aiCapabilities: ["massive_parallelism", "8ch_ddr5", "ecc_support"],
    recommendedWorkloads: ["training_large", "inference_enterprise", "multimodal"],
    prices: [
      { store: "amazon", price: 4999, currency: "USD", url: "https://amazon.com/tr-7995wx", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 4799, currency: "USD", url: "https://aliexpress.com/tr-7995wx", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 4500, currency: "USD", url: "https://ebay.com/tr-7995wx", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["workstation", "96-core", "hpc", "ecc"],
    releaseDate: "2023-10-19",
    msrp: 4999,
  },
  {
    id: "amd-tr-7980x",
    name: "Ryzen Threadripper 7980X",
    brand: "AMD",
    category: "cpu",
    description: "64-core enthusiast CPU for multi-GPU setups",
    aiPerformanceScore: 85,
    cores: 64,
    threads: 128,
    baseClock: 3.2,
    boostClock: 5.1,
    tdp: 350,
    pciLanes: 128,
    supportsPcie5: true,
    maxMemoryChannels: 4,
    maxMemorySpeed: 5200,
    supportsEcc: true,
    hasNpu: false,
    architecture: "Zen 4",
    processNode: "5nm",
    socket: "sTR5",
    aiCapabilities: ["64_cores", "4ch_ddr5", "ecc_support"],
    recommendedWorkloads: ["training_large", "training_medium", "multimodal"],
    prices: [
      { store: "amazon", price: 2999, currency: "USD", url: "https://amazon.com/tr-7980x", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 2899, currency: "USD", url: "https://aliexpress.com/tr-7980x", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 2700, currency: "USD", url: "https://ebay.com/tr-7980x", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["enthusiast", "64-core", "multi-gpu"],
    releaseDate: "2023-11-21",
    msrp: 2999,
  },
  {
    id: "amd-ryzen-9-9950x",
    name: "Ryzen 9 9950X",
    brand: "AMD",
    category: "cpu",
    description: "16-core Zen 5 flagship with best single-thread performance",
    aiPerformanceScore: 75,
    cores: 16,
    threads: 32,
    baseClock: 4.3,
    boostClock: 5.7,
    tdp: 170,
    pciLanes: 28,
    supportsPcie5: true,
    maxMemoryChannels: 2,
    maxMemorySpeed: 5600,
    supportsEcc: false,
    hasNpu: false,
    architecture: "Zen 5",
    processNode: "4nm",
    socket: "AM5",
    aiCapabilities: ["high_ipc", "avx512", "dual_channel_ddr5"],
    recommendedWorkloads: ["training_medium", "inference_small", "multimodal"],
    prices: [
      { store: "amazon", price: 649, currency: "USD", url: "https://amazon.com/r9-9950x", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 629, currency: "USD", url: "https://aliexpress.com/r9-9950x", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 599, currency: "USD", url: "https://ebay.com/r9-9950x", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["gaming", "ai", "16-core", "zen5"],
    releaseDate: "2024-10-22",
    msrp: 649,
  },
  {
    id: "intel-core-ultra-9-285k",
    name: "Core Ultra 9 285K",
    brand: "Intel",
    category: "cpu",
    description: "24-core CPU with integrated NPU for AI acceleration",
    aiPerformanceScore: 70,
    cores: 24,
    threads: 24,
    baseClock: 3.7,
    boostClock: 5.7,
    tdp: 125,
    pciLanes: 20,
    supportsPcie5: true,
    maxMemoryChannels: 2,
    maxMemorySpeed: 6400,
    supportsEcc: false,
    hasNpu: true,
    npuTops: 13,
    architecture: "Arrow Lake",
    processNode: "Intel 20A",
    socket: "LGA 1851",
    aiCapabilities: ["integrated_npu", "13_tops", "vnni", "dp4a"],
    recommendedWorkloads: ["inference_small", "edge_ai", "multimodal"],
    prices: [
      { store: "amazon", price: 589, currency: "USD", url: "https://amazon.com/u9-285k", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 569, currency: "USD", url: "https://aliexpress.com/u9-285k", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 549, currency: "USD", url: "https://ebay.com/u9-285k", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["npu", "ai-acceleration", "24-core", "hybrid"],
    releaseDate: "2024-10-24",
    msrp: 589,
  },
];

export const motherboardDatabase: Motherboard[] = [
  {
    id: "asus-pro-ws-trx50-sage",
    name: "Pro WS TRX50-SAGE WIFI",
    brand: "ASUS",
    category: "motherboard",
    description: "Workstation motherboard for Threadripper PRO with octa-channel memory",
    aiPerformanceScore: 90,
    socket: "sTR5",
    chipset: "TRX50",
    formFactor: "E-ATX",
    memorySlots: 8,
    maxMemory: 2048,
    memoryType: "DDR5",
    maxMemorySpeed: 8000,
    pciSlots: { x16: 4, x8: 0, x4: 1, x1: 1 },
    m2Slots: 4,
    sataPorts: 8,
    supportsPcie5: true,
    supportsNvmeRaid: true,
    hasThunderbolt: true,
    has10gbe: true,
    vrmPhases: 36,
    maxPcieLanesFromCpu: 128,
    supportsMultiGpu: true,
    maxGpuLength: 350,
    cpuPowerConnectors: ["2x 8-pin", "1x 6-pin"],
    aiFeatures: ["8ch_memory", "4x_gpu_support", "10gbe", "ipmi"],
    prices: [
      { store: "amazon", price: 1299, currency: "USD", url: "https://amazon.com/trx50-sage", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 1199, currency: "USD", url: "https://aliexpress.com/trx50-sage", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 1099, currency: "USD", url: "https://ebay.com/trx50-sage", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["workstation", "threadripper", "4x-gpu", "ecc"],
    releaseDate: "2023-10-19",
    msrp: 1299,
  },
  {
    id: "msi-meg-x670e-godlike",
    name: "MEG X670E GODLIKE",
    brand: "MSI",
    category: "motherboard",
    description: "Ultimate AM5 motherboard for dual GPU setups",
    aiPerformanceScore: 80,
    socket: "AM5",
    chipset: "X670E",
    formFactor: "E-ATX",
    memorySlots: 4,
    maxMemory: 256,
    memoryType: "DDR5",
    maxMemorySpeed: 8000,
    pciSlots: { x16: 2, x8: 1, x4: 1, x1: 1 },
    m2Slots: 6,
    sataPorts: 8,
    supportsPcie5: true,
    supportsNvmeRaid: true,
    hasThunderbolt: true,
    has10gbe: true,
    vrmPhases: 24,
    maxPcieLanesFromCpu: 28,
    supportsMultiGpu: true,
    maxGpuLength: 330,
    cpuPowerConnectors: ["2x 8-pin"],
    aiFeatures: ["dual_gpu", "6x_m2", "10gbe"],
    prices: [
      { store: "amazon", price: 899, currency: "USD", url: "https://amazon.com/x670e-godlike", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 849, currency: "USD", url: "https://aliexpress.com/x670e-godlike", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 799, currency: "USD", url: "https://ebay.com/x670e-godlike", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["enthusiast", "am5", "dual-gpu", "premium"],
    releaseDate: "2022-09-27",
    msrp: 1299,
  },
];

export const ramDatabase: RAM[] = [
  {
    id: "gskill-trident-z5-96gb",
    name: "Trident Z5 RGB 96GB Kit",
    brand: "G.Skill",
    category: "ram",
    description: "High-capacity DDR5 kit for large model inference",
    aiPerformanceScore: 70,
    capacity: 48,
    totalCapacity: 96,
    type: "DDR5",
    speed: 6400,
    casLatency: 32,
    voltage: 1.35,
    modules: 2,
    hasEcc: false,
    isBuffered: false,
    heatSpreader: true,
    recommendedChannels: 2,
    aiPerformanceImpact: 8,
    prices: [
      { store: "amazon", price: 449, currency: "USD", url: "https://amazon.com/trident-96gb", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 429, currency: "USD", url: "https://aliexpress.com/trident-96gb", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 399, currency: "USD", url: "https://ebay.com/trident-96gb", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["high-capacity", "96gb", "ddr5-6400", "rgb"],
    releaseDate: "2024-01-15",
    msrp: 499,
  },
  {
    id: "kingston-kc600-ecc-256gb",
    name: "Server Premier ECC 256GB Kit",
    brand: "Kingston",
    category: "ram",
    description: "ECC memory for workstation stability and data integrity",
    aiPerformanceScore: 85,
    capacity: 32,
    totalCapacity: 256,
    type: "DDR5",
    speed: 5600,
    casLatency: 46,
    voltage: 1.25,
    modules: 8,
    hasEcc: true,
    isBuffered: false,
    heatSpreader: true,
    recommendedChannels: 8,
    aiPerformanceImpact: 10,
    prices: [
      { store: "amazon", price: 899, currency: "USD", url: "https://amazon.com/kingston-256gb-ecc", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 859, currency: "USD", url: "https://aliexpress.com/kingston-256gb-ecc", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 799, currency: "USD", url: "https://ebay.com/kingston-256gb-ecc", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["ecc", "256gb", "workstation", "reliability"],
    releaseDate: "2023-11-01",
    msrp: 999,
  },
];

export const psuDatabase: PSU[] = [
  {
    id: "corsair-axi-1600",
    name: "AX1600i Digital ATX Power Supply",
    brand: "Corsair",
    category: "psu",
    description: "1600W titanium PSU for multi-GPU AI workstations",
    aiPerformanceScore: 90,
    wattage: 1600,
    efficiency: "80+ Titanium",
    modular: "Full-Modular",
    formFactor: "ATX",
    pcie8pinConnectors: 10,
    pcie12vhpwrConnectors: 2,
    eps8pinConnectors: 2,
    sataConnectors: 14,
    molexConnectors: 4,
    maxCombined12v: 1600,
    supportsAtx3: true,
    supportsPcie5: true,
    noiseLevel: 20,
    fanSize: 140,
    warranty: 10,
    calculatedHeadroom: 20,
    prices: [
      { store: "amazon", price: 599, currency: "USD", url: "https://amazon.com/ax1600i", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 549, currency: "USD", url: "https://aliexpress.com/ax1600i", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 499, currency: "USD", url: "https://ebay.com/ax1600i", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["1600w", "titanium", "multi-gpu", "digital"],
    releaseDate: "2022-01-01",
    msrp: 699,
  },
  {
    id: "be-quiet-dark-power-pro-1200",
    name: "Dark Power Pro 12 1200W",
    brand: "be quiet!",
    category: "psu",
    description: "Silent high-efficiency PSU for single-GPU setups",
    aiPerformanceScore: 75,
    wattage: 1200,
    efficiency: "80+ Titanium",
    modular: "Full-Modular",
    formFactor: "ATX",
    pcie8pinConnectors: 6,
    pcie12vhpwrConnectors: 2,
    eps8pinConnectors: 2,
    sataConnectors: 12,
    molexConnectors: 4,
    maxCombined12v: 1200,
    supportsAtx3: true,
    supportsPcie5: true,
    noiseLevel: 15,
    fanSize: 135,
    warranty: 10,
    calculatedHeadroom: 15,
    prices: [
      { store: "amazon", price: 399, currency: "USD", url: "https://amazon.com/dark-power-1200", inStock: true, lastUpdated: "2024-12-01" },
      { store: "aliexpress", price: 369, currency: "USD", url: "https://aliexpress.com/dark-power-1200", inStock: true, lastUpdated: "2024-12-01" },
      { store: "ebay", price: 349, currency: "USD", url: "https://ebay.com/dark-power-1200", inStock: true, lastUpdated: "2024-12-01" },
    ],
    tags: ["1200w", "titanium", "silent", "german-engineering"],
    releaseDate: "2023-03-01",
    msrp: 449,
  },
];

// Helper functions for component lookup
export const getGPUById = (id: string): GPU | undefined => gpuDatabase.find(g => g.id === id);
export const getCPUById = (id: string): CPU | undefined => cpuDatabase.find(c => c.id === id);
export const getMotherboardById = (id: string): Motherboard | undefined => motherboardDatabase.find(m => m.id === id);
export const getRAMById = (id: string): RAM | undefined => ramDatabase.find(r => r.id === id);
export const getPSUById = (id: string): PSU | undefined => psuDatabase.find(p => p.id === id);

// Get compatible components
export const getCompatibleGPUsForWorkload = (workload: WorkloadType): GPU[] => {
  return gpuDatabase.filter(gpu => gpu.recommendedWorkloads.includes(workload));
};

export const getGPUsWithMinVram = (minVram: number): GPU[] => {
  return gpuDatabase.filter(gpu => gpu.vramGb >= minVram);
};

export const getCompatibleMotherboardsForSocket = (socket: string): Motherboard[] => {
  return motherboardDatabase.filter(m => m.socket === socket);
};
