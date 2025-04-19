const Payment = require("../models/payments");
const Booking=require("../models/bookings");
const Futsal = require("../models/futsals");
const sendNotification = require('../utils/sendNotification');

// Create a new payment record
exports.createPayment = async (req, res) => {
  try {
    const {
      user,
      booking,
      transactionUuid,
      amount,
      status,
      paymentGateway
    } = req.body;

    // Check for existing payment
    const existing = await Payment.findOne({ transactionUuid });
    if (existing) {
      return res.status(400).json({
        message: "Payment with this transaction ID already exists."
      });
    }

    // Save payment
    const payment = new Payment({
      user,
      booking,
      transactionUuid,
      amount,
      status: status || "Pending",
      paymentGateway: paymentGateway || "eSewa"
    });

    await payment.save();

    // 🔔 Send push notification
    const title = "Payment Received!";
    const message = `Your payment of Rs. ${amount} via ${paymentGateway || "eSewa"} has been recorded successfully.`;

    await sendNotification(user, title, message);

    // ✅ Respond to client
    res.status(201).json({
      message: "Payment saved successfully",
      payment
    });

  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({
      error: "Server error while saving payment"
    });
  }
};

// Update payment status (by transactionUuid)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { transactionUuid } = req.params;
    const { status } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { transactionUuid },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment status updated", payment });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Server error while updating payment" });
  }
};

//get all payments
exports.getAllPayments = async (req, res) => {
    try {
      const allPayments = await Payment.find()
        .populate("user", "name email") // includes user name & email
        .populate("booking", "futsalName selectedDay selectedTimeSlot") // includes related booking info
        .sort({ createdAt: -1 }); // newest payments first
  
      res.status(200).json({
        message: "All payments retrieved successfully!",
        payments: allPayments,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({
        message: "Failed to fetch payments",
        error: error.message,
      });
    }
  };

  // Get all payments for a futsal owner
exports.getPaymentsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    // 1. Find futsals owned by this owner
    const ownerFutsals = await Futsal.find({ ownerId });
    if (!ownerFutsals || ownerFutsals.length === 0) {
      return res.status(404).json({ message: "No futsals found for this owner" });
    }

    // 2. Get futsal names to match with bookings
    const futsalNames = ownerFutsals.map((f) => f.futsalName);

    // 3. Get bookings that belong to those futsals
    const relevantBookings = await Booking.find({ futsalName: { $in: futsalNames } });
    const bookingIds = relevantBookings.map((b) => b._id.toString());

    // 4. Get payments where booking._id is in bookingIds
    const payments = await Payment.find({ booking: { $in: bookingIds } })
      .populate("user", "name email")
      .populate("booking", "futsalName selectedDay selectedTimeSlot")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Payments for owner retrieved successfully!",
      payments,
    });
  } catch (error) {
    console.error("Error fetching owner payments:", error);
    res.status(500).json({
      message: "Failed to fetch owner payments",
      error: error.message,
    });
  }
};
  
  
