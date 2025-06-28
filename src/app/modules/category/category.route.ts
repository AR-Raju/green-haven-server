import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../user/user.constant"
import { CategoryControllers } from "./category.controller"
import { CategoryValidation } from "./category.validation"

const router = express.Router()

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
)

router.get("/", CategoryControllers.getAllCategories)

router.get("/:id", CategoryControllers.getSingleCategory)

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
)

router.delete("/:id", auth(USER_ROLE.admin), CategoryControllers.deleteCategory)

export const CategoryRoutes = router
