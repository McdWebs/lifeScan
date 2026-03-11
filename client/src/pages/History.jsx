import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useSession from '../hooks/useSession';
import useChecklist from '../hooks/useChecklist';
import ProgressRing from '../components/ProgressRing';
import Loader from '../components/ui/Loader';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { track } from '../utils/analytics';

const eventMeta = {
  boughtHouse: { title: 'Bought a House',     Icon: HouseIcon     },
  newBaby:     { title: 'Had a Baby',          Icon: HeartIcon     },
  newJob:      { title: 'Started a New Job',   Icon: BriefcaseIcon },
  movedCity:   { title: 'Moved to a New City', Icon: MapPinIcon    },
  gotMarried:  { title: 'Got Married',         Icon: RingsIcon     },
};

function HouseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" />
    </svg>
  );
}
function HeartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function BriefcaseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function MapPinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function RingsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" />
    </svg>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function TrashIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}

function CustomIcon({ iconKey, className }) {
  const p = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (iconKey) {
    case 'house':      return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>;
    case 'heart':      return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
    case 'briefcase':  return <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case 'map-pin':    return <svg {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'rings':      return <svg {...p}><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>;
    case 'star':       return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case 'graduation': return <svg {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
    case 'plane':      return <svg {...p}><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
    case 'zap':        return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case 'scale':      return <svg {...p}><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l9-3 9 3"/><path d="M6 15l-3-9 6 2.25"/><path d="M18 15l3-9-6 2.25"/><path d="M3 15a3 3 0 0 0 6 0H3z"/><path d="M15 15a3 3 0 0 0 6 0h-6z"/></svg>;
    case 'sparkle':    return <svg {...p}><path d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M3 12h1m16 0h1M4.92 19.08l.7-.7M18.36 5.64l.7-.7"/><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" strokeWidth={1.5}/></svg>;
    default:           return <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
  }
}

export default function History() {
  const navigate  = useNavigate();
  const sessionId = useSession();
  const { history, loading, fetchHistory, deleteChecklist } = useChecklist();
  const { token } = useAuth();
  const [confirmId, setConfirmId] = useState(null);
  const [deleting,  setDeleting]  = useState(null);

  useEffect(() => {
    fetchHistory(sessionId);
    if (token) {
      track('page_view', { page: 'history', sessionId }, { token });
    }
  }, [sessionId, fetchHistory, token]);

  async function handleDelete(e, id) {
    e.stopPropagation();
    setDeleting(id);
    try {
      await deleteChecklist(id);
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  }

  if (loading && history.length === 0) return <Loader message="Loading history..." />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-10 font-display text-2xl font-bold text-neu-fg">Your Checklists</h1>

      {history.length === 0 ? (
        <div className="flex flex-col items-center rounded-[32px] bg-neu-bg shadow-neu-raised p-12 text-center">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-neu-bg shadow-neu-raised" />
            <div className="absolute inset-4 rounded-full bg-neu-bg shadow-neu-inset-deep" />
            <svg className="relative h-7 w-7 text-neu-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" />
            </svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-neu-fg">No checklists yet</h2>
          <p className="mt-2 text-sm text-neu-muted">
            Start by picking a life event to get your first checklist.
          </p>
          <Link to="/" className="btn-primary mt-8 inline-flex items-center px-6 py-3 text-sm">
            Get started
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const isCustom   = item.eventType === 'custom';
            const meta       = isCustom
              ? { title: item.answers?.eventTitle || item.answers?.eventDescription?.slice(0, 40) || 'Custom Checklist' }
              : (eventMeta[item.eventType] ?? { title: item.eventType });
            const { Icon }   = isCustom ? {} : (eventMeta[item.eventType] ?? {});
            const customIconKey = isCustom ? (item.answers?.iconKey || 'pencil') : null;
            const tasks      = item.tasks ?? [];
            const completed  = tasks.filter((t) => t.completed).length;
            const pct        = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
            const isConfirm  = confirmId === item._id;
            const isDeleting = deleting === item._id;

            return (
              <div
                key={item._id}
                className={cn(
                  'rounded-2xl bg-neu-bg transition-all duration-300',
                  isConfirm ? 'shadow-neu-inset-sm' : 'shadow-neu-raised'
                )}
              >
                {/* Main row */}
                <div className="flex items-center gap-4 p-5">
                  {/* Navigate zone */}
                  <button
                    type="button"
                    onClick={() => !isConfirm && navigate(`/checklist/${item._id}`)}
                    className="flex flex-1 items-center gap-4 text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg rounded-xl"
                  >
                    {/* Icon well */}
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-inset text-neu-fg">
                      {isCustom
                        ? <CustomIcon iconKey={customIconKey} className="h-5 w-5" />
                        : Icon && <Icon className="h-5 w-5" />
                      }
                    </span>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-semibold text-neu-fg truncate">
                        {meta.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-neu-muted">{formatDate(item.createdAt)}</p>
                    </div>

                    <ProgressRing percentage={pct} />
                  </button>

                  {/* Delete trigger */}
                  {!isConfirm && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setConfirmId(item._id); }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-raised-sm hover:shadow-neu-raised text-neu-muted hover:text-red-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
                      aria-label="Delete checklist"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Inline confirm strip — slides open inside the card */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                    isConfirm ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="flex items-center justify-between gap-3 px-5 pb-5">
                    <p className="text-sm font-medium text-neu-muted">
                      Delete this checklist?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setConfirmId(null); }}
                        className="rounded-2xl bg-neu-bg shadow-neu-raised-sm hover:shadow-neu-raised px-4 py-2 text-xs font-semibold text-neu-muted hover:text-neu-fg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item._id)}
                        disabled={isDeleting}
                        className="rounded-2xl bg-red-400 px-4 py-2 text-xs font-semibold text-white shadow-[5px_5px_10px_rgb(163,177,198,0.5),-5px_-5px_10px_rgba(255,255,255,0.4)] hover:bg-red-500 active:translate-y-px transition-all duration-300 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
                      >
                        {isDeleting ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
