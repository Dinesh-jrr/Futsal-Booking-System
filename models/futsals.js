const mongoose = require('mongoose');

const futsalSchema = new mongoose.Schema({
  futsalName: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to the owner
  pricePerHour: { type: Number, required: true },
  availableTimeSlots: [{ type: String, required: true }], // Example: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"]
  contactNumber: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('futsals', futsalSchema);
