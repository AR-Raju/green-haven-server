import httpStatus from "http-status"
import jwt from "jsonwebtoken"
import config from "../../config"
import AppError from "../../errors/AppError"
import { User } from "../user/user.model"
import type { TLoginUser, TRegisterUser } from "./auth.interface"

const registerUser = async (payload: TRegisterUser) => {
  const user = await User.create(payload)
  return user
}

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!")
  }

  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!")
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched")
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  }

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  })

  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in,
  })

  // Update last login
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
    },
  }
}

const getMe = async (userId: string) => {
  const result = await User.findById(userId)
  return result
}

const changePassword = async (userData: any, payload: { oldPassword: string; newPassword: string }) => {
  const user = await User.isUserExistsByEmail(userData.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!")
  }

  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!")
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched")
  }

  const newHashedPassword = await User.findByIdAndUpdate(
    user._id,
    {
      password: payload.newPassword,
    },
    {
      new: true,
    },
  )

  return null
}

export const AuthServices = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
}
