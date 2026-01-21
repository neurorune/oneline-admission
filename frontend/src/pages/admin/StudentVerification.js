import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';
import { useNotification } from '../../components/NotificationManager';

function StudentVerification() {
  const notification = useNotification();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [counts, setCounts] = useState({ pending: 0, verified: 0, rejected: 0 });

  useEffect(() => {
    fetchStudents();
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetch all students to calculate counts
      const allResponse = await adminAPI.getAllStudents();
      const allStudents = allResponse.data.data;
      
      // Calculate counts for each tab
      const pendingCount = allStudents.filter(s => 
        s.ssc_verification_status === 'pending' || s.hsc_verification_status === 'pending'
      ).length;
      
      const verifiedCount = allStudents.filter(s => 
        s.ssc_verification_status === 'verified' && s.hsc_verification_status === 'verified'
      ).length;
      
      const rejectedCount = allStudents.filter(s => 
        s.ssc_verification_status === 'rejected' || s.hsc_verification_status === 'rejected'
      ).length;
      
      setCounts({ pending: pendingCount, verified: verifiedCount, rejected: rejectedCount });
      
      // Filter students based on active tab
      let filtered;
      if (activeTab === 'pending') {
        filtered = allStudents.filter(s => 
          s.ssc_verification_status === 'pending' || s.hsc_verification_status === 'pending'
        );
      } else if (activeTab === 'verified') {
        filtered = allStudents.filter(s => 
          s.ssc_verification_status === 'verified' && s.hsc_verification_status === 'verified'
        );
      } else if (activeTab === 'rejected') {
        filtered = allStudents.filter(s => 
          s.ssc_verification_status === 'rejected' || s.hsc_verification_status === 'rejected'
        );
      }
      
      setStudents(filtered);
    } catch (error) {
      console.error('Error fetching students:', error);
      notification.error('Error', 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await adminAPI.verifyStudent(id, { verify_ssc: true, verify_hsc: true });
      notification.success('Verified', 'Student verified successfully');
      fetchStudents();
    } catch (error) {
      notification.error('Error', error.response?.data?.message || 'Failed to verify');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminAPI.rejectStudent(id, { 
        reject_ssc: true, 
        reject_hsc: true, 
        ssc_rejection_reason: reason,
        hsc_rejection_reason: reason
      });
      notification.warning('Rejected', 'Student verification rejected');
      fetchStudents();
    } catch (error) {
      notification.error('Error', error.response?.data?.message || 'Failed to reject');
    }
  };

  const handleAllowReapply = async (id) => {
    try {
      await adminAPI.verifyStudent(id, { 
        verify_ssc: false, 
        verify_hsc: false,
        reset_to_pending: true
      });
      notification.success('Reapply Allowed', 'Student can now update and reapply');
      fetchStudents();
    } catch (error) {
      notification.error('Error', error.response?.data?.message || 'Failed to allow reapply');
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
        <h2>Student Verification</h2>
        
        <div style={{marginBottom: '2rem', display: 'flex', gap: '1rem'}}>
          <button 
            onClick={() => setActiveTab('pending')} 
            className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            style={{padding: '0.75rem 1.5rem'}}
          >
            Pending ({counts.pending})
          </button>
          <button 
            onClick={() => setActiveTab('verified')} 
            className={`btn ${activeTab === 'verified' ? 'btn-primary' : 'btn-secondary'}`}
            style={{padding: '0.75rem 1.5rem'}}
          >
            Verified ({counts.verified})
          </button>
          <button 
            onClick={() => setActiveTab('rejected')} 
            className={`btn ${activeTab === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
            style={{padding: '0.75rem 1.5rem'}}
          >
            Rejected ({counts.rejected})
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>SSC</th>
                <th>HSC</th>
                <th>SSC Status</th>
                <th>HSC Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.ssc_roll_number} ({student.ssc_board}, {student.ssc_year}) - GPA: {student.ssc_gpa}</td>
                  <td>{student.hsc_roll_number} ({student.hsc_board}, {student.hsc_year}) - GPA: {student.hsc_gpa}</td>
                  <td><span className={`badge badge-${student.ssc_verification_status === 'verified' ? 'success' : student.ssc_verification_status === 'rejected' ? 'danger' : 'warning'}`}>{student.ssc_verification_status}</span></td>
                  <td><span className={`badge badge-${student.hsc_verification_status === 'verified' ? 'success' : student.hsc_verification_status === 'rejected' ? 'danger' : 'warning'}`}>{student.hsc_verification_status}</span></td>
                  <td>
                    {activeTab === 'pending' && (
                      <>
                        <button onClick={() => handleVerify(student.id)} className="btn btn-success" style={{padding: '0.5rem 1rem', marginRight: '0.5rem', fontSize: '0.9rem'}}>Verify</button>
                        <button onClick={() => handleReject(student.id)} className="btn btn-danger" style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}>Reject</button>
                      </>
                    )}
                    {activeTab === 'rejected' && (
                      <button onClick={() => handleAllowReapply(student.id)} className="btn btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}>Allow Reapply</button>
                    )}
                    {activeTab === 'verified' && (
                      <span className="badge badge-success">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && students.length === 0 && (
          <p style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>
            {activeTab === 'pending' && 'No pending student verifications.'}
            {activeTab === 'verified' && 'No verified students yet.'}
            {activeTab === 'rejected' && 'No rejected students.'}
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentVerification;
