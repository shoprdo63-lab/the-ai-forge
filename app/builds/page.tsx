"use client";

import { motion } from "framer-motion";
import { 
  Cpu, 
  Zap, 
  Layers, 
  HardDrive, 
  Battery, 
  Thermometer,
  DollarSign,
  Calendar,
  User,
  Heart,
  MessageCircle,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { type HardwareComponent } from "@/data/components";

interface CompletedBuild {
  id: string;
  name: string;
  author: string;
  date: string;
  description: string;
  totalPrice: number;
  components: {
    cpu?: HardwareComponent;
    motherboard?: HardwareComponent;
    gpu?: HardwareComponent;
    ram?: HardwareComponent;
    storage?: HardwareComponent;
    psu?: HardwareComponent;
    cooling?: HardwareComponent;
  };
  likes: number;
  comments: number;
  tags: string[];
}

const EXAMPLE_BUILDS: CompletedBuild[] = [
  {
    id: "build-1",
    name: "Ultimate AI Training Workstation",
    author: "AI_Enthusiast",
    date: "2024-12-15",
    description: "48GB VRAM beast for training LLMs at home. Dual RTX 4090 setup with Threadripper.",
    totalPrice: 18493,
    components: {
      cpu: { id: "tr-pro-7995wx", name: "AMD Ryzen Threadripper PRO 7995WX", category: "CPU", brand: "AMD", price: 4999, msrp: 4999, specs: { cores: "96", threads: "192", clock: "2.5 / 5.1 GHz", tdp: "350W", socket: "sTR5", architecture: "Zen 4", memory: "8-Channel DDR5" }, description: "96-core workstation CPU", tags: ["Workstation", "96-Core"], aiScore: 98, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      motherboard: { id: "trx50-sage-wifi", name: "ASUS Pro WS TRX50-SAGE WIFI", category: "Motherboard", brand: "ASUS", price: 1299, msrp: 1299, specs: { socket: "sTR5", chipset: "TRX50", memorySupport: "DDR5-8000 2TB", architecture: "E-ATX", tdp: "N/A" }, description: "Workstation board for Threadripper PRO", tags: ["Workstation", "sTR5"], aiScore: 95, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      gpu: { id: "rtx-4090", name: "NVIDIA GeForce RTX 4090", category: "GPU", brand: "NVIDIA", price: 3198, msrp: 3198, specs: { vram: "48GB", cuda: "32768", tensor: "1024", tdp: "900W", tflops: "165 FP16", architecture: "Ada Lovelace" }, description: "Dual RTX 4090 for massive AI models", tags: ["Flagship", "48GB", "SLI"], aiScore: 100, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      ram: { id: "kingston-ecc-256gb", name: "Kingston Server Premier ECC 256GB", category: "RAM", brand: "Kingston", price: 899, msrp: 999, specs: { capacity: "256GB (8x32GB)", speed: "DDR5-5600", architecture: "CL46 ECC", type: "RDIMM" }, description: "ECC memory for workstation", tags: ["ECC", "256GB"], aiScore: 92, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      storage: { id: "t700-4tb", name: "Crucial T700 4TB NVMe Gen5", category: "Storage", brand: "Crucial", price: 449, msrp: 499, specs: { type: "NVMe Gen5", capacity: "4TB", readSpeed: "12,400 MB/s", writeSpeed: "11,800 MB/s", architecture: "M.2 2280" }, description: "PCIe 5.0 SSD for datasets", tags: ["NVMe", "Gen5"], aiScore: 92, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      psu: { id: "ax1600i", name: "Corsair AX1600i Digital ATX", category: "PSU", brand: "Corsair", price: 599, msrp: 699, specs: { wattage: "1600W", efficiency: "80+ Titanium", architecture: "Digital", type: "ATX 3.0" }, description: "1600W Titanium PSU", tags: ["1600W", "Titanium"], aiScore: 95, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      cooling: { id: "liquid-freezer-iii-420", name: "ARCTIC Liquid Freezer III 420", category: "Cooling", brand: "ARCTIC", price: 169, msrp: 179, specs: { radiator: "420mm", type: "AIO", tdp: "420W+", architecture: "Triple Fan" }, description: "420mm AIO for Threadripper", tags: ["AIO", "420mm"], aiScore: 88, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
    },
    likes: 245,
    comments: 42,
    tags: ["AI Training", "Workstation", "Threadripper", "Dual GPU"]
  },
  {
    id: "build-2",
    name: "Budget AI Inference Rig",
    author: "ML_Student",
    date: "2024-12-10",
    description: "Perfect for running inference on 7B-13B models. 16GB VRAM with efficient cooling.",
    totalPrice: 2145,
    components: {
      cpu: { id: "ryzen-5-7600x", name: "AMD Ryzen 5 7600X", category: "CPU", brand: "AMD", price: 199, msrp: 299, specs: { cores: "6", threads: "12", clock: "4.7 / 5.3 GHz", tdp: "105W", socket: "AM5", architecture: "Zen 4", memory: "Dual DDR5" }, description: "6-core budget AM5", tags: ["Budget", "Entry"], aiScore: 60, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      motherboard: { id: "b650-aorus-elite", name: "Gigabyte B650 AORUS Elite AX", category: "Motherboard", brand: "Gigabyte", price: 189, msrp: 229, specs: { socket: "AM5", chipset: "B650", memorySupport: "DDR5-6400 128GB", architecture: "ATX", tdp: "N/A" }, description: "Cost-effective AM5 board", tags: ["Value", "AM5"], aiScore: 68, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      gpu: { id: "rtx-4070-ti-super", name: "NVIDIA GeForce RTX 4070 Ti SUPER", category: "GPU", brand: "NVIDIA", price: 799, msrp: 799, specs: { vram: "16GB GDDR6X", cuda: "8448", tensor: "264", tdp: "285W", tflops: "40.1 FP16", architecture: "Ada Lovelace" }, description: "Sweet spot with 16GB VRAM", tags: ["Enthusiast", "16GB"], aiScore: 75, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      ram: { id: "trident-z5-rgb-32gb", name: "G.Skill Trident Z5 RGB 32GB", category: "RAM", brand: "G.Skill", price: 149, msrp: 169, specs: { capacity: "32GB (2x16GB)", speed: "DDR5-7200", architecture: "CL34", type: "UDIMM" }, description: "High-speed entry kit", tags: ["Entry", "RGB"], aiScore: 65, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      storage: { id: "kc3000-2tb", name: "Kingston KC3000 2TB NVMe", category: "Storage", brand: "Kingston", price: 159, msrp: 199, specs: { type: "NVMe Gen4", capacity: "2TB", readSpeed: "7,000 MB/s", writeSpeed: "7,000 MB/s", architecture: "M.2 2280" }, description: "Budget-friendly NVMe", tags: ["NVMe", "Budget"], aiScore: 75, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      psu: { id: "focus-gx-1000", name: "Seasonic FOCUS GX-1000", category: "PSU", brand: "Seasonic", price: 179, msrp: 199, specs: { wattage: "1000W", efficiency: "80+ Gold", architecture: "Compact", type: "ATX 2.4" }, description: "Reliable 1000W", tags: ["1000W", "Gold"], aiScore: 78, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      cooling: { id: "liquid-freezer-iii-360", name: "ARCTIC Liquid Freezer III 360", category: "Cooling", brand: "ARCTIC", price: 119, msrp: 129, specs: { radiator: "360mm", type: "AIO", tdp: "300W", architecture: "Triple Fan" }, description: "Value 360mm AIO", tags: ["AIO", "360mm"], aiScore: 80, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
    },
    likes: 189,
    comments: 28,
    tags: ["Budget", "Inference", "Entry Level", "Efficient"]
  },
  {
    id: "build-3",
    name: "Datacenter Homelab Server",
    author: "Tech_Lead",
    date: "2024-12-08",
    description: "Dual EPYC server for distributed training. 80GB HBM2e A100 for serious ML workloads.",
    totalPrice: 45294,
    components: {
      cpu: { id: "epyc-9654", name: "AMD EPYC 9654", category: "CPU", brand: "AMD", price: 11805, msrp: 11805, specs: { cores: "96", threads: "192", clock: "2.4 / 3.7 GHz", tdp: "360W", socket: "SP5", architecture: "Zen 4", memory: "12-Channel DDR5" }, description: "96-core server CPU", tags: ["Server", "96-Core"], aiScore: 95, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      motherboard: { id: "wrx90-sage", name: "ASUS Pro WS WRX90E-SAGE SE", category: "Motherboard", brand: "ASUS", price: 1899, msrp: 1899, specs: { socket: "sTR5", chipset: "WRX90", memorySupport: "DDR5-5200 2TB ECC", architecture: "E-ATX", tdp: "N/A" }, description: "Dual-socket workstation board", tags: ["Workstation", "Dual Socket"], aiScore: 98, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      gpu: { id: "a100-80gb", name: "NVIDIA A100 80GB PCIe", category: "GPU", brand: "NVIDIA", price: 29998, msrp: 29998, specs: { vram: "80GB HBM2e", cuda: "6912", tensor: "432", tdp: "300W", tflops: "312 FP16", architecture: "Ampere" }, description: "Datacenter GPU for training", tags: ["Datacenter", "80GB"], aiScore: 99, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      ram: { id: "kingston-ecc-256gb", name: "Kingston Server Premier ECC 256GB", category: "RAM", brand: "Kingston", price: 899, msrp: 999, specs: { capacity: "256GB (8x32GB)", speed: "DDR5-5600", architecture: "CL46 ECC", type: "RDIMM" }, description: "ECC memory for server", tags: ["ECC", "256GB"], aiScore: 92, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      storage: { id: "rocket-4-plus-8tb", name: "Sabrent Rocket 4 Plus 8TB", category: "Storage", brand: "Sabrent", price: 899, msrp: 1099, specs: { type: "NVMe Gen4", capacity: "8TB", readSpeed: "7,100 MB/s", writeSpeed: "6,600 MB/s", architecture: "M.2 2280" }, description: "Massive 8TB storage", tags: ["NVMe", "8TB"], aiScore: 88, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      psu: { id: "supernova-1600-t2", name: "EVGA SuperNOVA 1600 T2", category: "PSU", brand: "EVGA", price: 549, msrp: 599, specs: { wattage: "1600W", efficiency: "80+ Titanium", architecture: "Analog", type: "ATX 2.4" }, description: "1600W Titanium PSU", tags: ["1600W", "Legacy"], aiScore: 88, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
      cooling: { id: "prosiphon-360", name: "IceGiant Prosiphon Elite 360", category: "Cooling", brand: "IceGiant", price: 349, msrp: 399, specs: { radiator: "Tower", type: "Thermosiphon", tdp: "500W", architecture: "Passive Loop" }, description: "Thermosiphon for EPYC", tags: ["Thermosiphon", "500W"], aiScore: 90, affiliateLinks: { amazon: "", ebay: "", aliexpress: "" }, inStock: true, imageUrl: "" },
    },
    likes: 412,
    comments: 67,
    tags: ["Datacenter", "Enterprise", "A100", "Server"]
  }
];

function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

const categoryIcons: Record<string, React.ReactNode> = {
  CPU: <Cpu className="h-4 w-4" />,
  GPU: <Zap className="h-4 w-4" />,
  Motherboard: <Layers className="h-4 w-4" />,
  RAM: <Layers className="h-4 w-4" />,
  Storage: <HardDrive className="h-4 w-4" />,
  PSU: <Battery className="h-4 w-4" />,
  Cooling: <Thermometer className="h-4 w-4" />,
};

export default function CompletedBuilds() {
  const [filter, setFilter] = useState<string>("all");

  const filteredBuilds = filter === "all" 
    ? EXAMPLE_BUILDS 
    : EXAMPLE_BUILDS.filter(build => build.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())));

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-500">
      {/* Header */}
      <div className="bg-[var(--card-bg)] border-b border-[var(--card-border)]">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Completed Builds</h1>
          <p className="text-[var(--text-secondary)]">Browse builds from the AI Forge community. Get inspired for your next AI workstation.</p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "AI Training", "Budget", "Datacenter", "Workstation"].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                filter === tag.toLowerCase()
                  ? "bg-emerald-500 text-[#020617]"
                  : "bg-[#0f172a] text-[#94a3b8] hover:text-white border border-[#1e293b]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Builds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBuilds.map((build, index) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0f172a] rounded-xl border border-[#1e293b] overflow-hidden hover:border-emerald-500/30 transition-all group"
            >
              {/* Build Header */}
              <div className="p-6 border-b border-[#1e293b]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {build.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748b]">
                      <User className="h-3 w-3" />
                      <span>{build.author}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>{build.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">{formatPrice(build.totalPrice)}</p>
                    <p className="text-[11px] text-[#64748b]">Total Build Cost</p>
                  </div>
                </div>
                
                <p className="text-[13px] text-[#94a3b8] line-clamp-2">{build.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {build.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-0.5 bg-[#1e293b] text-[#94a3b8] text-[11px] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Components List */}
              <div className="p-4 space-y-2">
                {Object.entries(build.components).map(([category, component]) => {
                  if (!component) return null;
                  return (
                    <div key={category} className="flex items-center gap-3 text-[12px]">
                      <div className="w-6 h-6 rounded bg-[#1e293b] flex items-center justify-center text-emerald-400 shrink-0">
                        {categoryIcons[component.category]}
                      </div>
                      <span className="text-[#64748b] w-20 shrink-0 uppercase">{component.category}</span>
                      <span className="text-white truncate flex-1">{component.name}</span>
                      <span className="text-emerald-400 shrink-0">{formatPrice(component.price)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-[#0a0f1a] border-t border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-4 text-[12px] text-[#64748b]">
                  <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span>{build.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{build.comments}</span>
                  </button>
                </div>
                <button className="flex items-center gap-1 text-[12px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Build CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/30 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Have a build to share?</h2>
          <p className="text-[#94a3b8] mb-6">Share your AI workstation with the community and help others build their perfect setup.</p>
          <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#020617] font-bold rounded-lg transition-all">
            Create Your Build
          </button>
        </div>
      </div>
    </div>
  );
}
