const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// POST: Create review
router.post('/', reviewController.createReview);

// GET: Get all reviews for a futsal
router.get('/futsal/:futsalId', reviewController.getFutsalReviews);

// GET: Get average rating
router.get('/futsal/:futsalId/average', reviewController.getAverageRating);

module.exports = router;
