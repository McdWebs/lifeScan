import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Default to '/api' to match local dev proxying to the backend
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

function Card({ label, value, sub }) {
  return (
    <div className="rounded-[24px] bg-neu-bg shadow-neu-raised p-5 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-neu-muted">{label}</p>
      <p className="text-2xl font-display font-bold text-neu-fg">{value}</p>
      {sub && <p className="text-xs text-neu-muted">{sub}</p>}
    </div>
  );
}

export default function AdminAnalytics() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function fetchOverview() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/analytics/overview?days=7`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load analytics');
        }
        if (!cancelled) {
          setOverview(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load analytics');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOverview();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 font-display text-2xl font-bold text-neu-fg">Admin analytics</h1>
        <p className="text-sm text-neu-muted">Sign in to view analytics.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-neu-fg mb-2">Admin analytics</h1>
        <p className="text-sm text-neu-muted">
          Internal view of how LifeScan is used. Only visible to you as the admin.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-neu-muted">Loading analytics…</p>
      )}

      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}

      {overview && !loading && !error && (
        <>
          {/* High-level KPIs */}
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card
              label="Events (last 7 days)"
              value={overview.totalEvents ?? 0}
              sub="All client-tracked actions"
            />
            <Card
              label="Users"
              value={overview.kpis?.totalUsers ?? 0}
              sub={overview.kpis?.newUsers ? `+${overview.kpis.newUsers} in last ${overview.daily?.length ?? 7} days` : undefined}
            />
            <Card
              label="Checklists"
              value={overview.kpis?.totalChecklists ?? 0}
              sub={overview.kpis?.newChecklists ? `+${overview.kpis.newChecklists} in last ${overview.daily?.length ?? 7} days` : undefined}
            />
            <Card
              label="Today’s DAU"
              value={overview.kpis?.todayDau ?? 0}
              sub={
                overview.kpis?.openaiCalls != null
                  ? `${overview.kpis.openaiCalls} OpenAI calls (last ${overview.daily?.length ?? 7} days)`
                  : undefined
              }
            />
          </section>

          {/* Daily activity */}
          <section className="space-y-3">
            <h2 className="font-display text-base font-semibold text-neu-fg">Daily activity</h2>
            {overview.daily?.length ? (
              <div className="overflow-x-auto rounded-[24px] bg-neu-bg shadow-neu-raised">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neu-muted/10">
                      <th className="px-4 py-3 font-medium text-neu-muted">Date</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">Events</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">Approx. DAU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.daily.map((row) => (
                      <tr key={row.date} className="border-b border-neu-muted/5 last:border-0">
                        <td className="px-4 py-2 text-neu-fg">
                          {new Date(row.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-neu-fg">{row.count}</td>
                        <td className="px-4 py-2 text-neu-fg">{row.dau}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neu-muted">No events recorded yet.</p>
            )}
          </section>

          {/* Page usage */}
          <section className="space-y-3">
            <h2 className="font-display text-base font-semibold text-neu-fg">Page usage (last 7 days)</h2>
            {overview.pages?.length ? (
              <div className="overflow-x-auto rounded-[24px] bg-neu-bg shadow-neu-raised">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neu-muted/10">
                      <th className="px-4 py-3 font-medium text-neu-muted">Page</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">Views</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">Unique users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.pages.map((p) => (
                      <tr key={p.page || 'unknown'} className="border-b border-neu-muted/5 last:border-0">
                        <td className="px-4 py-2 text-neu-fg font-mono text-[11px]">{p.page || '(unknown)'}</td>
                        <td className="px-4 py-2 text-neu-fg">{p.views}</td>
                        <td className="px-4 py-2 text-neu-fg">{p.uniqueUsers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neu-muted">No page view data yet.</p>
            )}
          </section>

          {/* Checklist stats by event */}
          <section className="space-y-3">
            <h2 className="font-display text-base font-semibold text-neu-fg">Checklists by event type</h2>
            {overview.checklistsByEvent?.length ? (
              <div className="overflow-x-auto rounded-[24px] bg-neu-bg shadow-neu-raised">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neu-muted/10">
                      <th className="px-4 py-3 font-medium text-neu-muted">Event type</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">Checklists</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.checklistsByEvent.map((c) => (
                      <tr key={c.eventType} className="border-b border-neu-muted/5 last:border-0">
                        <td className="px-4 py-2 text-neu-fg font-mono text-[11px]">{c.eventType}</td>
                        <td className="px-4 py-2 text-neu-fg">{c.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neu-muted">No checklists created in this window.</p>
            )}
          </section>

          {/* Conversion funnel */}
          <section className="space-y-3">
            <h2 className="font-display text-base font-semibold text-neu-fg">Activation funnel</h2>
            {overview.funnel?.length ? (
              <div className="overflow-x-auto rounded-[24px] bg-neu-bg shadow-neu-raised">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neu-muted/10">
                      <th className="px-4 py-3 font-medium text-neu-muted">Step</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">Users</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">From previous</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">From first</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.funnel.map((step) => (
                      <tr key={step.step} className="border-b border-neu-muted/5 last:border-0">
                        <td className="px-4 py-2 text-neu-fg">{step.label}</td>
                        <td className="px-4 py-2 text-neu-fg">{step.users}</td>
                        <td className="px-4 py-2 text-neu-fg">
                          {step.conversionFromPrevious != null ? `${step.conversionFromPrevious}%` : '—'}
                        </td>
                        <td className="px-4 py-2 text-neu-fg">
                          {step.conversionFromFirst != null ? `${step.conversionFromFirst}%` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neu-muted">Not enough data yet to compute the funnel.</p>
            )}
          </section>

          {/* OpenAI usage */}
          <section className="space-y-3">
            <h2 className="font-display text-base font-semibold text-neu-fg">OpenAI usage (last 7 days)</h2>
            {overview.openai?.length ? (
              <div className="overflow-x-auto rounded-[24px] bg-neu-bg shadow-neu-raised">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neu-muted/10">
                      <th className="px-4 py-3 font-medium text-neu-muted">Event</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">Calls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.openai.map((e) => (
                      <tr key={e.eventName} className="border-b border-neu-muted/5 last:border-0">
                        <td className="px-4 py-2 text-neu-fg font-mono text-[11px]">{e.eventName}</td>
                        <td className="px-4 py-2 text-neu-fg">{e.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neu-muted">No OpenAI usage recorded yet.</p>
            )}
          </section>

          {/* Raw top events (excluding legacy session_restored noise) */}
          <section className="space-y-3">
            <h2 className="font-display text-base font-semibold text-neu-fg">Top events</h2>
            {overview.topEvents?.filter((e) => e.eventName !== 'session_restored').length ? (
              <div className="overflow-x-auto rounded-[24px] bg-neu-bg shadow-neu-raised">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neu-muted/10">
                      <th className="px-4 py-3 font-medium text-neu-muted">Event</th>
                      <th className="px-4 py-3 font-medium text-neu-muted">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.topEvents
                      .filter((e) => e.eventName !== 'session_restored')
                      .map((e) => (
                      <tr key={e.eventName} className="border-b border-neu-muted/5 last:border-0">
                        <td className="px-4 py-2 text-neu-fg font-mono text-[11px]">{e.eventName}</td>
                        <td className="px-4 py-2 text-neu-fg">{e.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neu-muted">No events recorded yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

