import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import QueryBuilder from "../../builder/QueryBuilder"
import type { TBlogPost } from "./blog.interface"
import { BlogPost } from "./blog.model"

const BlogSearchableFields = ["title", "excerpt", "content"]

const createBlogPostIntoDB = async (blogData: TBlogPost, userData: any) => {
  const { title, content, excerpt, ...otherData } = blogData

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-")

  // Check if slug already exists
  const existingPost = await BlogPost.findOne({ slug })
  if (existingPost) {
    throw new AppError(httpStatus.BAD_REQUEST, "A post with this title already exists")
  }

  const post = await BlogPost.create({
    title,
    slug,
    content,
    excerpt: excerpt || content.substring(0, 200) + "...",
    authorId: userData.userId,
    authorName: userData.name,
    views: 0,
    likes: 0,
    ...otherData,
  })

  const populatedPost = await BlogPost.findById(post._id).populate("authorId", "name email avatar")

  return populatedPost
}

const getAllBlogPostsFromDB = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(BlogPost.find().populate("authorId", "name email avatar"), query)
    .search(BlogSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await blogQuery.modelQuery
  const meta = await blogQuery.countTotal()

  // Get categories and tags for filtering
  const categories = await BlogPost.distinct("category", {
    status: "published",
  })
  const tags = await BlogPost.distinct("tags", { status: "published" })

  return {
    meta,
    result,
    categories,
    tags,
  }
}

const getSingleBlogPostFromDB = async (slug: string) => {
  const post = await BlogPost.findOne({ slug }).populate("authorId", "name email avatar")

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog post not found")
  }

  // Increment view count
  await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

  // Get related posts
  const relatedPosts = await BlogPost.find({
    _id: { $ne: post._id },
    category: post.category,
    status: "published",
  })
    .limit(3)
    .select("title slug excerpt featuredImage createdAt")
    .populate("authorId", "name")

  return {
    post: {
      ...post.toObject(),
      views: post.views + 1,
    },
    relatedPosts,
  }
}

const updateBlogPostIntoDB = async (slug: string, payload: Partial<TBlogPost>, userData: any) => {
  const post = await BlogPost.findOne({ slug })
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog post not found")
  }

  // Check permissions
  const isOwner = post.authorId.toString() === userData.userId
  const isAdmin = userData.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized")
  }

  const updateData: any = { ...payload }

  if (payload.title) {
    // Generate new slug if title changed
    updateData.slug = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-")
  }

  const updatedPost = await BlogPost.findByIdAndUpdate(post._id, updateData, {
    new: true,
    runValidators: true,
  }).populate("authorId", "name email avatar")

  return updatedPost
}

const deleteBlogPostFromDB = async (slug: string, userData: any) => {
  const post = await BlogPost.findOne({ slug })
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog post not found")
  }

  // Check permissions
  const isOwner = post.authorId.toString() === userData.userId
  const isAdmin = userData.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized")
  }

  await BlogPost.findByIdAndDelete(post._id)

  return post
}

export const BlogServices = {
  createBlogPostIntoDB,
  getAllBlogPostsFromDB,
  getSingleBlogPostFromDB,
  updateBlogPostIntoDB,
  deleteBlogPostFromDB,
}
