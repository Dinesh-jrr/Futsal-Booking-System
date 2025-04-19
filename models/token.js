const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fcmToken: { type: String, required: true },
});

module.exports = mongoose.model("Token", tokenSchema);
