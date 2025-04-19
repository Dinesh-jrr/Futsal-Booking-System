const express = require("express");
const {
  getUserNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// GET: All notifications for a user
router.get("/notifications/:userId", getUserNotifications);

// PUT: Mark a notification as read
router.put("/notifications/:notificationId/read", markAsRead);

// DELETE: Delete a notification
router.delete("/notifications/:notificationId", deleteNotification);

//just to test
router.post("/notify-test", async (req, res) => {
  const { userId, title, message } = req.body;
  const sendNotification = require("../utils/sendNotification");
  await sendNotification(userId, title, message);
  res.status(200).json({ message: "Push sent" });
});


module.exports = router;
