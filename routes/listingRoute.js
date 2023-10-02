import express from 'express'
import { protectedRoute } from '../middleware/authMiddleware.js'
import { createListing, deleteListing, getAllListings, getListing, updateListing } from '../controllers/listingController.js'
const router = express.Router()
router.get('/', getAllListings)
router.get('/:identifier', getListing)
router.put('/:_id',protectedRoute, updateListing)
router.delete('/:_id',protectedRoute, deleteListing)
router.post('/', protectedRoute, createListing)
export default router