const express = require('express');
const {
  createFutsal,
  getAllFutsals,
  getFutsalById,
  updateFutsal,
  deleteFutsal,
  approveFutsal,
  checkFutsalByOwner
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

// Admin approves or rejects futsal
router.put('/futsals/:futsalId/approve', approveFutsal);

//check if futsal exists
router.get("/by-owner", checkFutsalByOwner);

module.exports = router;
