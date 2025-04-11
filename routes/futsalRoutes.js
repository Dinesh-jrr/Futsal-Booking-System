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
router.post('/createfutsal', createFutsal);

// Get all futsals
router.get('/getfutsals', getAllFutsals);

//check if futsal exists
router.get("/by-owner", checkFutsalByOwner);

// Get a single futsal by ID
router.get('/getOnefutsal/:futsalId', getFutsalById);

// Update a futsal by ID
router.put('/futsals/update:futsalId', updateFutsal);

// Delete a futsal by ID
router.delete('/futsals/delete:futsalId', deleteFutsal);

// Admin approves or rejects futsal
router.put('/futsals/:futsalId/approve', approveFutsal);



module.exports = router;
