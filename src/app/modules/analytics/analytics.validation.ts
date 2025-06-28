import { z } from "zod"

const getAnalyticsValidationSchema = z.object({
  query: z.object({
    period: z.string().optional().default("30"),
  }),
})

export const AnalyticsValidation = {
  getAnalyticsValidationSchema,
}
