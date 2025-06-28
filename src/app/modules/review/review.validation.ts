import { z } from "zod"

const createReviewValidationSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: "Product ID is required",
    }),
    rating: z
      .number({
        required_error: "Rating is required",
      })
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
    comment: z.string({
      required_error: "Comment is required",
    }),
  }),
})

const updateReviewValidationSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    adminResponse: z.string().optional(),
    rating: z.number().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5").optional(),
    comment: z.string().optional(),
  }),
})

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
}
