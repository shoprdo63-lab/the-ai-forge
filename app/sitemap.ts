import { MetadataRoute } from "next";
import { hardwareComponents } from "@/lib/constants";
import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

// ============================================
// SEO-Optimized Sitemap Generator (2026 Standards)
// ============================================

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theaiforge.ai";

  // Static routes with optimized priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      images: ["https://theaiforge.ai/og-image.jpg"],
    },
    {
      url: `${baseUrl}/components`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/builder`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/builds`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/specs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic product routes with high priority for hardware
  const productRoutes: MetadataRoute.Sitemap = hardwareComponents.map((component) => ({
    url: `${baseUrl}/product/${component.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
    images: component.imageUrl ? [component.imageUrl] : undefined,
  }));

  // Dynamic blog routes with enhanced metadata
  const blogPosts = getAllBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: "monthly",
    priority: 0.75,
    images: post.coverImage ? [post.coverImage] : undefined,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
