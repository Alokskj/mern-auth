import express from "express";
import { generateOtp, getUser, loginUser, logoutUser, registerUser, verifyOtp } from "../controllers/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";
import passport from "passport";
import generateToken from "../utils/generateToken.js";
const router = express.Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/user', protectedRoute ,getUser)
router.get('/google', passport.authenticate('google', {scope : ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google'), (req,res)=>{
    generateToken(res,req.user._id.toString())
    res.redirect('http://localhost:3000/')
})
router.post('/generate-otp', generateOtp)
router.post('/verify-otp', verifyOtp)
export default router