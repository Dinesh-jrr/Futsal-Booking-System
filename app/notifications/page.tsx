// app/notifications/page.tsx
'use client';
import { useState } from 'react';
import { Bell } from 'lucide-react';

const mockNotifications = [
  { id: 1, message: 'Your booking for Futsal Arena is confirmed.', time: '5 mins ago' },
  { id: 2, message: 'Opponent found for your match request!', time: '30 mins ago' },
  { id: 3, message: 'Your payment was successful.', time: '1 hour ago' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-4 bg-gray-100 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-200 transition"
            >
              <p className="text-gray-800">{notif.message}</p>
              <p className="text-sm text-gray-500">{notif.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
