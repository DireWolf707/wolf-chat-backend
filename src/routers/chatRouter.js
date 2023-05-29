import express from "express"
import { isAuthenticated } from "../middlewares/auth"
import {} from "../controllers/chatController"

const router = express.Router()
router.use(isAuthenticated)

export default router
