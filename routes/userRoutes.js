const express = require('express');
const { registerUser, loginUser, getCurrentUser,getAllUsers } = require('../controllers/userController.js');
const protect = require('../middleware/authMiddleware.js');
const { forgotPassword, resetPassword } = require('../controllers/userController');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect(), getCurrentUser);
// Get all users (protected and only for admin)
router.get('/allUsers',getAllUsers);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
