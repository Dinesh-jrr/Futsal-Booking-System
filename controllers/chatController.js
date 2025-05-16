const mongoose = require("mongoose");
const chat = require("../models/chat");
const user = require("../models/user");

// Send a new chat message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newMessage = new chat({ sender: senderId, receiver: receiverId, message });
    await newMessage.save();

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get chat history between two users
const getChatHistory = async (req, res) => {
  try {
    const { userId1, userId2 } = req.query;

    if (!userId1 || !userId2) {
      return res.status(400).json({ success: false, message: "Both user IDs are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(userId2)) {
      return res.status(400).json({ success: false, message: "Invalid user ID(s)" });
    }

    const chatHistory = await chat
      .find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
      })
      .populate("sender", "name profilePic")
      .populate("receiver", "name profilePic")
      .sort({ createdAt: 1 })
      .limit(50);

    return res.status(200).json({ success: true, data: chatHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get conversation partners with last message, unread count
const getConversationPartners = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, message: "userId query param is required" });
  }

  try {
    const chats = await chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const conversationPartnerIds = new Set();
    for (const chatEntry of chats) {
      if (String(chatEntry.sender) !== userId) {
        conversationPartnerIds.add(String(chatEntry.sender));
      }
      if (String(chatEntry.receiver) !== userId) {
        conversationPartnerIds.add(String(chatEntry.receiver));
      }
    }

    const conversations = [];

    for (const partnerId of conversationPartnerIds) {
      const userInfo = await user.findById(partnerId).select("name role profileImage");

      const lastMessage = await chat
        .findOne({
          $or: [
            { sender: userId, receiver: partnerId },
            { sender: partnerId, receiver: userId },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(1);

      const unreadCount = await chat.countDocuments({
        sender: partnerId,
        receiver: userId,
        isRead: false,
      });

      conversations.push({
        _id: userInfo._id,
        name: userInfo.name,
        role: userInfo.role,
        avatar: userInfo.profileImage || '',
        lastMessage: lastMessage?.message || "",
        lastMessageTime: lastMessage?.createdAt || null,
        isRead: lastMessage?.isRead ?? false,
        unreadCount,
      });
    }

    // Sort by most recent message time
    conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("Error in getConversationPartners:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getConversationPartners,
};
