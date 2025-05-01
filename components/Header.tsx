'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, MessageSquare } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { useSession } from 'next-auth/react';

interface Notification {
  id: number;
  message: string;
  time: string;
}

export default function Header() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/notification/notifications/${session.user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Notification[] = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Optionally set an error state here to inform the user
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [session?.user?.id]);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 shadow-md">
      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Welcome to FootLock</h1>
        <p className="text-gray-500">Hello {session?.user?.name || 'Guest'}, Welcome back!</p>
      </div>

      {/* Middle Section */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Dashboard"
          className="w-72 rounded-full border border-gray-300 bg-gray-100 py-2 px-4 text-gray-700 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <Search className="absolute right-4 top-2 text-gray-400" />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {userRole === 'admin' && (
          <Link href="/reviews">
            <MessageSquare className="text-gray-600 hover:text-gray-800 cursor-pointer" />
          </Link>
        )}
        {userRole === 'futsal_owner' && (
          <Link href="/dashboard/messages">
            <MessageSquare className="text-gray-600 hover:text-gray-800 cursor-pointer" />
          </Link>
        )}

        {/* Notification Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="relative p-1 text-gray-600 hover:text-gray-800 focus:outline-none">
            <Bell className="h-6 w-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {notifications.length}
              </span>
            )}
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {loading ? (
              <div className="p-4 text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-gray-500">No notifications available.</div>
            ) : (
              <div className="p-1">
                {notifications.map((notif) => (
                  <Menu.Item key={notif.id}>
                    {({ active }) => (
                      <div
                        className={`p-4 ${active ? 'bg-gray-100' : 'bg-white'} border-b border-gray-200 last:border-none`}
                      >
                        <p className="text-gray-800">{notif.message}</p>
                        <p className="text-sm text-gray-500">{notif.time}</p>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            )}
          </Menu.Items>
        </Menu>

        <Link href="/profile">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white font-bold">
            FL
          </div>
        </Link>
      </div>
    </header>
  );
}
