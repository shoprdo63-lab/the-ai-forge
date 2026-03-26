import { MetadataRoute } from "next";

export const dynamic = "force-static";

// ============================================
// SEO-Optimized Robots.txt Generator (2026 Standards)
// ============================================

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General web crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/static/",
          "/admin/",
          "/*.json$",
          "/*.xml$",
        ],
        crawlDelay: 1,
      },
      // Googlebot specific rules
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: "/api/",
      },
      // Bingbot specific rules
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: "/api/",
      },
      // AI crawlers (respectful blocking of training scrapers)
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: "https://theaiforge.ai/sitemap.xml",
    host: "https://theaiforge.ai",
  };
}
