import {
  getAllBlogPosts,
  getBlogPostsByCategory,
  blogCategories,
} from "@/lib/blog-constants";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Guides & Research | The AI Forge",
  description:
    "In-depth analysis, benchmarks, and guides for AI hardware. Expert insights on GPUs, CPUs, and building the ultimate AI workstation.",
  openGraph: {
    title: "Guides & Research | The AI Forge",
    description:
      "In-depth analysis, benchmarks, and guides for AI hardware. Expert insights on GPUs, CPUs, and building the ultimate AI workstation.",
    type: "website",
  },
};

export default function BlogArchivePage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category || 'all'
  const posts = category === 'all' 
    ? getAllBlogPosts() 
    : getBlogPostsByCategory(category)

  return (
    <main className="min-h-screen bg-[var(--background)] transition-colors duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-[var(--card-border)]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                Knowledge Base
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Hardware Intelligence
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Deep technical analysis and practical guides for building
              high-performance AI systems. From GPU selection to complete
              workstation design.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {blogCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === "all" ? "/blog" : `/blog?category=${cat.slug}`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
                category === cat.slug
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Posts Grid - Glassmorphism Design */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 rounded-2xl blur opacity-0 group-hover:opacity-100 group-hover:from-emerald-500/20 group-hover:via-emerald-500/10 group-hover:to-emerald-500/20 transition-all duration-500" />

              {/* Card Content */}
              <div className="relative h-full glass-card overflow-hidden hover:border-[var(--card-border-hover)] transition-all duration-300">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--card-border)] text-emerald-500">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs text-slate-500 bg-slate-800/60 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No articles found
            </h3>
            <p className="text-slate-400">
              No articles found in this category. Try selecting a different
              category.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
