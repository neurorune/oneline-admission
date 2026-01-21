import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { universityAPI } from '../../services/api';

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
      const response = await universityAPI.getProfile();
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
      await universityAPI.updateProfile(formData);
      setMessage('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      setMessage('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const links = [
    { path: '/university/dashboard', label: 'Dashboard' },
    { path: '/university/profile', label: 'Profile' },
    { path: '/university/programs', label: 'My Programs' },
    { path: '/university/applications', label: 'Applications' }
  ];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <DashboardLayout role="University" links={links}>
      <div className="card">
        <h2>University Profile</h2>
        {message && <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>{message}</div>}
        
        {profile && (
          <div style={{marginBottom: '1rem'}}>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Location:</strong> {profile.location}</p>
            <p><strong>Type:</strong> {profile.type}</p>
            <p><strong>Verified:</strong> <span className={`badge ${profile.is_verified ? 'badge-success' : 'badge-warning'}`}>{profile.is_verified ? 'Yes' : 'No'}</span></p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="3"></textarea>
          </div>
          <div className="form-group">
            <label>Website URL</label>
            <input type="url" value={formData.website_url || ''} onChange={(e) => setFormData({...formData, website_url: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Contact Person</label>
            <input type="text" value={formData.contact_person || ''} onChange={(e) => setFormData({...formData, contact_person: e.target.value})} />
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
