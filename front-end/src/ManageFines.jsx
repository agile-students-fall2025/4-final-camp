import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

const ManageFines = ({ onNavigate }) => {
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fineReason, setFineReason] = useState('late');
  const [fineAmount, setFineAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleStudentSearch = () => {
    // Simulate student lookup
    setSelectedStudent({
      netId: 'si2356',
      name: 'Sarah Johnson',
      fines: [
        {
          id: 1,
          reason: 'Overdue – Audio Recorder',
          amount: 5.00,
          status: 'unpaid'
        },
        {
          id: 2,
          reason: 'Damage – Tripod',
          amount: 12.00,
          status: 'unpaid'
        }
      ]
    });
  };

  const handleSaveApply = () => {
    alert(`Fine applied: $${fineAmount} for ${fineReason}`);
    onNavigate('dashboard');
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Fines</h1>
        </div>

        {/* Find Student Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Find student</h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by NetID or Name"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleStudentSearch}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Student Fines Section */}
        {selectedStudent && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Student fines - {selectedStudent.name}
            </h2>
            <div className="space-y-3">
              {selectedStudent.fines.map((fine) => (
                <div
                  key={fine.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{fine.reason}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      ${fine.amount.toFixed(2)} {fine.status}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      fine.status === 'unpaid'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {fine.status === 'unpaid' ? 'Unpaid' : 'Paid'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Fine Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply fine</h2>
          
          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <select
              value={fineReason}
              onChange={(e) => setFineReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="late">Late / Damage / Other</option>
              <option value="damage">Damage</option>
              <option value="lost">Lost Item</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={fineAmount}
                onChange={(e) => setFineAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Record Payment Section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Record payment</h3>
            
            {/* Select fine */}
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-2">Select fine</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>Choose...</option>
                <option>Overdue – Audio Recorder ($5.00)</option>
                <option>Damage – Tripod ($12.00)</option>
              </select>
            </div>

            {/* Method */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="cash">Cash / Online</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSaveApply}
            disabled={!fineAmount || !selectedStudent}
            className={`w-full py-4 rounded-lg font-semibold transition-colors ${
              fineAmount && selectedStudent
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save / Apply
          </button>
          <button
            onClick={() => onNavigate('overdue')}
            className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Overdue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageFines;
