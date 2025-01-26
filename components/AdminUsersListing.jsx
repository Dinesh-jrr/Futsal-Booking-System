import { useState } from "react";

const usersData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "9861524192", status: "Pending" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "9861524192", status: "Approved" },
  { id: 3, name: "Mark Johnson", email: "mark.johnson@example.com", phone: "9861524192", status: "Declined" },
  { id: 4, name: "Emma Brown", email: "emma.brown@example.com", phone: "9861524192", status: "Pending" },
];

export default function AdminUserListings() {
  const [users, setUsers] = useState(usersData);
  const [showModal, setShowModal] = useState(false);
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
      status: "Pending",
    };
    setUsers([...users, newUser]);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">User Listings</h1>
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>
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
              <td className="border border-gray-300 px-4 py-2 text-left">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{user.phone}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{user.status}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">
                <button
                  onClick={() => handleUpdate(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      {showModal && currentUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Update User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
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
                <label className="block text-sm font-medium">Email</label>
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
                <label className="block text-sm font-medium">Phone</label>
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
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={currentUser.status}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
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
    </div>
  );
}
