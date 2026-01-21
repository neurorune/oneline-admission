import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentAPI } from '../../services/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await studentAPI.getNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await studentAPI.markNotificationRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const links = [
    { path: '/student/dashboard', label: 'Dashboard' },
    { path: '/student/profile', label: 'My Profile' },
    { path: '/student/programs', label: 'Browse Programs' },
    { path: '/student/applications', label: 'My Applications' },
    { path: '/student/payments', label: 'Payment History' },
    { path: '/student/notifications', label: 'Notifications' }
  ];

  return (
    <DashboardLayout role="Student" links={links}>
      <div className="card">
        <h2>Notifications</h2>
        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : (
          <div>
            {notifications.map(notif => (
              <div key={notif.id} className="card" style={{background: notif.is_read ? '#f9f9f9' : '#fff', borderLeft: notif.is_read ? 'none' : '4px solid #667eea'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>{notif.title}</h3>
                    <p>{notif.message}</p>
                    <small style={{color: '#666'}}>{new Date(notif.created_at).toLocaleString()}</small>
                    <span className={`badge badge-${notif.type === 'verification' ? 'success' : notif.type === 'deadline' ? 'warning' : 'info'}`} style={{marginLeft: '1rem'}}>{notif.type}</span>
                  </div>
                  {!notif.is_read && (
                    <button onClick={() => markAsRead(notif.id)} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>Mark as Read</button>
                  )}
                </div>
              </div>
            ))}
            {notifications.length === 0 && <p>No notifications yet.</p>}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
