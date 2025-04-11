"use client";

import React, { useState, useEffect } from "react";


export default function FutsalListings() {
  const [futsals, setFutsals] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedFutsal, setSelectedFutsal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFutsals = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getfutsals");
        const data = await response.json();

        const cleanedData = Array.isArray(data.futsals)
  ? data.futsals.map((f, idx) => ({
      id: f._id || idx + 1,
      name: f.futsalName || "-",
      email: f.ownerEmail || "-",
      phone: f.contactNumber || "-",
      status: f.status || "pending",
      details: f,
    }))
  : [];


        setFutsals(cleanedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch futsals:", error);
        setIsLoading(false);
      }
    };

    fetchFutsals();
  }, []);

  const filteredFutsals = futsals.filter((futsal) => {
    return (
      (!search || futsal.name.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || futsal.status.toLowerCase() === statusFilter.toLowerCase())
    );
  });

  const paginatedFutsals = filteredFutsals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredFutsals.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        Loading futsals...
      </div>
    );
  }

  return (
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center px-2 gap-3">
      <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-green-400 via-green-400 to-white">
          Futsals Management
        </h1>
        <input
          type="text"
          placeholder="Search by name"
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
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedFutsals.map((futsal) => (
              <tr
                key={futsal.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedFutsal(futsal.details)}
              >
                <td className="px-3 py-2">{futsal.id}</td>
                <td className="px-3 py-2">{futsal.name}</td>
                <td className="px-3 py-2">{futsal.email}</td>
                <td className="px-3 py-2">{futsal.phone}</td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      futsal.status.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-700"
                        : futsal.status.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {futsal.status.charAt(0).toUpperCase() + futsal.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
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

      {selectedFutsal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[90vh] overflow-auto text-sm">
            <h2 className="text-md font-semibold mb-4">Futsal Details</h2>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
              {JSON.stringify(selectedFutsal, null, 2)}
            </pre>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedFutsal(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
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
