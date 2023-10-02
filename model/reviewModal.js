import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    rating: {
      type: Number,
      required: true,
      min: [0, "rating cannot be negative"],
      max: [5, "Rating should be less than equal to 5"],
    },
    message: {
      type: String,
      minlength: [3, "Message must be atleast 3 characters"],
      maxlength: [200, "Message cannot exceed 200 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  });

const Review = mongoose.model('Review', reviewSchema)
export default Review