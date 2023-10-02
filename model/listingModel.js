import mongoose from 'mongoose'
import Location from './locationModel.js';
import slugify from 'slugify';
const allowedClasses = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
const allowedConditions = ["new", "decent", "used", "worn", "damaged", "other"];
const currentYear = new Date().getFullYear();
const listingSchema = new mongoose.Schema({
  images: {
    type: [String],
    required: [true, "At least one image is required."],
    validate: {
      validator: (images) => images.length > 0,
      message: "At least one image is required.",
    },
  },
  slug: {
    type: String,
    unique: true, // Ensure slugs are unique
    sparse: true, // Allow null or undefined values
  },
  title: {
    type: String,
    required: [true, "Title is required."],
    minlength: [10, "Title must be at least 2 characters."],
    maxlength: [100, "Title cannot exceed 100 characters."],
  },
  description: {
    type: String,
    required: [true, "Description is required."],
    minlength: [10, "Description must be at least 10 characters."],
    maxlength: [1000, "Description cannot exceed 1000 characters."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
    min: [0, "Price cannot be negative."],
    max: [100000, "Price cannot be greater than 1 lakh."],
  },
  mrp: {
    type: Number,
    required: [true, "MRP is required."],
    min: [0, "MRP cannot be negative."],
    validate: {
      validator: function (value) {
        return value >= this.price;
      },
      message: "MRP must be greater than or equal to the price.",
    },
  },
  subject: {
    type: String,
    required: [true, "Subject is required."],
    minlength: [2, "Subject must be at least 2 characters."],
    maxlength: [50, "Subject cannot exceed 50 characters."],
  },
  standard: {
    type: String,
    maxlength: [50, "Class cannot exceed 50 characters."],
    enum: {
      values: allowedClasses,
      message: "Invalid class. Class should be a number from 1 to 12.",
    },
  },
  board: {
    type: String,
    maxlength: [50, "Board cannot exceed 50 characters."],
  },
  condition: {
    type: String,
    enum: {
      values: allowedConditions, // Specify allowed values
      message: "Invalid condition. Please select a valid condition.", // Custom error message
    },
  },
  edition: {
    type: Number,
    validate: {
      validator: (value) => {
        return Number.isInteger(value) && value >= 1900 && value <= currentYear;
      },
      message: `Invalid edition year. Please provide a valid year between 1900 and ${currentYear}.`,
    },
  },
  bookPublisher: {
    type: String,
    maxlength: [50, "Book publisher name cannot exceed 50 characters."],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Replace 'User' with your actual user model
    required: [true, "Posted by user ID is required."],
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: [true, "Location is required."],
  },
});
listingSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    // If the title has not been modified, no need to regenerate the slug
    return next();
  }

  // Generate the slug based on the title
  this.slug = slugify(this.title, { lower: true });

  next();
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
