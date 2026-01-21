import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { studentAPI } from '../../services/api';

function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  const fetchProgramDetails = async () => {
    try {
      setMessage(''); // Clear any previous error messages
      const response = await studentAPI.getProgramDetails(id);
      setProgram(response.data.data);
      setEligibility(response.data.eligibility);
    } catch (error) {
      console.error('Error fetching program details:', error);
      setMessage('Error: Failed to load program details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setMessage('');

    try {
      await studentAPI.submitApplication({ program_id: parseInt(id) });
      setMessage('Application submitted successfully! Please complete payment.');
      setTimeout(() => navigate('/student/applications'), 2000);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to submit application'));
    } finally {
      setApplying(false);
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <DashboardLayout role="Student" links={links}>
      <div className="card">
        <h2>{program?.name}</h2>
        {message && <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>{message}</div>}
        
        <div style={{marginBottom: '2rem'}}>
          <p><strong>University:</strong> {program?.university_name}</p>
          <p><strong>Duration:</strong> {program?.duration_years} years</p>
          <p><strong>Description:</strong> {program?.description}</p>
          <p><strong>Min SSC GPA:</strong> {program?.min_ssc_gpa}</p>
          <p><strong>Min HSC GPA:</strong> {program?.min_hsc_gpa}</p>
          <p><strong>Group Required:</strong> {program?.group_required || 'Any'}</p>
          <p><strong>Application Fee:</strong> {program?.application_fee} BDT</p>
          <p><strong>Intake Capacity:</strong> {program?.intake_capacity}</p>
          <p><strong>Current Applications:</strong> {program?.current_applications}</p>
          <p><strong>Application Deadline:</strong> {new Date(program?.application_deadline).toLocaleDateString()}</p>
        </div>

        <div className="card" style={{background: eligibility?.can_apply ? '#d1fae5' : '#fee2e2'}}>
          <h3>Eligibility Status</h3>
          {eligibility?.can_apply ? (
            <div>
              <p style={{color: '#065f46'}}>✓ You are eligible to apply for this program!</p>
              <button onClick={handleApply} className="btn btn-success" disabled={applying}>
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          ) : (
            <div>
              <p style={{color: '#991b1b'}}>✗ You are not eligible to apply</p>
              <ul>
                {eligibility?.reasons.map((reason, index) => (
                  <li key={index} style={{color: '#991b1b'}}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProgramDetail;
