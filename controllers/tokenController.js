const Token = require('../models/token');

// Save or update FCM token
exports.saveToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  if (!userId || !fcmToken) {
    return res.status(400).json({ message: 'userId and fcmToken required' });
  }

  try {
    const saved = await Token.findOneAndUpdate(
      { userId },
      { fcmToken },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Token saved successfully', token: saved });
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get token for a specific user
exports.getTokenByUserId = async (req, res) => {
  try {
    const token = await Token.findOne({ userId: req.params.userId });
    if (!token) return res.status(404).json({ message: 'Token not found' });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete token for a user
exports.deleteTokenByUserId = async (req, res) => {
  try {
    const result = await Token.deleteOne({ userId: req.params.userId });
    res.status(200).json({ message: 'Token deleted', result });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
