import React, { useState } from 'react';
import { ChevronLeft, Clock, MapPin } from 'lucide-react';

export default function MyBorrowalsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('current');

  const currentBorrowals = [
    { id: 1, name: 'Canon EOS R5', dueDate: 'Oct 15, 2:00 PM', location: 'Arts Centre', status: 'Active' },
    { id: 2, name: 'MacBook Pro 16"', dueDate: 'Oct 16, 4:00 PM', location: 'IM Lab', status: 'Active' },
    { id: 3, name: 'Tripod', dueDate: 'Oct 18, 1:00 PM', location: 'Library', status: 'Active' },
  ];

  const upcomingBorrowals = [
    { id: 4, name: 'Audio Recorder', pickupDate: 'Oct 20, 10:00 AM', location: 'IM Lab', status: 'Reserved' },
    { id: 5, name: 'Lighting Kit', pickupDate: 'Oct 22, 2:00 PM', location: 'Media Center', status: 'Reserved' },
  ];

  const historyBorrowals = [
    { id: 6, name: 'DSLR Camera', returnDate: 'Oct 01, 2025', location: 'IM Lab', status: 'Returned' },
    { id: 7, name: 'Microphone', returnDate: 'Sep 28, 2025', location: 'Library', status: 'Returned' },
    { id: 8, name: 'Power Drill', returnDate: 'Sep 25, 2025', location: 'IM Lab', status: 'Returned' },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">My Borrowals</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex space-x-2">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'current'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            History
          </button>
        </div>

        {/* Current Borrowals */}
        {activeTab === 'current' && (
          <div className="space-y-3">
            {currentBorrowals.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Due: {item.dueDate}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    {item.status}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    Extend
                  </button>
                  <button className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                    Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Borrowals */}
        {activeTab === 'upcoming' && (
          <div className="space-y-3">
            {upcomingBorrowals.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Pickup: {item.pickupDate}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {item.status}
                  </span>
                </div>
                <button className="w-full py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
                  Cancel Reservation
                </button>
              </div>
            ))}
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {historyBorrowals.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Returned: {item.returnDate}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
