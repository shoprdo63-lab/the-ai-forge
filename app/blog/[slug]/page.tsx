import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, BookOpen, User, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogPostBySlug, getRelatedHardware, getAllBlogPosts } from "@/lib/blog";
import { BlogPost } from "@/lib/blog";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedHardwareSidebar from "@/components/blog/RelatedHardwareSidebar";
import Navbar from "@/components/Navbar";
import { mdxComponents } from "@/components/blog/MdxComponents";

// ============================================
// Generate Static Paths
// ============================================

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ============================================
// Generate Metadata with SEO
// ============================================

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const ogImage = post.featuredHardware?.[0] 
    ? `/api/og?id=${post.featuredHardware[0]}` 
    : "/api/og";

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author || "The AI Forge Team" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : ["The AI Forge Team"],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://theaiforge.ai/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ============================================
// JSON-LD Structured Data
// ============================================

function generateStructuredData(post: any, relatedHardware: any[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // TechArticle Schema
      {
        "@type": "TechArticle",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.date,
        dateModified: post.updatedAt || post.date,
        author: {
          "@type": "Organization",
          name: post.author || "The AI Forge Team",
          url: "https://theaiforge.ai",
        },
        publisher: {
          "@type": "Organization",
          name: "The AI Forge",
          logo: {
            "@type": "ImageObject",
            url: "https://theaiforge.ai/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://theaiforge.ai/blog/${post.slug}`,
        },
        keywords: post.tags.join(", "),
        articleSection: post.category,
      },
      // BreadcrumbList Schema
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://theaiforge.ai",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://theaiforge.ai/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://theaiforge.ai/blog/${post.slug}`,
          },
        ],
      },
      // Related Products
      ...relatedHardware.map((product: any) => ({
        "@type": "Product",
        name: product.name,
        description: product.description,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      })),
    ],
  };
}

// ============================================
// Abstract SVG Cover Pattern
// ============================================

function AbstractTechPattern() {
  return (
    <svg
      viewBox="0 0 1200 630"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#050505" />
          <stop offset="50%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
        <pattern
          id="circuitPattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 50 H40 M60 50 H100 M50 0 V40 M50 60 V100"
            stroke="#10b981"
            strokeWidth="0.5"
            fill="none"
            opacity="0.2"
          />
          <circle cx="50" cy="50" r="3" fill="#10b981" opacity="0.3" />
        </pattern>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#techGradient)" />
      <rect width="100%" height="100%" fill="url(#circuitPattern)" />

      {/* Abstract geometric shapes */}
      <g opacity="0.3">
        <rect x="100" y="100" width="200" height="200" stroke="#10b981" strokeWidth="1" fill="none" />
        <rect x="900" y="330" width="200" height="200" stroke="#10b981" strokeWidth="1" fill="none" />
      </g>

      {/* Glowing orbs */}
      <circle cx="300" cy="315" r="150" fill="url(#glowGradient)" />
      <circle cx="900" cy="315" r="200" fill="url(#glowGradient)" />

      {/* Connecting lines */}
      <path
        d="M300 315 L600 200 L900 315 M300 315 L600 430 L900 315"
        stroke="#10b981"
        strokeWidth="0.5"
        fill="none"
        opacity="0.2"
      />
    </svg>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Get related hardware
  const relatedHardware = getRelatedHardware(post);

  // Generate JSON-LD
  const structuredData = generateStructuredData(post, relatedHardware);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      <Navbar />

      {/* Hero Section with Cover Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {/* Abstract Tech Pattern Background */}
        <div className="absolute inset-0">
          <AbstractTechPattern />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end max-w-[1800px] mx-auto px-6 pb-12">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit mb-4">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-white max-w-4xl leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author || "The AI Forge Team"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          {/* Article Content */}
          <article className="max-w-3xl">
            {/* Excerpt */}
            <p className="font-serif text-xl text-zinc-300 leading-relaxed mb-12 italic">
              {post.excerpt}
            </p>

            {/* MDX Content with Interactive Components */}
            <div className="prose prose-invert prose-zinc max-w-none">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-500">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?category=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 text-sm text-zinc-400 bg-white/[0.02] border border-white/5 rounded-lg hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {post.author || "The AI Forge Team"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    AI Hardware Specialists
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-8">
              {/* Table of Contents */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <TableOfContents content={post.content} />
              </div>

              {/* Related Hardware */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <RelatedHardwareSidebar
                  hardware={relatedHardware}
                  postTags={post.tags}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
