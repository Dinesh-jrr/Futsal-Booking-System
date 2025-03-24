

const Payment = require("../models/payments");
const Booking = require("../models/bookings");
const crypto = require("crypto");

// Generate a unique transaction ID
const generateTransactionId = () => crypto.randomBytes(8).toString("hex");

// Initiate Payment with eSewa
exports.payWithEsewa = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Create a payment record in DB
        const transactionUuid = generateTransactionId();
        const payment = new Payment({
            user: booking.user,
            booking: booking._id,
            transactionUuid,
            amount: booking.totalAmount,
            status: "Pending",
        });
        await payment.save();

        // eSewa Test Environment
        const eSewaURL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
        const successURL = `http://localhost:5000/api/payments/success?transactionUuid=${transactionUuid}`;
        const failureURL = `http://localhost:5000/api/payments/failure?transactionUuid=${transactionUuid}`;

        // Send payment form to client
        res.send(`
            <body>
                <form action="${eSewaURL}" method="POST">
                    <input type="hidden" name="amount" value="${booking.totalAmount}">
                    <input type="hidden" name="tax_amount" value="0">
                    <input type="hidden" name="total_amount" value="${booking.totalAmount}">
                    <input type="hidden" name="transaction_uuid" value="${transactionUuid}">
                    <input type="hidden" name="product_code" value="EPAYTEST">
                    <input type="hidden" name="product_service_charge" value="0">
                    <input type="hidden" name="product_delivery_charge" value="0">
                    <input type="hidden" name="success_url" value="${successURL}">
                    <input type="hidden" name="failure_url" value="${failureURL}">
                    <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code">
                    <input type="hidden" name="signature" value="">
                    <button type="submit">Pay with eSewa</button>
                </form>
            </body>
        `);
    } catch (error) {
        res.status(500).json({ message: "Error initiating payment", error });
    }
};

// Handle Successful Payment
exports.paymentSuccess = async (req, res) => {
    try {
        const { transactionUuid, data } = req.query;
        const payment = await Payment.findOne({ transactionUuid });

        if (!payment) return res.status(404).json({ message: "Payment record not found" });

        // Decode eSewa response
        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("ascii"));

        if (decodedData.status === "COMPLETE") {
            payment.status = "Complete";
            await payment.save();

            // Update booking status
            await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: "Paid", transactionId: transactionUuid });

            return res.json({ message: "Payment successful", paymentDetails: decodedData });
        } else {
            return res.status(400).json({ message: "Invalid payment status" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error handling payment success", error });
    }
};

// Handle Failed Payment
exports.paymentFailure = async (req, res) => {
    try {
        const { transactionUuid } = req.query;
        const payment = await Payment.findOne({ transactionUuid });

        if (!payment) return res.status(404).json({ message: "Payment record not found" });

        payment.status = "Failed";
        await payment.save();

        return res.json({ message: "Payment failed. Please try again." });
    } catch (error) {
        res.status(500).json({ message: "Error handling payment failure", error });
    }
};
