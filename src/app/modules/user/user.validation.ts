import { z } from "zod"

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "vendor", "admin"]).optional(),
  }),
})

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    role: z.enum(["user", "vendor", "admin"]).optional(),
    phone: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    avatar: z.string().url("Invalid URL format").optional(),
    isActive: z.boolean().optional(),
  }),
})

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
}
