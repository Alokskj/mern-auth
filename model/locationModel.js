import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  locality: {
    type: String,
    required: [true, 'Locality is required.'],
    maxlength: [100, 'Locality cannot exceed 100 characters.'],
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
    maxlength: [100, 'City cannot exceed 100 characters.'],
  },
  state: {
    type: String,
    required: [true, 'State is required.'],
    maxlength: [100, 'State cannot exceed 100 characters.'],
  },
  locationCoords: {
    type: {
      type: String,
      enum: ['Point'], // We specify that this field will contain 'Point' data
      required: true,
    },
    coordinates: {
      type: [Number], // Longitude and latitude values
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Replace 'User' with your actual user model
    required: [true, "user ID is required."],
  },
});

// Create a geospatial index on the locationCoords field for geospatial queries
locationSchema.index({ locationCoords: '2dsphere' });

const Location = mongoose.model('Location', locationSchema);

export default Location
