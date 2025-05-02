const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
    futsalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Futsal', required: true },
    futsalName: { type: String, required: true },
    selectedDay: { type: Date, required: true },
    selectedTimeSlot: { type: String, required: true },
    totalCost: { type: Number, required: true },
    advancePayment: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('bookings', bookingsSchema);
