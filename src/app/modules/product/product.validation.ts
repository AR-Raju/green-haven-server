import { z } from "zod"

const createProductValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Product title is required",
      })
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string({
        required_error: "Product description is required",
      })
      .max(1000, "Description cannot exceed 1000 characters"),
    price: z
      .number({
        required_error: "Product price is required",
      })
      .min(0, "Price cannot be negative"),
    quantity: z.number().min(0, "Quantity cannot be negative").default(0),
    rating: z.number().min(0, "Rating cannot be less than 0").max(5, "Rating cannot exceed 5").default(0),
    image: z
      .string({
        required_error: "Product image is required",
      })
      .url("Image must be a valid URL"),
    category: z.string({
      required_error: "Product category is required",
    }),
  }),
})

const updateProductValidationSchema = z.object({
  body: z.object({
    title: z.string().max(100, "Title cannot exceed 100 characters").optional(),
    description: z.string().max(1000, "Description cannot exceed 1000 characters").optional(),
    price: z.number().min(0, "Price cannot be negative").optional(),
    quantity: z.number().min(0, "Quantity cannot be negative").optional(),
    rating: z.number().min(0, "Rating cannot be less than 0").max(5, "Rating cannot exceed 5").optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    category: z.string().optional(),
  }),
})

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
}
