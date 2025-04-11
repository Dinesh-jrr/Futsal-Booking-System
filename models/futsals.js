const mongoose = require('mongoose');

const futsalSchema = new mongoose.Schema({
  futsalName: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  pricePerHour: { type: Number, required: true },
  availableTimeSlots: [{ type: String, required: true }],
  contactNumber: { type: String, required: true },
  images: [{ type: String }],
  documents: [{ type: String }],
  
  // ✅ Replace isApproved + old status field with this:
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Futsal', futsalSchema);