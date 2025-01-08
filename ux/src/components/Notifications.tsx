// src/components/Notifications.tsx
import React from 'react';
import { removeNotification } from '../redux/notificationsSlice';
import { Notification } from '../interfaces/NotificationInterfaces';
import { useAppDispatch, useAppSelector } from '../redux/store';

export const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.notifications);

  const getNotificationStyles = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-700';
      case 'error':
        return 'bg-red-500 border-red-700';
      case 'info':
        return 'bg-blue-500 border-blue-700';
      default:
        return 'bg-gray-500 border-gray-700';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification: Notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationStyles(notification.type)}
            text-white px-4 py-2 rounded shadow-lg border-l-4
            transform transition-all duration-500 ease-in-out
            animate-slide-in
          `}
        >
          <div className="flex justify-between items-center">
            <p>{notification.message}</p>
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};