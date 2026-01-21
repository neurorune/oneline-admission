import React, { useState, useEffect } from 'react';

const PushNotification = ({ notification, onClose }) => {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className={`push-notification ${notification.type} ${isHiding ? 'hiding' : ''}`}>
      <div className="push-notification-icon">{getIcon()}</div>
      <div className="push-notification-content">
        <div className="push-notification-title">{notification.title}</div>
        <div className="push-notification-message">{notification.message}</div>
      </div>
      <button className="push-notification-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default PushNotification;
