import { Schema, model } from "mongoose"
import type { TBlogPost } from "./blog.interface"

const blogPostSchema = new Schema<TBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featuredImage: {
      type: String,
      default: "/placeholder.svg?height=400&width=600",
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    readingTime: {
      type: Number, // in minutes
    },
  },
  {
    timestamps: true,
  },
)

blogPostSchema.index({ slug: 1 })
blogPostSchema.index({ status: 1 })
blogPostSchema.index({ category: 1 })
blogPostSchema.index({ tags: 1 })
blogPostSchema.index({ featured: 1 })
blogPostSchema.index({ publishedAt: -1 })

// Calculate reading time before saving
blogPostSchema.pre("save", function (next) {
  if (this.content) {
    const wordsPerMinute = 200
    const wordCount = this.content.split(/\s+/).length
    this.readingTime = Math.ceil(wordCount / wordsPerMinute)
  }

  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date()
  }

  next()
})

export const BlogPost = model<TBlogPost>("BlogPost", blogPostSchema)
