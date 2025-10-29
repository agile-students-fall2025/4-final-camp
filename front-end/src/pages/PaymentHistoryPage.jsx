import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function PaymentHistoryPage({ onNavigate }) {
  const paymentHistory = [
    {
      id: 1,
      receipt: 'R-58231',
      amount: 5.00,
      date: 'Oct 13, 2025',
      method: 'Campus Cash'
    },
    {
      id: 2,
      receipt: 'R-1012',
      amount: 3.00,
      date: 'Oct 01, 2025',
      method: 'Campus Cash'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('fines')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Payment History List */}
        <div className="space-y-3">
          {paymentHistory.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{payment.receipt}</h3>
                <span className="text-xl font-bold text-gray-900">
                  ${payment.amount.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600">
                {payment.date} - {payment.method}
              </p>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('fines')}
          className="w-full py-4 bg-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-400 transition-colors shadow-sm"
        >
          Back to Fines
        </button>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
