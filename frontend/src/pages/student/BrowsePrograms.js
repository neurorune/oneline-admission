import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { studentAPI } from '../../services/api';

function BrowsePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', type: '', group: '' });

  useEffect(() => {
    fetchPrograms();
  }, [filters]);

  const fetchPrograms = async () => {
    try {
      const response = await studentAPI.getPrograms(filters);
      setPrograms(response.data.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
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
        <h2>Browse Programs</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem'}}>
          <div className="form-group">
            <label>Location</label>
            <input type="text" placeholder="e.g., Dhaka" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} />
          </div>
          <div className="form-group">
            <label>University Type</label>
            <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
              <option value="">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="form-group">
            <label>Group</label>
            <select value={filters.group} onChange={(e) => setFilters({...filters, group: e.target.value})}>
              <option value="">All</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading programs...</div>
        ) : (
          <div>
            <p>Found {programs.length} programs</p>
            <table className="table">
              <thead>
                <tr>
                  <th>University</th>
                  <th>Program</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Min GPA</th>
                  <th>Fee</th>
                  <th>Deadline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {programs.map(program => (
                  <tr key={program.id}>
                    <td>{program.university_name}</td>
                    <td>{program.name}</td>
                    <td>{program.university_location}</td>
                    <td><span className="badge badge-info">{program.university_type}</span></td>
                    <td>{program.min_hsc_gpa}</td>
                    <td>{program.application_fee} BDT</td>
                    <td>{new Date(program.application_deadline).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/student/programs/${program.id}`} className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default BrowsePrograms;
