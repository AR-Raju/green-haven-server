import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../user/user.constant"
import { BlogControllers } from "./blog.controller"
import { BlogValidation } from "./blog.validation"

const router = express.Router()

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(BlogValidation.createBlogPostValidationSchema),
  BlogControllers.createBlogPost,
)

router.get("/", BlogControllers.getAllBlogPosts)

router.get("/:slug", BlogControllers.getSingleBlogPost)

router.patch(
  "/:slug",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(BlogValidation.updateBlogPostValidationSchema),
  BlogControllers.updateBlogPost,
)

router.delete("/:slug", auth(USER_ROLE.admin, USER_ROLE.vendor), BlogControllers.deleteBlogPost)

export const BlogRoutes = router
