import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Product } from './products'

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  date: string
  readTime: string
  category: string
  tags: string[]
  featuredHardware: string[]
  content: string
}

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        slug,
        title: matterResult.data.title || '',
        excerpt: matterResult.data.excerpt || '',
        coverImage: matterResult.data.coverImage || '',
        date: matterResult.data.date || '',
        readTime: matterResult.data.readTime || '5 min read',
        category: matterResult.data.category || 'Industry News',
        tags: matterResult.data.tags || [],
        featuredHardware: matterResult.data.featuredHardware || [],
        content: matterResult.content,
      }
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    return {
      slug,
      title: matterResult.data.title || '',
      excerpt: matterResult.data.excerpt || '',
      coverImage: matterResult.data.coverImage || '',
      date: matterResult.data.date || '',
      readTime: matterResult.data.readTime || '5 min read',
      category: matterResult.data.category || 'Industry News',
      tags: matterResult.data.tags || [],
      featuredHardware: matterResult.data.featuredHardware || [],
      content: matterResult.content,
    }
  } catch {
    return null
  }
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllBlogPosts()
  return allPosts.filter(post => post.category === category)
}

export function getRelatedHardware(post: BlogPost): Product[] {
  const { products }: { products: Product[] } = require('@/lib/products')
  return products.filter((product: Product) => 
    post.featuredHardware.some(hardwareId => product.id === hardwareId)
  )
}
