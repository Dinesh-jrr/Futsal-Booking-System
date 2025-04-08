'use client'
import Header from "@/components/Header";
import UsersTable from "@/components/UsersTable";
import AdminBookingListing from "@/components/AdminBookingListing";
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Total Players</h3>
              <p className="text-xl font-bold">350</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a2 2 0 114 0 2 2 0 01-4 0zm4 4H8a4 4 0 018 0z" clipRule="evenodd" /></svg>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            {/* <div>
              <h3 className="text-sm text-gray-500">Total Futsals</h3>
              <p className="text-xl font-bold">3</p>
            </div> */}
            <div className="text-green-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" /></svg>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Total Bookings</h3>
              <p className="text-xl font-bold">87</p>
            </div>
            <div className="text-purple-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a1 1 0 00-1 1v1h12V4a1 1 0 00-1-1H5zm11 4H4v9a1 1 0 001 1h10a1 1 0 001-1V7z" /></svg>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Total Revenue</h3>
              <p className="text-xl font-bold">Rs. 150,000</p>
            </div>
            <div className="text-yellow-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11 17a1 1 0 01-1-1V5a1 1 0 112 0v11a1 1 0 01-1 1z" /></svg>
            </div>
          </div>
        </div>

        {/* Booking Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <AdminBookingListing />
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
