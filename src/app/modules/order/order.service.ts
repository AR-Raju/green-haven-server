import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import QueryBuilder from "../../builder/QueryBuilder"
import { Product } from "../product/product.model"
import type { TOrder } from "./order.interface"
import { Order } from "./order.model"

const OrderSearchableFields = ["customerName", "email"]

const createOrderIntoDB = async (orderData: TOrder) => {
  const { items, ...otherData } = orderData

  // Validate stock availability and calculate totals
  let calculatedTotal = 0
  const validatedItems = []

  for (const item of items) {
    const product = await Product.findById(item.product)
    if (!product) {
      throw new AppError(httpStatus.BAD_REQUEST, `Product not found: ${item.product}`)
    }

    if (product.quantity < item.quantity) {
      throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for ${product.title}`)
    }

    // Store product details in order item
    const orderItem = {
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    }

    validatedItems.push(orderItem)
    calculatedTotal += product.price * item.quantity
  }

  // Create order
  const order = await Order.create({
    ...otherData,
    items: validatedItems,
    totalAmount: calculatedTotal,
  })

  // Update product quantities
  for (const item of validatedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity },
    })
  }

  return await Order.findById(order._id).populate("items.product", "title price image")
}

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find().populate("items.product", "title price image"), query)
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await orderQuery.modelQuery
  const meta = await orderQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate("items.product", "title price image")
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found")
  }
  return result
}

const updateOrderIntoDB = async (id: string, payload: Partial<TOrder>) => {
  const result = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("items.product", "title price image")

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found")
  }

  return result
}

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderIntoDB,
}
