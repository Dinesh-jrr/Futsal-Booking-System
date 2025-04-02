const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to sender (user or futsal_owner)
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to receiver (user or futsal_owner)
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Optional: add index for faster querying of conversations
chatSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

module.exports = Chat;
