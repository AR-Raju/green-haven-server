import { z } from "zod"

const addToWishlistValidationSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: "Product ID is required",
    }),
  }),
})

export const WishlistValidation = {
  addToWishlistValidationSchema,
}
