import { z } from "zod"

const createOrderValidationSchema = z.object({
  body: z.object({
    customerName: z.string({
      required_error: "Customer name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Please enter a valid email"),
    phone: z.string({
      required_error: "Phone number is required",
    }),
    address: z.object({
      street: z.string({ required_error: "Street is required" }),
      city: z.string({ required_error: "City is required" }),
      state: z.string({ required_error: "State is required" }),
      zipCode: z.string({ required_error: "Zip code is required" }),
    }),
    items: z
      .array(
        z.object({
          product: z.string({ required_error: "Product ID is required" }),
          quantity: z.number({ required_error: "Quantity is required" }).min(1, "Quantity must be at least 1"),
        }),
      )
      .min(1, "At least one item is required"),
    paymentMethod: z.enum(["COD", "STRIPE"]).default("COD"),
  }),
})

const updateOrderValidationSchema = z.object({
  body: z.object({
    orderStatus: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
  }),
})

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
}
