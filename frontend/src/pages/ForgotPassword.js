import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetLink('');
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword({ email });
      setResetLink(response.data.resetLink);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {resetLink && (
          <div className="alert alert-success">
            <p>Password reset link generated:</p>
            <a href={resetLink} style={{wordBreak: 'break-all'}}>{resetLink}</a>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Reset Link'}
          </button>
        </form>
        <div className="text-center mt-2">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
