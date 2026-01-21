import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';

function UniversityVerification() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUniversities();
  }, []);

  const fetchPendingUniversities = async () => {
    try {
      const response = await adminAPI.getPendingUniversities();
      setUniversities(response.data.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await adminAPI.verifyUniversity(id);
      alert('University verified successfully');
      fetchPendingUniversities();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to verify'));
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminAPI.rejectUniversity(id, { reason });
      alert('University verification rejected');
      fetchPendingUniversities();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to reject'));
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
        <h2>University Verification</h2>
        {loading ? (
          <div className="loading">Loading universities...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Website</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.map(uni => (
                <tr key={uni.id}>
                  <td>{uni.name}</td>
                  <td>{uni.email}</td>
                  <td>{uni.location}</td>
                  <td><span className="badge badge-info">{uni.type}</span></td>
                  <td>{uni.contact_person}</td>
                  <td>{uni.website_url}</td>
                  <td>
                    <button onClick={() => handleVerify(uni.id)} className="btn btn-success" style={{padding: '0.5rem 1rem', marginRight: '0.5rem'}}>Verify</button>
                    <button onClick={() => handleReject(uni.id)} className="btn btn-danger" style={{padding: '0.5rem 1rem'}}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && universities.length === 0 && (
          <p>No pending university verifications.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UniversityVerification;
