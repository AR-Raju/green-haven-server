import { BlogPost } from "../blog/blog.model"
import { Order } from "../order/order.model"
import { Product } from "../product/product.model"
import { Review } from "../review/review.model"
import { User } from "../user/user.model"
import type { TAnalyticsData } from "./analytics.interface"

const getAnalyticsFromDB = async (period = "30"): Promise<TAnalyticsData> => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - Number.parseInt(period))

  // Basic stats
  const totalOrders = await Order.countDocuments()
  const totalProducts = await Product.countDocuments()
  const totalUsers = await User.countDocuments()
  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: "PAID" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ])

  // Recent orders
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate("items.product", "title")

  // Sales by day (last period days)
  const salesByDay = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        paymentStatus: "PAID",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        sales: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // Top selling products
  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ])

  // Order status distribution
  const orderStatusStats = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ])

  // User registration stats
  const userStats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        newUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  // Review stats
  const reviewStats = {
    total: await Review.countDocuments(),
    pending: await Review.countDocuments({ status: "pending" }),
    approved: await Review.countDocuments({ status: "approved" }),
    averageRating: await Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
  }

  // Blog stats
  const blogStats = {
    total: await BlogPost.countDocuments(),
    published: await BlogPost.countDocuments({ status: "published" }),
    draft: await BlogPost.countDocuments({ status: "draft" }),
    totalViews: await BlogPost.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
  }

  // Low stock products
  const lowStockProducts = await Product.find({ quantity: { $lt: 10 } })
    .select("title quantity")
    .limit(10)

  return {
    overview: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    recentOrders,
    salesByDay,
    topProducts,
    orderStatusStats,
    userStats,
    reviewStats: {
      ...reviewStats,
      averageRating: reviewStats.averageRating[0]?.avg || 0,
    },
    blogStats: {
      ...blogStats,
      totalViews: blogStats.totalViews[0]?.total || 0,
    },
    lowStockProducts,
  }
}

export const AnalyticsServices = {
  getAnalyticsFromDB,
}
