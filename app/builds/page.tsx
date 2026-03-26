"use client";

import { motion } from "framer-motion";
import { 
  Cpu, 
  Zap, 
  Layers, 
  HardDrive, 
  Battery, 
  Thermometer,
  Calendar,
  Heart,
  MessageCircle,
  ChevronRight,
  Plus,
  ArrowRight,
  Sparkles,
  Gauge
} from "lucide-react";
import { useState } from "react";
import { type HardwareComponent } from "@/data/components";
import Link from "next/link";

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
  aiScore: number;
}

const EXAMPLE_BUILDS: CompletedBuild[] = [
  {
    id: "build-1",
    name: "Ultimate AI Training Workstation",
    author: "AI_Enthusiast",
    date: "2024-12-15",
    description: "48GB VRAM beast for training LLMs at home. Dual RTX 4090 setup with Threadripper.",
    totalPrice: 18493,
    aiScore: 98,
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
    aiScore: 75,
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
    aiScore: 99,
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

const FILTER_TAGS = ["All", "AI Training", "Budget", "Datacenter", "Workstation", "Inference"];

const categoryIcons: Record<string, React.ReactNode> = {
  CPU: <Cpu className="h-3.5 w-3.5" strokeWidth={1.5} />,
  GPU: <Zap className="h-3.5 w-3.5" strokeWidth={1.5} />,
  Motherboard: <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />,
  RAM: <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />,
  Storage: <HardDrive className="h-3.5 w-3.5" strokeWidth={1.5} />,
  PSU: <Battery className="h-3.5 w-3.5" strokeWidth={1.5} />,
  Cooling: <Thermometer className="h-3.5 w-3.5" strokeWidth={1.5} />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

export default function CompletedBuilds() {
  const [filter, setFilter] = useState<string>("all");

  const filteredBuilds = filter === "all" 
    ? EXAMPLE_BUILDS 
    : EXAMPLE_BUILDS.filter(build => 
        build.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header Section */}
      <div className="relative border-b border-white/5">
        {/* Background Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 30% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)",
          }}
        />
        
        <div className="relative max-w-[1800px] mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-geometric">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="label-mono">Community Showcase</span>
            </div>
            <h1 className="headline-hero text-4xl md:text-5xl lg:text-6xl mb-4">
              Completed Builds
            </h1>
            <p className="body-premium text-lg max-w-2xl">
              Browse AI workstation builds from the community. Get inspired and discover the perfect configuration for your machine learning workloads.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-12">
        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag.toLowerCase())}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === tag.toLowerCase()
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/[0.02] text-zinc-400 border border-white/5 hover:border-white/10 hover:text-zinc-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Builds Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredBuilds.map((build) => (
            <motion.div
              key={build.id}
              variants={itemVariants}
              className="group"
            >
              <div className="glass-premium h-full flex flex-col overflow-hidden">
                {/* Build Header */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="headline-card text-lg mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                        {build.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-mono uppercase tracking-wider">@{build.author}</span>
                        <span>•</span>
                        <span className="font-mono">{build.date}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-light text-emerald-400 font-mono tracking-tight">
                        {formatPrice(build.totalPrice)}
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mt-1">
                        Total Cost
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                    {build.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {build.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] rounded-md text-[11px] text-zinc-500 uppercase tracking-wider font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* AI Score Badge */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-mono">
                        AI Score: {build.aiScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Components List */}
                <div className="p-4 space-y-2 flex-1">
                  {Object.entries(build.components).map(([category, component]) => {
                    if (!component) return null;
                    return (
                      <div 
                        key={category} 
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-emerald-400/70 shrink-0">
                          {categoryIcons[component.category]}
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono w-16 shrink-0">
                          {component.category}
                        </span>
                        <span className="text-sm text-zinc-300 truncate flex-1 font-light">
                          {component.name}
                        </span>
                        <span className="text-sm text-emerald-400/70 shrink-0 font-mono">
                          {formatPrice(component.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-xs text-zinc-500 hover:text-emerald-400 transition-colors">
                      <Heart className="h-4 w-4" strokeWidth={1.5} />
                      <span className="font-mono">{build.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-xs text-zinc-500 hover:text-blue-400 transition-colors">
                      <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                      <span className="font-mono">{build.comments}</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group/btn">
                    <span className="font-mono uppercase tracking-wider text-xs">Details</span>
                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Build CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 relative"
        >
          {/* Background Glow */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
            }}
          />
          
          <div className="relative glass-premium p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Plus className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
            </div>
            <h2 className="headline-section text-2xl md:text-3xl mb-3">
              Share Your Build
            </h2>
            <p className="body-premium max-w-xl mx-auto mb-8">
              Contribute to the community by sharing your AI workstation configuration. Help others discover the perfect hardware setup for their needs.
            </p>
            <Link
              href="/builder"
              className="btn-premium inline-flex items-center gap-3"
            >
              <span>Create Your Build</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
