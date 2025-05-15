'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { baseUrl } from '@/lib/config';

interface Notification {
  id: number;
  message: string;
  time: string;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      try {
        const response = await fetch(`${baseUrl}/api/notification/notifications/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data: Notification[] = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [userId]);

  return (
    <div className="relative p-6">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center gap-2 focus:outline-none">
            <Bell className="text-green-500" />
            <span className="text-2xl font-bold text-gray-800">Notifications</span>
          </Menu.Button>
        </div>
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
                      className={`p-4 ${
                        active ? 'bg-gray-100' : 'bg-white'
                      } border-b border-gray-200 last:border-none`}
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
    </div>
  );
}
