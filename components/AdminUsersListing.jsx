'use client';
import { useState, useEffect } from "react";

export default function AdminUserListings() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'Pending',
  });

  useEffect(() => {
    // Fetch initial users data from backend
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:5000/api/users/allUsers");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // Delete user handler
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'DELETE',
    });
    setUsers(users.filter((user) => user.id !== id));
  };

  // Show update modal handler
  const handleUpdate = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  // Handle save update
  const handleSaveUpdate = async () => {
    await fetch(`http://localhost:5000/api/bookings/${currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentUser),
    });

    setUsers(users.map((user) =>
      user.id === currentUser.id ? { ...user, ...currentUser } : user
    ));
    setShowModal(false);
  };

  // Add user handler
  const handleAddUser = async () => {
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUserData),
    });

    if (response.ok) {
      const addedUser = await response.json();
      setUsers([...users, addedUser]);  // Add the new user to the list
      setShowModal(false);  // Close the modal after adding
      setNewUserData({
        name: '',
        email: '',
        phoneNumber: '',
        role: 'Pending',  // Reset the form after adding
      });
    } else {
      alert("Error adding user. Please try again.");
    }
  };

  // Handle form change for new user
  const handleNewUserChange = (e) => {
    setNewUserData({
      ...newUserData,
      [e.target.name]: e.target.value,
    });
  };

  // View user details handler
  const handleViewDetails = (user) => {
    setCurrentUser(user);  // Set the current user to be viewed in the modal
    setShowModal(true);  // Show modal with user details
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center shadow-lg p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-black">
          User Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-black"
        >
          Add User
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-black">Serial No</th>
            <th className="border border-gray-300 px-4 py-2 text-black">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-black">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-black">Phone</th>
            <th className="border border-gray-300 px-4 py-2 text-black">Role</th>
            <th className="border border-gray-300 px-4 py-2 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-100 text-black">
              <td className="border border-gray-300 px-4 py-2 text-black">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2 text-black">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-black">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2 text-black">{user.phoneNumber}</td>
              <td className="border border-gray-300 px-4 py-2 text-black">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2 text-black">
                <button
                  onClick={() => handleUpdate(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleViewDetails(user)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-black">
              {currentUser ? "User Details" : "Add New User"}
            </h2>

            {currentUser ? (
              <div className="space-y-4">
                <div>
                  <p><strong>Name:</strong> {currentUser.name}</p>
                </div>
                <div>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                </div>
                <div>
                  <p><strong>Phone:</strong> {currentUser.phoneNumber}</p>
                </div>
                <div>
                  <p><strong>Role:</strong> {currentUser.role}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newUserData.name}
                    onChange={handleNewUserChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewUserChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Phone</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={newUserData.phoneNumber}
                    onChange={handleNewUserChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Status</label>
                  <select
                    name="status"
                    value={newUserData.status}
                    onChange={handleNewUserChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4 text-black">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-black"
              >
                Cancel
              </button>
              {!currentUser && (
                <button
                  onClick={handleAddUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-black"
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
