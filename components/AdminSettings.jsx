'use client';

import { useState } from 'react';
import { UploadButton } from '@uploadthing/react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    profileImage: '',
    appName: 'Footlock', // Default app name
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [activeTab, setActiveTab] = useState('Profile Settings');
  const [isImageUploading, setIsImageUploading] = useState(false);

  const tabs = ['Profile Settings', 'Password'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect API to update profile
    toast.success('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New password and confirm password do not match');
      return;
    }
    // TODO: Connect API to update password
    toast.success('Password updated successfully!');
  };

  const handleDeleteImage = () => {
    setForm((prev) => ({ ...prev, profileImage: '' }));
    toast.success('Profile image removed');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs */}
      <div className="flex justify-center space-x-6 border-b border-gray-200 bg-white shadow-sm px-6 py-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-8">

          {activeTab === 'Profile Settings' && (
            <form className="space-y-8" onSubmit={handleProfileSubmit}>
              {/* Profile Image */}
              <div className="flex items-center gap-6">
                <Image
                  src={form.profileImage || '/default-avatar.png'}
                  alt="Profile"
                  width={90}
                  height={90}
                  className="rounded-full object-cover border"
                />
                <div className="space-x-2">
                  <UploadButton
                    endpoint="profileImageUploader"
                    appearance={{
                      button: `bg-primary text-white rounded-md px-4 py-2 ${isImageUploading ? 'opacity-50' : ''}`,
                      allowedContent: 'text-sm text-gray-500',
                    }}
                    onUploadBegin={() => setIsImageUploading(true)}
                    onClientUploadComplete={(res) => {
                      setIsImageUploading(false);
                      const url = res?.[0]?.url;
                      if (url) {
                        setForm((prev) => ({ ...prev, profileImage: url }));
                        toast.success('Profile image uploaded!');
                      }
                    }}
                    onUploadError={(error) => {
                      setIsImageUploading(false);
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm"
                  >
                    Delete Avatar
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">App Name</label>
                  <input
                    name="appName"
                    value={form.appName}
                    disabled
                    className="w-full mt-1 px-3 py-2 border rounded bg-gray-100 text-gray-500"
                  />
                </div>
              </div>

              <div className="text-right">
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'Password' && (
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>

              <div className="text-right">
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700">
                  Update Password
                </button>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
