import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';

function AllApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const response = await adminAPI.getAllApplications(params);
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      submitted: 'badge-info',
      shortlisted: 'badge-info',
      accepted: 'badge-success',
      rejected: 'badge-danger',
      withdrawn: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  return (
    <DashboardLayout role="Admin" links={links}>
      <div className="card">
        <h2>All Applications</h2>
        
        <div className="form-group" style={{maxWidth: '300px', marginBottom: '1.5rem'}}>
          <label>Filter by Status</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading applications...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>University</th>
                <th>Program</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>#{app.id}</td>
                  <td>{app.student_name}</td>
                  <td>{app.university_name}</td>
                  <td>{app.program_name}</td>
                  <td><span className={`badge ${getStatusBadge(app.application_status)}`}>{app.application_status}</span></td>
                  <td><span className={`badge ${app.payment_status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{app.payment_status || 'pending'}</span></td>
                  <td>{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AllApplications;
