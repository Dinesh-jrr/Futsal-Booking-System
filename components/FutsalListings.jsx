"use client"

import React, { useState } from "react";

export default function FutsalListings() {
  const [futsals, setFutsals] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "9861524192", status: "Pending" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "9861524192", status: "Approved" },
    { id: 3, name: "Mark Johnson", email: "mark.johnson@example.com", phone: "9861524192", status: "Declined" },
    { id: 4, name: "Emma Brown", email: "emma.brown@example.com", phone: "9861524192", status: "Pending" },
    { id: 5, name: "Emma Brown", email: "emma.brown@example.com", phone: "9861524192", status: "Pending" },
    { id: 6, name: "Emma Brown", email: "emma.brown@example.com", phone: "9861524192", status: "Pending" },
    { id: 7, name: "Emma Brown", email: "emma.brown@example.com", phone: "9861524192", status: "Pending" },
  ]);

  // Handle Status Updates
  const handleStatusChange = (id, status) => {
    setFutsals((prev) =>
      prev.map((futsal) => (futsal.id === id ? { ...futsal, status } : futsal))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Futsal Listing</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {futsals.map((futsal) => (
              <tr key={futsal.id} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-left">{futsal.id}</td>
                <td className="border border-gray-300 px-4 py-2 text-left">{futsal.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-left">{futsal.email}</td>
                <td className="border border-gray-300 px-4 py-2 text-left">{futsal.phone}</td>
                <td className="border border-gray-300 px-4 py-2 text-left">
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
  );
}
