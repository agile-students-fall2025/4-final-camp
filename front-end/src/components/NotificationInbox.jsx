import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Clock, List, Calendar, DollarSign } from 'lucide-react';
import { api } from '../services/api.js';

export default function NotificationInbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.getNotifications({ limit: 20 });
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.getUnreadNotificationCount();
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
      case 'overdue':
        return <Clock className="w-5 h-5 text-gray-600" />;
      case 'waitlist':
        return <List className="w-5 h-5 text-gray-600" />;
      case 'reservation':
        return <Calendar className="w-5 h-5 text-gray-600" />;
      case 'fine':
        return <DollarSign className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (type === 'overdue' || priority === 'high') return 'border-red-200 bg-red-50';
    if (type === 'waitlist' || priority === 'high') return 'border-violet-200 bg-violet-50';
    if (type === 'reminder') return 'border-yellow-200 bg-yellow-50';
    return 'border-gray-200 bg-white';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No notifications</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                        !notification.isRead ? 'font-medium' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getNotificationIcon(notification.type)}
                            <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                          </div>
                          <p className="text-sm text-gray-700">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

