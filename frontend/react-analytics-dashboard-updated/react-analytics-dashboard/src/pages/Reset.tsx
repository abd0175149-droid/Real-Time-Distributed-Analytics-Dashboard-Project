import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import '../styles/auth.scss';
import { resetPassword } from '../services/auth';

export default function Reset() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const prefilledEmail = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!token) return setErrorMessage('Missing reset token.');
    if (!email.trim()) return setErrorMessage('Email is required.');
    if (!password) return setErrorMessage('New password is required.');
    if (password !== password_confirmation) return setErrorMessage('Passwords do not match.');

    setLoading(true);
    try {
      await resetPassword({ token, email: email.trim(), password, password_confirmation });
      setSuccessMessage('Password updated. Redirecting to login...');
      setTimeout(() => navigate('/login'), 800);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to reset password.';
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
            <i className="fas fa-key"></i>
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            {token ? 'Enter your email and new password' : 'Error: Missing reset token'}
          </p>
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

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm New Password</label>
            <input
              type="password"
              id="password_confirmation"
              value={password_confirmation}
              onChange={(e) => setPassword_confirmation(e.target.value)}
              placeholder="••••••••"
            />
            {password_confirmation && password !== password_confirmation && (
              <div className="validation-error">Passwords do not match</div>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={loading || !token}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Change Password'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login"><i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i> Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
