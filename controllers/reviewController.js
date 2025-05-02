const Review = require('../models/review');

// Create a review
exports.createReview = async (req, res) => {
  const { futsalId, userId, bookingId, rating, comment } = req.body;

  try {
    // Optional: Check if the user already reviewed this booking
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.status(400).json({ message: 'You already submitted a review for this booking.' });
    }

    const review = new Review({ futsalId, userId, bookingId, rating, comment });
    await review.save();

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    res.status(500).json({ message: 'Error creating review', error: err.message });
  }
};

// Get all reviews for a futsal
exports.getFutsalReviews = async (req, res) => {
  const { futsalId } = req.params;

  try {
    const reviews = await Review.find({ futsalId }).populate('userId', 'name profileImage');
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};

// Get average rating for a futsal
exports.getAverageRating = async (req, res) => {
  const { futsalId } = req.params;

  try {
    const result = await Review.aggregate([
      { $match: { futsalId: require('mongoose').Types.ObjectId(futsalId) } },
      { $group: { _id: '$futsalId', avgRating: { $avg: '$rating' } } }
    ]);

    const avg = result[0]?.avgRating || 0;
    res.json({ averageRating: avg.toFixed(1) });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating average rating', error: err.message });
  }
};
