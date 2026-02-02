import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './DashboardLayout.scss';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { me, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { path: '/integration', icon: 'fa-plug', label: 'Integration' },
    { path: '/setup', icon: 'fa-vial', label: 'Test Events' },
    { path: '/users', icon: 'fa-users', label: 'Users' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo">
            <span className="logo-icon">
              <i className="fas fa-chart-pie"></i>
            </span>
            <span className="logo-text">DataFlow</span>
          </Link>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ path, icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
            >
              <i className={`fas ${icon}`}></i>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{me?.name?.charAt(0)?.toUpperCase() || '?'}</div>
            <div className="user-info">
              <span className="user-name">{me?.name || 'User'}</span>
              <span className="user-email">{me?.email || ''}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        {(title || subtitle) && (
          <header className="page-header">
            <div>
              {title && <h1 className="page-title">{title}</h1>}
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
          </header>
        )}
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
