import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { AnalyticsServices } from "./analytics.service"

const getAnalytics = catchAsync(async (req, res) => {
  const { period } = req.query
  const result = await AnalyticsServices.getAnalyticsFromDB(period as string)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Analytics retrieved successfully",
    data: result,
  })
})

export const AnalyticsControllers = {
  getAnalytics,
}
