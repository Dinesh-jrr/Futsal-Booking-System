const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Route to initiate eSewa payment
router.post("/initiate", paymentController.payWithEsewa);

// Route to handle successful payment
router.get("/success", paymentController.paymentSuccess);

// Route to handle failed payment
router.get("/failure", paymentController.paymentFailure);
// router.get("/savePaymentHistory", paymentHistoryController.createPayment);
module.exports = router;
