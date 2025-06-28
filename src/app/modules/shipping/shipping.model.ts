import { Schema, model } from "mongoose"
import type { TShippingMethod, TShippingZone } from "./shipping.interface"

const shippingZoneSchema = new Schema<TShippingZone>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regions: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    methods: [
      {
        type: Schema.Types.ObjectId,
        ref: "ShippingMethod",
      },
    ],
  },
  {
    timestamps: true,
  },
)

const shippingMethodSchema = new Schema<TShippingMethod>(
  {
    zoneId: {
      type: Schema.Types.ObjectId,
      ref: "ShippingZone",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedDays: {
      type: String,
      required: true,
    },
    freeShippingThreshold: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxWeight: {
      type: Number, // in kg
    },
    maxDimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
  },
)

shippingZoneSchema.index({ name: 1 })
shippingZoneSchema.index({ isActive: 1 })

shippingMethodSchema.index({ zoneId: 1 })
shippingMethodSchema.index({ isActive: 1 })
shippingMethodSchema.index({ cost: 1 })

export const ShippingZone = model<TShippingZone>("ShippingZone", shippingZoneSchema)
export const ShippingMethod = model<TShippingMethod>("ShippingMethod", shippingMethodSchema)
