const admin = require("../firebase");
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
      token: tokenDoc.fcmToken,
      notification: {
        title: title,
        body: message,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        status: 'done',
      },
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      },
    };

    await admin.messaging().send(payload);
    await Notification.create({ userId, title, message });

    console.log("✅ Push notification sent & saved.");
  } catch (err) {
    console.error("❌ Failed to send/save notification:", err);
  }
};

module.exports = sendNotification;
