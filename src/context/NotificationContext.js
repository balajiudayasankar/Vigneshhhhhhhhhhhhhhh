import React, { createContext, useContext, useState, useCallback } from 'react';
import { toastrService } from '../services/toastrService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toastr notification
    switch (notification.type) {
      case 'success':
        toastrService.success(notification.message, notification.title);
        break;
      case 'error':
        toastrService.error(notification.message, notification.title);
        break;
      case 'warning':
        toastrService.warning(notification.message, notification.title);
        break;
      case 'info':
      default:
        toastrService.info(notification.message, notification.title);
        break;
    }
    
    // Auto remove notification after timeout
    if (notification.autoRemove !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.timeout || 5000);
    }
    
    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    toastrService.clear();
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  // Get unread count
  const getUnreadCount = useCallback(() => {
    return notifications.filter(notif => !notif.read).length;
  }, [notifications]);

  // Notification helpers
  const success = useCallback((message, title = 'Success') => {
    return addNotification({ type: 'success', message, title });
  }, [addNotification]);

  const error = useCallback((message, title = 'Error') => {
    return addNotification({ type: 'error', message, title });
  }, [addNotification]);

  const warning = useCallback((message, title = 'Warning') => {
    return addNotification({ type: 'warning', message, title });
  }, [addNotification]);

  const info = useCallback((message, title = 'Info') => {
    return addNotification({ type: 'info', message, title });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
