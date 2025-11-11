import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useMockData } from '../hooks/useMockData.js';

export default function FinesPage({ onNavigate, setSelectedFine }) {
  const { data, loading, error, refetch } = useMockData('fines', {
    initialData: { fines: [] }
  });

  const fines = data?.fines ?? [];

  const handlePayFine = (fine) => {
    setSelectedFine(fine);
    onNavigate('payFine');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center items-start sm:space-x-4 space-y-2 sm:space-y-0">
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

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              Unable to load fines.
              <button onClick={refetch} className="ml-2 underline hover:text-red-800">
                Try again
              </button>
            </div>
          )}

          {loading && fines.length === 0 ? (
            <div className="text-center text-gray-600 py-6">Loading fines…</div>
          ) : (
            <div className="space-y-4">
              {fines.length === 0 ? (
                <p className="text-center text-gray-600">You have no fines 🎉</p>
              ) : (
                fines.map((fine) => (
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
                ))
              )}
            </div>
          )}
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
