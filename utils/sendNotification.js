const admin = require("../firebase");
const Token = require("../models/token");
const Notification = require("../models/notifications"); // ✅ import model

async function sendNotification(userId, title, body) {
  const tokenDoc = await Token.findOne({ userId });
  if (!tokenDoc || !tokenDoc.fcmToken) return;

  const message = {
    token: tokenDoc.fcmToken,
    notification: { title, body },
  };

  try {
    // ✅ Send FCM push
    await admin.messaging().send(message);
    console.log("✅ Push notification sent");

    // ✅ Save to DB
    await Notification.create({
      userId,
      title,
      message: body,
    });

  } catch (error) {
    console.error("❌ Error sending push:", error);
  }
}

module.exports = sendNotification;
