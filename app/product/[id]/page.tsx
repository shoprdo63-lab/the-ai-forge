import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Cpu,
  Zap,
  Database,
  ArrowLeft,
  ShoppingCart,
  ExternalLink,
  Brain,
  Image as ImageIcon,
  Gauge,
  Layers,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import { hardwareComponents, getComponentById, TIER_COLORS, type HardwareComponent } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ProductReviews from "@/components/ProductReviews";
import StarRating from "@/components/StarRating";

// Generate static paths for all products
export async function generateStaticParams() {
  return hardwareComponents.map((component) => ({
    id: component.id,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const component = getComponentById(id);

  if (!component) {
    return {
      title: "Product Not Found | AI Forge",
      description: "The requested hardware component could not be found.",
    };
  }

  const isGPU = component.category === "GPU";
  const vram = component.vram;

  // Create SEO-optimized title based on product type and AI capabilities
  let title = `${component.name} - AI Hardware`;
  if (isGPU && vram) {
    if (vram >= 24) {
      title = `${component.name} - Best for ${vram}GB AI Models`;
    } else {
      title = `${component.name} - AI Inference & Training GPU`;
    }
  } else if (component.category === "CPU") {
    title = `${component.name} - AI Workstation CPU`;
  }

  // Create SEO-optimized description
  let description = `${component.name} - Premium hardware for AI workloads.`;
  if (isGPU && vram) {
    description = `${component.name} with ${vram}GB VRAM. Optimized for LLM inference, Stable Diffusion, and AI training workloads.`;
  }

  return {
    title: `${title} | AI Forge`,
    description,
    keywords: [
      component.name,
      component.brand,
      component.category,
      "AI Hardware",
      "Machine Learning",
      "Deep Learning",
      "GPU",
      "LLM",
      "Stable Diffusion",
    ].filter(Boolean),
    openGraph: {
      title: `${title} | AI Forge`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AI Forge`,
      description,
    },
  };
}

// AI Performance Analysis component
function AIPerformanceAnalysis({ component }: { component: HardwareComponent }) {
  const isGPU = component.category === "GPU";
  const { aiIntelligence, specs } = component;
  const vramMatch = specs.vram?.match(/(\d+)/);
  const vramGb = vramMatch ? parseInt(vramMatch[1]) : 0;

  // Determine AI use cases based on specs
  const useCases = [];
  if (isGPU) {
    if (vramGb >= 48) {
      useCases.push({
        title: "70B+ Parameter Models",
        desc: "Run Llama 3 70B, GPT-4 class models with full precision",
        score: 98,
      });
    }
    if (vramGb >= 24) {
      useCases.push({
        title: "Large Language Models",
        desc: "Llama 3, Mistral, CodeLlama up to 70B parameters",
        score: Math.min(95, vramGb * 2),
      });
    }
    if (vramGb >= 16) {
      useCases.push({
        title: "Stable Diffusion XL",
        desc: "High-resolution image generation with LoRA fine-tuning",
        score: 92,
      });
    }
    if (vramGb >= 12) {
      useCases.push({
        title: "Stable Diffusion 1.5",
        desc: "Standard image generation and ControlNet workflows",
        score: 88,
      });
    }
    useCases.push({
      title: "AI Inference",
      desc: `Local API endpoints with ${aiIntelligence.llama3Tps} tokens/sec`,
      score: aiIntelligence.inferenceScore,
    });
    if (aiIntelligence.trainingScore >= 70) {
      useCases.push({
        title: "Model Training",
        desc: "Fine-tuning small models and LoRA adapters",
        score: aiIntelligence.trainingScore,
      });
    }
  } else if (component.category === "CPU") {
    const cores = parseInt(specs.cores || "0");
    if (cores >= 64) {
      useCases.push({
        title: "Data Preprocessing",
        desc: "Large dataset preparation and tokenization",
        score: 95,
      });
    }
    if (cores >= 32) {
      useCases.push({
        title: "Multi-GPU Orchestration",
        desc: "Feeding multiple GPUs without bottlenecks",
        score: 90,
      });
    }
    useCases.push({
      title: "Inference Offloading",
      desc: "CPU fallback for small models when GPU is busy",
      score: 70,
      });
  }

  if (useCases.length === 0) {
    useCases.push({
      title: "System Support",
      desc: "Reliable foundation for AI workstation builds",
      score: 60,
    });
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#10b981]/10 rounded-lg">
            <Brain className="w-5 h-5 text-[#10b981]" />
          </div>
          <h2 className="text-xl font-bold text-white">AI Performance Analysis</h2>
        </div>
        <p className="text-slate-400">
          How this {component.category} performs for AI workloads
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Primary Use Cases */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Recommended Use Cases
          </h3>
          <div className="grid gap-3">
            {useCases.slice(0, 4).map((useCase) => (
              <div
                key={useCase.title}
                className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800"
              >
                <div>
                  <p className="font-medium text-white">{useCase.title}</p>
                  <p className="text-sm text-slate-400">{useCase.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10b981] rounded-full"
                      style={{ width: `${useCase.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[#10b981] w-10 text-right">
                    {useCase.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 text-center">
            <Gauge className="w-5 h-5 text-[#10b981] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{aiIntelligence.inferenceScore}</p>
            <p className="text-xs text-slate-500">Inference Score</p>
          </div>
          <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 text-center">
            <Layers className="w-5 h-5 text-[#10b981] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{aiIntelligence.trainingScore}</p>
            <p className="text-xs text-slate-500">Training Score</p>
          </div>
          <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 text-center">
            <Zap className="w-5 h-5 text-[#10b981] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{aiIntelligence.efficiencyScore}</p>
            <p className="text-xs text-slate-500">Efficiency</p>
          </div>
        </div>

        {/* VRAM Analysis for GPUs */}
        {isGPU && vramGb > 0 && (
          <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-[#10b981] mt-0.5" />
              <div>
                <p className="font-medium text-white">VRAM Capacity Analysis</p>
                <p className="text-sm text-slate-400 mt-1">
                  With {vramGb}GB VRAM, you can run:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-300">
                  {vramGb >= 48 && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10b981]" />
                      Llama 3 70B (Q4 quantization) - Full context
                    </li>
                  )}
                  {vramGb >= 24 && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10b981]" />
                      Llama 3 70B (Q4) or Mixtral 8x7B (Q4)
                    </li>
                  )}
                  {vramGb >= 16 && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10b981]" />
                      Llama 3 8B (FP16) + Stable Diffusion XL simultaneously
                    </li>
                  )}
                  {vramGb >= 12 && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10b981]" />
                      Llama 3 8B (Q8) or CodeLlama 13B (Q4)
                    </li>
                  )}
                  {vramGb < 12 && (
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Limited to 7B models - consider upgrade for serious AI work
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* LLM Tokens/sec for GPUs */}
        {isGPU && aiIntelligence.llama3Tps > 0 && (
          <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#10b981]/10 rounded">
                <ImageIcon className="w-4 h-4 text-[#10b981]" />
              </div>
              <div>
                <p className="font-medium text-white">LLM Inference Speed</p>
                <p className="text-sm text-slate-400">
                  Expected performance with Llama 3 8B:{" "}
                  <span className="text-[#10b981] font-semibold">
                    {aiIntelligence.llama3Tps} tokens/sec
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Technical Specs Table component
function TechnicalSpecs({ component }: { component: HardwareComponent }) {
  const { specs, category } = component;

  const specEntries = Object.entries(specs).filter(([, value]) => value && value !== "N/A");

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#10b981]/10 rounded-lg">
            <Cpu className="w-5 h-5 text-[#10b981]" />
          </div>
          <h2 className="text-xl font-bold text-white">Technical Specifications</h2>
        </div>
        <p className="text-slate-400">
          Complete specifications for the {component.name}
        </p>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-slate-800">
              {/* Category-specific header row */}
              <tr className="bg-slate-950/30">
                <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-[#10b981] uppercase tracking-wider">
                  {category} Specifications
                </td>
              </tr>
              {specEntries.map(([key, value]) => {
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .replace(/([a-z])([A-Z])/g, "$1 $2");

                return (
                  <tr key={key} className="hover:bg-slate-950/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-400 w-1/3">
                      {label}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-mono">
                      {value as string}
                    </td>
                  </tr>
                );
              })}
              {/* AI Intelligence row */}
              <tr className="bg-slate-950/30">
                <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-[#10b981] uppercase tracking-wider">
                  AI Performance Metrics
                </td>
              </tr>
              <tr className="hover:bg-slate-950/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-400">AI Tier</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${
                      TIER_COLORS[component.aiIntelligence.aiTier].bg
                    } ${TIER_COLORS[component.aiIntelligence.aiTier].text} ${
                      TIER_COLORS[component.aiIntelligence.aiTier].border
                    }`}
                  >
                    {component.aiIntelligence.aiTier}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-950/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-400">AI Score</td>
                <td className="px-4 py-3 text-sm text-white font-mono">
                  {component.aiScore}/100
                </td>
              </tr>
              {component.aiIntelligence.vramPerDollar > 0 && (
                <tr className="hover:bg-slate-950/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-400">
                    VRAM per Dollar
                  </td>
                  <td className="px-4 py-3 text-sm text-white font-mono">
                    {component.aiIntelligence.vramPerDollar.toFixed(3)} GB/$
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Affiliate Buttons component
function AffiliateButtons({ links, name }: { links: HardwareComponent["affiliateLinks"]; name: string }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Where to Buy</h3>

      {/* Primary Amazon Button */}
      <a
        href={links.amazon}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#10b981] text-slate-950 font-semibold rounded-lg hover:bg-[#0d9488] transition-all mb-4"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Buy on Amazon</span>
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Secondary Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href={links.ebay}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
        >
          <span>eBay</span>
          <ExternalLink className="w-4 h-4" />
        </a>
        <a
          href={links.aliexpress}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
        >
          <span>AliExpress</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <p className="mt-4 text-xs text-slate-500 text-center">
        Prices may vary. Affiliate links help support AI Forge.
      </p>
    </div>
  );
}

// Main Product Page Component
export const revalidate = 3600; // ISR: Revalidate every hour

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const component = getComponentById(id);

  if (!component) {
    notFound();
  }

  const { name, brand, category, price, msrp, specs, description, tags, aiIntelligence, affiliateLinks, inStock, releaseDate, imageUrl, rating, reviewCount } = component;
  const isGPU = category === "GPU";

  // JSON-LD Schema for Product with AggregateRating
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    description: description,
    image: imageUrl,
    sku: component.id,
    category: category,
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "USD",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://theaiforge.ai/product/${component.id}`,
    },
    ...(rating && reviewCount && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount: reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#10b981] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hardware Grid</span>
          </Link>
        </div>

        {/* Product Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider border ${
                TIER_COLORS[aiIntelligence.aiTier].bg
              } ${TIER_COLORS[aiIntelligence.aiTier].text} ${
                TIER_COLORS[aiIntelligence.aiTier].border
              }`}
            >
              {aiIntelligence.aiTier}
            </span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              {brand} · {category}
            </span>
            {inStock ? (
              <span className="text-xs text-[#10b981] font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> In Stock
              </span>
            ) : (
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Out of Stock
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {name}
              </h1>
              <p className="text-lg text-slate-400 max-w-3xl">{description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs text-slate-400 bg-slate-800/60 rounded-full border border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Star Rating Display */}
              {rating && reviewCount && (
                <div className="flex items-center gap-2 mt-4">
                  <StarRating rating={rating} size="md" animated />
                  <span className="text-sm text-slate-400">
                    {rating.toFixed(1)} out of 5 ({reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price Card */}
            <div className="flex flex-col items-start lg:items-end">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#10b981] font-mono">
                  ${price.toLocaleString()}
                </span>
                {price < msrp && (
                  <span className="text-lg text-slate-500 line-through">
                    ${msrp.toLocaleString()}
                  </span>
                )}
              </div>
              {releaseDate && (
                <p className="text-sm text-slate-500 mt-1">
                  Released: {releaseDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Specs & AI Analysis */}
          <div className="lg:col-span-2 space-y-8">
            <TechnicalSpecs component={component} />
            <AIPerformanceAnalysis component={component} />
          </div>

          {/* Right Column - Affiliate & Quick Stats */}
          <div className="space-y-6">
            <AffiliateButtons links={affiliateLinks} name={name} />

            {/* Quick Stats Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {specs.vram && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">VRAM</span>
                    <span className="text-sm font-medium text-white">{specs.vram}</span>
                  </div>
                )}
                {specs.tdp && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Power Draw</span>
                    <span className="text-sm font-medium text-white">{specs.tdp}</span>
                  </div>
                )}
                {specs.architecture && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Architecture</span>
                    <span className="text-sm font-medium text-white">{specs.architecture}</span>
                  </div>
                )}
                {isGPU && aiIntelligence.llama3Tps > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Llama3 Speed</span>
                    <span className="text-sm font-medium text-[#10b981]">
                      {aiIntelligence.llama3Tps} t/s
                    </span>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">AI Score</span>
                    <span className="text-lg font-bold text-[#10b981]">{component.aiScore}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ProductReviews component={component} />
        </div>
      </main>
    </div>
  );
}
