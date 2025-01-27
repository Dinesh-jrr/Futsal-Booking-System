"use client"

import React, { useState } from "react";

export default function FutsalListings() {
  const [futsals, setFutsals] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "9861524192", status: "Pending" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "9861524192", status: "Approved" },
    { id: 3, name: "Mark Johnson", email: "mark.johnson@example.com", phone: "9861524192", status: "Declined" },
    { id: 4, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 5, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 6, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 7, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 8, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 9, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 10, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 11, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 12, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 13, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 14, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
    { id: 15, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "Pending" },
  ]);

  // Handle Status Updates
  const handleStatusChange = (id, status) => {
    setFutsals((prev) =>
      prev.map((futsal) => (futsal.id === id ? { ...futsal, status } : futsal))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center shadow-lg p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Futsal Management
      </h1>

      <div className="overflow-x-auto">
        {/* Make the table body scrollable with max-height */}
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {futsals.map((futsal) => (
                <tr key={futsal.id} className="odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-black">{futsal.id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{futsal.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{futsal.email}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{futsal.phone}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        futsal.status === "Pending"
                          ? "bg-yellow-500"
                          : futsal.status === "Approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {futsal.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleStatusChange(futsal.id, "Approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(futsal.id, "Declined")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        View More
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
