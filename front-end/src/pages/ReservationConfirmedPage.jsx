import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ReservationConfirmedPage({ onNavigate, reservationData }) {
  if (!reservationData) {
    onNavigate('filter');
    return null;
  }

  const handleCancelReservation = () => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      alert('Reservation cancelled successfully.');
      onNavigate('home');
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Reservation Confirmation</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Reservation Confirmed
          </h2>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <p className="text-xl font-bold text-gray-900 mb-2">
              Success 🎉
            </p>
            <p className="text-gray-600 mb-4">
              Reservation #{reservationData.number}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Item</span>
                <span className="text-gray-900 font-bold">{reservationData.item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Facility</span>
                <span className="text-gray-900 font-bold">{reservationData.facility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Pickup</span>
                <span className="text-gray-900 font-bold">
                  {reservationData.date}, {reservationData.time}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Bring Student ID • Check email for QR
            </p>
          </div>

          <div className="flex space-x-4 text-[#57068C]">
            <button className="text-sm hover:underline">Add to calendar</button>
            <button className="text-sm hover:underline">Directions</button>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={() => onNavigate('borrowals')}
          className="w-full py-4 bg-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-400 transition-colors shadow-sm"
        >
          My Borrowals
        </button>

        <button
          onClick={handleCancelReservation}
          className="w-full py-4 bg-gray-200 text-gray-700 font-semibold text-lg rounded-xl hover:bg-gray-300 transition-colors"
        >
          Cancel Reservation
        </button>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
