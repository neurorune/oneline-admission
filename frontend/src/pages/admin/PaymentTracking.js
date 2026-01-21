import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';

function PaymentTracking() {
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await adminAPI.getPayments();
      setPayments(response.data.data);
      setTotalRevenue(response.data.total_revenue);
    } catch (error) {
      console.error('Error fetching payments:', error);
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
        <h2>Payment Tracking</h2>
        
        <div className="stat-card" style={{marginBottom: '2rem'}}>
          <h3>{totalRevenue} BDT</h3>
          <p>Total Revenue</p>
        </div>

        {loading ? (
          <div className="loading">Loading payments...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Student</th>
                <th>University</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>#{payment.id}</td>
                  <td>{payment.student_name}</td>
                  <td>{payment.university_name}</td>
                  <td>{payment.amount} BDT</td>
                  <td><span className={`badge ${payment.payment_status === 'completed' ? 'badge-success' : payment.payment_status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{payment.payment_status}</span></td>
                  <td>{payment.transaction_id || 'N/A'}</td>
                  <td>{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PaymentTracking;
