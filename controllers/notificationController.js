const Notification = require('../models/notifications');

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const notifications = await Notification.find({ recipientId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

// Create/send a new notification
exports.createNotification = async (req, res) => {
  try {
    const { recipientId, recipientType, title, message, type } = req.body;

    const notification = new Notification({
      recipientId,
      recipientType,
      title,
      message,
      type,
    });

    await notification.save();

    // Emit via Socket.IO (if available)
    if (req.io) {
      req.io.to(recipientId).emit('new-notification', notification);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};
