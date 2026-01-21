import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentAPI } from '../../services/api';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await studentAPI.getPayments();
      setPayments(response.data.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
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

  return (
    <DashboardLayout role="Student" links={links}>
      <div className="card">
        <h2>Payment History</h2>
        {loading ? (
          <div className="loading">Loading payments...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>University</th>
                <th>Program</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>#{payment.application_id}</td>
                  <td>{payment.university_name}</td>
                  <td>{payment.program_name}</td>
                  <td>{payment.amount} BDT</td>
                  <td><span className={`badge ${payment.payment_status === 'completed' ? 'badge-success' : payment.payment_status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{payment.payment_status}</span></td>
                  <td>{payment.transaction_id || 'N/A'}</td>
                  <td>{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && payments.length === 0 && (
          <p>No payment history yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PaymentHistory;
