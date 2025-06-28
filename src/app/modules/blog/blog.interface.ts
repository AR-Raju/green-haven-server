import type { Types } from "mongoose"

export interface TBlogPost {
  _id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  featuredImage: string
  authorId: Types.ObjectId
  authorName: string
  status: "draft" | "published" | "archived"
  featured: boolean
  views: number
  likes: number
  publishedAt?: Date
  seoTitle?: string
  seoDescription?: string
  readingTime?: number
  createdAt?: Date
  updatedAt?: Date
}
