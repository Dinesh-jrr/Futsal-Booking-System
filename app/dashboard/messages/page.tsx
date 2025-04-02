'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import socket from '../../socket';
import { Conversation, Message } from '../../types/next-auth';

export default function MessagesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Fetch conversations and fix _id mapping
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`http://localhost:5000/api/chat/conversation?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          const mapped = (data.conversations || []).map((conv: any) => ({
            id: conv._id,
            name: conv.name,
            lastMessage: conv.lastMessage,
          }));
          setConversations(mapped);
        })
        .catch(err => console.error('Failed to load conversations:', err));
    }
  }, [session]);

  // Set up socket listeners
  useEffect(() => {
    if (status === 'loading') return;

    const userId = session?.user?.id;
    if (userId) {
      if (!socket.connected) socket.connect();

      socket.emit('join', userId);

      socket.on('newMessage', (message: any) => {
        const isParticipant =
          selectedConversation &&
          (message.sender === selectedConversation.id || message.receiver === selectedConversation.id);

        if (isParticipant) {
          const formatted: Message = {
            sender: message.sender === session?.user?.id ? 'You' : selectedConversation.name,
            content: message.message,
            timestamp: new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
          setMessages(prev => [...prev, formatted]);
        }
      });

      socket.on('typing', ({ senderId }) => {
        if (selectedConversation && senderId === selectedConversation.id) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 2000);
        }
      });
    }

    return () => {
      socket.off('newMessage');
      socket.off('typing');
    };
  }, [session, status, selectedConversation]);

  // When selecting a conversation
  const handleConversationSelect = async (conv: Conversation) => {
    if (!conv?.id || !session?.user?.id) {
      console.error('Missing conv.id or session.user.id');
      return;
    }

    setSelectedConversation(conv);
    setMessages([]);
    setIsTyping(false);
    setNewMessage('');

    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/chat-history?userId1=${session.user.id}&userId2=${conv.id}`
      );
      const data = await res.json();

      const formatted = (data.data || []).map((msg: any) => ({
        sender: msg.sender._id === session.user.id ? 'You' : conv.name,
        content: msg.message,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setMessages(formatted);

      await fetch('http://localhost:5000/api/chat/chat-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: session.user.id , receiverId: conv.id }),
      });
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const messageData: Message = {
      sender: 'You',
      content: newMessage,
      timestamp,
    };

    setMessages(prev => [...prev, messageData]);

    socket.emit('sendMessage', {
      senderId: session?.user?.id,
      receiverId: selectedConversation.id,
      message: newMessage,
    });

    try {
      await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: session?.user?.id,
          receiverId: selectedConversation.id,
          message: newMessage,
        }),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }

    setNewMessage('');
    setIsTyping(false);
  };

  // Typing indicator
  useEffect(() => {
    if (selectedConversation && newMessage.trim()) {
      socket.emit('typing', {
        senderId: session?.user?.id,
        receiverId: selectedConversation.id,
      });
    }
  }, [newMessage]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations Panel */}
      <div className="w-80 bg-white border-r overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chats</h2>
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-green-600 hover:underline"
          >
            Back
          </button>
        </div>

        {conversations.map((conv) => (
          <div
            key={String(conv.id)}
            onClick={() => handleConversationSelect(conv)}
            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-300 text-black ${
              String(selectedConversation?.id) === String(conv.id) ? 'bg-green-100' : ''
            }`}
          >
            <h3 className="font-semibold">{conv.name}</h3>
            <p className="text-sm text-gray-700 truncate">{conv.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b bg-green-200 text-black flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {selectedConversation?.name || 'Select a conversation'}
          </h2>
        </div>

        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4 flex flex-col bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.sender === 'You'
                  ? 'bg-green-500 text-white self-end'
                  : 'bg-gray-200 text-gray-800 self-start'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs mt-1 text-right opacity-70">{msg.timestamp}</p>
            </div>
          ))}

          {isTyping && selectedConversation && (
            <div className="text-sm italic text-gray-500 self-start">
              {selectedConversation.name} is typing...
            </div>
          )}
        </div>

        {selectedConversation && (
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
