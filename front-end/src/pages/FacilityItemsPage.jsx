import React, { useMemo } from 'react';
import { ChevronLeft, Package } from 'lucide-react';
import { useApiData } from '../hooks/useApiData.js';

export default function FacilityItemsPage({ onNavigate, selectedFacility, setSelectedItem }) {
  const { data, loading, error, refetch } = useApiData('items', {
    initialData: { items: [] }
  });

  const allItems = useMemo(() => data?.items ?? [], [data]);

  const facilityItems = useMemo(
    () => allItems.filter(item => item.facility === selectedFacility),
    [allItems, selectedFacility]
  );

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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
            Unable to load items right now.
            <button onClick={refetch} className="ml-2 underline hover:text-red-800">
              Retry
            </button>
          </div>
        )}

        {loading && allItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-600">
            Loading items…
          </div>
        ) : facilityItems.length === 0 ? (
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
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
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
