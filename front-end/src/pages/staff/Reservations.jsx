import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const Reservations = ({ onNavigate }) => {
  const [viewFilter, setViewFilter] = useState('today');

  const reservations = [
    {
      id: 1,
      item: 'DSLR Camera',
      time: '2:30 PM',
      student: 'Akash M.',
      location: 'IM Lab',
      status: 'pending'
    },
    {
      id: 2,
      item: 'Tripod',
      time: '3:00 PM',
      student: 'Leah S.',
      location: 'Library',
      status: 'ready'
    },
    {
      id: 3,
      item: 'Audio Recorder',
      time: '4:15 PM',
      student: 'Mike T.',
      location: 'Media Center',
      status: 'pending'
    },
    {
      id: 4,
      item: 'Lighting Kit',
      time: '5:00 PM',
      student: 'Emma W.',
      location: 'IM Lab',
      status: 'ready'
    },
    {
      id: 5,
      item: 'Microphone Stand',
      time: '5:30 PM',
      student: 'David K.',
      location: 'Media Center',
      status: 'pending'
    }
  ];

  const handleMarkPrepared = (id) => {
    alert(`Reservation ${id} marked as prepared`);
  };

  const handleFastCheckout = (id) => {
    alert(`Fast checkout for reservation ${id}`);
    onNavigate('checkout');
  };

  const handleNoShow = (id) => {
    alert(`Reservation ${id} marked as no-show`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setViewFilter('today')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              viewFilter === 'today'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setViewFilter('upcoming')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              viewFilter === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setViewFilter('past')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              viewFilter === 'past'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Past
          </button>
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {reservation.item} – {reservation.time}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {reservation.student}
                  </p>
                  <p className="text-sm text-gray-500">
                    Pickup at {reservation.location} • Status: {reservation.status === 'pending' ? 'Pending' : 'Ready'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {reservation.status === 'pending' && (
                  <button
                    onClick={() => handleMarkPrepared(reservation.id)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Mark Prepared
                  </button>
                )}
                <button
                  onClick={() => handleFastCheckout(reservation.id)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Fast Checkout
                </button>
                {reservation.status === 'ready' && (
                  <button
                    onClick={() => handleNoShow(reservation.id)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    No Show
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full mt-6 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Reservations;
