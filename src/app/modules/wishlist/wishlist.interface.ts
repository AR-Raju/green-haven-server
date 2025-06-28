import type { Types } from "mongoose"

export interface TWishlistItem {
  productId: Types.ObjectId
  addedAt: Date
}

export interface TWishlist {
  _id?: string
  userId: Types.ObjectId
  items: TWishlistItem[]
  createdAt?: Date
  updatedAt?: Date
}
