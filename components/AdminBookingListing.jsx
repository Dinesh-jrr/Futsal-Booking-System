'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminBookingListing() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const role = session?.user?.role;
        const endpoint =
          role === 'admin'
            ? 'http://localhost:5000/api/bookings/allBookings'
            : `http://localhost:5000/api/bookings/owner/${session.user.id}`;

        const res = await fetch(endpoint);
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error('Booking fetch error:', err);
      }
    };

    if (session?.user) fetchBookings();
  }, [session]);

  const filteredBookings = bookings.filter((b) => {
    const nameMatch = b.futsalName?.toLowerCase().includes(search.toLowerCase());
    const statusMatch = !statusFilter || b.status?.toLowerCase() === statusFilter.toLowerCase();
    return nameMatch && statusMatch;
  });

  const paginatedBookings = filteredBookings.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center px-2 gap-3">
        <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-green-400 via-green-400 to-white">
          Bookings Management
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
              <th className="px-3 py-2">Futsal</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Cost</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-3 text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              paginatedBookings.map((b, i) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{(page - 1) * itemsPerPage + i + 1}</td>
                  <td className="px-3 py-2">{b.futsalName}</td>
                  <td className="px-3 py-2">{new Date(b.selectedDay).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{b.selectedTimeSlot}</td>
                  <td className="px-3 py-2">Rs. {b.totalCost}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        b.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    {b.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(b._id, 'confirmed')}
                          className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                          className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setEditMode(false);
                          setForm(b);
                        }}
                        className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-200"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-xs mt-4">
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="text-sm font-semibold text-gray-700 border border-green-400 rounded-md px-3 py-1 shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="text-sm font-semibold text-gray-700 border border-green-400 rounded-md px-3 py-1 shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
