import express from "express"
import auth from "../../middlewares/auth"
import { USER_ROLE } from "../user/user.constant"
import { AnalyticsControllers } from "./analytics.controller"

const router = express.Router()

router.get("/", auth(USER_ROLE.admin, USER_ROLE.vendor), AnalyticsControllers.getAnalytics)

export const AnalyticsRoutes = router
