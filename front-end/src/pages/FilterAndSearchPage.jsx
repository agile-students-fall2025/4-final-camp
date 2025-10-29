import React, { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';

export default function FilterAndSearchPage({ onNavigate, setSelectedItem }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

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
  ];

  const categories = ['All', 'Electronics', 'Tools', 'Art Supplies'];
  const facilities = ['All', 'IM Lab', 'Media Center', 'Library', 'Arts Centre'];
  const availabilities = ['All', 'Available', 'Reserved'];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesFacility = selectedFacility === 'All' || item.facility === selectedFacility;
    const matchesAvailability = selectedAvailability === 'All' || item.availability === selectedAvailability;
    return matchesSearch && matchesCategory && matchesFacility && matchesAvailability;
  });

  const handleItemClick = (item) => {
    setSelectedItem(item);
    onNavigate('itemDetail');
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Filter and Search</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
          
          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Facility Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Facility</label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {facilities.map(facility => (
                <option key={facility} value={facility}>{facility}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availabilities.map(availability => (
                <option key={availability} value={availability}>{availability}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Results ({filteredItems.length})
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No items found matching your criteria
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map(item => (
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
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Category:</span> {item.category}
                        </span>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Location:</span> {item.facility}
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
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
