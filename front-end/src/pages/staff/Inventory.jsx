import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

const Inventory = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['Available', 'Reserved', 'Checked-Out', 'Maintenance'];

  const items = [
    { id: 1, name: 'DSLR Camera Kit', location: 'IM Lab', assetId: 'ID CAM-201', status: 'available', category: 'Camera', quantity: 3, condition: 'Good', reservationWindow: 24, description: 'Body + 18-55mm lens, 2 batteries, charger' },
    { id: 2, name: 'Audio Recorder', location: 'Media Center', assetId: 'ID AUD-105', status: 'checked-out', category: 'Audio', quantity: 2, condition: 'Good', reservationWindow: 48, description: 'Zoom H4n Pro with accessories' },
    { id: 3, name: 'Tripod', location: 'Library', assetId: 'ID TRI-042', status: 'available', category: 'Accessory', quantity: 5, condition: 'Good', reservationWindow: 24, description: 'Manfrotto 190 aluminum tripod' },
    { id: 4, name: 'Microphone Stand', location: 'Media Center', assetId: 'ID MIC-089', status: 'reserved', category: 'Audio', quantity: 4, condition: 'Good', reservationWindow: 24, description: 'Adjustable boom stand' },
    { id: 5, name: 'Lighting Kit', location: 'IM Lab', assetId: 'ID LIT-034', status: 'reserved', category: 'Lighting', quantity: 2, condition: 'Excellent', reservationWindow: 48, description: '3-point LED lighting kit with stands' },
    { id: 6, name: 'Video Camera', location: 'Arts Centre', assetId: 'ID VID-112', status: 'maintenance', category: 'Camera', quantity: 1, condition: 'Needs Repair', reservationWindow: 72, description: 'Sony FDR-AX700 4K camcorder' },
    { id: 7, name: 'Projector', location: 'Library', assetId: 'ID PRJ-056', status: 'available', category: 'Other', quantity: 3, condition: 'Good', reservationWindow: 24, description: 'Epson PowerLite 1080p projector' },
    { id: 8, name: 'Laptop - MacBook Pro', location: 'IM Lab', assetId: 'ID LAP-203', status: 'checked-out', category: 'Computer', quantity: 1, condition: 'Excellent', reservationWindow: 168, description: '16" M2 Pro, 16GB RAM, 512GB SSD' }
  ];

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' || item.status === activeFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === filter.toLowerCase()
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.location} • {item.assetId}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'reserved'
                        ? 'bg-blue-100 text-blue-700'
                        : item.status === 'maintenance'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.status === 'available'
                      ? 'Available'
                      : item.status === 'reserved'
                      ? 'Reserved'
                      : item.status === 'maintenance'
                      ? 'Maintenance'
                      : 'Checked-Out'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      item.status === 'available' && onNavigate('checkout')
                    }
                    disabled={item.status !== 'available'}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      item.status === 'available'
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Check-Out
                  </button>
                  <button
                    onClick={() => onNavigate('edititem', item)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No items found.</p>
          )}
        </div>

        {/* Add New Item Button */}
        <button
          onClick={() => onNavigate('additem')}
          className="w-full mt-6 bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          + Add New Item
        </button>
      </div>
    </div>
  );
};

export default Inventory;