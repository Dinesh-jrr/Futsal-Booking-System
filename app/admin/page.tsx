'use client';
import Header from "@/components/Header";
import UsersTable from "@/components/UsersTable";
import FutsalListings from "@/components/AdminFutsalListing";
import Image from "next/image";

export default function Home() {
  const feedbacks = [
    { name: "Ramesh", comment: "Easy to use admin panel.", rating: 5 },
    { name: "Sunita", comment: "Needs more features, but works great.", rating: 4 },
  ];

  const adminsOnline = [
    { name: "Super Admin", online: true, profile: "/admin1.png" },
    { name: "Support", online: true, profile: "/admin2.png" },
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[2fr_0.6fr] gap-6">
      {/* Main Area */}
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-500">Total Players</h3>
              <p className="text-xl font-bold">350</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a2 2 0 114 0 2 2 0 01-4 0zm4 4H8a4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-500">Total Futsals</h3>
              <p className="text-xl font-bold">12</p>
            </div>
            <div className="text-green-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 3a3 3 0 016 0h1a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h1a3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-500">Total Bookings</h3>
              <p className="text-xl font-bold">87</p>
            </div>
            <div className="text-purple-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 8a2 2 0 11-4 0 2 2 0 014 0zm-4 8a2 2 0 11-4 0 2 2 0 014 0zM6 8a2 2 0 11-4 0 2 2 0 014 0zm-4 8a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Registered Players</h2>
          <UsersTable />
        </div>

        {/* Futsal Listings */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">All Futsal Listings</h2>
          <FutsalListings />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6 hidden lg:block">
        {/* Feedback */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-3">Feedback</h2>
          <div className="space-y-3">
            {feedbacks.map((fb, idx) => (
              <div key={idx} className="border p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">{fb.name}</span>
                  <span className="text-yellow-500 text-xs">{"⭐".repeat(fb.rating)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Chat */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-md font-semibold mb-3">Admins Online</h2>
          <ul className="space-y-3">
            {adminsOnline.map((admin, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Image src={admin.profile} alt={admin.name} width={30} height={30} className="rounded-full object-cover" />
                  <button className="text-blue-600 hover:underline text-sm">
                    {admin.name}
                  </button>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${admin.online ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {admin.online ? 'Online' : 'Offline'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
