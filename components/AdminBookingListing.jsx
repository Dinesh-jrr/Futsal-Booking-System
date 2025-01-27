import { useState } from "react";

const usersData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "9861524192", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "9861524192", status: "cancelled" },
  { id: 3, name: "Mark Johnson", email: "mark.johnson@example.com", phone: "9861524192", status: "completed" },
  { id: 4, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "active" },
  { id: 5, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "active" },
  { id: 6, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "active" },
  { id: 7, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "active" },
  { id: 8, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "active" },
  { id: 9, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "active" },
  { id: 10, name: "Dinesh Singh", email: "jrdinesh1@gmail.com", phone: "9861524192", status: "active" },
];

export default function AdminBookingListings() {
  const [users, setUsers] = useState(usersData);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Delete user handler
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Show update modal handler
  const handleUpdate = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  // Handle save update
  const handleSaveUpdate = () => {
    setUsers(
      users.map((user) =>
        user.id === currentUser.id ? { ...user, ...currentUser } : user
      )
    );
    setShowModal(false);
  };

  // Add user handler (example)
  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: "New User",
      email: "new.user@example.com",
      phone: "1234567890",
      status: "active",
    };
    setUsers([...users, newUser]);
  };

  // View details handler
  const handleViewDetails = (user) => {
    setCurrentUser(user);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center shadow-lg p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Bookings Management
        </h1>
        {/* <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button> */}
      </div>
      <div className="overflow-x-auto">
        {/* Make the table body scrollable with max-height */}
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-black">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.phone}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{user.status}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    {/* <button
                      onClick={() => handleUpdate(user)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Update
                    </button> */}
                    {/* <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                    >
                      Delete
                    </button> */}
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
        </div>
      </div>

      {/* Update Modal */}
      {showModal && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-black">Update User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Phone</label>
                <input
                  type="text"
                  value={currentUser.phone}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Status</label>
                <select
                  value={currentUser.status}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="Approved">Completed</option>
                  <option value="Declined">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-black">Name: {currentUser.name}</p>
              </div>
              <div>
                <p className="font-medium text-black">Email: {currentUser.email}</p>
              </div>
              <div>
                <p className="font-medium text-black">Phone: {currentUser.phone}</p>
              </div>
              <div>
                <p className="font-medium text-black">Status: {currentUser.status}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
