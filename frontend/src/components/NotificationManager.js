import React, { useState, useEffect, createContext, useContext } from 'react';
import PushNotification from './PushNotification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    const notification = { id, title, message, type };
    
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (title, message) => showNotification(title, message, 'success');
  const error = (title, message) => showNotification(title, message, 'error');
  const warning = (title, message) => showNotification(title, message, 'warning');
  const info = (title, message) => showNotification(title, message, 'info');

  return (
    <NotificationContext.Provider value={{ success, error, warning, info }}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <PushNotification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
