import React, { useMemo, useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useMockData } from '../../hooks/useMockData.js';

const STATUS_ORDER = ['available', 'reserved', 'checked-out', 'maintenance'];
const STATUS_LABELS = {
  available: 'Available',
  reserved: 'Reserved',
  'checked-out': 'Checked-Out',
  maintenance: 'Maintenance'
};

const Inventory = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data, loading, error, refetch } = useMockData('staffInventory', {
    initialData: { items: [] }
  });

  const items = useMemo(() => data?.items ?? [], [data]);

  const availableFilters = useMemo(() => {
    const presentStatuses = new Set(items.map((item) => item.status));
    const filtered = STATUS_ORDER.filter((status) => presentStatuses.has(status));
    return filtered.length > 0 ? filtered : STATUS_ORDER;
  }, [items]);

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;

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
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">
            Unable to load inventory.
            <button onClick={refetch} className="ml-2 underline hover:text-red-800">
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-violet-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {availableFilters.map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === status
                  ? 'bg-violet-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {STATUS_LABELS[status] ?? status}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {loading && items.length === 0 ? (
            <p className="text-gray-500 text-center">Loading inventory…</p>
          ) : filteredItems.length > 0 ? (
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
                        ? 'bg-violet-100 text-violet-700'
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
          className="w-full mt-6 bg-[#57068C] text-white py-4 rounded-lg font-semibold hover:bg-[#460573] transition-colors"
        >
          + Add New Item
        </button>
      </div>
    </div>
  );
};

export default Inventory;
