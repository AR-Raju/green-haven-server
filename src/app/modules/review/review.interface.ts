import type { Types } from "mongoose"

export interface TReview {
  _id?: string
  productId: Types.ObjectId
  userId: Types.ObjectId
  userName: string
  userEmail: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  adminResponse?: string
  helpfulVotes: number
  verifiedPurchase: boolean
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}
