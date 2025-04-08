'use client';
import { useState, useEffect } from "react";

export default function AdminFutsalListings() {
  const [futsals, setFutsals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentFutsal, setCurrentFutsal] = useState(null);
  const [newFutsal, setNewFutsal] = useState({
    futsalName: "",
    location: "",
    ownerId: "",
    pricePerHour: 0,
    availableTimeSlots: [],
    contactNumber: "",
    images: [],
  });

  const apiUrl = "http://localhost:5000/api/futsals";

  const fetchFutsals = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setFutsals(data.futsals);
    } catch (error) {
      console.error("Error fetching futsals:", error);
    }
  };

  useEffect(() => {
    fetchFutsals();
  }, []);

  const handleAddFutsal = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFutsal),
      });
      const addedFutsal = await response.json();
      setFutsals([...futsals, addedFutsal]);
      setNewFutsal({
        futsalName: "",
        location: "",
        ownerId: "",
        pricePerHour: 0,
        availableTimeSlots: [],
        contactNumber: "",
        images: [],
      });
    } catch (error) {
      console.error("Error adding futsal:", error);
    }
  };

  const handleUpdate = (futsal) => {
    setCurrentFutsal(futsal);
    setShowModal(true);
  };

  const handleViewDetails = (futsal) => {
    setCurrentFutsal(futsal);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 text-center shadow p-3 rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Futsal Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Futsal
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">S.N</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Price/Hour</th>
                <th className="px-3 py-2">Time Slots</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {futsals.map((futsal, index) => (
                <tr key={futsal._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{futsal.futsalName}</td>
                  <td className="px-3 py-2">{futsal.location}</td>
                  <td className="px-3 py-2">{futsal.pricePerHour}</td>
                  <td className="px-3 py-2">{futsal.availableTimeSlots.join(", ")}</td>
                  <td className="px-3 py-2 space-x-2 text-right">
                    <button onClick={() => handleUpdate(futsal)} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 text-xs">
                      Update
                    </button>
                    <button onClick={() => handleViewDetails(futsal)} className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 text-xs">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg text-sm">
            <h2 className="text-lg font-semibold mb-4">Add New Futsal</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Futsal Name" value={newFutsal.futsalName} onChange={(e) => setNewFutsal({ ...newFutsal, futsalName: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Location" value={newFutsal.location} onChange={(e) => setNewFutsal({ ...newFutsal, location: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="number" placeholder="Price Per Hour" value={newFutsal.pricePerHour} onChange={(e) => setNewFutsal({ ...newFutsal, pricePerHour: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Available Time Slots (comma-separated)" value={newFutsal.availableTimeSlots.join(", ")} onChange={(e) => setNewFutsal({ ...newFutsal, availableTimeSlots: e.target.value.split(",") })} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Contact Number" value={newFutsal.contactNumber} onChange={(e) => setNewFutsal({ ...newFutsal, contactNumber: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Images (comma-separated)" value={newFutsal.images.join(", ")} onChange={(e) => setNewFutsal({ ...newFutsal, images: e.target.value.split(",") })} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleAddFutsal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && currentFutsal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg text-sm">
            <h2 className="text-lg font-semibold mb-4">{currentFutsal.futsalName} Details</h2>
            <div className="space-y-2">
              <p><strong>Location:</strong> {currentFutsal.location}</p>
              <p><strong>Price/Hour:</strong> {currentFutsal.pricePerHour}</p>
              <p><strong>Time Slots:</strong> {currentFutsal.availableTimeSlots.join(", ")}</p>
              <p><strong>Contact:</strong> {currentFutsal.contactNumber}</p>
              <p><strong>Images:</strong> {currentFutsal.images.join(", ")}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowDetailsModal(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
