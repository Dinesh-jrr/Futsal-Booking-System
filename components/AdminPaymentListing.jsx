"use client";
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
      setPayments(data.payments);
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
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center px-2">
        <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Payments Management
        </h1>
      </div>

      {loading ? (
        <p className="text-center text-black">Loading payments...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">Transaction ID</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Amount (NPR)</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Method</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 text-black">
                    <td className="px-3 py-2">{payment.transactionUuid}</td>
                    <td className="px-3 py-2">{payment.user?.name || "N/A"}</td>
                    <td className="px-3 py-2">{payment.user?.email || "N/A"}</td>
                    <td className="px-3 py-2">NPR {payment.amount}</td>
                    <td
                      className={`px-3 py-2 font-medium ${
                        payment.status === "Complete"
                          ? "text-green-500"
                          : payment.status === "Pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {payment.status}
                    </td>
                    <td className="px-3 py-2">{payment.paymentGateway}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 text-xs"
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
      )}

      {showDetailsModal && currentPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg text-sm">
            <h2 className="text-lg font-semibold mb-4 text-black">Payment Details</h2>
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
