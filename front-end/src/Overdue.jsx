import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Overdue = ({ onNavigate }) => {
  const overdueItems = [
    {
      id: 1,
      item: 'Audio Recorder',
      days: 1,
      student: 'J. Patel',
      dueDate: 'Oct 26, 2025'
    },
    {
      id: 2,
      item: 'Tripod',
      days: 3,
      student: 'R. Chen',
      dueDate: 'Oct 24, 2025'
    },
    {
      id: 3,
      item: 'DSLR Camera',
      days: 5,
      student: 'A. Martinez',
      dueDate: 'Oct 22, 2025'
    },
    {
      id: 4,
      item: 'Lighting Kit',
      days: 2,
      student: 'S. Johnson',
      dueDate: 'Oct 25, 2025'
    }
  ];

  const handleSendReminder = (id) => {
    alert(`Reminder sent for item ${id}`);
  };

  const handleApplyFine = (id) => {
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
          <h1 className="text-3xl font-bold text-gray-900">Overdue</h1>
        </div>

        {/* Overdue Items List */}
        <div className="space-y-4">
          {overdueItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {item.item} – {item.days} day{item.days > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-gray-600">
                  Student: {item.student}
                </p>
                <p className="text-sm text-red-600 font-medium mt-1">
                  Due date: {item.dueDate}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendReminder(item.id)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Send Reminder
                </button>
                <button
                  onClick={() => handleApplyFine(item.id)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Apply Fine
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no overdue items) */}
        {overdueItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Overdue Items
            </h3>
            <p className="text-gray-600">
              All items are returned on time!
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full mt-6 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Overdue;
