import type { Types } from "mongoose"

export interface TShippingZone {
  _id?: string
  name: string
  regions: string[]
  isActive: boolean
  methods: Types.ObjectId[]
  createdAt?: Date
  updatedAt?: Date
}

export interface TShippingMethod {
  _id?: string
  zoneId: Types.ObjectId
  name: string
  description: string
  cost: number
  estimatedDays: string
  freeShippingThreshold?: number
  isActive: boolean
  maxWeight?: number
  maxDimensions?: {
    length: number
    width: number
    height: number
  }
  createdAt?: Date
  updatedAt?: Date
}
