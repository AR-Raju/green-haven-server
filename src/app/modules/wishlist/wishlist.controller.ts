import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WishlistServices } from "./wishlist.service";

const getWishlist = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await WishlistServices.getWishlistFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist retrieved successfully",
    data: result,
  });
});

const addToWishlist = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;
  const result = await WishlistServices.addToWishlistIntoDB(userId, productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product added to wishlist successfully",
    data: result,
  });
});

const removeFromWishlist = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;
  if (!productId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Product id is required",
      data: null,
    });
  }
  const result = await WishlistServices.removeFromWishlistFromDB(
    userId,
    productId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product removed from wishlist successfully",
    data: result,
  });
});

export const WishlistControllers = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
