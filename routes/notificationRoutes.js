const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  createNotification,
} = require('../controllers/notificationController');

// Get notifications for a specific recipient
router.get('/:recipientId', getNotifications);

// Mark a notification as read
router.patch('/read/:id', markAsRead);

// Create a new notification
router.post('/create', createNotification);

module.exports = router;
