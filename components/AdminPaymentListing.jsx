import { useState } from "react";

const paymentsData = [
    { id: 1, transactionId: "TX12345", name: "John Doe", email: "john.doe@example.com", date: "2025-01-25", amount: 500, status: "Paid", method: "Direct Pay" },
    { id: 2, transactionId: "TX12346", name: "Jane Smith", email: "jane.smith@example.com", date: "2025-01-24", amount: 300, status: "Pending", method: "Split Payment" },
    { id: 3, transactionId: "TX12347", name: "Mark Johnson", email: "mark.johnson@example.com", date: "2025-01-23", amount: 700, status: "Paid", method: "Cash" },
    { id: 4, transactionId: "TX12348", name: "Dinesh Singh", email: "jrdinesh1@gmail.com", date: "2025-01-22", amount: 400, status: "Failed", method: "Cash" },
  ];
  

export default function AdminPaymentListings() {
  const [payments, setPayments] = useState(paymentsData);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);

  // Delete payment handler
  const handleDelete = (id) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  // Show update modal handler
  const handleUpdate = (payment) => {
    setCurrentPayment(payment);
    setShowModal(true);
  };

  // Handle save update
  const handleSaveUpdate = () => {
    setPayments(
      payments.map((payment) =>
        payment.id === currentPayment.id ? { ...payment, ...currentPayment } : payment
      )
    );
    setShowModal(false);
  };

  // View details handler
  const handleViewDetails = (payment) => {
    setCurrentPayment(payment);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-black mb-4 text-center shadow-lg p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Payments Management
        </h1>
      </div>
      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-black">Transaction ID</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Amount</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Method</th>
                <th className="border border-gray-300 px-4 py-2 text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-black">{payment.transactionId}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{payment.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{payment.email}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{payment.date}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">NPR {payment.amount}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 text-black ${
                      payment.status === "Paid"
                        ? "text-green-500"
                        : payment.status === "Pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {payment.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-black">{payment.method}</td>
                  <td className="border border-gray-300 px-4 py-2 text-black">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handleUpdate(payment)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && currentPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-black">Update Payment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Name</label>
                <input
                  type="text"
                  value={currentPayment.name}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Email</label>
                <input
                  type="email"
                  value={currentPayment.email}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Amount</label>
                <input
                  type="number"
                  value={currentPayment.amount}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, amount: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Status</label>
                <select
                  value={currentPayment.status}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
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
      {showDetailsModal && currentPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-black">Name: {currentPayment.name}</p>
              </div>
              <div>
                <p className="font-medium text-black">Email: {currentPayment.email}</p>
              </div>
              <div>
                <p className="font-medium text-black">Amount: NPR {currentPayment.amount}</p>
              </div>
              <div>
                <p className="font-medium text-black">Status: {currentPayment.status}</p>
              </div>
              <div>
                <p className="font-medium text-black">Method: {currentPayment.method}</p>
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
