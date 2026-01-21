import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentAPI, paymentAPI } from '../../services/api';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await studentAPI.getApplications();
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (applicationId) => {
    try {
      const response = await paymentAPI.initiatePayment({ application_id: applicationId });
      alert('Payment initiated! In a real system, you would be redirected to payment gateway.');
      
      await paymentAPI.verifyPayment({
        payment_id: response.data.data.payment_id,
        transaction_id: 'TXN' + Date.now(),
        status: 'completed',
        amount: response.data.data.amount
      });
      
      alert('Payment completed successfully!');
      fetchApplications();
    } catch (error) {
      alert('Payment failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await studentAPI.withdrawApplication(applicationId, { reason: 'Student withdrew' });
      alert('Application withdrawn successfully');
      fetchApplications();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to withdraw'));
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
    <DashboardLayout role="Student" links={links}>
      <div className="card">
        <h2>My Applications</h2>
        {loading ? (
          <div className="loading">Loading applications...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>University</th>
                <th>Program</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Fee</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.university_name}</td>
                  <td>{app.program_name}</td>
                  <td><span className={`badge ${getStatusBadge(app.application_status)}`}>{app.application_status}</span></td>
                  <td><span className={`badge ${app.payment_status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{app.payment_status || 'pending'}</span></td>
                  <td>{app.application_fee} BDT</td>
                  <td>{new Date(app.application_deadline).toLocaleDateString()}</td>
                  <td>
                    {app.payment_status === 'pending' && (
                      <button onClick={() => handlePayment(app.id)} className="btn btn-success" style={{padding: '0.5rem 1rem', marginRight: '0.5rem'}}>Pay Now</button>
                    )}
                    {!['accepted', 'rejected', 'withdrawn'].includes(app.application_status) && (
                      <button onClick={() => handleWithdraw(app.id)} className="btn btn-danger" style={{padding: '0.5rem 1rem'}}>Withdraw</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && applications.length === 0 && (
          <p>No applications yet. <a href="/student/programs">Browse programs</a> to apply.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyApplications;
