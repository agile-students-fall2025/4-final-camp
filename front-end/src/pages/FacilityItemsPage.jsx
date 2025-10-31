import React from 'react';
import { ChevronLeft, Package } from 'lucide-react';

export default function FacilityItemsPage({ onNavigate, selectedFacility, setSelectedItem }) {
  const allItems = [
    { id: 1, name: 'Canon EOS R5 Camera', category: 'Electronics', facility: 'Arts Centre', availability: 'Available', description: 'Professional camera with 18-55mm lens, battery, charger' },
    { id: 2, name: 'DSLR Camera Kit', category: 'Electronics', facility: 'IM Lab', availability: 'Reserved', description: 'Includes body, 18-55mm lens, battery, charger', expectedBack: 'Oct 16, 2:00 PM' },
    { id: 3, name: 'MacBook Pro 16-inch', category: 'Electronics', facility: 'IM Lab', availability: 'Reserved', description: 'High-performance laptop', expectedBack: 'Oct 18, 4:00 PM' },
    { id: 4, name: 'Audio Recorder', category: 'Electronics', facility: 'IM Lab', availability: 'Available', description: 'Professional audio recording device' },
    { id: 5, name: 'Microphone', category: 'Electronics', facility: 'Library', availability: 'Available', description: 'High-quality microphone for recording' },
    { id: 6, name: 'Tripod', category: 'Tools', facility: 'Library', availability: 'Available', description: 'Sturdy tripod for cameras' },
    { id: 7, name: 'Painting Easel', category: 'Art Supplies', facility: 'Arts Centre', availability: 'Available', description: 'Adjustable painting easel' },
    { id: 8, name: 'Acrylic Paint Set', category: 'Art Supplies', facility: 'Arts Centre', availability: 'Available', description: 'Complete set of acrylic paints' },
    { id: 9, name: 'Power Drill', category: 'Tools', facility: 'IM Lab', availability: 'Reserved', description: 'Cordless power drill', expectedBack: 'Oct 20, 1:00 PM' },
    { id: 10, name: 'Soldering Iron', category: 'Electronics', facility: 'IM Lab', availability: 'Available', description: 'Electronic soldering tool' },
    { id: 11, name: 'Video Camera', category: 'Electronics', facility: 'Media Center', availability: 'Available', description: 'HD video camera with accessories' },
    { id: 12, name: 'Lighting Kit', category: 'Electronics', facility: 'Media Center', availability: 'Available', description: 'Professional lighting equipment' },
    { id: 13, name: 'Green Screen', category: 'Equipment', facility: 'Media Center', availability: 'Reserved', description: 'Portable green screen backdrop', expectedBack: 'Oct 17, 3:00 PM' },
    { id: 14, name: 'Wireless Microphone Set', category: 'Electronics', facility: 'Media Center', availability: 'Available', description: 'Wireless lavalier microphone system' },
  ];

  const facilityItems = allItems.filter(item => item.facility === selectedFacility);

  if (!selectedFacility) {
    onNavigate('catalogue');
    return null;
  }

  const handleItemClick = (item) => {
    setSelectedItem(item);
    onNavigate('itemDetail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center items-start sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              onClick={() => onNavigate('catalogue')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedFacility}</h1>
              <p className="text-gray-600 mt-1">{facilityItems.length} items available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {facilityItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">No items found at this facility</p>
          </div>
        ) : (
          <div className="space-y-3">
            {facilityItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span> {item.category}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      item.availability === 'Available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {item.availability}
                  </div>
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
