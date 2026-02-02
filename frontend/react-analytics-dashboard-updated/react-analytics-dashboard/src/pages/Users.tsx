import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Users.scss';
import { useAuth } from '../components/AuthContext';
import { ApiUser, listUsers } from '../services/users';
import DashboardLayout from '../components/DashboardLayout';

type UserVM = {
  id: string;
  name: string;
  email: string;
  lastActive?: string;
  eventsCount?: number;
  signupDate?: string;
  location?: string;
};

function normalizeUser(u: ApiUser): UserVM {
  return {
    id: String(u.id),
    name: u.name || u.email || String(u.id),
    email: u.email || '—',
    lastActive: u.lastActive,
    eventsCount: u.eventsCount,
    signupDate: u.created_at,
    location: u.location,
  };
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserVM[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listUsers();
        setUsers((res || []).map(normalizeUser));
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load users.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  }, [users, searchTerm]);

  const viewUserDetail = (userId: string) => {
    navigate(`/dashboard?user=${encodeURIComponent(userId)}`);
  };

  return (
    <DashboardLayout
      title="User Profiles"
      subtitle={`${filteredUsers.length} active users`}
    >
      <div className="users-content">
        <div className="users-toolbar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {error && (
          <div className="users-error">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        )}

        <div className="users-table-card">
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Location</th>
                  <th>Events</th>
                  <th>Sign Up</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="loading-cell">
                      <i className="fas fa-spinner fa-spin"></i> Loading...
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="user-cell">
                        <div className="user-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                        <div className="user-details">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </td>
                      <td>{user.location || '—'}</td>
                      <td>
                        {typeof user.eventsCount === 'number' ? (
                          <span className="events-badge">{user.eventsCount.toLocaleString()}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>{user.signupDate ? new Date(user.signupDate).toLocaleDateString() : '—'}</td>
                      <td>{user.lastActive ? new Date(user.lastActive).toLocaleTimeString() : '—'}</td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => viewUserDetail(user.id)}
                        >
                          View <i className="fas fa-arrow-right"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredUsers.length === 0 && (
            <div className="empty-users">
              <i className="fas fa-users-slash"></i>
              <p>No users found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
