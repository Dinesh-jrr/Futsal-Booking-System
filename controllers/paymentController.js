const Payment = require("../models/payments");
const Booking=require("../models/bookings");

// Create a new payment record
exports.createPayment = async (req, res) => {
  try {
    const { user, booking, transactionUuid, amount, status, paymentGateway } = req.body;

    // Check if payment already exists to avoid duplicates
    const existing = await Payment.findOne({ transactionUuid });
    if (existing) {
      return res.status(400).json({ message: "Payment with this transaction ID already exists." });
    }

    const payment = new Payment({
      user,
      booking,
      transactionUuid,
      amount,
      status: status || "Pending",
      paymentGateway: paymentGateway || "eSewa",
    });

    await payment.save();
    res.status(201).json({ message: "Payment saved successfully", payment });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ error: "Server error while saving payment" });
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
  
  
