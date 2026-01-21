import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';

function Analytics() {
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
      <div className="card">
        <h2>System Analytics</h2>

        <h3>Students</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{analytics?.total_students}</h3>
            <p>Total Students</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.verified_students}</h3>
            <p>Verified</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.pending_students}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.rejected_students}</h3>
            <p>Rejected</p>
          </div>
        </div>

        <h3>Universities</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{analytics?.total_universities}</h3>
            <p>Total Universities</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.verified_universities}</h3>
            <p>Verified</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.pending_universities}</h3>
            <p>Pending</p>
          </div>
        </div>

        <h3>Applications</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{analytics?.total_applications}</h3>
            <p>Total Applications</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.applications_by_status?.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.applications_by_status?.submitted}</h3>
            <p>Submitted</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.applications_by_status?.shortlisted}</h3>
            <p>Shortlisted</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.applications_by_status?.accepted}</h3>
            <p>Accepted</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.applications_by_status?.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>

        <h3>Revenue</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{analytics?.total_revenue} BDT</h3>
            <p>Total Revenue</p>
          </div>
          <div className="stat-card">
            <h3>{analytics?.payment_success_rate}</h3>
            <p>Payment Success Rate</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;
