"use client";

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
  Gauge,
  Monitor
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
  GPU: <Monitor className="h-3.5 w-3.5" strokeWidth={1.5} />,
  Motherboard: <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />,
  RAM: <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />,
  Storage: <HardDrive className="h-3.5 w-3.5" strokeWidth={1.5} />,
  PSU: <Battery className="h-3.5 w-3.5" strokeWidth={1.5} />,
  Cooling: <Thermometer className="h-3.5 w-3.5" strokeWidth={1.5} />,
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
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Blue Header - PCPartPicker Style */}
      <header className="bg-[#4f46e5] text-white">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Completed Builds</h1>
                <p className="text-sm text-white/70">Community workstation configurations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag.toLowerCase())}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === tag.toLowerCase()
                  ? "bg-[#4f46e5] text-white"
                  : "bg-white text-[#374151] border border-[#d1d5db] hover:bg-[#f9fafb]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Builds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBuilds.map((build) => (
            <div
              key={build.id}
              className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Build Header */}
              <div className="p-4 border-b border-[#e5e7eb]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#374151] mb-1">
                      {build.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                      <span className="font-medium">@{build.author}</span>
                      <span>•</span>
                      <span>{build.date}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-bold text-[#0d9488]">
                      {formatPrice(build.totalPrice)}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-[#6b7280] leading-relaxed line-clamp-2">
                  {build.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {build.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-0.5 bg-[#f3f4f6] rounded text-[10px] text-[#6b7280]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* AI Score */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#f0fdf4] rounded">
                    <Gauge className="w-3 h-3 text-[#16a34a]" />
                    <span className="text-xs text-[#16a34a] font-medium">
                      AI: {build.aiScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Components List */}
              <div className="p-3 space-y-1 bg-[#f9fafb]">
                {Object.entries(build.components).map(([category, component]) => {
                  if (!component) return null;
                  return (
                    <div 
                      key={category} 
                      className="flex items-center gap-3 p-2 rounded bg-white border border-[#e5e7eb]"
                    >
                      <div className="w-7 h-7 rounded bg-[#f3f4f6] flex items-center justify-center text-[#6b7280] shrink-0">
                        {categoryIcons[component.category]}
                      </div>
                      <span className="text-[10px] text-[#9ca3af] uppercase w-14 shrink-0">
                        {component.category}
                      </span>
                      <span className="text-sm text-[#374151] truncate flex-1">
                        {component.name}
                      </span>
                      <span className="text-sm text-[#0d9488] shrink-0 font-medium">
                        {formatPrice(component.price)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-[#e5e7eb] flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-[#4f46e5] transition-colors">
                    <Heart className="h-4 w-4" strokeWidth={1.5} />
                    <span>{build.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-[#4f46e5] transition-colors">
                    <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                    <span>{build.comments}</span>
                  </button>
                </div>
                <button className="flex items-center gap-1 text-sm text-[#4f46e5] hover:text-[#4338ca] transition-colors">
                  <span className="text-xs font-medium">Details</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Build CTA */}
        <div className="mt-8 bg-white border border-[#d1d5db] rounded-lg p-6 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#f5f3ff] border border-[#e5e7eb] mb-4">
            <Plus className="w-6 h-6 text-[#4f46e5]" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-[#374151] mb-2">
            Share Your Build
          </h2>
          <p className="text-sm text-[#6b7280] max-w-xl mx-auto mb-4">
            Contribute to the community by sharing your AI workstation configuration.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
          >
            <span>Create Your Build</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
