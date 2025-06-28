import { z } from "zod"

const createPaymentIntentValidationSchema = z.object({
  body: z.object({
    amount: z
      .number({
        required_error: "Amount is required",
      })
      .positive("Amount must be positive"),
    currency: z.string().default("usd"),
    metadata: z.record(z.string()).optional(),
  }),
})

const confirmPaymentValidationSchema = z.object({
  body: z.object({
    paymentIntentId: z.string({
      required_error: "Payment intent ID is required",
    }),
    orderId: z.string({
      required_error: "Order ID is required",
    }),
  }),
})

export const PaymentValidation = {
  createPaymentIntentValidationSchema,
  confirmPaymentValidationSchema,
}
