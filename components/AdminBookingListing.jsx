'use client';
import { useEffect, useState } from "react";

export default function AdminBookingListing() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings/allBookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => console.error("Booking fetch error:", err));
  }, []);

  return (
    <div className="overflow-x-auto max-h-[400px]">
      <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg">
        <thead className="text-xs uppercase bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2 whitespace-nowrap">S.N</th>
            <th className="px-3 py-2 whitespace-nowrap">Futsal Name</th>
            <th className="px-3 py-2 whitespace-nowrap">Date</th>
            <th className="px-3 py-2 whitespace-nowrap">Time Slot</th>
            <th className="px-3 py-2 whitespace-nowrap">Total Cost</th>
            <th className="px-3 py-2 whitespace-nowrap">Status</th>
            <th className="px-3 py-2 whitespace-nowrap text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-xs">
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-3 text-gray-400">
                No bookings available
              </td>
            </tr>
          ) : (
            bookings.map((booking, index) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-3 py-2">{index + 1}</td>
                <td className="px-3 py-2">{booking.futsalName}</td>
                <td className="px-3 py-2">{new Date(booking.selectedDay).toLocaleDateString()}</td>
                <td className="px-3 py-2">{booking.selectedTimeSlot}</td>
                <td className="px-3 py-2">Rs. {booking.totalCost}</td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-200">
                    View
                  </button>
                  <button className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs hover:bg-yellow-200">
                    Edit
                  </button>
                  <button className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
