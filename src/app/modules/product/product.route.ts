import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../user/user.constant"
import { ProductControllers } from "./product.controller"
import { ProductValidation } from "./product.validation"

const router = express.Router()

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductControllers.createProduct,
)

router.get("/", ProductControllers.getAllProducts)

router.get("/:id", ProductControllers.getSingleProduct)

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductControllers.updateProduct,
)

router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.vendor), ProductControllers.deleteProduct)

export const ProductRoutes = router
