import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { USER_ROLE } from "../user/user.constant"
import { AuthControllers } from "./auth.controller"
import { AuthValidation } from "./auth.validation"

const router = express.Router()

router.post("/register", validateRequest(AuthValidation.registerValidationSchema), AuthControllers.registerUser)

router.post("/login", validateRequest(AuthValidation.loginValidationSchema), AuthControllers.loginUser)

router.get("/me", auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin), AuthControllers.getMe)

router.post(
  "/change-password",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
)

router.post("/logout", AuthControllers.logout)

export const AuthRoutes = router
