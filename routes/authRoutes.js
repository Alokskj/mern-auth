import express from "express";
import { forgetPassword, generateOtp, getUser, loginUser, logoutUser, registerUser, verifyOtp } from "../controllers/authController.js";
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
    const token = generateToken(res,req.user._id.toString(),)
    res.redirect(process.env.CLIENT_URL)
    
})
router.post('/generate-otp', generateOtp)
router.post('/verify-otp', verifyOtp)
router.post('/forget-password', forgetPassword)
export default router