import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { Wishlist } from "./wishlist.model"

const getWishlistFromDB = async (userId: string) => {
  const wishlist = await Wishlist.findOne({ userId }).populate("items.productId", "title price image rating inStock")

  return wishlist || { items: [] }
}

const addToWishlistIntoDB = async (userId: string, productId: string) => {
  let wishlist = await Wishlist.findOne({ userId })

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      items: [{ productId, addedAt: new Date() }],
    })
  } else {
    // Check if product already in wishlist
    const existingItem = wishlist.items.find((item) => item.productId.toString() === productId)

    if (existingItem) {
      throw new AppError(httpStatus.BAD_REQUEST, "Product already in wishlist")
    }

    wishlist.items.push({ productId, addedAt: new Date() })
    await wishlist.save()
  }

  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "items.productId",
    "title price image rating inStock",
  )

  return populatedWishlist
}

const removeFromWishlistFromDB = async (userId: string, productId: string) => {
  const wishlist = await Wishlist.findOne({ userId })

  if (!wishlist) {
    throw new AppError(httpStatus.NOT_FOUND, "Wishlist not found")
  }

  wishlist.items = wishlist.items.filter((item) => item.productId.toString() !== productId)

  await wishlist.save()

  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "items.productId",
    "title price image rating inStock",
  )

  return populatedWishlist
}

export const WishlistServices = {
  getWishlistFromDB,
  addToWishlistIntoDB,
  removeFromWishlistFromDB,
}
