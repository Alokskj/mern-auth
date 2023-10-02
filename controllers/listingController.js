import expressAsyncHandler from "express-async-handler";
import Listing from "../model/listingModel.js";
import Location from "../model/locationModel.js";
import mongoose from "mongoose";

export const createListing = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  const listingDetails = req.body;
  const {
    location: { city, state, locality },
    locationCoords,
  } = req.body;
  const listingLocation = await Location.create({
    locality,
    city,
    state,
    user: user._id,
    locationCoords,
  });
  const listing = await Listing.create({
    ...listingDetails,
    postedBy: user._id,
    location: listingLocation._id,
  });
  res
    .status(201)
    .json({ message: "Listing successfully created", success: true, listing });
});

export const getAllListings = expressAsyncHandler(async (req, res) => {

  const listings = await Listing.find(req.query);
  res.status(200).json(listings);
});

export const getListing = expressAsyncHandler(async (req, res) => {
  const identifier = req.params.identifier;
  let listing = null;
  if (mongoose.isValidObjectId(identifier)) {
    listing = await Listing.findById(identifier).populate('postedBy').populate('location');
  } else {
    // If it's not a valid ObjectId or no listing by _id is found, try to find the listing by slug
    listing = await Listing.findOne({ slug: identifier }).populate('postedBy').populate('location');
  }


  // If neither _id nor slug matches, return a 404 Not Found response
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  return res.status(200).json(listing);
});

export const updateListing = expressAsyncHandler(async (req, res) => {
  const { _id } = req.params;
  const userId = req.user._id;
  const listingDetails = req.body;
  const listing = await Listing.findById(_id);

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  // Check if the authenticated user is the same as the user who posted the listing
  if (listing.postedBy.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ error: "You are not authorized to update this listing" });
  }
  const updatedListing = await Listing.findByIdAndUpdate(
    { _id },
    listingDetails,
    { new: true }
  );
  res.status(201).json(updatedListing);
});

export const deleteListing = expressAsyncHandler(async (req, res) => {
  const { _id } = req.params;
  const userId = req.user._id;
  const listing = await Listing.findById(_id);

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  // Check if the authenticated user is the same as the user who posted the listing
  if (listing.postedBy.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ error: "You are not authorized to delete this listing" });
  }
  const deletedListing = await Listing.findByIdAndDelete(_id);
  res
    .status(200)
    .json({ message: "Listing deleted successfully", success: true });
});
