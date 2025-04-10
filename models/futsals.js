const mongoose = require('mongoose');

const futsalSchema = new mongoose.Schema({
  futsalName: { type: String, required: true, unique: true },
  location: { type: String, required: true }, // e.g., "Boudha, Kathmandu"
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  pricePerHour: { type: Number, required: true },
  availableTimeSlots: [{ type: String, required: true }],
  contactNumber: { type: String, required: true },
  images: [{ type: String }],       // Image URLs (from UploadThing)
  documents: [{ type: String }],    // Document URLs (from UploadThing)
  isApproved: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('futsals', futsalSchema);
