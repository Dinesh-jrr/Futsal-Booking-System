'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { baseUrl } from '@/lib/config';

export default function OwnerBookingPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userDetails, setUserDetails] = useState({}); // State to store user details

  useEffect(() => {
    // toast("🔥 Dashboard test toast");
    const fetchBookings = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`http://localhost:5000/api/bookings/owner/${session.user.id}`);
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        toast.error('❌ Failed to fetch bookings');
        console.error('Failed to fetch owner bookings:', err);
      }
    };

    fetchBookings();
  }, [session]);

  // Function to fetch user details
  const fetchUserDetails = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`);
      const data = await res.json();
      setUserDetails(prevState => ({
        ...prevState,
        [userId]: data.user || {}
      }));
    } catch (err) {
      console.error('Failed to fetch user details:', err);
    }
  };

  useEffect(() => {
    // Fetch user details for all users in the bookings list
    bookings.forEach((booking) => {
      if (!userDetails[booking.userId]) {
        fetchUserDetails(booking.userId);
      }
    });
  }, [bookings]);

  const filtered = bookings.filter((b) => {
    const nameMatch = b.futsalName?.toLowerCase().includes(search.toLowerCase());
    const statusMatch = !statusFilter || b.status?.toLowerCase() === statusFilter.toLowerCase();
    return nameMatch && statusMatch;
  });

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const approveBooking = async (bookingId) => {
    try {
      const res = await fetch(`${baseUrl}/api/bookings/${bookingId}/approve`, {
        method: 'PUT',
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || '✅ Booking approved!');
      } else {
        toast.error(data.message || '⚠️ Could not approve booking');
      }

      setSelectedBooking(null);

      const updatedRes = await fetch(`${baseUrl}/api/bookings/owner/${session.user.id}`);
      const updatedData = await updatedRes.json();
      setBookings(updatedData.bookings || []);
    } catch (err) {
      console.error('Failed to approve booking:', err);
      toast.error('❌ Error approving booking');
    }
  };

  const declineBooking = async (bookingId) => {
    try {
      const res = await fetch(`${baseUrl}/api/bookings/${bookingId}/decline`, {
        method: 'PUT',
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || '❌ Booking declined!');
      } else {
        toast.error(data.message || '⚠️ Could not decline booking');
      }

      setSelectedBooking(null);

      const updatedRes = await fetch(`${baseUrl}/api/bookings/owner/${session.user.id}`);
      const updatedData = await updatedRes.json();
      setBookings(updatedData.bookings || []);
    } catch (err) {
      console.error('Failed to decline booking:', err);
      toast.error('❌ Error declining booking');
    }
  };

  return (
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center px-2 gap-3">
        <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-green-400 via-green-400 to-white">
          My Futsal Bookings
        </h1>
        <input
          type="text"
          placeholder="Search by futsal name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm font-semibold text-gray-700 border border-green-400 rounded-md px-3 py-1 shadow-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm font-semibold text-gray-700 border border-green-400 rounded-md px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">S.N</th>
              <th className="px-3 py-2">Player</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Cost</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-3 text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              paginated.map((b, i) => (
                <tr key={b._id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-3 py-2">{(page - 1) * itemsPerPage + i + 1}</td>
                  <td className="px-3 py-2">
                    {userDetails[b.userId] ? userDetails[b.userId].name : 'Loading...'}
                  </td>
                  <td className="px-3 py-2">{new Date(b.selectedDay).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{b.selectedTimeSlot}</td>
                  <td className="px-3 py-2">Rs. {b.advancePayment}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${b.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right space-x-2 text-black">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-200 text-black"
                    >
                      View
                    </button>
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveBooking(b._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineBooking(b._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <div className="mt-4 p-4 border rounded-md shadow-lg">
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <div className="mt-2">
            <p><strong>Player:</strong> {userDetails[selectedBooking.userId] ? userDetails[selectedBooking.userId].name : 'Loading...'} </p>
            <p><strong>Futsal:</strong> {selectedBooking.futsalName}</p>
            <p><strong>Date:</strong> {new Date(selectedBooking.selectedDay).toLocaleDateString()}</p>
            <p><strong>Time Slot:</strong> {selectedBooking.selectedTimeSlot}</p>
            <p><strong>Advance Payment:</strong> Rs. {selectedBooking.advancePayment}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}
