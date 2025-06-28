import type { Types } from "mongoose"

export interface TOrderItem {
  product: Types.ObjectId
  quantity: number
  price: number
}

export interface TOrder {
  _id?: string
  customerName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  items: TOrderItem[]
  totalAmount: number
  paymentMethod: "COD" | "STRIPE"
  paymentStatus: "PENDING" | "PAID" | "FAILED"
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  createdAt?: Date
  updatedAt?: Date
}
