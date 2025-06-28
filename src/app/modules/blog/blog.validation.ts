import { z } from "zod"

const createBlogPostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    excerpt: z.string().optional(),
    category: z.string().default("General"),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().url("Featured image must be a valid URL").optional(),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    featured: z.boolean().default(false),
  }),
})

const updateBlogPostValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featuredImage: z.string().url("Featured image must be a valid URL").optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    featured: z.boolean().optional(),
  }),
})

export const BlogValidation = {
  createBlogPostValidationSchema,
  updateBlogPostValidationSchema,
}
