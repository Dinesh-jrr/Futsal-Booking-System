// controllers/matchRequestController.js
const MatchRequest = require('../models/opponentFinder');
const sendNotification = require('../utils/sendNotification');

// Create new match request and try to find a match
exports.opponentFind = async (req, res) => {
  try {
    const { userId, preferredLocation, preferredDate, preferredTimeSlots } = req.body;
    console.log("🔥 Opponent request received:", req.body);

    if (!userId || !preferredLocation || !preferredDate || !preferredTimeSlots || preferredTimeSlots.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Try to match with any of the preferred time slots
    for (let slot of preferredTimeSlots) {
      const existingMatch = await MatchRequest.findOne({
        location: preferredLocation,
        preferredDay: preferredDate,
        preferredTimeSlots: slot,
        status: 'pending',
        userId: { $ne: userId }
      });

      if (existingMatch) {
        // Update existing matched request
        existingMatch.status = 'matched';
        existingMatch.matchedWith = userId;
        await existingMatch.save();

        const newMatch = new MatchRequest({
          userId,
          location: preferredLocation,
          preferredDay: preferredDate,
          preferredTimeSlots: [slot],
          status: 'matched',
          matchedWith: existingMatch.userId
        });

        const savedMatch = await newMatch.save();

        // Notify both users
        await sendNotification(userId, "Match Found!", `You've been matched for ${slot} in ${preferredLocation}`);
        await sendNotification(existingMatch.userId, "Match Found!", `You've been matched for ${slot} in ${preferredLocation}`);

        return res.status(200).json({
          message: 'Match found and confirmed!',
          match: savedMatch,
          opponent: existingMatch.userId
        });
      }
    }

    // No match found — save all preferred slots as pending
    const newRequest = new MatchRequest({
      userId,
      location: preferredLocation,
      preferredDay: preferredDate,
      preferredTimeSlots,
      status: 'pending'
    });

    const savedRequest = await newRequest.save();
    return res.status(200).json({
      message: 'Match request saved. Waiting for opponent.',
      match: savedRequest
    });

  } catch (error) {
    console.error("❌ Error creating match request:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRequestCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const requestCount = await MatchRequest.countDocuments({
      userId,
      createdAt: { $gte: startOfDay }
    });

    return res.status(200).json({
      requestCount,
      remaining: Math.max(0, 3 - requestCount),
    });
  } catch (error) {
    console.error("❌ Error fetching request count:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/opponent/delete/:requestId
exports.deleteRequest= async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await MatchRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be deleted' });
    }

    await MatchRequest.findByIdAndDelete(requestId);
    res.status(200).json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

