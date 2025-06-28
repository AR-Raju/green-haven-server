import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../user/user.constant"
import { WishlistControllers } from "./wishlist.controller"
import { WishlistValidation } from "./wishlist.validation"

const router = express.Router()

router.get("/", auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin), WishlistControllers.getWishlist)

router.post(
  "/",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  validateRequest(WishlistValidation.addToWishlistValidationSchema),
  WishlistControllers.addToWishlist,
)

router.delete(
  "/:productId",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  WishlistControllers.removeFromWishlist,
)

export const WishlistRoutes = router
