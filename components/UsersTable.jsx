"use client";
import React, { useState, useEffect } from "react";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/allUsers");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = (id, status) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status } : user))
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto max-h-[400px]">
      <div className="mb-4 flex justify-between items-center px-2">
  <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
    Futsal Management
  </h1>
  <button
    onClick={() => setShowModal(true)}
    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition"
  >
    Add Futsal
  </button>
</div>

      <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg">
        <thead className="text-xs uppercase bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2">S.N</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Phone</th>
            <th className="px-3 py-2">Role</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-xs">
          {users.map((user, index) => (
            <tr key={user.id || index} className="hover:bg-gray-50">
              <td className="px-3 py-2">{index + 1}</td>
              <td className="px-3 py-2">{user.name}</td>
              <td className="px-3 py-2">{user.email}</td>
              <td className="px-3 py-2">{user.phoneNumber}</td>
              <td className="px-3 py-2">{user.role}</td>
              <td className="px-3 py-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    user.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : user.status === 'Declined'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-3 py-2 text-right space-x-2">
                <button
                  onClick={() => handleStatusChange(user.id, "Approved")}
                  className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(user.id, "Declined")}
                  className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                >
                  Decline
                </button>
                <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200">
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
