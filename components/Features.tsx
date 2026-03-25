"use client";

import { 
  Cpu, 
  Zap, 
  Shield, 
  Clock, 
  LineChart,
  Settings,
  Headphones,
  Package
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Expert Curation",
    description: "Every component is hand-picked and tested for AI/ML compatibility. No guesswork, just proven configurations.",
  },
  {
    icon: Zap,
    title: "Optimized Performance",
    description: "Tuned for maximum inference speed and training efficiency. Get the most out of your hardware investment.",
  },
  {
    icon: Shield,
    title: "Compatibility Guaranteed",
    description: "Our Smart Compatibility Engine ensures CPU socket and motherboard alignment. No hardware conflicts.",
  },
  {
    icon: Clock,
    title: "Same-Day Assembly",
    description: "Professional technicians build and test your system within 24 hours. Ready to run AI workloads immediately.",
  },
  {
    icon: LineChart,
    title: "Performance Reports",
    description: "Receive detailed benchmarks for LLMs, Stable Diffusion, and other AI workloads specific to your build.",
  },
  {
    icon: Settings,
    title: "Pre-Configured Software",
    description: "Ollama, LM Studio, CUDA, and PyTorch pre-installed. Start experimenting right out of the box.",
  },
  {
    icon: Headphones,
    title: "Lifetime Support",
    description: "Access to our AI hardware experts for troubleshooting, upgrades, and optimization advice.",
  },
  {
    icon: Package,
    title: "Secure Shipping",
    description: "Systems packed with anti-static materials and shock protection. Full insurance on every delivery.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 border-t border-[#1e293b] bg-[#020617]">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-20">
          <div className="glass-card inline-flex items-center gap-2.5 px-4 py-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#10b981]">
              Platform Protocol
            </span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Precision-Engineered Excellence
          </h2>
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto leading-relaxed">
            We architect high-performance local AI infrastructure, ensuring 100% computational integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-8 hover:border-[#10b981]/30 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0f172a]/80 flex items-center justify-center mb-6 border border-[#1e293b] group-hover:border-[#10b981]/30 transition-colors">
                <feature.icon className="w-6 h-6 text-[#64748b] group-hover:text-[#10b981] transition-colors" />
              </div>
              <h3 
                className="text-[15px] font-bold text-white mb-3 tracking-tight"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {feature.title}
              </h3>
              <p className="text-[13px] text-[#64748b] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-card-strong p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: "70+", label: "AI Components" },
              { value: "4.9/5", label: "Precision Rating" },
              { value: "48hr", label: "Build Lead Time" },
              { value: "3yr", label: "Warranty Coverage" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div 
                  className="text-3xl font-bold text-white mb-2 tracking-tight"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
