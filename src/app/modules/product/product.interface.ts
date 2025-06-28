import type { Types } from "mongoose"

export interface TProduct {
  _id?: string
  title: string
  description: string
  price: number
  quantity: number
  rating: number
  image: string
  category: Types.ObjectId
  inStock: boolean
  createdAt?: Date
  updatedAt?: Date
}
