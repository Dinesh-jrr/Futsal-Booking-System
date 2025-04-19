const express = require('express');
const {
  saveToken,
  getTokenByUserId,
  deleteTokenByUserId,
} = require('../controllers/tokenController');

const router = express.Router();

// Save or update FCM token for a user
router.post('/token/save', saveToken);

// Get token for a specific user
router.get('/token/:userId', getTokenByUserId);

// Delete a user's token (optional, e.g., logout or uninstall)
router.delete('/token/:userId', deleteTokenByUserId);

module.exports = router;
