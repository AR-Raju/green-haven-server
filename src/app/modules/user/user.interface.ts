import type { Model } from "mongoose"
import type { USER_ROLE } from "./user.constant"

export interface TUser {
  _id?: string
  name: string
  email: string
  password: string
  role: keyof typeof USER_ROLE
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  emailVerified: boolean
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>
}
