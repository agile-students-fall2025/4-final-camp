import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ReserveDateTimePage({ onNavigate, selectedItem, setReservationData }) {
  const [selectedDate, setSelectedDate] = useState('Oct 15');
  const [selectedTime, setSelectedTime] = useState('10:00-12:00');

  const dates = ['Oct 15', 'Oct 16', 'Oct 17'];
  const times = ['10:00-12:00', '14:00-16:00', '16:00-18:00'];

  const handleNext = () => {
    const reservationNumber = `R-${Math.floor(Math.random() * 9000) + 1000}`;
    const reservation = {
      number: reservationNumber,
      item: selectedItem.name,
      facility: selectedItem.facility,
      date: selectedDate,
      time: selectedTime
    };
    setReservationData(reservation);
    onNavigate('reservationConfirmed');
  };

  if (!selectedItem) {
    onNavigate('filter');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center items-start sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              onClick={() => onNavigate('itemDetail')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Reserve - Date & Time</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Item Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Facility</p>
              <p className="text-sm text-gray-500">Item</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{selectedItem.facility}</p>
              <p className="text-lg font-bold text-gray-900">{selectedItem.name}</p>
            </div>
          </div>
        </div>

        {/* Choose Date */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a date</h3>
          <div className="space-y-3">
            {dates.map((date) => (
              <label
                key={date}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="date"
                  value={date}
                  checked={selectedDate === date}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                />
                <span className="text-lg text-gray-900">{date}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Choose Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a time</h3>
          <div className="space-y-3">
            {times.map((time) => (
              <label
                key={time}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="time"
                  value={time}
                  checked={selectedTime === time}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                />
                <span className="text-lg text-gray-900">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleNext}
          className="w-full py-4 bg-gray-300 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-400 transition-colors shadow-sm"
        >
          Next: Review
        </button>

        <button
          onClick={() => onNavigate('itemDetail')}
          className="w-full py-4 bg-gray-200 text-gray-700 font-semibold text-lg rounded-xl hover:bg-gray-300 transition-colors"
        >
          Back
        </button>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
