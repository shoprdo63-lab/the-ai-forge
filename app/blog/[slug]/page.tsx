import { getBlogPostBySlug, getAllBlogPosts, getRelatedHardware } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Cpu, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RelatedHardwareSidebar from '@/components/RelatedHardwareSidebar'
import FeaturedConfiguration from '@/components/FeaturedConfiguration'

interface BlogPageProps {
  params: {
    slug: string
  }
}

export default function BlogPage({ params }: BlogPageProps) {
  const post = getBlogPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const relatedHardware = getRelatedHardware(post)

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="flex gap-12">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Back Navigation */}
            <Link 
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-xs text-[#d4d4d4]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Research Terminal
            </Link>
            
            {/* Article Header */}
            <header className="mb-12">
              <div className="mb-6 flex items-center gap-4 text-xs text-[#a3a3a3]">
                <span className="border border-[#262626] px-2 py-1 text-[#a3a3a3]">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </div>
              </div>
              
              <h1 className="mb-6 text-4xl font-semibold leading-[1.6] text-white">
                {post.title}
              </h1>
              
              <p className="mb-8 text-[14px] font-normal leading-[1.6] text-[#a3a3a3]">
                {post.excerpt}
              </p>
            </header>

            {/* Article Content */}
            <article className="max-w-none border border-[#262626] p-6 text-[14px] leading-[1.6] text-[#d4d4d4]">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 border-t border-[#262626] pt-8">
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#262626] px-2 py-1 text-xs text-[#a3a3a3]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Configuration */}
            <FeaturedConfiguration hardware={relatedHardware} />

            {/* Article Footer */}
            <footer className="mt-20 border-t border-[#262626] pt-12">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-xs text-[#d4d4d4]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Research Terminal
              </Link>
            </footer>
          </div>

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <RelatedHardwareSidebar hardware={relatedHardware} />
          </div>
        </div>
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPageProps) {
  const post = getBlogPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}
