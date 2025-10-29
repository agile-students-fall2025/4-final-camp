import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function FinesPage({ onNavigate, setSelectedFine }) {
  const [fines, setFines] = useState([
    {
      id: 1,
      type: 'Overdue',
      item: 'Audio Recorder',
      amount: 5.00,
      dueDate: 'Oct 10',
      status: 'Unpaid',
      ref: 'F-2084'
    },
    {
      id: 2,
      type: 'Damage',
      item: 'Tripod',
      amount: 12.00,
      assessed: 'Oct 11',
      status: 'Unpaid',
      ref: 'F-3091'
    },
    {
      id: 3,
      type: 'Late',
      item: 'Microphone',
      amount: 0.00,
      paid: 'Oct 01',
      receipt: 'R-1012',
      status: 'Paid'
    }
  ]);

  const handlePayFine = (fine) => {
    setSelectedFine(fine);
    onNavigate('payFine');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Fines</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Fines Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fines</h2>

          <div className="space-y-4">
            {fines.map((fine) => (
              <div
                key={fine.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {fine.type} - {fine.item}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {fine.dueDate && `Due date: ${fine.dueDate}`}
                      {fine.assessed && `Assessed: ${fine.assessed}`}
                      {fine.paid && `Paid: ${fine.paid}`}
                      {' • '}
                      {fine.status === 'Paid' ? (
                        <span>Receipt {fine.receipt}</span>
                      ) : (
                        <span>Status: {fine.status}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${fine.amount.toFixed(2)}
                  </div>
                </div>

                {fine.status === 'Unpaid' && (
                  <button
                    onClick={() => handlePayFine(fine)}
                    className="w-full mt-3 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Pay this fine
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* View Payment History Button */}
        <button
          onClick={() => onNavigate('paymentHistory')}
          className="w-full py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
        >
          View payment history
        </button>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
