import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  hardwareComponents,
  getComponentById,
  TIER_COLORS,
  type HardwareComponent,
} from "@/lib/constants";
import Navbar from "@/components/Navbar";
import HardwareDashboardClient from "@/components/HardwareDashboardClient";
import ProductReviews from "@/components/ProductReviews";

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
  const vram = component.vram;

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
    if (isGPU && currentProduct.vram && product.vram) {
      const vramDiff = Math.abs(product.vram - currentProduct.vram);
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
    aggregateRating: component.rating && component.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: component.rating,
          reviewCount: component.reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
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
      ...(component.category === "GPU" && component.vram
        ? [
            {
              "@type": "PropertyValue",
              name: "VRAM",
              value: `${component.vram}GB`,
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hardware Dashboard Client Component with Animations */}
        <HardwareDashboardClient
          component={component}
          similarProducts={similarProducts}
        />

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews component={component} />
        </div>
      </main>
    </div>
  );
}
