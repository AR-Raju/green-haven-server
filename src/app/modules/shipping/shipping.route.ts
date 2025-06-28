import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../user/user.constant"
import { ShippingControllers } from "./shipping.controller"
import { ShippingValidation } from "./shipping.validation"

const router = express.Router()

router.post(
  "/zones",
  auth(USER_ROLE.admin),
  validateRequest(ShippingValidation.createShippingZoneValidationSchema),
  ShippingControllers.createShippingZone,
)

router.get("/zones", ShippingControllers.getAllShippingZones)

router.post(
  "/methods",
  auth(USER_ROLE.admin),
  validateRequest(ShippingValidation.createShippingMethodValidationSchema),
  ShippingControllers.createShippingMethod,
)

router.get("/methods", ShippingControllers.getAllShippingMethods)

export const ShippingRoutes = router
