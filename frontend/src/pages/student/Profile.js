import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentAPI } from '../../services/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getProfile();
      setProfile(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await studentAPI.updateProfile(formData);
      setMessage('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      setMessage('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSaving(false);
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
        <h2>My Profile</h2>
        {message && <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>{message}</div>}
        
        {profile && (
          <div style={{marginBottom: '1rem'}}>
            <p><strong>Registration Number:</strong> {profile.registration_number}</p>
            <p><strong>SSC Verification:</strong> <span className={`badge badge-${profile.ssc_verification_status === 'verified' ? 'success' : profile.ssc_verification_status === 'rejected' ? 'danger' : 'warning'}`}>{profile.ssc_verification_status}</span></p>
            <p><strong>HSC Verification:</strong> <span className={`badge badge-${profile.hsc_verification_status === 'verified' ? 'success' : profile.hsc_verification_status === 'rejected' ? 'danger' : 'warning'}`}>{profile.hsc_verification_status}</span></p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" value={formData.date_of_birth || ''} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />
          </div>

          <h3>SSC Information</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="form-group">
              <label>SSC GPA</label>
              <input type="number" step="0.01" value={formData.ssc_gpa || ''} onChange={(e) => setFormData({...formData, ssc_gpa: e.target.value})} />
            </div>
            <div className="form-group">
              <label>SSC Group</label>
              <select value={formData.ssc_group || ''} onChange={(e) => setFormData({...formData, ssc_group: e.target.value})}>
                <option value="">Select</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
            <div className="form-group">
              <label>SSC Board</label>
              <input type="text" value={formData.ssc_board || ''} onChange={(e) => setFormData({...formData, ssc_board: e.target.value})} />
            </div>
            <div className="form-group">
              <label>SSC Year</label>
              <input type="number" value={formData.ssc_year || ''} onChange={(e) => setFormData({...formData, ssc_year: e.target.value})} />
            </div>
            <div className="form-group">
              <label>SSC Roll Number</label>
              <input type="text" value={formData.ssc_roll_number || ''} onChange={(e) => setFormData({...formData, ssc_roll_number: e.target.value})} />
            </div>
          </div>

          <h3>HSC Information</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="form-group">
              <label>HSC GPA</label>
              <input type="number" step="0.01" value={formData.hsc_gpa || ''} onChange={(e) => setFormData({...formData, hsc_gpa: e.target.value})} />
            </div>
            <div className="form-group">
              <label>HSC Group</label>
              <select value={formData.hsc_group || ''} onChange={(e) => setFormData({...formData, hsc_group: e.target.value})}>
                <option value="">Select</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
            <div className="form-group">
              <label>HSC Board</label>
              <input type="text" value={formData.hsc_board || ''} onChange={(e) => setFormData({...formData, hsc_board: e.target.value})} />
            </div>
            <div className="form-group">
              <label>HSC Year</label>
              <input type="number" value={formData.hsc_year || ''} onChange={(e) => setFormData({...formData, hsc_year: e.target.value})} />
            </div>
            <div className="form-group">
              <label>HSC Roll Number</label>
              <input type="text" value={formData.hsc_roll_number || ''} onChange={(e) => setFormData({...formData, hsc_roll_number: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
