"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { baseUrl } from "@/lib/config";
import { toast } from "react-hot-toast";

export default function ManualBookingModal({
  open,
  onClose,
  slot,
  date,
  futsalId,
  futsalName,
}) {
  const [playerEmail, setPlayerEmail] = useState("");
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // 🔍 Auto-suggest emails while typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (playerEmail.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `${baseUrl}/api/users/search-email?query=${playerEmail}`
        );
        const data = await res.json();
        if (res.ok) {
          setSuggestions(data.users || []);
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [playerEmail]);

  const handleSelectEmail = (email) => {
    setPlayerEmail(email);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!playerEmail || !payment) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const resUser = await fetch(`${baseUrl}/api/users/email/${playerEmail}`);
      const dataUser = await resUser.json();
      if (!resUser.ok || !dataUser.user?._id) {
        toast.error("User not found.");
        return;
      }

      const userId = dataUser.user._id;

      const resBooking = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          futsalId,
          futsalName,
          userId,
          selectedDay: new Date(date),
          selectedTimeSlot: slot,
          totalCost: 1000,
          advancePayment: payment,
          status: "pending",
        }),
      });

      const dataBooking = await resBooking.json();
      if (resBooking.ok) {
        toast.success("Booking created!");
        onClose();
      } else {
        toast.error(dataBooking.message || "Failed to create booking.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white p-6 rounded-md shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-2 text-black">
            📆 Book Slot: {slot}
          </Dialog.Title>
          <p className="mb-4 text-sm text-black">Date: {date}</p>

          <div className="relative mb-3">
            <input
              type="email"
              placeholder="Search Player Email"
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              className="border p-2 rounded w-full text-black"
            />

            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto text-black">
                {suggestions.map((user) => (
                  <li
                    key={user._id}
                    className="px-3 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleSelectEmail(user.email)}
                  >
                    <div className="font-medium text-black">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="number"
            placeholder="Advance Payment (Cash)"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="border p-2 rounded w-full mb-4 text-black"
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
