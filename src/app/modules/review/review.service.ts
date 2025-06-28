import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import QueryBuilder from "../../builder/QueryBuilder"
import { Product } from "../product/product.model"
import type { TReview } from "./review.interface"
import { Review } from "./review.model"

const ReviewSearchableFields = ["userName", "comment"]

const createReviewIntoDB = async (reviewData: TReview, userData: any) => {
  const { productId, rating, comment } = reviewData

  // Check if product exists
  const product = await Product.findById(productId)
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found")
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    productId,
    userId: userData.userId,
  })

  if (existingReview) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already reviewed this product")
  }

  const review = await Review.create({
    productId,
    userId: userData.userId,
    userName: userData.name || "Anonymous",
    userEmail: userData.email,
    rating,
    comment,
    status: "pending",
    verifiedPurchase: false, // TODO: Check if user actually purchased the product
  })

  const populatedReview = await Review.findById(review._id)
    .populate("productId", "title image")
    .populate("userId", "name email avatar")

  return populatedReview
}

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(
    Review.find().populate("productId", "title image").populate("userId", "name email avatar"),
    query,
  )
    .search(ReviewSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await reviewQuery.modelQuery
  const meta = await reviewQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getSingleReviewFromDB = async (id: string) => {
  const result = await Review.findById(id).populate("productId", "title image").populate("userId", "name email avatar")

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found")
  }

  return result
}

const updateReviewIntoDB = async (id: string, payload: Partial<TReview>, userData: any) => {
  const review = await Review.findById(id)
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found")
  }

  // Check permissions
  const isOwner = review.userId.toString() === userData.userId
  const isAdmin = ["admin", "vendor"].includes(userData.role)

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized")
  }

  const updateData: any = {}

  // Users can only update their own review content
  if (isOwner && !isAdmin) {
    if (payload.rating) updateData.rating = payload.rating
    if (payload.comment) updateData.comment = payload.comment
  }

  // Admins can update status and add responses
  if (isAdmin) {
    if (payload.status) updateData.status = payload.status
    if (payload.adminResponse !== undefined) updateData.adminResponse = payload.adminResponse
  }

  const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("productId", "title image")
    .populate("userId", "name email avatar")

  // Update product rating if review was approved
  if (payload.status === "approved") {
    await updateProductRating(review.productId.toString())
  }

  return updatedReview
}

const deleteReviewFromDB = async (id: string, userData: any) => {
  const review = await Review.findById(id)
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found")
  }

  // Check permissions
  const isOwner = review.userId.toString() === userData.userId
  const isAdmin = ["admin", "vendor"].includes(userData.role)

  if (!isOwner && !isAdmin) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized")
  }

  const productId = review.productId.toString()
  await Review.findByIdAndDelete(id)

  // Update product rating after deletion
  await updateProductRating(productId)

  return review
}

// Helper function to update product rating
const updateProductRating = async (productId: string) => {
  const approvedReviews = await Review.find({ productId, status: "approved" })

  if (approvedReviews.length > 0) {
    const averageRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    })
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
    })
  }
}

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  updateReviewIntoDB,
  deleteReviewFromDB,
}
