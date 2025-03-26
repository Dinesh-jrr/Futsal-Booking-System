const express = require("express");
const { sendMessage, getChatHistory, getConversationPartners } = require("../controllers/chatController");
const router = express.Router();

router.post("/send", sendMessage);
router.get("/chat-history", getChatHistory);
router.get("/conversation", getConversationPartners);

module.exports = router;
