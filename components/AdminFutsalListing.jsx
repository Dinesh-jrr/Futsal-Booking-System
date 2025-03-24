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

  const apiUrl = "http://localhost:5000/api/futsals"; // API URL for futsals

  // Fetch futsals from the backend API
  const fetchFutsals = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setFutsals(data.futsals); // Assuming 'futsals' is the array of futsal objects
    } catch (error) {
      console.error("Error fetching futsals:", error);
    }
  };

  // Initial fetch of futsals when component mounts
  useEffect(() => {
    fetchFutsals();
  }, []);

  // Add new futsal handler
  const handleAddFutsal = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFutsal),
      });

      const addedFutsal = await response.json();
      setFutsals([...futsals, addedFutsal]); // Add the new futsal to the state
      setNewFutsal({
        futsalName: "",
        location: "",
        ownerId: "",
        pricePerHour: 0,
        availableTimeSlots: [],
        contactNumber: "",
        images: [],
      }); // Clear the form
    } catch (error) {
      console.error("Error adding futsal:", error);
    }
  };

  // Show update modal handler
  const handleUpdate = (futsal) => {
    setCurrentFutsal(futsal);
    setShowModal(true);
  };

  // View details handler
  const handleViewDetails = (futsal) => {
    setCurrentFutsal(futsal);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center shadow-lg p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Futsal Management
        </h1>
        <button
          onClick={() => setShowModal(true)} // Show the Add Futsal form
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Futsal
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-black">S.N</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Location</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Price Per Hour</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Available Time Slots</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {futsals.map((futsal,index) => (
                <tr key={futsal._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-black">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{futsal.futsalName}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{futsal.location}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{futsal.pricePerHour}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{futsal.availableTimeSlots.join(", ")}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    <button
                      onClick={() => handleUpdate(futsal)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleViewDetails(futsal)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Futsal Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Futsal</h2>
            <div className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-medium text-black">Name</label>
                <input
                  type="text"
                  value={newFutsal.futsalName}
                  onChange={(e) => setNewFutsal({ ...newFutsal, futsalName: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Location</label>
                <input
                  type="text"
                  value={newFutsal.location}
                  onChange={(e) => setNewFutsal({ ...newFutsal, location: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Price Per Hour</label>
                <input
                  type="number"
                  value={newFutsal.pricePerHour}
                  onChange={(e) => setNewFutsal({ ...newFutsal, pricePerHour: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Available Time Slots</label>
                <input
                  type="text"
                  value={newFutsal.availableTimeSlots.join(", ")}
                  onChange={(e) => setNewFutsal({ ...newFutsal, availableTimeSlots: e.target.value.split(",") })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Contact Number</label>
                <input
                  type="text"
                  value={newFutsal.contactNumber}
                  onChange={(e) => setNewFutsal({ ...newFutsal, contactNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Images</label>
                <input
                  type="text"
                  value={newFutsal.images.join(", ")}
                  onChange={(e) => setNewFutsal({ ...newFutsal, images: e.target.value.split(",") })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFutsal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Futsal Details Modal */}
      {showDetailsModal && currentFutsal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{currentFutsal.futsalName} Details</h2>
            <div className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-medium text-black">Location</label>
                <p>{currentFutsal.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Price Per Hour</label>
                <p>{currentFutsal.pricePerHour}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Available Time Slots</label>
                <p>{currentFutsal.availableTimeSlots.join(", ")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Contact Number</label>
                <p>{currentFutsal.contactNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Images</label>
                <p>{currentFutsal.images.join(", ")}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end text-black">
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
