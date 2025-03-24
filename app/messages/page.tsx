"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Interfaces
interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

// Dummy data
const conversations: Conversation[] = [
  { id: 1, name: "Alex", lastMessage: "Don't forget our meeting at 3 PM." },
  { id: 2, name: "Jordan", lastMessage: "The latest changes have been pushed." },
];

const chatHistory: Record<number, Message[]> = {
  1: [
    { sender: "Alex", content: "Hey, are you free at 3?", timestamp: "10:00 AM" },
    { sender: "You", content: "Yes, I am. See you then!", timestamp: "10:02 AM" },
  ],
  2: [
    { sender: "Jordan", content: "I just pushed the new updates.", timestamp: "9:30 AM" },
    { sender: "You", content: "Great, I'll check them out.", timestamp: "9:33 AM" },
  ],
};

export default function MessagesPage() {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(chatHistory[conversations[0].id] || []);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleConversationSelect = (conv: Conversation) => {
    setSelectedConversation(conv);
    setMessages(chatHistory[conv.id] || []);
    setNewMessage("");
    setIsTyping(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updatedMessages = [...messages, { sender: "You", content: newMessage, timestamp }];
    setMessages(updatedMessages);
    setNewMessage("");
    setIsTyping(false);
  };

  useEffect(() => {
    setIsTyping(newMessage.trim().length > 0);
  }, [newMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex p-4">
      {/* Sidebar */}
      <div className="w-1/3 max-w-xs bg-white rounded-xl shadow-lg p-4 space-y-4">
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-green-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversations</h2>

        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => handleConversationSelect(conv)}
            className={`p-3 rounded-lg cursor-pointer border ${
              selectedConversation.id === conv.id ? "border-green-500" : "border-gray-300"
            }`}
          >
            <h3 className="font-semibold text-gray-800">{conv.name}</h3>
            <p className="text-sm text-gray-500">{conv.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-xl shadow-lg ml-4 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{selectedConversation.name}</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs break-words ${
                msg.sender === "You"
                  ? "bg-green-500 text-white self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
            </div>
          ))}

          {isTyping && (
            <div className="text-sm italic text-gray-500">{selectedConversation.name} is typing...</div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-300">
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-l-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
