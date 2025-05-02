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
  changePassword
} = require('../controllers/userController.js');
const protect = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect(), getCurrentUser);
router.get('/allUsers', getAllUsers);
router.get('/:userId',getUserDetails);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put("/change-password/:userId", changePassword);

// ✅ Add this route for verifying email during registration
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/send-otp', sendOtpToEmail);
router.put('/profile/:userId',updateUserProfile);


module.exports = router;
