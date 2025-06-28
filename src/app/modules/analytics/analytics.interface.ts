export interface TAnalyticsOverview {
  totalOrders: number
  totalProducts: number
  totalUsers: number
  totalRevenue: number
}

export interface TSalesByDay {
  _id: string
  sales: number
  orders: number
}

export interface TTopProduct {
  _id: string
  totalSold: number
  revenue: number
  product: {
    title: string
    price: number
    image: string
  }
}

export interface TAnalyticsData {
  overview: TAnalyticsOverview
  recentOrders: any[]
  salesByDay: TSalesByDay[]
  topProducts: TTopProduct[]
  orderStatusStats: any[]
  userStats: any[]
  reviewStats: any
  blogStats: any
  lowStockProducts: any[]
}
