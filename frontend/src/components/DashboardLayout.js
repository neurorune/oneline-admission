import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardLayout({ children, role, links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>One-Line Admission</h1>
        <div>
          <span style={{marginRight: '1rem'}}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </nav>
      <div className="dashboard">
        <div className="sidebar">
          <h2>{role} Dashboard</h2>
          <nav>
            {links.map((link, index) => (
              <Link key={index} to={link.path}>{link.label}</Link>
            ))}
          </nav>
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
