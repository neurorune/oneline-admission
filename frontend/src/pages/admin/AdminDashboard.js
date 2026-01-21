import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const links = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/students', label: 'Student Verification' },
    { path: '/admin/universities', label: 'University Verification' },
    { path: '/admin/users', label: 'User Management' },
    { path: '/admin/applications', label: 'All Applications' },
    { path: '/admin/payments', label: 'Payment Tracking' },
    { path: '/admin/analytics', label: 'Analytics' },
    { path: '/admin/logs', label: 'Admin Logs' }
  ];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <DashboardLayout role="Admin" links={links}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

      <h3>System Overview</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{analytics?.total_students}</h3>
          <p>Total Students</p>
        </div>
        <div className="stat-card">
          <h3>{analytics?.verified_students}</h3>
          <p>Verified Students</p>
        </div>
        <div className="stat-card">
          <h3>{analytics?.pending_students}</h3>
          <p>Pending Verification</p>
        </div>
        <div className="stat-card">
          <h3>{analytics?.total_universities}</h3>
          <p>Total Universities</p>
        </div>
        <div className="stat-card">
          <h3>{analytics?.total_applications}</h3>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h3>{analytics?.total_revenue}</h3>
          <p>Total Revenue (BDT)</p>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
          <a href="/admin/students" className="btn btn-primary">Verify Students</a>
          <a href="/admin/applications" className="btn btn-secondary">View Applications</a>
          <a href="/admin/analytics" className="btn btn-secondary">View Analytics</a>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
