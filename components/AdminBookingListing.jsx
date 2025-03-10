'use client';
import { useState, useEffect } from "react";

export default function AdminFutsalListings() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newBooking, setNewBooking] = useState({
    futsalName: "",
    selectedDay: "",
    selectedTimeSlot: "",
    totalCost: 0,
    advancePayment: 0,
    userId: "",
    status: "pending",
  });
  const [error, setError] = useState(null); // For error handling


  // Fetch bookings from the backend API
const fetchBookings = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/bookings/allBookings");
    const data = await response.json();

    // Ensure the response contains the bookings array
    if (data && Array.isArray(data.bookings)) {
      setBookings(data.bookings);  // Use data.bookings to set the state
    } else {
      console.error("Expected an array in the 'bookings' property but got:", data);
    }
  } catch (error) {
    setError("Error fetching bookings: " + error.message);
    console.error("Error fetching bookings:", error);
  }
};

  // Initial fetch of bookings when component mounts
  useEffect(() => {
    fetchBookings(); // Fetch bookings when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Delete booking handler
  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (error) {
      setError("Error deleting booking: " + error.message);
      console.error("Error deleting booking:", error);
    }
  };

  // Show update modal handler
  const handleUpdate = (booking) => {
    setCurrentBooking(booking);
    setShowModal(true);
  };

  // Handle save update and optimize state update
  const handleSaveUpdate = async () => {
    try {
      const response = await fetch(`${apiUrl}/${currentBooking._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentBooking),
      });
      const updatedBooking = await response.json();

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );
      setShowModal(false); // Close modal after saving
    } catch (error) {
      setError("Error updating booking: " + error.message);
      console.error("Error updating booking:", error);
    }
  };

  // Add new booking handler
  const handleAddBooking = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      const addedBooking = await response.json();
      setBookings([...bookings, addedBooking]); // Add the new booking to the state
      setNewBooking({
        futsalName: "",
        selectedDay: "",
        selectedTimeSlot: "",
        totalCost: 0,
        advancePayment: 0,
        status: "pending",
      }); // Clear the form
    } catch (error) {
      setError("Error adding booking: " + error.message);
      console.error("Error adding booking:", error);
    }
  };

  // View details handler
  const handleViewDetails = (booking) => {
    setCurrentBooking(booking);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center shadow-lg p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Bookings Management
        </h1>
        <button
          onClick={() => setShowModal(true)} // Show the Add Booking form
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Booking
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        {/* Make the table body scrollable with max-height */}
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-black">S.N</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Futsal Name</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Time Slot</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Total Cost</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No bookings available
                  </td>
                </tr>
              ) : (
                bookings.map((booking,index) => (
                  <tr key={booking._id} className="hover:bg-gray-100">
                     <td className="border border-gray-300 px-4 py-2 text-black">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{booking.futsalName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{new Date(booking.selectedDay).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{booking.selectedTimeSlot}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{booking.totalCost}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{booking.status}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      <button
                        onClick={() => handleUpdate(booking)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2 text-black"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2 text-black"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-black"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Booking</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Futsal Name</label>
                <input
                  type="text"
                  value={newBooking.futsalName}
                  onChange={(e) => setNewBooking({ ...newBooking, futsalName: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Date</label>
                <input
                  type="date"
                  value={newBooking.selectedDay}
                  onChange={(e) => setNewBooking({ ...newBooking, selectedDay: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Time Slot</label>
                <input
                  type="text"
                  value={newBooking.selectedTimeSlot}
                  onChange={(e) => setNewBooking({ ...newBooking, selectedTimeSlot: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Total Cost</label>
                <input
                  type="number"
                  value={newBooking.totalCost}
                  onChange={(e) => setNewBooking({ ...newBooking, totalCost: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Advance Payment</label>
                <input
                  type="number"
                  value={newBooking.advancePayment}
                  onChange={(e) => setNewBooking({ ...newBooking, advancePayment: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Status</label>
                <select
                  value={newBooking.status}
                  onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4 text-black">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBooking}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && currentBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-black">Futsal Name: {currentBooking.futsalName}</p>
              </div>
              <div>
                <p className="font-medium text-black">Date: {new Date(currentBooking.selectedDay).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium text-black">Time Slot: {currentBooking.selectedTimeSlot}</p>
              </div>
              <div>
                <p className="font-medium text-black">Total Cost: {currentBooking.totalCost}</p>
              </div>
              <div>
                <p className="font-medium text-black">Status: {currentBooking.status}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
