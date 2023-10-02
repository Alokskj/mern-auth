import expressAsyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import Listing from "../model/listingModel.js";
import Review from "../model/reviewModal.js";
export const getUser = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Find User and do not return sensitive data
  const user = await User.findById(userId)
    .populate("reviews")
    .populate("location")
    .select("-password")
    .select("-tokenVersion");
  res.status(200).json({ success: true, user });
});
export const toggleFollow = expressAsyncHandler(async (req, res) => {
  const userIdToToggle = req.params.userId;
  const currentUser = req.user;

  if (currentUser._id.toString() === userIdToToggle) {
    res.status(400);
    throw new Error("You cannot follow youself");
  }
  const userToToggle = await User.findOne({ _id: userIdToToggle });
  if (!userToToggle) {
    res.status(404);
    throw new Error("User to follow not exists");
  }
  // Check if the user is already following the target user
  const isFollowing = currentUser.following.includes(userIdToToggle);
  if (isFollowing) {
    // User is already following, so unfollow
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userIdToToggle
    );
    // Update followers in userToToggle
    await User.findByIdAndUpdate(userIdToToggle, {
      $pull: { followers: currentUser._id.toString() },
    });
  } else {
    // User is not following, so follow
    currentUser.following.push(userIdToToggle);
    await User.findByIdAndUpdate(userIdToToggle, {
      $push: { followers: currentUser._id.toString() },
    });
  }
  await currentUser.save();

  const message = isFollowing
    ? "You have unfollowed this user"
    : "You are now following this user";
  res.status(200).json({ message });
});

export const toggleWishlist = expressAsyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const user = req.user;
  const isListingExists = await Listing.findById(listingId);
  if (!isListingExists) {
    res.status(404);
    throw new Error("Listing to add in wishlist is not exists");
  }
  const isInWishlist = user.wishlist.includes(listingId);
  if (isInWishlist) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== listingId);
  } else {
    user.wishlist.push(listingId);
  }
  await user.save();
  const message = isInWishlist
    ? "Listing has removed from wishlist"
    : "Listing has added to wishlist";
  res.status(200).json({ message, success: true });
});

export const createReview = expressAsyncHandler(async (req, res) => {
  const { rating, message } = req.body;
  if (!rating || !message) {
    res.status(400);
    throw new Error("insufficient details");
  }
  const userIdToReview = req.params.userId;
  const currentUserId = req.user._id.toString();
  const userToReview = await User.findById(userIdToReview).populate("reviews");
  if (userIdToReview === currentUserId) {
    res.status(400);
    throw new Error("Cannot create review for yourself");
  }
  if (!userToReview) {
    res.status(404);
    throw new Error("User to create review not exists");
  }
  const isReviewExisted = userToReview.reviews.find(
    (review) => review.user.toString() === currentUserId
  );
  if (isReviewExisted) {
    res.status(400);
    throw new Error("Review for this user already existed");
  }

  const review = await Review.create({ rating, message, user: currentUserId });
  userToReview.reviews.push(review);
  await userToReview.save();
  res.status(201).json({
    success: true,
    message: "Review created successfully",
    review,
    success: true,
  });
});

export const updateReview = expressAsyncHandler(async (req, res) => {
  const reviewIdToUpdate = req.params.reviewId;
  const currentUser = req.user;
  const { rating, message } = req.body;

  const review = await Review.findById(reviewIdToUpdate);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (review.user.toString() !== currentUser._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to update this review");
  }

  review.rating = rating;
  review.message = message;

  const updatedReview = await review.save();

  res.status(200).json({
    message: "Review updated successfully",
    updatedReview,
    success: true,
  });
});

export const deleteReview = expressAsyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;
  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (review.user.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("You are not authorized to delete this review");
  }
  const deletedReview = await Review.findByIdAndDelete(reviewId);
  console.log(deletedReview);
  res
    .status(200)
    .json({ message: "Review deleted successfully", success: true });
});
