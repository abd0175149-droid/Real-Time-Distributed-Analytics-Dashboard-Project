import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.scss';
import { forgotPassword } from '../services/auth';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!email.trim()) return setErrorMessage('Email is required.');

    setLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      setSuccessMessage('If the email exists, a reset link has been sent.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to send reset link.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i className="fas fa-lock"></i>
          </div>
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          {errorMessage && (
            <div className="auth-alert error">
              <i className="fas fa-exclamation-circle"></i> {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="auth-alert success">
              <i className="fas fa-check-circle"></i> {successMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@company.com"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading || !!successMessage || !email}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login"><i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i> Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
