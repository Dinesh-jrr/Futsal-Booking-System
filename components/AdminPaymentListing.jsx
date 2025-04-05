import { useState, useEffect } from "react";

export default function AdminPaymentListings() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://192.168.1.5:5000/api/payment/getAllPayments");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPayments(data.payments); // ✅ correct key name
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payment) => {
    setCurrentPayment(payment);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-center mb-4 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-lg shadow">
        Payments Management
      </h1>

      {loading ? (
        <p className="text-center text-black">Loading payments...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Transaction ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Amount (NPR)</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Method</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-100 text-black">
                  <td className="px-4 py-2 border">{payment.transactionUuid}</td>
                  <td className="px-4 py-2 border">{payment.user?.name || "N/A"}</td>
                  <td className="px-4 py-2 border">{payment.user?.email || "N/A"}</td>
                  <td className="px-4 py-2 border">NPR {payment.amount}</td>
                  <td
                    className={`px-4 py-2 border ${
                      payment.status === "Complete"
                        ? "text-green-500"
                        : payment.status === "Pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {payment.status}
                  </td>
                  <td className="px-4 py-2 border">{payment.paymentGateway}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleViewDetails(payment)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Details Modal */}
      {showDetailsModal && currentPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-black">Payment Details</h2>
            <div className="space-y-2 text-black">
              <p><strong>Name:</strong> {currentPayment.user?.name}</p>
              <p><strong>Email:</strong> {currentPayment.user?.email}</p>
              <p><strong>Amount:</strong> NPR {currentPayment.amount}</p>
              <p><strong>Status:</strong> {currentPayment.status}</p>
              <p><strong>Method:</strong> {currentPayment.paymentGateway}</p>
              <p><strong>Transaction ID:</strong> {currentPayment.transactionUuid}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
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
