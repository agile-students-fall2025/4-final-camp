import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const AutomatedAlerts = ({ onNavigate }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'rules',
      title: 'Rules',
      description: 'Overdue: 1d, 3d, 7d',
      subdesc: 'Pickup reminder: 2h before'
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Overdue notice • Reminder • Pickup'
    },
    {
      id: 'queue',
      title: 'Notification Queue',
      description: 'Email / SMS / In-app'
    },
    {
      id: 'logs',
      title: 'Delivery Logs',
      description: 'Log ID • Student • Status'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Automated Alerts</h1>
        </div>

        {/* Sections List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {sections.map((section, index) => (
            <div key={section.id}>
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === section.id ? null : section.id)
                }
                className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${
                  index !== sections.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  {section.subdesc && (
                    <p className="text-sm text-gray-500 mt-1">{section.subdesc}</p>
                  )}
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSection === section.id ? 'rotate-90' : ''
                  }`}
                />
              </button>
              
              {/* Expanded Content */}
              {expandedSection === section.id && (
                <div className="p-5 bg-gray-50 border-t border-gray-100">
                  {section.id === 'rules' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm text-gray-700">Send overdue notice at 1 day</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm text-gray-700">Send overdue notice at 3 days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm text-gray-700">Send overdue notice at 7 days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm text-gray-700">Send pickup reminder 2h before</span>
                      </div>
                    </div>
                  )}
                  {section.id === 'templates' && (
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-900">Overdue Notice Template</span>
                      </button>
                      <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-900">Pickup Reminder Template</span>
                      </button>
                      <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-900">Reservation Confirmation Template</span>
                      </button>
                    </div>
                  )}
                  {section.id === 'queue' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-sm font-medium text-gray-900">3 notifications pending</p>
                        <p className="text-xs text-gray-600 mt-1">Email: 2 • SMS: 1</p>
                      </div>
                    </div>
                  )}
                  {section.id === 'logs' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-sm font-medium text-gray-900">Log #1024</p>
                        <p className="text-xs text-gray-600 mt-1">Sarah Johnson • Delivered</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-sm font-medium text-gray-900">Log #1023</p>
                        <p className="text-xs text-gray-600 mt-1">Mike Chen • Delivered</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('overdue')}
          className="w-full mt-6 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Overdue
        </button>
      </div>
    </div>
  );
};

export default AutomatedAlerts;
