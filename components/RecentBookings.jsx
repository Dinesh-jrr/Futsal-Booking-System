"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { baseUrl } from "@/lib/config";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import ManualBookingModal from "@/components/ManualBookingModal";

export default function BookingListForOwner() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [futsalId, setFutsalId] = useState("");
  const [futsalName, setFutsalName] = useState("");
  const router = useRouter();
  const allTimeSlots = [
    "6 - 7 AM",
    "7 - 8 AM",
    "8 - 9 AM",
    "9 - 10 AM",
    "10 - 11 AM",
    "11 - 12 AM",
    "12 - 1 PM",
    "1 - 2 PM",
    "2 - 3 PM",
    "3 - 4 PM",
    "4 - 5 PM",
    "5 - 6 PM",
    "6 - 7 PM",
    "7 - 8 PM",
    "8 - 9 PM",
  ];

  // Fetch bookings for the owner
  const fetchBookings = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(
        `${baseUrl}/api/bookings/owner/${session.user.id}`
      );
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      toast.error("❌ Failed to fetch bookings");
      console.error("Failed to fetch owner bookings:", err);
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
      const res = await fetch(`${baseUrl}/api/users/${userId}`);
      const data = await res.json();
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [userId]: data.user,
      }));
    } catch (err) {
      toast.error("❌ Failed to fetch user details");
      console.error("Error fetching user details:", err);
    }
  };

  // Handle date change
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    fetchAvailableSlots(date);
  };
  const fetchAvailableSlots = async (date) => {
  if (!date || !session?.user?.id) return;

  try {
    // 1. Get the futsal for this owner
    const futsalRes = await fetch(
      `${baseUrl}/api/by-owner?ownerId=${session.user.id}`
    );
    const futsalData = await futsalRes.json();

    if (!futsalRes.ok || !futsalData.futsal?._id) {
      toast.error("❌ Could not find futsal for owner");
      return;
    }

    const futsalId = futsalData.futsal._id;
    setFutsalId(futsalId);
    setFutsalName(futsalData.futsal.futsalName); // If you need the name

    const formattedDate = new Date(date).toISOString().split("T")[0];

    // 2. Fetch booked slots
    const slotsRes = await fetch(
      `${baseUrl}/api/bookedslots/${futsalId}/${formattedDate}`
    );
    const slotsData = await slotsRes.json();

    if (!slotsRes.ok) {
      toast.error("❌ Failed to load booked slots");
      return;
    }

    const booked = slotsData.bookedSlots || [];
    console.log("📦 Booked slots from server:", booked);

    // 3. Store booked slots
    setBookedSlots(booked);
  } catch (error) {
    console.error("Error in fetchAvailableSlots:", error);
    toast.error("❌ Something went wrong while fetching slots");
  }
};

  // Function to approve booking
  const approveBooking = async (bookingId) => {
    try {
      const res = await fetch(`${baseUrl}/api/bookings/${bookingId}/approve`, {
        method: "PUT",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "✅ Booking approved!");
      } else {
        toast.error(data.message || "⚠️ Could not approve booking");
      }

      setSelectedBooking(null); // Clear selected booking

      // Fetch updated bookings
      const updatedRes = await fetch(
        `${baseUrl}/api/bookings/owner/${session.user.id}`
      );
      const updatedData = await updatedRes.json();
      setBookings(updatedData.bookings || []); // Update bookings list
    } catch (err) {
      console.error("Failed to approve booking:", err);
      toast.error("❌ Error approving booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [session]);

  useEffect(() => {
    const today = new Date();
    const isoDate = today.toISOString().split("T")[0];
    setSelectedDate(isoDate);
    fetchAvailableSlots(isoDate); // <--- Make sure this is here
  }, []);

  useEffect(() => {
    if (session?.user?.id && selectedDate && activeTab === "slots") {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, session?.user?.id, activeTab]);

  useEffect(() => {
    // Fetch user details for all players involved in today's bookings
    bookings.forEach((booking) => {
      if (booking.userId && !userDetails[booking.userId]) {
        fetchUserDetails(booking.userId);
      }
    });
  }, [bookings, userDetails]);

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  const isSameLocalDate = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const todaysBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!b.selectedDay) return false;

      const bookingDate = new Date(b.selectedDay);
      const today = new Date();

      const match = isSameLocalDate(bookingDate, today); // compare in local timezone
      const valid = b.status === "approved" || b.status === "confirmed";

      console.log("→", b.selectedDay, "| Match:", match, "| Status OK:", valid);

      return match && valid;
    });
  }, [bookings]);

  if (loading) return <p className="text-center py-10">Loading bookings...</p>;

  return (
    <div className="max-w-4xl mx-auto p-0 m-0">
      <div className="mb-4 flex justify-center gap-2">
        {["pending", "slots", "today"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm",
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            )}
          >
            {tab === "pending" && "🕒 Pending Bookings"}
            {tab === "slots" && "📅 Available Slots"}
            {tab === "today" && "🔔 Today's Bookings"}
          </Button>
        ))}
      </div>

      {/* ======== PENDING BOOKINGS ======== */}
      {activeTab === "pending" && (
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
                          {player?.name || "👤 Player"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          📧 {player?.email || "No email available"}
                        </p>
                        <p className="text-sm text-gray-600">
                          📞 {player?.phoneNumber || "No phone number"}
                        </p>
                        <p className="text-sm text-gray-600">
                          📅 {booking.date} | 🕒 {booking.timeSlot}
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-300"
                        >
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button
                        onClick={() => approveBooking(booking._id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        ✅ Approve
                      </Button>
                      <Button
                        onClick={() => updateStatus(booking._id, "rejected")}
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
      {/* Available slots */}

      {activeTab === "slots" && (
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
            <h4 className="text-md font-semibold mb-2 text-black">
              All Available Slots
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allTimeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={clsx(
                    "p-2 rounded-lg shadow-md text-center font-semibold transition-colors",
                    bookedSlots.includes(slot)
                      ? "bg-red-200 text-gray-600 border border-red-400 cursor-not-allowed"
                      : "bg-white border-2 border-green-600 hover:bg-green-50"
                  )}
                  onClick={() => {
    if (!bookedSlots.includes(slot)) {
      setSelectedSlot(slot);
      setModalOpen(true);
    }
  }}
                >
                  <h5 className="text-black text-lg font-semibold text-center">
                    {slot}
                  </h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {modalOpen && (
  <ManualBookingModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    slot={selectedSlot}
    date={selectedDate}
    futsalId={futsalId}          // Pass this from fetched futsal data
    futsalName={futsalName}      // Same
  />
)}

      {/* ======== TODAY'S BOOKINGS ======== */}
      {activeTab === "today" && (
        <div className="grid gap-4">
          {todaysBookings.length === 0 ? (
            <p className="text-center py-6 text-black">
              No approved or confirmed bookings for today.
            </p>
          ) : (
            todaysBookings.map((booking) => {
              const player = userDetails[booking.userId];

              if (!player) {
                fetchUserDetails(booking.userId);
                return (
                  <Card
                    key={booking._id}
                    className="shadow-md border-l-4 border-gray-500"
                  >
                    <CardContent className="p-4 space-y-2">
                      <h3 className="text-lg font-semibold">
                        {booking.futsalName}
                      </h3>
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
                    booking.status === "approved"
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                >
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">
                      {booking.futsalName}
                    </h3>
                    <p className="text-sm">🕒 {booking.selectedTimeSlot}</p>

                    <>
                      <p className="text-sm">👤 {player.name}</p>
                      <p className="text-sm">📧 {player.email}</p>
                      <p className="text-sm">📞 {player.phoneNumber}</p>
                    </>

                    <Badge
                      variant="secondary"
                      className={clsx(
                        "px-2 py-1 rounded",
                        booking.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {booking.status.toUpperCase()}
                    </Badge>

                    {(booking.status === "approved" ||
                      booking.status === "confirmed") && (
                      <div className="pt-2">
                        <Button
                          onClick={() =>
                            router.push(
                              `/dashboard/messages?userId=${booking.userId}`
                            )
                          }
                          className="mt-2 text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
                        >
                          💬 Send Message
                        </Button>
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
