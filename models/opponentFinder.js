const mongoose = require('mongoose');

const matchRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  preferredDay: { type: Date, required: true },
  preferredTimeSlots: { type: [String], required: true }, // updated
  location: { type: String }, // Optional
  status: { type: String, enum: ['pending', 'matched', 'cancelled'], default: 'pending' },
  matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MatchRequest', matchRequestSchema);
