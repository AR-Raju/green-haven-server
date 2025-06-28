import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../user/user.constant"
import { OrderControllers } from "./order.controller"
import { OrderValidation } from "./order.validation"

const router = express.Router()

router.post("/", validateRequest(OrderValidation.createOrderValidationSchema), OrderControllers.createOrder)

router.get("/", auth(USER_ROLE.admin, USER_ROLE.vendor), OrderControllers.getAllOrders)

router.get("/:id", OrderControllers.getSingleOrder)

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(OrderValidation.updateOrderValidationSchema),
  OrderControllers.updateOrder,
)

export const OrderRoutes = router
