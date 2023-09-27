import express from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";
const router = express.Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/user', protectedRoute ,getUser)
export default router