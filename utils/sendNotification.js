const admin = require("../firebase"); // ✅ Import from your firebase.js
const Token = require("../models/token");
const Notification = require("../models/notifications");

const sendNotification = async (userId, title, message) => {
  try {
    const tokenDoc = await Token.findOne({ userId });
    if (!tokenDoc || !tokenDoc.fcmToken) {
      console.warn("⚠️ FCM token not found for user:", userId);
      return;
    }

    const payload = {
      notification: {
        title,
        body: message,
      },
      token: tokenDoc.fcmToken,
    };

    await admin.messaging().send(payload); // ✅ will now work
    await Notification.create({ userId, title, message });

    console.log("✅ Push notification sent & saved.");
  } catch (err) {
    console.error("❌ Failed to send/save notification:", err);
  }
};

module.exports = sendNotification;
