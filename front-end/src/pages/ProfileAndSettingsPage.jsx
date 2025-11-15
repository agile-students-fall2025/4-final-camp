import React, { useEffect, useState } from 'react';
import { ChevronLeft, CreditCard, Bell, Shield } from 'lucide-react';
import { useApiData } from '../hooks/useApiData.js';
import { authUtils } from '../utils/auth.js';

export default function ProfileAndSettingsPage({ onNavigate }) {
  const [campusCash, setCampusCash] = useState('0.00');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [shareData, setShareData] = useState(false);
  const userId = authUtils.getUserId();

  const { data, loading, error, refetch } = useApiData('profile', {
    initialData: { student: null },
    params: { userId }
  });

  useEffect(() => {
    const student = data?.student;
    if (!student) {
      return;
    }

    if (typeof student.campusCashBalance === 'number') {
      setCampusCash(student.campusCashBalance.toFixed(2));
    }

    if (student.notificationPreferences) {
      setEmailNotifications(!!student.notificationPreferences.email);
      setSmsNotifications(!!student.notificationPreferences.sms);
      setShareData(!!student.notificationPreferences.shareData);
    }
  }, [data]);

  const handleSave = () => {
    alert('Preferences saved successfully!');
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
            <h1 className="text-3xl font-bold text-gray-900">Profile and Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
            Unable to load your profile.
            <button onClick={refetch} className="ml-2 underline hover:text-red-800">
              Try again
            </button>
          </div>
        )}

        {/* Campus Cash Balance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Campus Cash Balance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">
                {loading && campusCash === '0.00' ? 'Loading…' : `$${campusCash}`}
              </p>
              <p className="text-sm text-gray-600 mt-1">Available balance</p>
            </div>
            <button className="px-6 py-3 bg-[#57068C] text-white rounded-lg hover:bg-[#460573] transition-colors font-medium">
              Add Funds
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-[#57068C]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via text</p>
              </div>
              <button
                onClick={() => setSmsNotifications(!smsNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  smsNotifications ? 'bg-[#57068C]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Share borrowing data</p>
              <p className="text-sm text-gray-600">Help improve our service</p>
            </div>
            <button
              onClick={() => setShareData(!shareData)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                shareData ? 'bg-[#57068C]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  shareData ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-400 transition-colors shadow-sm"
        >
          Save Preferences
        </button>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
