import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { universityAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function UniversityDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ programs: 0, applications: 0, pending: 0, accepted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, appsRes] = await Promise.all([
        universityAPI.getPrograms(),
        universityAPI.getApplications()
      ]);
      
      const apps = appsRes.data.data;
      setStats({
        programs: programsRes.data.count,
        applications: apps.length,
        pending: apps.filter(a => a.application_status === 'submitted').length,
        accepted: apps.filter(a => a.application_status === 'accepted').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const links = [
    { path: '/university/dashboard', label: 'Dashboard' },
    { path: '/university/profile', label: 'Profile' },
    { path: '/university/programs', label: 'My Programs' },
    { path: '/university/applications', label: 'Applications' }
  ];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <DashboardLayout role="University" links={links}>
      <h1>Welcome, {user?.name}!</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.programs}</h3>
          <p>Total Programs</p>
        </div>
        <div className="stat-card">
          <h3>{stats.applications}</h3>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending Review</p>
        </div>
        <div className="stat-card">
          <h3>{stats.accepted}</h3>
          <p>Accepted</p>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
          <a href="/university/programs" className="btn btn-primary">Manage Programs</a>
          <a href="/university/applications" className="btn btn-secondary">View Applications</a>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UniversityDashboard;
