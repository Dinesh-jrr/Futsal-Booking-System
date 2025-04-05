const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Save payment
router.post("/create", paymentController.createPayment);

// Update payment status
router.patch("/payments/:transactionUuid", paymentController.updatePaymentStatus);

//get all payments
router.get("/getAllPayments", paymentController.getAllPayments);

// router.get('/payments', paymentController.getAllPayments);

module.exports = router;
