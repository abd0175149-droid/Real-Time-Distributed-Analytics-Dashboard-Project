import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.scss';
import { useAuth } from '../components/AuthContext';
import { getUserAnalytics } from '../services/analytics';
import { AnalyticsResponse } from '../models/analytics.models';
import DashboardLayout from '../components/DashboardLayout';

const fallback: AnalyticsResponse = {
  user: { id: '', name: '', email: '' },
  events_count: 0,
  last_events: [],
};

const POLLING_INTERVAL = 10000;

export default function Dashboard() {
  const { me } = useAuth();
  const [data, setData] = useState<AnalyticsResponse>(fallback);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAnalytics = useCallback(async (showLoading = false) => {
    if (!me?.id) return;
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const res = await getUserAnalytics(me.id);
      setData(res);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load analytics.');
      if (showLoading) setData(fallback);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [me?.id]);

  useEffect(() => { fetchAnalytics(true); }, [fetchAnalytics]);

  useEffect(() => {
    if (!isPolling || !me?.id) return;
    pollingRef.current = setInterval(() => fetchAnalytics(false), POLLING_INTERVAL);
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isPolling, me?.id, fetchAnalytics]);

  const togglePolling = () => setIsPolling((prev) => !prev);
  const handleRefresh = () => fetchAnalytics(true);

  const rows = useMemo(() => (data.last_events || []).slice(0, 10), [data.last_events]);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Analytics overview and recent events from ClickHouse"
    >
      <div className="dashboard-content">
        <div className="dashboard-toolbar">
          <div className="toolbar-left">
            <span className={`status-dot ${isPolling ? 'active' : ''}`}></span>
            <span className="status-text">{isPolling ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
            {lastUpdated && (
              <span className="last-updated">Last: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
          <div className="toolbar-right">
            <button
              className="btn-toolbar"
              onClick={handleRefresh}
              disabled={loading}
            >
              <i className="fas fa-sync-alt"></i> {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              className={`btn-toolbar ${isPolling ? 'danger' : 'success'}`}
              onClick={togglePolling}
            >
              {isPolling ? 'Stop' : 'Start'} Auto-refresh
            </button>
          </div>
        </div>

        {loading && <div className="dashboard-loading">Loading…</div>}
        {error && <div className="dashboard-error"><i className="fas fa-exclamation-triangle"></i> {error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
            <div className="stat-content">
              <span className="stat-value">{data.events_count.toLocaleString()}</span>
              <span className="stat-label">Total Events</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-clock"></i></div>
            <div className="stat-content">
              <span className="stat-value">
                {rows[0]?.timestamp ? new Date(rows[0].timestamp).toLocaleString() : '—'}
              </span>
              <span className="stat-label">Last Event</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-user"></i></div>
            <div className="stat-content">
              <span className="stat-value truncate">{me ? me.email : '—'}</span>
              <span className="stat-label">Current User</span>
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Recent Events</h3>
            <span className="table-meta">Showing {rows.length} of {data.last_events.length}</span>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Page</th>
                  <th>Tracking</th>
                  <th>Session</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      <i className="fas fa-inbox"></i>
                      <span>No events yet. <Link to="/integration">Integrate your site</Link> to start collecting data.</span>
                    </td>
                  </tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : '—'}</td>
                      <td><span className="badge">{r.event_type}</span></td>
                      <td className="mono truncate">{r.page_url}</td>
                      <td className="mono truncate">{r.tracking_id}</td>
                      <td className="mono truncate">{r.session_id || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-footer">
          <Link to="/" className="back-link"><i className="fas fa-arrow-left"></i> Home</Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
