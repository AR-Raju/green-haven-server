import { Router } from "express"
import { AuthRoutes } from "../modules/auth/auth.route"
import { UserRoutes } from "../modules/user/user.route"
import { ProductRoutes } from "../modules/product/product.route"
import { CategoryRoutes } from "../modules/category/category.route"
import { OrderRoutes } from "../modules/order/order.route"
import { UploadRoutes } from "../modules/upload/upload.route"
import { PaymentRoutes } from "../modules/payment/payment.route"
import { WishlistRoutes } from "../modules/wishlist/wishlist.route"
import { ReviewRoutes } from "../modules/review/review.route"
import { BlogRoutes } from "../modules/blog/blog.route"
import { ShippingRoutes } from "../modules/shipping/shipping.route"
import { AnalyticsRoutes } from "../modules/analytics/analytics.route"

const router = Router()

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/upload",
    route: UploadRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/wishlist",
    route: WishlistRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/blog",
    route: BlogRoutes,
  },
  {
    path: "/shipping",
    route: ShippingRoutes,
  },
  {
    path: "/analytics",
    route: AnalyticsRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
