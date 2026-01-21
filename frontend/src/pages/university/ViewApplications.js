import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { universityAPI } from '../../services/api';

function ViewApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const response = await universityAPI.getApplications(params);
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await universityAPI.changeApplicationStatus(id, { new_status: newStatus });
      alert(`Application ${newStatus} successfully`);
      fetchApplications();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to update status'));
    }
  };

  const links = [
    { path: '/university/dashboard', label: 'Dashboard' },
    { path: '/university/profile', label: 'Profile' },
    { path: '/university/programs', label: 'My Programs' },
    { path: '/university/applications', label: 'Applications' }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      submitted: 'badge-info',
      shortlisted: 'badge-info',
      accepted: 'badge-success',
      rejected: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  return (
    <DashboardLayout role="University" links={links}>
      <div className="card">
        <h2>Applications Received</h2>
        
        <div className="form-group" style={{maxWidth: '300px', marginBottom: '1.5rem'}}>
          <label>Filter by Status</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
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
                <th>Student</th>
                <th>Program</th>
                <th>SSC GPA</th>
                <th>HSC GPA</th>
                <th>Group</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.student_name}</td>
                  <td>{app.program_name}</td>
                  <td>{app.student_ssc_gpa}</td>
                  <td>{app.student_hsc_gpa}</td>
                  <td>{app.student_group}</td>
                  <td><span className={`badge ${getStatusBadge(app.application_status)}`}>{app.application_status}</span></td>
                  <td><span className={`badge ${app.payment_status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{app.payment_status}</span></td>
                  <td>{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {(app.application_status === 'pending' || app.application_status === 'submitted') && (
                      <>
                        <button onClick={() => handleStatusChange(app.id, 'accepted')} className="btn btn-success" style={{padding: '0.5rem 1rem', marginRight: '0.5rem'}}>Accept</button>
                        <button onClick={() => handleStatusChange(app.id, 'rejected')} className="btn btn-danger" style={{padding: '0.5rem 1rem'}}>Reject</button>
                      </>
                    )}
                    {app.application_status === 'shortlisted' && (
                      <>
                        <button onClick={() => handleStatusChange(app.id, 'accepted')} className="btn btn-success" style={{padding: '0.5rem 1rem', marginRight: '0.5rem'}}>Accept</button>
                        <button onClick={() => handleStatusChange(app.id, 'rejected')} className="btn btn-danger" style={{padding: '0.5rem 1rem'}}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && applications.length === 0 && (
          <p>No applications found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ViewApplications;
