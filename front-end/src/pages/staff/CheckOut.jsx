import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

const CheckOut = ({ onNavigate }) => {
  const [studentId, setStudentId] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleStudentScan = () => {
    // Simulate student lookup
    setSelectedStudent({
      id: 'si2356',
      name: 'Sarah Johnson',
      netId: 'si2356'
    });
  };

  const handleItemSearch = () => {
    // Simulate item lookup
    setSelectedItem({
      name: 'DSLR Camera Kit',
      id: 'CAM-201',
      availability: 'In stock'
    });
  };

  const handleConfirmCheckout = () => {
    alert('Checkout confirmed!');
    onNavigate('dashboard');
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
          <h1 className="text-3xl font-bold text-gray-900">Check-Out</h1>
        </div>

        {/* Find Student Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Find student</h2>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Scan ID / Enter NetID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1 min-w-0 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ring-[#57068C]"
            />
            <button
              onClick={handleStudentScan}
              className="flex-shrink-0 px-4 sm:px-6 py-3 bg-[#57068C] text-white rounded-lg font-medium hover:bg-[#460573] transition-colors"
            >
              Search
            </button>
          </div>
          {selectedStudent && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900">
                Student: {selectedStudent.name} ({selectedStudent.netId})
              </p>
            </div>
          )}
        </div>

        {/* Select Item Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select item</h2>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search item / scan barcode"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleItemSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          {selectedItem && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Availability: <span className="text-green-600 font-medium">{selectedItem.availability}</span>
              </p>
              <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                <p className="text-sm font-medium text-violet-900">
                  Selected: {selectedItem.name} ({selectedItem.id})
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Verify Reservation Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Verify reservation</h2>
          <p className="text-sm text-gray-600">No conflicting reservations</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleConfirmCheckout}
            disabled={!selectedStudent || !selectedItem}
            className={`w-full py-4 rounded-lg font-semibold transition-colors ${
              selectedStudent && selectedItem
                ? 'bg-violet-500 text-white hover:bg-violet-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Checkout
          </button>
          <button
            onClick={() => onNavigate('inventory')}
            className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
