import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

// ─── Icons ────────────────────────────────────────────────────────────────────

function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function DatabaseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function LogOutIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function AlertIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Field({ label, htmlFor, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-neu-muted">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-neu-muted leading-relaxed">{hint}</p>}
    </div>
  );
}

function InputNeu({ id, type = 'text', value, onChange, placeholder, autoComplete, disabled }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      className="input-neu w-full px-4 py-3 text-sm disabled:opacity-40"
    />
  );
}

function StatusMsg({ status }) {
  if (!status) return null;
  const isError = status.type === 'error';
  return (
    <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-600'}`}>
      {status.msg}
    </p>
  );
}

function PrimaryBtn({ loading, label, loadingLabel }) {
  return (
    <button type="submit" disabled={loading} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50">
      {loading ? loadingLabel : label}
    </button>
  );
}

function SecondaryBtn({ onClick, label, className }) {
  return (
    <button type="button" onClick={onClick} className={cn('btn-secondary px-5 py-2.5 text-sm', className)}>
      {label}
    </button>
  );
}

function DangerBtn({ onClick, loading, label, loadingLabel, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="rounded-2xl bg-neu-bg px-5 py-2.5 text-sm font-medium text-red-500 shadow-neu-raised-sm hover:shadow-neu-raised hover:text-red-600 active:shadow-neu-inset-sm active:translate-y-px transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg disabled:opacity-50"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}

function Divider() {
  return <div className="border-t border-neu-muted/10" />;
}

// ─── Panels ──────────────────────────────────────────────────────────────────

function ProfilePanel({ user, token, updateUser }) {
  const [name, setName] = useState(user?.name ?? '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      updateUser(data);
      setStatus({ type: 'success', msg: 'Name saved.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Display name" htmlFor="name">
        <InputNeu
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
      </Field>
      <Field label="Email" htmlFor="email-ro">
        <InputNeu id="email-ro" value={user?.email ?? ''} disabled />
      </Field>
      <div className="flex items-center gap-4 pt-1">
        <PrimaryBtn loading={loading} label="Save" loadingLabel="Saving…" />
        <StatusMsg status={status} />
      </div>
    </form>
  );
}

function SecurityPanel({ token, updateUser }) {
  const [cp, setCp] = useState('');
  const [np, setNp] = useState('');
  const [conf, setConf] = useState('');
  const [loadingPw, setLoadingPw] = useState(false);
  const [statusPw, setStatusPw] = useState(null);

  async function handlePasswordChange(e) {
    e.preventDefault();
    setStatusPw(null);
    if (np !== conf) { setStatusPw({ type: 'error', msg: 'New passwords do not match.' }); return; }
    if (np.length < 8) { setStatusPw({ type: 'error', msg: 'Must be at least 8 characters.' }); return; }
    setLoadingPw(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: cp, newPassword: np }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      updateUser(data.user, data.token);
      setCp(''); setNp(''); setConf('');
      setStatusPw({ type: 'success', msg: 'Password updated.' });
    } catch (err) {
      setStatusPw({ type: 'error', msg: err.message });
    } finally {
      setLoadingPw(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Change password */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-neu-fg">Change password</h3>
        <p className="text-xs text-neu-muted pb-3">Your current session will stay active after changing your password.</p>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Field label="Current password" htmlFor="cp-cur">
            <InputNeu id="cp-cur" type="password" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </Field>
          <Field label="New password" htmlFor="cp-new">
            <InputNeu id="cp-new" type="password" value={np} onChange={(e) => setNp(e.target.value)} placeholder="Min. 8 characters" autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password" htmlFor="cp-conf">
            <InputNeu id="cp-conf" type="password" value={conf} onChange={(e) => setConf(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          </Field>
          <div className="flex items-center gap-4 pt-1">
            <PrimaryBtn loading={loadingPw} label="Update password" loadingLabel="Updating…" />
            <StatusMsg status={statusPw} />
          </div>
        </form>
      </div>

    </div>
  );
}

function DataPanel({ token, handleClearHistory }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleExport() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/user/export', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Export failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LifeScan-data.json';
      a.click();
      URL.revokeObjectURL(url);
      setStatus({ type: 'success', msg: 'Download started.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neu-fg">Export your data</h3>
        <p className="text-sm text-neu-muted leading-relaxed">
          Download a complete copy of your account and all checklists as a JSON file.
        </p>
        <div className="flex items-center gap-4">
          <SecondaryBtn onClick={handleExport} label={loading ? 'Exporting…' : 'Export data'} />
          <StatusMsg status={status} />
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neu-fg">Clear local session</h3>
        <p className="text-sm text-neu-muted leading-relaxed">
          Removes the anonymous session ID stored in this browser. Does not affect your account or saved checklists.
        </p>
        <DangerBtn onClick={handleClearHistory} loading={false} label="Clear local history" loadingLabel="" />
      </div>
    </div>
  );
}

function DangerPanel({ token, logout, navigate }) {
  const [step, setStep] = useState('idle');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!password) { setStatus({ type: 'error', msg: 'Enter your password to confirm.' }); return; }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      logout();
      navigate('/');
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-neu-muted leading-relaxed">
        Permanently deletes your account and every checklist you've created. This cannot be undone.
      </p>

      {step === 'idle' && (
        <DangerBtn onClick={() => setStep('confirm')} loading={false} label="Delete my account" loadingLabel="" />
      )}

      {step === 'confirm' && (
        <div className="space-y-4 rounded-2xl bg-neu-bg shadow-neu-inset-sm p-5">
          <div className="flex items-start gap-3">
            <AlertIcon className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-500 font-medium leading-snug">
              Everything will be permanently deleted. Enter your password to confirm.
            </p>
          </div>
          <Field label="Password" htmlFor="del-pw">
            <InputNeu
              id="del-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </Field>
          <div className="flex items-center gap-3">
            <DangerBtn onClick={handleDelete} loading={loading} label="Yes, delete everything" loadingLabel="Deleting…" />
            <button
              type="button"
              onClick={() => { setStep('idle'); setPassword(''); setStatus(null); }}
              className="text-sm text-neu-muted hover:text-neu-fg transition-colors"
            >
              Cancel
            </button>
          </div>
          <StatusMsg status={status} />
        </div>
      )}
    </div>
  );
}

// ─── Nav items config ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'profile',  label: 'Profile',  Icon: UserIcon     },
  // { id: 'security', label: 'Security', Icon: LockIcon     },
  { id: 'data',     label: 'Your data', Icon: DatabaseIcon },
  { id: 'account',  label: 'Account',  Icon: LogOutIcon   },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [logoutStep, setLogoutStep] = useState('idle');

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleClearHistory() {
    localStorage.removeItem('sessionId');
    window.location.reload();
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="mb-8 font-display text-2xl font-bold text-neu-fg">Settings</h1>
        <div className="rounded-[32px] bg-neu-bg p-8 shadow-neu-raised space-y-4">
          <p className="text-sm text-neu-muted">Sign in to manage your account settings.</p>
          <Link to="/login" className="btn-primary inline-flex items-center px-5 py-2.5 text-sm">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const panelTitle = NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? 'Settings';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="mb-8 font-display text-2xl font-bold text-neu-fg">Settings</h1>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-start w-full">

        {/* ── Sidebar nav ── */}
        <nav className="hidden sm:flex flex-col w-44 shrink-0 rounded-[28px] bg-neu-bg shadow-neu-raised p-3 gap-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg',
                  active
                    ? 'text-neu-accent shadow-neu-inset-sm'
                    : 'text-neu-muted shadow-neu-raised-sm hover:text-neu-fg hover:shadow-neu-raised'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* ── Mobile tab strip ── */}
        <div className="sm:hidden flex w-full flex-wrap gap-2 mb-4">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center justify-center gap-2 shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent flex-1 min-w-[7rem]',
                  active
                    ? 'text-neu-accent shadow-neu-inset-sm'
                    : 'text-neu-muted shadow-neu-raised-sm hover:text-neu-fg'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Content panel ── */}
        <div className="flex-1 min-w-0 rounded-[28px] bg-neu-bg shadow-neu-raised p-5 sm:p-8">
          <h2 className="mb-6 font-display text-base font-semibold text-neu-fg">{panelTitle}</h2>

          {activeTab === 'profile' && (
            <ProfilePanel user={user} token={token} updateUser={updateUser} />
          )}

          {activeTab === 'security' && (
            <SecurityPanel token={token} updateUser={updateUser} />
          )}

          {activeTab === 'data' && (
            <DataPanel token={token} handleClearHistory={handleClearHistory} />
          )}

          {activeTab === 'account' && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neu-fg">Current session</h3>
                <p className="text-sm text-neu-muted">
                  Signed in as <span className="font-semibold text-neu-fg">{user.email}</span>
                </p>
                {logoutStep === 'idle' && (
                  <SecondaryBtn onClick={() => setLogoutStep('confirm')} label="Sign out" />
                )}
                {logoutStep === 'confirm' && (
                  <div className="space-y-4 rounded-2xl bg-neu-bg shadow-neu-inset-sm p-5">
                    <div className="flex items-start gap-3">
                      <AlertIcon className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-neu-muted leading-snug">
                        You&apos;ll be signed out from LifeScan on this device. You can sign back in at any time.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <DangerBtn
                        onClick={handleLogout}
                        loading={false}
                        label="Yes, sign me out"
                        loadingLabel=""
                      />
                      <button
                        type="button"
                        onClick={() => setLogoutStep('idle')}
                        className="text-sm text-neu-muted hover:text-neu-fg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Divider />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-red-500">Delete account</h3>
                <DangerPanel token={token} logout={logout} navigate={navigate} />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
