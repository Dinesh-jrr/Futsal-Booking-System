const express = require('express');
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  verifyEmailOtp, 
  sendOtpToEmail,
  updateUserProfile
} = require('../controllers/userController.js');
const protect = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect(), getCurrentUser);
router.get('/allUsers', getAllUsers);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ✅ Add this route for verifying email during registration
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/send-otp', sendOtpToEmail);
router.put('/profile',protect(),updateUserProfile);

module.exports = router;
