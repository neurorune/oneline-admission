import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
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
          {user ? (
            <>
              <Link to={`/${user.role}/dashboard`}>Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{marginLeft: '1rem'}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{marginRight: '1rem'}}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="hero">
        <h1>One Platform, All Universities</h1>
        <p>Apply to multiple universities without repeating forms</p>
        <div>
          <Link to="/register" className="btn btn-primary" style={{marginRight: '1rem'}}>Register as Student</Link>
          <Link to="/register" className="btn btn-secondary">Register as University</Link>
        </div>
      </div>

      <div className="container">
        <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Key Features</h2>
        <div className="features">
          <div className="feature-card">
            <h3>All Universities</h3>
            <p>Access all public and private universities in one place</p>
          </div>
          <div className="feature-card">
            <h3>Auto-Matching</h3>
            <p>Automatic eligibility check based on your grades</p>
          </div>
          <div className="feature-card">
            <h3>One Form</h3>
            <p>Apply to multiple programs without repeating</p>
          </div>
          <div className="feature-card">
            <h3>Smart Notifications</h3>
            <p>Get deadline reminders and status updates</p>
          </div>
          <div className="feature-card">
            <h3>Secure Payment</h3>
            <p>Pay all fees securely in one place</p>
          </div>
          <div className="feature-card">
            <h3>Verification</h3>
            <p>Admin verifies your credentials</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
