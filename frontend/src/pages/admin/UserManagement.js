import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter ? { role: filter } : {};
      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    const reason = prompt('Enter reason for deactivation:');
    if (!reason) return;

    try {
      await adminAPI.deactivateUser(id, { reason });
      alert('User deactivated successfully');
      fetchUsers();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to deactivate'));
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;

    try {
      await adminAPI.resetPassword(id, { new_password: newPassword });
      alert('Password reset successfully');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to reset password'));
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
        <h2>User Management</h2>
        
        <div className="form-group" style={{maxWidth: '300px', marginBottom: '1.5rem'}}>
          <label>Filter by Role</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="university">University</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Active</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge badge-info">{user.role}</span></td>
                  <td><span className={`badge ${user.is_verified ? 'badge-success' : 'badge-warning'}`}>{user.is_verified ? 'Yes' : 'No'}</span></td>
                  <td><span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
                  <td>
                    {user.is_active && (
                      <>
                        <button onClick={() => handleResetPassword(user.id)} className="btn btn-secondary" style={{padding: '0.5rem 1rem', marginRight: '0.5rem'}}>Reset Password</button>
                        <button onClick={() => handleDeactivate(user.id)} className="btn btn-danger" style={{padding: '0.5rem 1rem'}}>Deactivate</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UserManagement;
