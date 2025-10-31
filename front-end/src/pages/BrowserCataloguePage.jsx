import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function BrowserCataloguePage({ onNavigate, setSelectedFacility }) {
  const facilities = [
    { name: 'IM Lab' },
    { name: 'Media Center' },
    { name: 'Library' },
    { name: 'Arts Centre' },
  ];

  const handleFacilityClick = (facilityName) => {
    setSelectedFacility(facilityName);
    onNavigate('facilityItems');
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
            <h1 className="text-3xl font-bold text-gray-900">Browser Catalogue</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Campus Asset Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Campus Asset Management
          </h2>

          <div className="space-y-3">
            {facilities.map((facility, index) => (
              <button
                key={index}
                onClick={() => handleFacilityClick(facility.name)}
                className="w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-violet-300 hover:bg-violet-50 transition-all text-center"
              >
                {facility.name}
              </button>
            ))}
            
            {/* Filter & Search Button */}
            <button
              onClick={() => onNavigate('filter')}
              className="w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-violet-300 hover:bg-violet-50 transition-all text-center"
            >
              Filter & Search
            </button>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
