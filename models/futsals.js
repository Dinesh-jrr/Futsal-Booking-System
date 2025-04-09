const mongoose = require('mongoose');

const futsalSchema = new mongoose.Schema({
  futsalName: { type: String, required: true, unique: true },
  location: { type: String, required: true }, // e.g., "Boudha, Kathmandu"
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to the owner
  pricePerHour: { type: Number, required: true },
  availableTimeSlots: [{ type: String, required: true }], // e.g., ["10:00 AM - 11:00 AM"]
  contactNumber: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs (e.g., UploadThing)
  documents: [{ type: String }], // Array of document URLs
  isApproved: { type: Boolean, default: false }, // For admin approval
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('futsals', futsalSchema);
