import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../components/NotificationManager';

function StudentDashboard() {
  const { user } = useAuth();
  const notification = useNotification();
  const [stats, setStats] = useState({ total: 0, accepted: 0, pending: 0, shortlisted: 0 });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Show welcome notification
    notification.success('Welcome!', `Good to see you, ${user?.name}!`);
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, appsRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getApplications()
      ]);
      
      setProfile(profileRes.data.data);
      const apps = appsRes.data.data;
      setStats({
        total: apps.length,
        accepted: apps.filter(a => a.application_status === 'accepted').length,
        pending: apps.filter(a => a.application_status === 'pending').length,
        shortlisted: apps.filter(a => a.application_status === 'shortlisted').length
      });

      // Show notification for accepted applications
      const acceptedCount = apps.filter(a => a.application_status === 'accepted').length;
      if (acceptedCount > 0) {
        notification.success('Congratulations!', `You have ${acceptedCount} accepted application${acceptedCount > 1 ? 's' : ''}!`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      notification.error('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <DashboardLayout role="Student" links={links}>
      <h1>Welcome, {user?.name}!</h1>
      
      {!user?.is_verified && (
        <div className="alert alert-warning">
          Your account is pending admin verification. Please complete your profile and wait for verification.
        </div>
      )}

      {profile && !profile.is_profile_complete && (
        <div className="alert alert-warning">
          Please complete your profile to start applying to programs.
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h3>{stats.accepted}</h3>
          <p>Accepted</p>
        </div>
        <div className="stat-card">
          <h3>{stats.shortlisted}</h3>
          <p>Shortlisted</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
          <a href="/student/programs" className="btn btn-primary">Browse Programs</a>
          <a href="/student/applications" className="btn btn-secondary">View Applications</a>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
