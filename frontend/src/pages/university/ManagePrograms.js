import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { universityAPI } from '../../services/api';

function ManagePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', duration_years: 4,
    min_ssc_gpa: 2.5, min_hsc_gpa: 2.5, group_required: '',
    application_fee: 500, intake_capacity: 50,
    application_start_date: '', application_deadline: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await universityAPI.getPrograms();
      setPrograms(response.data.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        await universityAPI.updateProgram(editingId, formData);
        setMessage('Program updated successfully!');
      } else {
        await universityAPI.createProgram(formData);
        setMessage('Program created successfully!');
      }
      setShowModal(false);
      setEditingId(null);
      fetchPrograms();
      setFormData({
        name: '', description: '', duration_years: 4,
        min_ssc_gpa: 2.5, min_hsc_gpa: 2.5, group_required: '',
        application_fee: 500, intake_capacity: 50,
        application_start_date: '', application_deadline: ''
      });
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to save program'));
    }
  };

  const handleEdit = (program) => {
    setEditingId(program.id);
    setFormData({
      name: program.name,
      description: program.description,
      duration_years: program.duration_years,
      min_ssc_gpa: program.min_ssc_gpa,
      min_hsc_gpa: program.min_hsc_gpa,
      group_required: program.group_required || '',
      application_fee: program.application_fee,
      intake_capacity: program.intake_capacity,
      application_start_date: program.application_start_date ? program.application_start_date.split('T')[0] : '',
      application_deadline: program.application_deadline ? program.application_deadline.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) return;

    try {
      await universityAPI.deleteProgram(id);
      setMessage('Program deleted successfully');
      fetchPrograms();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to delete program'));
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this program?')) return;

    try {
      await universityAPI.deactivateProgram(id);
      setMessage('Program deactivated successfully');
      fetchPrograms();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to deactivate'));
    }
  };

  const links = [
    { path: '/university/dashboard', label: 'Dashboard' },
    { path: '/university/profile', label: 'Profile' },
    { path: '/university/programs', label: 'My Programs' },
    { path: '/university/applications', label: 'Applications' }
  ];

  return (
    <DashboardLayout role="University" links={links}>
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h2>My Programs</h2>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">Create Program</button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <div className="loading">Loading programs...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Duration</th>
                <th>Min GPA</th>
                <th>Group</th>
                <th>Fee</th>
                <th>Capacity</th>
                <th>Applications</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map(program => (
                <tr key={program.id}>
                  <td>{program.name}</td>
                  <td>{program.duration_years} years</td>
                  <td>{program.min_hsc_gpa}</td>
                  <td>{program.group_required || 'Any'}</td>
                  <td>{program.application_fee} BDT</td>
                  <td>{program.intake_capacity}</td>
                  <td>{program.current_applications}</td>
                  <td>{new Date(program.application_deadline).toLocaleDateString()}</td>
                  <td><span className={`badge ${program.is_active ? 'badge-success' : 'badge-danger'}`}>{program.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button onClick={() => handleEdit(program)} className="btn btn-primary" style={{padding: '0.5rem 1rem', marginRight: '0.5rem'}}>Edit</button>
                    <button onClick={() => handleDelete(program.id)} className="btn btn-danger" style={{padding: '0.5rem 1rem'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Program' : 'Create Program'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Program Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3"></textarea>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div className="form-group">
                  <label>Duration (years)</label>
                  <input type="number" value={formData.duration_years} onChange={(e) => setFormData({...formData, duration_years: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Group Required</label>
                  <select value={formData.group_required} onChange={(e) => setFormData({...formData, group_required: e.target.value})}>
                    <option value="">Any</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Min SSC GPA</label>
                  <input type="number" step="0.01" value={formData.min_ssc_gpa} onChange={(e) => setFormData({...formData, min_ssc_gpa: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Min HSC GPA</label>
                  <input type="number" step="0.01" value={formData.min_hsc_gpa} onChange={(e) => setFormData({...formData, min_hsc_gpa: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Application Fee (BDT) *</label>
                  <input type="number" value={formData.application_fee} onChange={(e) => setFormData({...formData, application_fee: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Intake Capacity</label>
                  <input type="number" value={formData.intake_capacity} onChange={(e) => setFormData({...formData, intake_capacity: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Start Date *</label>
                  <input type="date" value={formData.application_start_date} onChange={(e) => setFormData({...formData, application_start_date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Deadline *</label>
                  <input type="date" value={formData.application_deadline} onChange={(e) => setFormData({...formData, application_deadline: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">{editingId ? 'Update Program' : 'Create Program'}</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManagePrograms;
