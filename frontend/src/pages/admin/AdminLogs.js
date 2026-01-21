import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await adminAPI.getLogs({ limit: 100 });
      setLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
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

  return (
    <DashboardLayout role="Admin" links={links}>
      <div className="card">
        <h2>Admin Action Logs</h2>
        {loading ? (
          <div className="loading">Loading logs...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Description</th>
                <th>Table</th>
                <th>Record ID</th>
                <th>IP Address</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.admin_name}</td>
                  <td><span className="badge badge-info">{log.action_type}</span></td>
                  <td>{log.description}</td>
                  <td>{log.table_name}</td>
                  <td>{log.record_id}</td>
                  <td>{log.ip_address}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && logs.length === 0 && (
          <p>No logs found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminLogs;
