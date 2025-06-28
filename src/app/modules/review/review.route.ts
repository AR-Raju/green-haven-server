import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../user/user.constant"
import { ReviewControllers } from "./review.controller"
import { ReviewValidation } from "./review.validation"

const router = express.Router()

router.post(
  "/",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewControllers.createReview,
)

router.get("/", ReviewControllers.getAllReviews)

router.get("/:id", ReviewControllers.getSingleReview)

router.patch(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  validateRequest(ReviewValidation.updateReviewValidationSchema),
  ReviewControllers.updateReview,
)

router.delete("/:id", auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin), ReviewControllers.deleteReview)

export const ReviewRoutes = router
