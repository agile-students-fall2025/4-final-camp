import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const CheckIn = ({ onNavigate }) => {
  const [itemId, setItemId] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [condition, setCondition] = useState('good');

  const handleItemScan = () => {
    // Simulate item lookup
    setSelectedItem({
      name: 'DSLR Camera Kit',
      id: 'CAM-201',
      borrower: 'Sarah Johnson (si2356)'
    });
  };

  const handleCompleteCheckIn = () => {
    alert(`Item checked in with condition: ${condition}`);
    onNavigate('dashboard');
  };

  const handleApplyFine = () => {
    onNavigate('fines');
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
          <h1 className="text-3xl font-bold text-gray-900">Check-In</h1>
        </div>

        {/* Scan Item Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan item / search</h2>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Enter item ID"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="flex-1 min-w-0 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ring-[#57068C]"
            />
            <button
              onClick={handleItemScan}
              className="flex-shrink-0 px-4 sm:px-6 py-3 bg-[#57068C] text-white rounded-lg font-medium hover:bg-[#460573] transition-colors"
            >
              Search
            </button>
          </div>
          {selectedItem && (
            <div className="mt-4 p-3 bg-violet-50 border border-violet-200 rounded-lg">
              <p className="text-sm font-medium text-violet-900">
                {selectedItem.name} ({selectedItem.id})
              </p>
              <p className="text-sm text-violet-700 mt-1">
                Borrowed by: {selectedItem.borrower}
              </p>
            </div>
          )}
        </div>

        {/* Condition Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Condition</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="condition"
                value="good"
                checked={condition === 'good'}
                onChange={(e) => setCondition(e.target.value)}
                className="w-5 h-5 text-[#57068C]"
              />
              <span className="text-gray-900">Good</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="condition"
                value="damaged"
                checked={condition === 'damaged'}
                onChange={(e) => setCondition(e.target.value)}
                className="w-5 h-5 text-[#57068C]"
              />
              <span className="text-gray-900">Damaged</span>
            </label>
          </div>
        </div>

        {/* Status Update Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Status update</h2>
          <p className="text-sm text-gray-600">Will set item to Available</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCompleteCheckIn}
            disabled={!selectedItem}
            className={`w-full py-4 rounded-lg font-semibold transition-colors ${
              selectedItem
                ? 'bg-[#57068C] text-white hover:bg-[#460573]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Complete Check-In
          </button>
          <button
            onClick={handleApplyFine}
            className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Apply Fine
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
