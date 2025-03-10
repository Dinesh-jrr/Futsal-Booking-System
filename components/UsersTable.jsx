"use client";
import React, { useState, useEffect } from "react";

export default function UsersTable() {
  const [users, setUsers] = useState([]); // To hold user data fetched from the backend
  const [loading, setLoading] = useState(true); // To show loading state while data is being fetched
  const [error, setError] = useState(null); // To handle any errors that may occur during the fetch

  // Fetch users data from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/allUsers"); // Fetch data from the API
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data); // Update state with the fetched data
      } catch (error) {
        setError(error.message); // Set error if something goes wrong
      } finally {
        setLoading(false); // Stop loading after the fetch completes
      }
    };

    fetchUsers(); // Call the function to fetch users
  }, []); // Empty dependency array ensures it only runs once when the component mounts

  // Handle Status Updates
  const handleStatusChange = (id, status) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status } : user))
    );
  };

  // Show loading or error state
  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there's an error
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center shadow-lg p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        User Management
      </h1>

      <div className="overflow-x-auto">
        {/* Apply scrollable wrapper around the table */}
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">S.N</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Role</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-black">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            {/* Scrollable table body */}
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-black">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.phoneNumber}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.role}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.status}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleStatusChange(user.id, "Approved")}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.id, "Declined")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Decline
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
