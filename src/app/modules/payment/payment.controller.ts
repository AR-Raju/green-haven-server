import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { PaymentServices } from "./payment.service"

const createPaymentIntent = catchAsync(async (req, res) => {
  const result = await PaymentServices.createPaymentIntent(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully",
    data: result,
  })
})

const confirmPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.confirmPayment(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  })
})

export const PaymentControllers = {
  createPaymentIntent,
  confirmPayment,
}
