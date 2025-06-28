import httpStatus from "http-status"
import config from "../../config"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  })
})

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)
  const { refreshToken, accessToken, user } = result

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  })

  res.cookie("token", accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      user,
      token: accessToken,
    },
  })
})

const getMe = catchAsync(async (req, res) => {
  const { userId } = req.user
  const result = await AuthServices.getMe(userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  })
})

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body

  const result = await AuthServices.changePassword(req.user, passwordData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully!",
    data: result,
  })
})

const logout = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken")
  res.clearCookie("token")

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  })
})

export const AuthControllers = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  logout,
}
