import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Setup.scss';
import { useAuth } from '../components/AuthContext';
import { trackEvent } from '../services/tracking';
import DashboardLayout from '../components/DashboardLayout';

type CommonEvent = { event_type: string; description: string };

function uuidLike(): string {
  return 'trk_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
}

export default function Setup() {
  const { me } = useAuth();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const base = useMemo(() => {
    const pageUrl = window.location.origin + '/setup';
    return {
      tracking_id: uuidLike(),
      page_url: pageUrl,
      session_id: me?.id ? `sess_${me.id}` : undefined,
    };
  }, [me?.id]);

  const events: CommonEvent[] = useMemo(() => ([
    { event_type: 'page_view', description: 'Page view event' },
    { event_type: 'click', description: 'Click event' },
    { event_type: 'custom_event', description: 'Custom event' },
  ]), []);

  async function send(e: CommonEvent) {
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await trackEvent({
        tracking_id: base.tracking_id,
        page_url: base.page_url,
        event_type: e.event_type,
        session_id: base.session_id,
      });
      setMsg(res?.message || 'Event sent successfully.');
    } catch (ex: any) {
      setErr(ex?.response?.data?.message || 'Failed to send event.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout
      title="Setup"
      subtitle="Test sending events to ClickHouse via API"
    >
      <div className="setup-content">
        <div className="setup-info-card">
          <div className="info-row">
            <span className="info-label">User</span>
            <span className="info-value">{me ? `${me.name} (${me.email})` : '—'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">tracking_id</span>
            <span className="info-value mono">{base.tracking_id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">page_url</span>
            <span className="info-value mono truncate">{base.page_url}</span>
          </div>
        </div>

        <div className="setup-actions">
          {events.map((e) => (
            <button
              key={e.event_type}
              className="event-btn"
              disabled={loading}
              onClick={() => send(e)}
            >
              <span className="event-type">{e.event_type}</span>
              <span className="event-desc">{e.description}</span>
              <i className="fas fa-paper-plane"></i>
            </button>
          ))}
        </div>

        {msg && (
          <div className="setup-notice success">
            <i className="fas fa-check-circle"></i> {msg}
          </div>
        )}
        {err && (
          <div className="setup-notice error">
            <i className="fas fa-exclamation-circle"></i> {err}
          </div>
        )}

        <Link to="/dashboard" className="back-link"><i className="fas fa-arrow-left"></i> Back to Dashboard</Link>
      </div>
    </DashboardLayout>
  );
}
