import QueryBuilder from "../../builder/QueryBuilder"
import { UserSearchableFields } from "./user.constant"
import type { TUser } from "./user.interface"
import { User } from "./user.model"

const createUserIntoDB = async (userData: TUser) => {
  const result = await User.create(userData)
  return result
}

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await userQuery.modelQuery
  const meta = await userQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id)
  return result
}

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id)
  return result
}

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
}
