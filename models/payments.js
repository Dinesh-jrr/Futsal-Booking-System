const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    transactionUuid: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Complete", "Failed"], default: "Pending" },
    paymentGateway: { type: String, default: "eSewa" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
