'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import socket from '../../socket-client';
import { Conversation, Message } from '../../types/next-auth';
import { FaPaperclip, FaSmile, FaSearch } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { baseUrl } from '@/lib/config';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const createNewConversation = async (receiverId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/users/${receiverId}`);
      const userData = await res.json();

      if (!userData?.user) return;

      const newConv: Conversation = {
        id: userData.user._id,
        name: userData.user.name,
        avatar: userData.user.profileImage || '/default-avatar.png',
        lastMessage: '',
        unreadCount: 0,
      };
      setConversations((prev) => [...prev, newConv]);
      handleConversationSelect(newConv);
    } catch (err) {
      console.error('Failed to create new conversation', err);
    }
  };

  useEffect(() => {
    if (initialUserId && conversations.length > 0) {
      const target = conversations.find((c: any) => c.id === initialUserId);
      if (target) {
        handleConversationSelect(target);
      } else {
        createNewConversation(initialUserId);
      }
    }
  }, [initialUserId, conversations]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`${baseUrl}/api/chat/conversation?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          const mapped = (data.conversations || []).map((conv: any) => ({
            id: conv._id,
            name: conv.name,
            avatar: conv.avatar || '/default-avatar.png',
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount || 0,
          }));
          setConversations(mapped);
        });
    }
  }, [session]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.id) return;

    socket.connect();
    socket.emit('join', session.user.id);

    socket.on('newMessage', (msg: any) => {
      if (
        selectedConversation &&
        (msg.sender === selectedConversation.id || msg.receiver === selectedConversation.id)
      ) {
        const formatted: Message = {
          sender: msg.sender === session.user.id ? 'You' : selectedConversation.name,
          content: msg.message,
          type: msg.type || 'text',
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, formatted]);
      }
    });

    socket.on('typing', ({ senderId }) => {
      if (selectedConversation && senderId === selectedConversation.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('typing');
    };
  }, [selectedConversation, session]);

  const handleConversationSelect = async (conv: Conversation) => {
    setSelectedConversation(conv);
    setMessages([]);
    setIsTyping(false);
    setNewMessage('');

    const res = await fetch(
      `${baseUrl}/api/chat/chat-history?userId1=${session?.user?.id}&userId2=${conv.id}`
    );
    const data = await res.json();

    const formatted = (data.data || []).map((msg: any) => ({
      sender: msg.sender._id === session?.user?.id ? 'You' : conv.name,
      content: msg.message,
      type: msg.type || 'text',
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    setMessages(formatted);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const msg = {
      senderId: session?.user?.id,
      receiverId: selectedConversation.id,
      message: newMessage,
    };

    setMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        content: newMessage,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    socket.emit('sendMessage', msg);

    await fetch(`${baseUrl}/api/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });

    setNewMessage('');
  };

  useEffect(() => {
    if (selectedConversation && newMessage.trim()) {
      socket.emit('typing', {
        senderId: session?.user?.id,
        receiverId: selectedConversation.id,
      });
    }
  }, [newMessage]);

  return (
    <div className="flex h-screen">
      <aside className="w-80 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Inbox</h2>
        {conversations.map((conv) => (
          <div
            key={conv.id.toString()}
            onClick={() => handleConversationSelect(conv)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 text-black ${
              selectedConversation?.id === conv.id ? 'bg-green-300' : ''
            }`}
          >
            <img src={conv.avatar || '/default-avatar.png'}className="w-12 h-12 rounded-full text-black" />
            <div className="flex-1">
              <h4 className="font-semibold text-black">{conv.name}</h4>
              <p className="text-gray-500 text-sm truncate">{conv.lastMessage}</p>
            </div>
            {(conv.unreadCount ?? 0) > 0 && (
              <span className="bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {conv.unreadCount}
              </span>
            )}
          </div>
        ))}
      </aside>

      <main className="flex-1 flex flex-col bg-gray-50">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3">
                <img src={selectedConversation.avatar} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-bold text-black">{selectedConversation.name}</h3>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <FaSearch className="text-gray-500" />
            </>
          ) : (
            <p className="text-black font-bold">Select a conversation</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full min-h-[300px]">
          {messages.map((msg, i) => (
            <div
  key={i}
  className={`flex flex-col max-w-sm ${
    msg.sender === 'You' ? 'ml-auto items-end' : 'mr-auto items-start'
  }`}
>
              <div
                className={`px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === 'You'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {msg.type === 'text' && <p>{msg.content}</p>}
                {msg.type === 'voice' && <audio controls src={msg.content} className="w-full" />}
                {msg.type === 'file' && (
                  <a href={msg.content} target="_blank" rel="noopener noreferrer" className="underline">
                    Download file
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
            </div>
          ))}
          {isTyping && <p className="italic text-gray-400">Typing...</p>}
        </div>

        {selectedConversation && (
          <div className="p-4 border-t bg-white flex items-center gap-3">
            <FaSmile className="text-gray-500" />
            <FaPaperclip className="text-gray-500" />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none text-black"
            />
            <button onClick={handleSendMessage} className="bg-green-500 p-2 rounded-full text-white">
              <FiSend />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
