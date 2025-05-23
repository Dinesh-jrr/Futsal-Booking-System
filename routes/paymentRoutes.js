const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Save payment
router.post("/create", paymentController.createPayment);

// Update payment status
router.patch("/payments/:transactionUuid", paymentController.updatePaymentStatus);

//get all payments
router.get("/getAllPayments", paymentController.getAllPayments);

router.get("/owner/:ownerId", paymentController.getPaymentsByOwner);

// router.get('/payments', paymentController.getAllPayments);
router.get('/user/:userId', paymentController.getPaymentsByUser);


module.exports = router;
