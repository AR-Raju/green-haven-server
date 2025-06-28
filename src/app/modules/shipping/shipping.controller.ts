import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { ShippingServices } from "./shipping.service"

const createShippingZone = catchAsync(async (req, res) => {
  const result = await ShippingServices.createShippingZoneIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shipping zone created successfully",
    data: result,
  })
})

const getAllShippingZones = catchAsync(async (req, res) => {
  const result = await ShippingServices.getAllShippingZonesFromDB()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shipping zones retrieved successfully",
    data: result,
  })
})

const createShippingMethod = catchAsync(async (req, res) => {
  const result = await ShippingServices.createShippingMethodIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shipping method created successfully",
    data: result,
  })
})

const getAllShippingMethods = catchAsync(async (req, res) => {
  const result = await ShippingServices.getAllShippingMethodsFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shipping methods retrieved successfully",
    data: result,
  })
})

export const ShippingControllers = {
  createShippingZone,
  getAllShippingZones,
  createShippingMethod,
  getAllShippingMethods,
}
