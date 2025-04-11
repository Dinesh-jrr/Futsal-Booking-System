"use client";
import React, { useEffect, useState } from "react";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/allUsers");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();

        const cleaned = Array.isArray(data)
          ? data.map((u, i) => ({
              id: u._id || i + 1,
              name: u.name || "-",
              email: u.email || "-",
              phone: u.phoneNumber || "-",
              role: u.role || "user",
              status: u.status || "pending",
              details: u,
            }))
          : [];

        setUsers(cleaned);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    return (
      (!search || user.name.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || user.status.toLowerCase() === statusFilter.toLowerCase())
    );
  });

  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) return <div className="p-6 text-center text-gray-500 text-sm">Loading users...</div>;
  if (error) return <div className="p-6 text-center text-red-500 text-sm">Error: {error}</div>;

  return (
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center px-2 gap-3">
      <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-green-400 via-green-400 to-white">
          Users Management
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
          <option value="declined">Declined</option>
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
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedUser(user.details)}
              >
                <td className="px-3 py-2">{user.id}</td>
                <td className="px-3 py-2">{user.name}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{user.phone}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      user.status.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-700"
                        : user.status.toLowerCase() === "declined"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[90vh] overflow-auto text-sm">
            <h2 className="text-md font-semibold mb-4">User Details</h2>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
              {JSON.stringify(selectedUser, null, 2)}
            </pre>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedUser(null)}
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
