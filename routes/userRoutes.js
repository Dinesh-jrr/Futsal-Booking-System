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
  updateUserProfile,
  getUserDetails,
  changePassword,
  getUserByEmail,
  searchUsersByEmail
} = require('../controllers/userController.js');
const protect = require('../middleware/authMiddleware.js');

const router = express.Router();

// ✅ Static routes first
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect(), getCurrentUser);
router.get('/allUsers', getAllUsers);
router.get('/email/:email', getUserByEmail);
router.get('/search-email', searchUsersByEmail);

// router.post('/forgot-password', forgotPassword);
router.post('/password/reset', resetPassword);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/otp/send', sendOtpToEmail);
router.put('/change-password/:userId', changePassword);
router.put('/profile/:userId', updateUserProfile);

// ⛔️ This MUST be last
router.get('/:userId', getUserDetails);

module.exports = router;
