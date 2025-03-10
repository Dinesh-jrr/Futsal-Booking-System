const protect = require('../middleware/authMiddleware');
const express = require('express');
const {
  createFutsal,
  getAllFutsals,
  getFutsalById,
  updateFutsal,
  deleteFutsal,
} = require('../controllers/futsalController');

const router = express.Router();

// Create a new futsal
router.post('/futsals', createFutsal);

// Get all futsals
router.get('/futsals', getAllFutsals);

// Get a single futsal by ID
router.get('/futsals/:futsalId', getFutsalById);

// Update a futsal by ID
router.put('/futsals/:futsalId', updateFutsal);

// Delete a futsal by ID
router.delete('/futsals/:futsalId', deleteFutsal);

module.exports = router;
