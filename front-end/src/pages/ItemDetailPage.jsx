import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ItemDetailPage({ onNavigate, selectedItem, setWaitlistData }) {
  if (!selectedItem) {
    onNavigate('filter');
    return null;
  }

  const facilityName = selectedItem.facility && typeof selectedItem.facility === 'object'
    ? selectedItem.facility.name
    : selectedItem.facility;

  // Normalize availability status regardless of backend field naming
  const rawStatus = selectedItem.status || selectedItem.availability || '';
  const normalizedStatus = typeof rawStatus === 'string' ? rawStatus.toLowerCase() : '';
  
  // Check quantity-based availability
  const totalQuantity = selectedItem.quantity ?? 1;
  const availableQuantity = selectedItem.availableQuantity ?? (normalizedStatus === 'available' ? 1 : 0);
  const isAvailable = availableQuantity > 0;

  const handleReserve = () => {
    onNavigate('reserveDateTime');
  };

  const handleJoinWaitlist = () => {
    const waitlistNumber = `W-${Math.floor(Math.random() * 9000) + 1000}`;
    const waitlist = {
      number: waitlistNumber,
      item: selectedItem.name,
      facility: facilityName,
      expectedBack: selectedItem.expectedBack || 'TBD'
    };
    setWaitlistData(waitlist);
    onNavigate('waitlistConfirmed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center items-start sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              onClick={() => onNavigate('filter')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Item Detail</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Item Card - Available */}
        {isAvailable && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedItem.name}
                </h2>
                <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Availability</p>
                    <p className="text-lg font-bold text-gray-900">
                      {availableQuantity} of {totalQuantity} available
                    </p>
                  </div>
                </div>
              </div>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                {facilityName}
              </span>
            </div>

            <button
              onClick={handleReserve}
              className="w-full py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reserve
            </button>
          </div>
        )}

        {/* Item Card - Unavailable */}
        {!isAvailable && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedItem.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {totalQuantity > 1 
                    ? `All ${totalQuantity} units currently unavailable`
                    : `Status: ${rawStatus || 'Unavailable'}`
                  } • Expected back: {selectedItem.expectedBack || 'TBD'}
                </p>
              </div>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                {facilityName}
              </span>
            </div>

            <button
              onClick={handleJoinWaitlist}
              className="w-full py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
            >
              Join Waitlist
            </button>
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
