import { Schema, model } from "mongoose";
import type { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminResponse: {
      type: String,
      trim: true,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ productId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });

export const Review = model<TReview>("Review", reviewSchema);
