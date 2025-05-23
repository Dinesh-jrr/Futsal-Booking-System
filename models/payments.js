const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "bookings", required: true },
  transactionUuid: { type: String, required: true, unique: true },

  amount: { type: Number, required: true }, // Paid amount
  totalAmount: { type: Number, required: true }, // Total expected amount

  status: { 
    type: String, 
    enum: ["Pending", "Partial", "Complete", "Failed"], 
    default: "Pending" 
  },

  paymentGateway: { type: String, default: "eSewa" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
