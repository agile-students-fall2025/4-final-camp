import React, { useState } from 'react';
import { Search, Package, Calendar, AlertCircle, ChevronRight, Clock, MapPin, X } from 'lucide-react';

export default function HomePage({ onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stats = [
    { label: 'Active Borrowals', value: '3', color: 'text-[#57068C]' },
    // { label: 'Upcoming Bookings', value: '2', color: 'text-green-600' },
    { label: 'Overdue Items', value: '2', color: 'text-red-600' },
  ];

  const quickLinks = [
    { label: 'My Borrowals', icon: Package, action: () => onNavigate('borrowals') },
    { label: 'Browser Catalogue', icon: Search, action: () => onNavigate('catalogue') },
    { label: 'Notifications', icon: AlertCircle, action: () => onNavigate('notifications') },
  ];

  const menuItems = [
    { label: 'Filter and Search', icon: Search, action: () => onNavigate('filter') },
    { label: 'Profile and Settings', icon: Package, action: () => onNavigate('profile') },
    { label: 'Browser Catalogue', icon: Calendar, action: () => onNavigate('catalogue') },
    { label: 'Notifications', icon: AlertCircle, action: () => onNavigate('notifications') },
    { label: 'Fines', icon: AlertCircle, action: () => onNavigate('fines') },
    { label: 'Help and Policies', icon: AlertCircle, action: () => onNavigate('help') },
  ];

  const dueItems = [
    { name: 'Canon EOS R5', dueDate: 'Oct 15, 2:00 PM', location: 'Arts Centre' },
    { name: 'MacBook Pro 16"', dueDate: 'Oct 16, 4:00 PM', location: 'IM Lab' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:justify-between gap-3">
          <h1 className="text-3xl font-bold text-[#57068C]">C.A.M.P</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Package className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.action}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <link.icon className="w-8 h-8 text-gray-700 mb-2" />
                <span className="text-sm text-gray-700 font-medium text-center">{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Due Soon */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Due Soon</h2>
          <div className="space-y-3">
            {dueItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.dueDate}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </span>
                  </div>
                </div>
                {/* <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  Extend
                </button> */}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
