// app/profile/page.tsx
'use client';
import { User } from 'lucide-react';

const user = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  role: 'Player',
  joined: 'Jan 2024',
};

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <User className="text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border space-y-3">
        <div>
          <p className="text-gray-600 font-medium">Name</p>
          <p className="text-gray-900">{user.name}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Email</p>
          <p className="text-gray-900">{user.email}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Role</p>
          <p className="text-gray-900">{user.role}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Member Since</p>
          <p className="text-gray-900">{user.joined}</p>
        </div>
      </div>
    </div>
  );
}
