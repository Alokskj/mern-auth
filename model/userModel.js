import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists in DB"],
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    googleId: { type: String },
    password: {
      type: String,
    },
    mobileNumber: {
      type: String,
      minlength: [0, "Number lenth cannot be negetive."],
      maxlength: [15, "Number cannot exceed 15 characters."],
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: "Review"}],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
