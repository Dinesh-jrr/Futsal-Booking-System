"use client";

import React, { useState, useEffect } from "react";

export default function FutsalListings() {
  const [futsals, setFutsals] = useState([]);

  useEffect(() => {
    const fetchFutsals = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/futsals/allFutsals");
        const data = await response.json();

        // Ensure all required fields exist
        const cleanedData = (Array.isArray(data) ? data : []).map((f, idx) => ({
          id: f.id || idx + 1,
          name: f.name || "-",
          email: f.email || "-",
          phone: f.phone || "-",
          status: f.status || "Pending",
        }));

        setFutsals(cleanedData);
      } catch (error) {
        console.error("Failed to fetch futsals:", error);
      }
    };

    fetchFutsals();
  }, []);

  return (
    <div className="overflow-x-auto max-h-[400px]">
      <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg">
        <thead className="text-xs uppercase bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Phone</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y text-xs">
          {futsals.map((futsal) => (
            <tr key={futsal.id} className="hover:bg-gray-50">
              <td className="px-3 py-2">{futsal.id}</td>
              <td className="px-3 py-2">{futsal.name}</td>
              <td className="px-3 py-2">{futsal.email}</td>
              <td className="px-3 py-2">{futsal.phone}</td>
              <td className="px-3 py-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    futsal.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : futsal.status === 'Declined'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {futsal.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
