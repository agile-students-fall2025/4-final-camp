import { ArrowRight } from 'lucide-react';

const StaffDashboard = ({ onNavigate }) => {
  const inventoryStats = {
    available: 126,
    out: 34,
    reserved: 18,
    checkouts: 22,
    returns: 19,
    overdue: 12
  };

  const menuItems = [
    { id: 'inventory', label: 'Manage Inventory'},
    { id: 'checkout', label: 'Check-Out'},
    { id: 'checkin', label: 'Check-In'},
    { id: 'reservations', label: 'Reservations (Today)'},
    { id: 'overdue', label: 'Overdue Tracking'},
    { id: 'fines', label: 'Manage Fines'},
    { id: 'alerts', label: 'Automated Alerts'}
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        </div>

        {/* Inventory Stats Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="font-semibold text-gray-900">Inventory</span>
              <span className="text-sm text-gray-600">
                Avail {inventoryStats.available} • Out {inventoryStats.out} • Res {inventoryStats.reserved}
              </span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="font-semibold text-gray-900">Today</span>
              <span className="text-sm text-gray-600">
                Checkouts {inventoryStats.checkouts} • Returns {inventoryStats.returns}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Overdue</span>
              <span className="text-sm text-red-600 font-medium">
                {inventoryStats.overdue} items
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Go to Inventory Button */}
        <button
          onClick={() => onNavigate('inventory')}
          className="w-full mt-6 bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Go to Inventory
        </button>
      </div>
    </div>
  );
};

export default StaffDashboard;
