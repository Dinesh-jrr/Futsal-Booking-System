"use client";
import { useState, useEffect } from "react";

export default function AdminUserListings() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "Player",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:5000/api/users/allUsers");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleUpdate = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleViewDetails = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id));
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong.");
    }
  };

  const handleAddUser = async () => {
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData),
    });

    if (response.ok) {
      const addedUser = await response.json();
      setUsers([...users, addedUser]);
      setShowModal(false);
      setNewUserData({ name: "", email: "", phoneNumber: "", role: "Player" });
    } else {
      alert("Error adding user. Please try again.");
    }
  };

  const handleNewUserChange = (e) => {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center px-2">
        <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-green-400 via-green-400 to-white">
          User Management
        </h1>
        <button
          onClick={() => {
            setCurrentUser(null);
            setShowModal(true);
          }}
          className="text-xs bg-primary text-black px-3 py-1.5 rounded hover:bg-primary hover:text-white transition"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">S.N</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user, index) => (
                <tr
                  key={user.id || user.email || index}
                  className="hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{user.name}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2">{user.phoneNumber}</td>
                  <td className="px-3 py-2">{user.role}</td>
                  <td className="px-3 py-2 space-x-2 text-right">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 text-xs"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleUpdate(user)}
                      className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 text-xs"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 text-xs"
                    >
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
            <h2 className="text-lg font-semibold mb-4">
              {currentUser ? "User Details" : "Add New User"}
            </h2>

            {currentUser ? (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {currentUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {currentUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {currentUser.phoneNumber}
                </p>
                <p>
                  <strong>Role:</strong> {currentUser.role}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={newUserData.name}
                  onChange={handleNewUserChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleNewUserChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={newUserData.phoneNumber}
                  onChange={handleNewUserChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <select
                  name="role"
                  value={newUserData.role}
                  onChange={handleNewUserChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="Player">Player</option>
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              {!currentUser && (
                <button
                  onClick={handleAddUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
