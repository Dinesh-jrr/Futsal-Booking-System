'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';

export default function BookingListForOwner() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'slots', or 'today'

  // Fetch bookings for the owner
  const fetchBookings = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/owner/${session.user.id}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      toast.error('❌ Failed to fetch bookings');
      console.error('Failed to fetch owner bookings:', err);
    } finally {
      setLoading(false);
    }
  };

 // Fetch user details for each player involved in today's bookings
const fetchUserDetails = async (userId) => {
  // Check if the user details already exist in the state
  if (userDetails[userId]) {
    return; // If the user details are already available, do nothing
  }

  try {
    const res = await fetch(`http://localhost:5000/api/users/${userId}`);
    const data = await res.json();
    setUserDetails((prevDetails) => ({ ...prevDetails, [userId]: data.user }));
  } catch (err) {
    toast.error('❌ Failed to fetch user details');
    console.error('Error fetching user details:', err);
  }
};

   // Handle date change
   const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    fetchAvailableSlots(date);
  };
  const fetchAvailableSlots = (date) => {
    const bookedSlots = bookedSlotsByDate[date] || [];
    const available = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableSlots(available);
  };
  // Get today's date at 00:00:00 in local time
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

// Get the end of today (23:59:59.999) in local time
const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

// Filter bookings for today
const todayBookings = bookings.filter((booking) => {
  const selectedDay = new Date(booking.selectedDay); // Convert the selectedDay to a Date object
  return selectedDay >= todayStart && selectedDay <= todayEnd;
});

// Log filtered todayBookings
console.log('Filtered todayBookings:', todayBookings);

  console.log('Filtered todayBookings:', todayBookings);
   // Function to approve booking
   const approveBooking = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {
        method: 'PUT',
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || '✅ Booking approved!');
      } else {
        toast.error(data.message || '⚠️ Could not approve booking');
      }

      setSelectedBooking(null); // Clear selected booking

      // Fetch updated bookings
      const updatedRes = await fetch(`http://localhost:5000/api/bookings/owner/${session.user.id}`);
      const updatedData = await updatedRes.json();
      setBookings(updatedData.bookings || []); // Update bookings list

    } catch (err) {
      console.error('Failed to approve booking:', err);
      toast.error('❌ Error approving booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [session]);

  useEffect(() => {
    // Fetch user details for all players involved in today's bookings
    bookings.forEach((booking) => {
      if (booking.userId && !userDetails[booking.userId]) {
        fetchUserDetails(booking.userId);
      }
    });
  }, [bookings, userDetails]);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const todaysBookings = bookings.filter(
    (b) => b.selectedDay && new Date(b.selectedDay).toDateString() === new Date().toDateString()
  );

  if (loading) return <p className="text-center py-10">Loading bookings...</p>;

  return (
    <div className="max-w-4xl mx-auto p-0 m-0">
      <div className="mb-4 flex justify-center gap-2">
        {['pending', 'slots', 'today'].map(tab => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm',
              activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            )}
          >
            {tab === 'pending' && '🕒 Pending Bookings'}
            {tab === 'slots' && '📅 Available Slots'}
            {tab === 'today' && '🔔 Today\'s Bookings'}
          </Button>
        ))}
      </div>

     {/* ======== PENDING BOOKINGS ======== */}
{activeTab === 'pending' && (
  <div className="grid gap-4">
    {pendingBookings.length === 0 ? (
      <p className="text-center py-6 text-black">No pending bookings.</p>
    ) : (
      pendingBookings.map((booking) => {
        const player = userDetails[booking.userId];
        console.log(player);

        return (
          <Card
            key={booking._id}
            className="shadow-md border-l-4 border-yellow-500 bg-white hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center gap-4">
                {player?.profileImage ? (
                  <img
                    src={player.profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    ?
                  </div>
                )}

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-green-800">
                    {player?.name || '👤 Player'}
                  </h3>
                  <p className="text-sm text-gray-600">📧 {player?.email || 'No email available'}</p>
                  <p className="text-sm text-gray-600">📞 {player?.phoneNumber || 'No phone number'}</p>
                  <p className="text-sm text-gray-600">
                    📅 {booking.date} | 🕒 {booking.timeSlot}
                  </p>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                <Button
                  onClick={() => approveBooking(booking._id, 'approved')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  ✅ Approve
                </Button>
                <Button
                  onClick={() => updateStatus(booking._id, 'rejected')}
                  variant="destructive"
                >
                  ❌ Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })
    )}
  </div>
)}


{activeTab === 'slots' && (
  <div className="mt-8">
    <div className="flex justify-center">
  <div className="relative w-48">
    {/* Date Input */}
    <input
      type="date"
      value={selectedDate}
      onChange={handleDateChange}
      className="w-full border-2 border-green-600 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none text-black"
      id="date-input"
    />

    {/* Calendar Icon */}
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </div>
  </div>
    </div>

    <div className="space-y-4">
      <h4 className="text-md font-semibold mb-2 text-black">All Available Slots</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {["6-7 AM", "7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM", "11-12 AM", "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM","4-5 PM","5-6 PM","6-7 PM","7-8 PM","8-9 PM"].map((slot, index) => (
          <div
            key={index}
            className="bg-white border-2 border-green-600 hover:bg-green-50 p-2 rounded-lg shadow-md transition-colors"
          >
            <h5 className="text-black text-lg font-semibold text-center">{slot}</h5>
          </div>
        ))}
      </div>
    </div>
  </div>
)}



{/* ======== TODAY'S BOOKINGS ======== */}
{activeTab === 'today' && (
      <div className="grid gap-4">
        {/* Log the bookings being filtered */}
        {console.log('All Bookings:', bookings)}

        {/* Check if no bookings are found */}
        {todayBookings.length === 0 ? (
          <p className="text-center py-6 text-black">No approved or rejected bookings for today.</p>
        ) : (
          todayBookings.map((booking) => {
            // Log each booking and player data
            console.log('Booking:', booking);

            const player = userDetails[booking.userId]; // Get user details for the current booking
            console.log('Player:', player);  // Log the player object

            // Fetch user details if not available
            if (!player) {
              console.log(`Fetching user details for userId: ${booking.userId}`);
              fetchUserDetails(booking.userId);
              return (
                <Card key={booking._id} className="shadow-md border-l-4 border-gray-500">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">{booking.futsalName}</h3>
                    <p className="text-sm">🕒 {booking.selectedTimeSlot}</p>
                    <p className="text-sm">Loading user details...</p>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card
                key={booking._id}
                className={`shadow-md border-l-4 ${
                  booking.status === 'approved' ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{booking.futsalName}</h3>
                  <p className="text-sm">🕒 {booking.selectedTimeSlot}</p>
                  
                  {/* User details */}
                  {player ? (
                    <>
                      <p className="text-sm">👤 {player.name}</p>
                      <p className="text-sm">📧 {player.email}</p>
                      <p className="text-sm">📞 {player.phoneNumber}</p>
                    </>
                  ) : (
                    <p className="text-sm">Loading user details...</p> // Fallback while user details are being fetched
                  )}

                  <Badge
                    variant="secondary"
                    className={clsx(
                      'px-2 py-1 rounded',
                      booking.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}
                  >
                    {booking.status.toUpperCase()}
                  </Badge>

                  {(booking.status === 'approved' || booking.status === 'confirmed') && (
  <div className="pt-2">
    <button
      onClick={() =>
        (window.location.href = `/messages?userId=${booking.userId}`)
      }
      className="mt-2 text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
    >
      💬 Send Message
    </button>
  </div>
)}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    )}

    </div>
  );
}
