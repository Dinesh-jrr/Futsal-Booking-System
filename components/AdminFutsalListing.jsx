"use client";

import { baseUrl } from "@/lib/config";
import React, { useState, useEffect } from "react";

export default function FutsalListings() {
  const [futsals, setFutsals] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedFutsal, setSelectedFutsal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFutsals = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/getfutsals`);
        const data = await response.json();

        const cleanedData = Array.isArray(data.futsals)
          ? data.futsals
              .filter((f) => f.status?.toLowerCase() === "pending")
              .map((f, idx) => ({
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
    return !search || futsal.name.toLowerCase().includes(search.toLowerCase());
  });

  const paginatedFutsals = filteredFutsals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredFutsals.length / itemsPerPage);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/futsals/${id}/approve`, {
        method: "PUT",
      });
      if (res.ok) {
        setFutsals((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (e) {
      console.error("Approval failed", e);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/futsals/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Rejected by admin." }),
      });
      if (res.ok) {
        setFutsals((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (e) {
      console.error("Rejection failed", e);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        Loading futsals...
      </div>
    );
  }

  if (futsals.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        No pending futsals found.
      </div>
    );
  }

  return (
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center px-2 gap-3">
      <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-green-400 via-green-400 to-white">
          Futsal Management
        </h1>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
        />
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
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedFutsals.map((futsal) => (
              <tr key={futsal.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">{futsal.id}</td>
                <td className="px-3 py-2">{futsal.name}</td>
                <td className="px-3 py-2">{futsal.email}</td>
                <td className="px-3 py-2">{futsal.phone}</td>
                <td className="px-3 py-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </td>
                <td className="px-3 py-2 space-x-2 text-right">
                  <button
                    onClick={() => handleApprove(futsal.id)}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(futsal.id)}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 text-xs"
                  >
                    Reject
                  </button>
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
            disabled={page === 1}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
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