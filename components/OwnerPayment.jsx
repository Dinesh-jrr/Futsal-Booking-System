'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function OwnerPaymentListings() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`http://localhost:5000/api/payment/owner/${session.user.id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (err) {
        console.error("Failed to fetch owner payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [session]);

  const filtered = payments.filter((p) =>
    p.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-4 text-sm">
      <div className="mb-4 flex justify-between items-center px-2 gap-3">
        <h1 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 shadow-sm bg-gradient-to-r from-purple-400 to-pink-400">
          My Futsal Payments
        </h1>
        <input
          type="text"
          placeholder="Search by user name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm font-semibold text-gray-700 border border-purple-400 rounded-md px-3 py-1 shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-center text-black">Loading payments...</p>
      ) : (
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Transaction ID</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Amount (NPR)</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-3 text-gray-400">
                    No payments found
                  </td>
                </tr>
              ) : (
                paginated.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 text-black">
                    <td className="px-3 py-2">{payment.transactionUuid}</td>
                    <td className="px-3 py-2">{payment.user?.name || "N/A"}</td>
                    <td className="px-3 py-2">{payment.user?.email || "N/A"}</td>
                    <td className="px-3 py-2">NPR {payment.amount}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        payment.status === 'Complete'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{payment.paymentGateway}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => setCurrentPayment(payment) || setShowModal(true)}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center text-xs mt-4">
        <span className="text-gray-600">Page {page} of {totalPages}</span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="text-sm font-semibold text-gray-700 border border-purple-400 rounded-md px-3 py-1 shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="text-sm font-semibold text-gray-700 border border-purple-400 rounded-md px-3 py-1 shadow-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && currentPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg text-sm">
            <h2 className="text-md font-semibold mb-4 text-black">Payment Details</h2>
            <div className="space-y-2 text-black">
              <p><strong>Name:</strong> {currentPayment.user?.name}</p>
              <p><strong>Email:</strong> {currentPayment.user?.email}</p>
              <p><strong>Amount:</strong> NPR {currentPayment.amount}</p>
              <p><strong>Status:</strong> {currentPayment.status}</p>
              <p><strong>Method:</strong> {currentPayment.paymentGateway}</p>
              <p><strong>Transaction ID:</strong> {currentPayment.transactionUuid}</p>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowModal(false)}
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
