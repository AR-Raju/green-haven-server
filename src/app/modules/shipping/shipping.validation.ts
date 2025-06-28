import { z } from "zod"

const createShippingZoneValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Zone name is required",
    }),
    regions: z.array(z.string()).min(1, "At least one region is required"),
    isActive: z.boolean().default(true),
  }),
})

const createShippingMethodValidationSchema = z.object({
  body: z.object({
    zoneId: z.string({
      required_error: "Zone ID is required",
    }),
    name: z.string({
      required_error: "Method name is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    cost: z
      .number({
        required_error: "Cost is required",
      })
      .min(0, "Cost cannot be negative"),
    estimatedDays: z.string({
      required_error: "Estimated days is required",
    }),
    freeShippingThreshold: z.number().min(0).optional(),
    isActive: z.boolean().default(true),
    maxWeight: z.number().positive().optional(),
    maxDimensions: z
      .object({
        length: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .optional(),
  }),
})

export const ShippingValidation = {
  createShippingZoneValidationSchema,
  createShippingMethodValidationSchema,
}
