import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  hardwareComponents,
  getComponentById,
  type HardwareComponent,
} from "@/data/components";
import Link from "next/link";
import { 
  Cpu, 
  Monitor, 
  Zap, 
  ArrowLeft,
  ExternalLink,
  Award,
  Check,
  X,
  ShoppingCart
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
      title: "Product Not Found | AI Forge Hardware Database",
      description: "The requested hardware component could not be found in our database.",
    };
  }

  const isGPU = component.category === "GPU";
  const vram = component.specs.vram ? parseInt(component.specs.vram) : 0;

  // NASA-grade SEO title generation
  let title = `${component.name} — AI Hardware Database`;
  if (isGPU && vram) {
    if (vram >= 48) {
      title = `${component.name} — Flagship ${vram}GB AI Accelerator`;
    } else if (vram >= 24) {
      title = `${component.name} — Professional ${vram}GB AI Workstation GPU`;
    } else if (vram >= 16) {
      title = `${component.name} — Mid-Range ${vram}GB AI GPU`;
    } else {
      title = `${component.name} — Entry-Level AI GPU`;
    }
  } else if (component.category === "CPU") {
    const cores = component.specs.cores;
    if (cores && parseInt(cores) >= 32) {
      title = `${component.name} — HEDT AI Workstation CPU`;
    } else {
      title = `${component.name} — AI Workstation Processor`;
    }
  }

  // Precision description
  let description = `${component.name} — ${component.description} AI Score: ${component.aiScore}/100. Technical specifications, performance benchmarks, and purchase options.`;
  if (isGPU && vram) {
    description = `${component.name} with ${vram}GB VRAM. ${component.description} Optimized for LLM inference, Stable Diffusion, and machine learning workloads. AI Score: ${component.aiScore}/100.`;
  }

  return {
    title,
    description,
    keywords: [
      component.name,
      component.brand,
      component.category,
      "AI Hardware",
      "Machine Learning",
      "Deep Learning",
      "GPU",
      "CPU",
      "LLM",
      "Inference",
      "Training",
      component.specs.architecture,
      isGPU ? `${vram}GB VRAM` : undefined,
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      url: `https://theaiforge.ai/product/${component.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://theaiforge.ai/product/${component.id}`,
    },
  };
}

// Find similar products for Quick Compare (DO NOT modify products array)
function findSimilarProducts(
  currentProduct: HardwareComponent,
  allProducts: HardwareComponent[],
  limit: number = 2
): HardwareComponent[] {
  const isGPU = currentProduct.category === "GPU";
  
  // Filter by same category and sort by AI score proximity
  const sameCategory = allProducts.filter(
    (p) => p.category === currentProduct.category && p.id !== currentProduct.id
  );

  // Score each product by similarity
  const scored = sameCategory.map((product) => {
    let score = 0;
    
    // Same brand bonus
    if (product.brand === currentProduct.brand) {
      score += 10;
    }
    
    // AI score proximity (closer = higher score)
    const aiScoreDiff = Math.abs(product.aiScore - currentProduct.aiScore);
    score += Math.max(0, 30 - aiScoreDiff);
    
    // Price proximity (closer = higher score)
    const priceDiff = Math.abs(product.price - currentProduct.price);
    const priceRange = Math.max(currentProduct.price, 1000);
    score += Math.max(0, 20 - (priceDiff / priceRange) * 20);
    
    // VRAM proximity for GPUs
    if (isGPU && currentProduct.specs.vram && product.specs.vram) {
      const currentVram = parseInt(currentProduct.specs.vram) || 0;
      const productVram = parseInt(product.specs.vram) || 0;
      const vramDiff = Math.abs(productVram - currentVram);
      score += Math.max(0, 20 - vramDiff * 2);
    }
    
    // Same architecture bonus
    if (product.specs.architecture === currentProduct.specs.architecture) {
      score += 15;
    }
    
    return { product, score };
  });

  // Sort by score descending and return top products
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product);
}

// Revalidate every hour for ISR
export const revalidate = 3600;

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

  // Find similar products for Quick Compare (filtering from existing array)
  const similarProducts = findSimilarProducts(component, hardwareComponents, 2);

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: component.name,
    brand: {
      "@type": "Brand",
      name: component.brand,
    },
    description: component.description,
    sku: component.id,
    category: component.category,
    offers: {
      "@type": "Offer",
      price: component.price,
      priceCurrency: "USD",
      availability: component.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://theaiforge.ai/product/${component.id}`,
      seller: {
        "@type": "Organization",
        name: "AI Forge Hardware Database",
      },
    },
    aggregateRating: undefined,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "AI Score",
        value: component.aiScore.toString(),
      },
      {
        "@type": "PropertyValue",
        name: "Category",
        value: component.category,
      },
      ...(component.category === "GPU" && component.specs.vram
        ? [
            {
              "@type": "PropertyValue",
              name: "VRAM",
              value: component.specs.vram,
            },
          ]
        : []),
    ],
  };

  // MERCHANTS config
  const MERCHANTS = [
    { id: "amazon", name: "Amazon", color: "#ff9900" },
    { id: "newegg", name: "Newegg", color: "#f2711c" },
    { id: "bh", name: "B&H", color: "#c41230" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Blue Header - PCPartPicker Style */}
      <header className="bg-[#4f46e5] text-white">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                {component.category === "GPU" ? (
                  <Monitor className="w-5 h-5 text-white" />
                ) : component.category === "CPU" ? (
                  <Cpu className="w-5 h-5 text-white" />
                ) : (
                  <Zap className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{component.name}</h1>
                <p className="text-sm text-white/70">{component.brand} • {component.category}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Product Card */}
            <div className="bg-white border border-[#d1d5db] rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-6">
                {/* Product Image Placeholder */}
                <div className="w-32 h-32 bg-[#f3f4f6] rounded-lg flex items-center justify-center shrink-0">
                  {component.category === "GPU" ? (
                    <Monitor className="w-16 h-16 text-[#9ca3af]" />
                  ) : component.category === "CPU" ? (
                    <Cpu className="w-16 h-16 text-[#9ca3af]" />
                  ) : (
                    <Zap className="w-16 h-16 text-[#9ca3af]" />
                  )}
                </div>

                <div className="flex-1">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-[#f3f4f6] text-[#6b7280] rounded mb-2">
                    {component.category}
                  </span>
                  <h2 className="text-xl font-semibold text-[#374151] mb-2">{component.name}</h2>
                  <p className="text-sm text-[#6b7280] mb-4">{component.description}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-[#f59e0b]" />
                      <span className="text-sm font-medium text-[#374151]">AI Score: {component.aiScore}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${component.inStock ? 'text-[#16a34a]' : 'text-red-500'}`}>
                      {component.inStock ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span className="text-sm font-medium">{component.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-[#0d9488]">
                    ${component.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
                <h3 className="text-sm font-semibold text-[#374151]">Specifications</h3>
              </div>
              <div className="p-4">
                <dl className="grid grid-cols-2 gap-4">
                  {Object.entries(component.specs).map(([key, value]) => (
                    value && (
                      <div key={key}>
                        <dt className="text-xs text-[#6b7280] uppercase">{key}</dt>
                        <dd className="text-sm font-medium text-[#374151]">{value}</dd>
                      </div>
                    )
                  ))}
                </dl>
              </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <h3 className="text-sm font-semibold text-[#374151]">Compare with Similar Products</h3>
                </div>
                <div className="divide-y divide-[#e5e7eb]">
                  {similarProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-[#f9fafb] transition-colors"
                    >
                      <div className="w-12 h-12 bg-[#f3f4f6] rounded flex items-center justify-center">
                        {product.category === "GPU" ? (
                          <Monitor className="w-6 h-6 text-[#9ca3af]" />
                        ) : (
                          <Zap className="w-6 h-6 text-[#9ca3af]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-[#374151]">{product.name}</h4>
                        <p className="text-xs text-[#6b7280]">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-[#0d9488]">${product.price.toLocaleString()}</span>
                        <p className="text-xs text-[#9ca3af]">AI: {product.aiScore}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Pricing & Merchants */}
          <div className="space-y-4">
            {/* Buy Options */}
            <div className="bg-white border border-[#d1d5db] rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#374151] mb-3">Where to Buy</h3>
              <div className="space-y-2">
                {MERCHANTS.map((merchant) => {
                  const link = component.directLinks?.[merchant.id as keyof typeof component.directLinks];
                  return (
                    <Link
                      key={merchant.id}
                      href={link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
                    >
                      <span className="text-sm font-medium text-[#374151]">{merchant.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#0d9488]">${component.price.toLocaleString()}</span>
                        <ExternalLink className="w-3 h-3 text-[#9ca3af]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Merchants Filter */}
            <div className="bg-white border border-[#d1d5db] rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#374151] mb-3">Merchants</h3>
              <div className="space-y-2">
                {MERCHANTS.map((merchant) => (
                  <label key={merchant.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox defaultChecked />
                    <span className="text-sm text-[#4b5563]">{merchant.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white border border-[#d1d5db] rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#374151] mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {component.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-[#f3f4f6] text-[#6b7280] rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
