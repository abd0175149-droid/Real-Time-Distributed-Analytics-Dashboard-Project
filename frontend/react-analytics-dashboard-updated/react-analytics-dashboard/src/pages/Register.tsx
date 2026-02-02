import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.scss';
import { useAuth } from '../components/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) return setErrorMessage('Name is required.');
    if (!email.trim()) return setErrorMessage('Email is required.');
    if (!password) return setErrorMessage('Password is required.');
    if (password.length < 6) return setErrorMessage('Password must be at least 6 characters.');
    if (password !== passwordConfirmation) return setErrorMessage('Passwords do not match.');

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      setSuccessMessage('Account created. Signing you in…');
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed.';
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
            <i className="fas fa-chart-pie"></i>
          </div>
          <h1 className="auth-title">Join DataFlow</h1>
          <p className="auth-subtitle">Create your account to start transforming data into insights</p>
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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@dataflow.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              type="password"
              id="password_confirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
            />
            {passwordConfirmation && password !== passwordConfirmation && (
              <div className="validation-error">Passwords do not match</div>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={loading || !name || !email || !password || !passwordConfirmation}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : 'Register Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
