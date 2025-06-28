import express from "express"
import validateRequest from "../../middlewares/validateRequest"
import { PaymentControllers } from "./payment.controller"
import { PaymentValidation } from "./payment.validation"

const router = express.Router()

router.post(
  "/create-payment-intent",
  validateRequest(PaymentValidation.createPaymentIntentValidationSchema),
  PaymentControllers.createPaymentIntent,
)

router.post(
  "/confirm-payment",
  validateRequest(PaymentValidation.confirmPaymentValidationSchema),
  PaymentControllers.confirmPayment,
)

export const PaymentRoutes = router
