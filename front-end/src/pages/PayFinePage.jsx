import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useMockData } from '../hooks/useMockData.js';

export default function PayFinePage({ onNavigate, selectedFine, setPaymentResult }) {
  const [paymentMethod, setPaymentMethod] = useState('campus');
  const { data, loading, error, refetch } = useMockData('profile', {
    initialData: { student: { name: '', email: '' } }
  });

  const billingDetails = data?.student ?? { name: '', email: '' };

  const handlePayment = () => {
    const result = {
      amount: selectedFine.amount,
      method: paymentMethod === 'campus' ? 'Campus Cash' : 'Card on file',
      receipt: `R-${Math.floor(Math.random() * 90000) + 10000}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      email: billingDetails.email
    };
    setPaymentResult(result);
    onNavigate('paymentSuccess');
  };

  if (!selectedFine) {
    onNavigate('fines');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center items-start sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              onClick={() => onNavigate('fines')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Pay Fine</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Selected Fine */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Selected fine</h3>
              <p className="text-gray-600 text-sm">
                {selectedFine.type} - {selectedFine.item} • Ref {selectedFine.ref}
              </p>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${selectedFine.amount.toFixed(2)}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Payment method</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <span className="text-lg text-gray-700">Campus Cash</span>
                <input
                  type="radio"
                  name="payment"
                  value="campus"
                  checked={paymentMethod === 'campus'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg text-gray-700">Card on file</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">•••• 1234</span>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Billing Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Billing details</h3>

          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">
              Unable to load your billing profile.
              <button onClick={refetch} className="ml-2 underline hover:text-red-800">
                Retry
              </button>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Name</span>
              <span className="text-gray-900">
                {loading && !billingDetails.name ? 'Loading…' : billingDetails.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Email</span>
              <span className="text-gray-900">
                {loading && !billingDetails.email ? 'Loading…' : billingDetails.email}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handlePayment}
          className="w-full py-4 bg-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-400 transition-colors shadow-sm"
        >
          Pay ${selectedFine.amount.toFixed(2)}
        </button>

        <button
          onClick={() => onNavigate('fines')}
          className="w-full py-4 bg-gray-200 text-gray-700 font-semibold text-lg rounded-xl hover:bg-gray-300 transition-colors"
        >
          Back to fines
        </button>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
