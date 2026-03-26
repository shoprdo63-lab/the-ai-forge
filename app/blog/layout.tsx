import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "../globals.css";

// ============================================
// Premium Typography: Newsreader for body, Inter for headers
// ============================================

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  fallback: ["Georgia", "serif"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["system-ui", "sans-serif"],
});

// ============================================
// SEO Metadata (2026 Standards)
// ============================================

export const metadata: Metadata = {
  title: {
    template: "%s | The AI Forge Blog",
    default: "AI Hardware Intelligence | The AI Forge Blog",
  },
  description:
    "In-depth analysis, benchmarks, and guides for AI hardware. Expert insights on GPUs, CPUs, and building high-performance AI workstations.",
  keywords: [
    "AI hardware",
    "GPU benchmarks",
    "machine learning",
    "deep learning",
    "RTX 4090",
    "CUDA",
    "ROCm",
    "AI workstation",
    "VRAM",
    "LLM inference",
  ],
  authors: [{ name: "The AI Forge Team", url: "https://theaiforge.ai" }],
  creator: "The AI Forge",
  publisher: "The AI Forge",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://theaiforge.ai/blog",
    siteName: "The AI Forge",
    title: "AI Hardware Intelligence | The AI Forge Blog",
    description:
      "In-depth analysis, benchmarks, and guides for AI hardware. Expert insights on GPUs, CPUs, and building high-performance AI workstations.",
    images: [
      {
        url: "https://theaiforge.ai/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "The AI Forge Blog - AI Hardware Intelligence",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Hardware Intelligence | The AI Forge Blog",
    description:
      "In-depth analysis, benchmarks, and guides for AI hardware. Expert insights on GPUs, CPUs, and building high-performance AI workstations.",
    images: ["https://theaiforge.ai/og-blog.jpg"],
    creator: "@theaiforge",
    site: "@theaiforge",
  },
  alternates: {
    canonical: "https://theaiforge.ai/blog",
    types: {
      "application/rss+xml": "https://theaiforge.ai/blog/feed.xml",
      "application/atom+xml": "https://theaiforge.ai/blog/atom.xml",
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  other: {
    "apple-mobile-web-app-title": "The AI Forge Blog",
    "application-name": "The AI Forge Blog",
    "msapplication-TileColor": "#10b981",
    "theme-color": "#050505",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${newsreader.variable} ${inter.variable} font-sans`}>
      {/* Font CSS Variables for Tailwind */}
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --font-serif: ${newsreader.style.fontFamily};
            --font-sans: ${inter.style.fontFamily};
          }
        `
      }} />
      {children}
    </div>
  );
}
