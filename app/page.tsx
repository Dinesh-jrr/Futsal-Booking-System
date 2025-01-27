import Header from "@/components/Header";
import UsersTable from "@/components/UsersTable";
import FutsalListings from "@/components/FutsalListings";

export default function Home() {
  return (
    <div className="p-8">
      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Players */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Total Players</h3>
            <p className="text-3xl font-bold">350</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.075 8.075a3 3 0 114.24 4.24A7.992 7.992 0 0110 13a7.992 7.992 0 01-.825-3.685 3 3 0 01-4.24-4.24zM10 16a6 6 0 10-6-6 6 6 0 006 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Futsals */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Total Futsals</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 3a3 3 0 016 0h1a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h1a3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Bookings */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Total Bookings</h3>
            <p className="text-3xl font-bold">87</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 8a2 2 0 11-4 0 2 2 0 014 0zm-4 8a2 2 0 11-4 0 2 2 0 014 0zM6 8a2 2 0 11-4 0 2 2 0 014 0zm-4 8a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tables Below */}
      <UsersTable />
      <FutsalListings />
    </div>
  );
}
