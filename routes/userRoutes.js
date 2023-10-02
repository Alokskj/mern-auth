import express from "express"
import { protectedRoute } from "../middleware/authMiddleware.js"
import { createReview, deleteReview, getUser, toggleFollow, toggleWishlist, updateReview } from "../controllers/userController.js"
const router = express.Router()
router.get('/:userId', getUser)
router.post('/toggle-follow/:userId', protectedRoute, toggleFollow)
router.post('/toggle-wishlist/:listingId', protectedRoute, toggleWishlist)
router.post('/:userId/review', protectedRoute, createReview)
router.put('/review/:reviewId', protectedRoute, updateReview)
router.delete('/review/:reviewId', protectedRoute, deleteReview)
export default router