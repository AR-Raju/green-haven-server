import { Schema, model } from "mongoose"
import type { TWishlist, TWishlistItem } from "./wishlist.interface"

const wishlistItemSchema = new Schema<TWishlistItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

const wishlistSchema = new Schema<TWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  },
)

wishlistSchema.index({ userId: 1 })
wishlistSchema.index({ "items.productId": 1 })

export const Wishlist = model<TWishlist>("Wishlist", wishlistSchema)
