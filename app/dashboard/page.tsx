'use client'

import Header from "@/components/Header";
import UsersTable from "@/components/UsersTable";
import OwnerBookingListing from "@/components/OwnerBookings";
import Image from "next/image";

export default function Home() {
  const feedbacks = [
    { name: "Anil", comment: "Great futsal! Friendly staff.", rating: 5 },
    { name: "Sita", comment: "Nice turf, but toilets could be cleaner.", rating: 3 },
    { name: "Raju", comment: "Well maintained and spacious.", rating: 4 },
  ];

  const chatUsers = [
    { name: "Anil", online: true, profile: "/profile1.png" },
    { name: "Sita", online: false, profile: "/profile2.png" },
    { name: "Raju", online: true, profile: "/profile3.png" },
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[2fr_0.8fr] gap-6">
      {/* Main Content */}
      <div className="space-y-6">
        {/* Section Heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mb-4">Overview of bookings and revenue.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition duration-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Total Bookings</h3>
              <p className="text-2xl font-bold text-gray-800">87</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full text-purple-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a1 1 0 00-1 1v1h12V4a1 1 0 00-1-1H5zm11 4H4v9a1 1 0 001 1h10a1 1 0 001-1V7z" /></svg>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition duration-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-800">Rs. 150,000</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11 17a1 1 0 01-1-1V5a1 1 0 112 0v11a1 1 0 01-1 1z" /></svg>
            </div>
          </div>
        </div>

        {/* Booking Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <OwnerBookingListing />
        </div>
      </div>

      {/* Right Panel */}
      <div className="space-y-6 hidden lg:block">
        {/* Customer Feedback */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-3">Customer Feedback</h2>
          <div className="space-y-3">
            {feedbacks.map((fb, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-800">{fb.name}</span>
                  <span className="text-yellow-500 text-xs">{"⭐".repeat(fb.rating)}</span>
                </div>
                <p className="text-sm text-gray-600">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-3">Players Online</h2>
          <ul className="space-y-3">
            {chatUsers.map((user, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Image src={user.profile} alt={user.name} width={30} height={30} className="rounded-full object-cover" />
                  <button className="text-blue-600 hover:underline text-sm">
                    {user.name}
                  </button>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.online ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {user.online ? 'Online' : 'Offline'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
