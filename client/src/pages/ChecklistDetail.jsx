import { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import useChecklist from '../hooks/useChecklist';
import Loader from '../components/ui/Loader';
import ChecklistItem from '../components/ChecklistItem';
import AddTaskForm from '../components/AddTaskForm';
import affiliateLinks from '../lib/affiliateLinks';

const eventMeta = {
  boughtHouse: { name: 'Bought a House',     category: 'Real Estate'   },
  newBaby:     { name: 'Had a Baby',          category: 'Family'        },
  newJob:      { name: 'Started a New Job',   category: 'Career'        },
  movedCity:   { name: 'Moved to a New City', category: 'Lifestyle'     },
  gotMarried:  { name: 'Got Married',         category: 'Relationships' },
};

function BackIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

// Inline SVG icons for custom checklist icon picker
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

function StickyHeader({ name, category, iconKey, completed, total, pct }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 bg-neu-bg/95 backdrop-blur-md px-4 pt-4 pb-4 shadow-neu-raised">
      <div className="flex items-center gap-3">

        {/* Icon well — only shown for custom checklists */}
        {iconKey && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-inset-deep">
            <CustomIcon iconKey={iconKey} className="h-5 w-5 text-neu-fg" />
          </div>
        )}

        {/* Title block — fills middle */}
        <div className="flex-1 min-w-0">
          {category && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-neu-accent mb-0.5">
              {category}
            </p>
          )}
          <h1 className="font-display text-lg font-bold text-neu-fg leading-snug truncate">
            {name}
          </h1>
        </div>

        {/* Progress ring — inset well with SVG arc */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative flex h-[52px] w-[52px] items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-neu-bg shadow-neu-inset-deep" />
            <svg width="52" height="52" className="-rotate-90 relative z-10">
              <circle cx="26" cy="26" r="20" fill="none"
                stroke="rgb(163,177,198)" strokeWidth="3.5" strokeOpacity="0.35" />
              <circle cx="26" cy="26" r="20" fill="none"
                stroke="#38B2AC" strokeWidth="3.5" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - pct / 100)}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute z-10 font-display text-[11px] font-extrabold text-neu-fg">
              {pct}%
            </span>
          </div>
          <span className="mt-1 text-[10px] font-medium text-neu-muted">
            {completed}/{total}
          </span>
        </div>
      </div>

      {/* Thin progress track */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neu-bg shadow-neu-inset-sm">
        <div
          className="h-full rounded-full bg-neu-accent-secondary transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ChecklistDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { checklist, loading, error, fetchChecklist, toggleTask, addTask } = useChecklist();
  const celebratedRef = useRef(false);

  useEffect(() => { fetchChecklist(id); }, [id]);

  const tasks     = checklist?.tasks ?? [];
  const completed = tasks.filter((t) => t.completed).length;
  const total     = tasks.length;
  const allDone   = total > 0 && completed === total;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    if (allDone && !celebratedRef.current) {
      celebratedRef.current = true;
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [allDone]);

  if (loading && !checklist) return <Loader />;

  if (error) {
    return (
      <div className="flex flex-col items-center py-20 text-center px-4">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-neu-bg shadow-neu-raised" />
          <div className="absolute inset-4 rounded-full bg-neu-bg shadow-neu-inset-deep" />
          <svg className="relative h-6 w-6 text-neu-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        </div>
        <p className="text-neu-muted mb-4">Could not load this checklist.</p>
        <button type="button" onClick={() => navigate('/history')} className="btn-secondary px-5 py-2.5 text-sm">
          Back to history
        </button>
      </div>
    );
  }

  if (!checklist) return null;

  const meta = checklist.eventType === 'custom'
    ? { name: checklist.answers?.eventTitle || checklist.answers?.eventDescription || 'Custom Checklist', category: 'AI Generated' }
    : (eventMeta[checklist.eventType] ?? { name: 'Checklist', category: null });

  const grouped = tasks.reduce((acc, task, idx) => {
    const cat = task.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...task, _index: idx });
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24">

      <StickyHeader
        name={meta.name}
        category={meta.category}
        iconKey={checklist.eventType === 'custom' ? (checklist.answers?.iconKey || 'pencil') : null}
        completed={completed}
        total={total}
        pct={pct}
      />

      {/* ── All done banner ── */}
      {allDone && (
        <div className="mt-8 rounded-[32px] bg-neu-bg shadow-neu-raised p-8 text-center">
          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-neu-bg shadow-neu-raised" />
            <div className="absolute inset-[18px] rounded-full bg-neu-bg shadow-neu-inset-deep" />
            <span className="relative text-xl animate-float select-none">🎉</span>
          </div>
          <h2 className="font-display text-lg font-bold text-neu-accent-secondary">You did it!</h2>
          <p className="mt-1 text-sm text-neu-muted">All {total} tasks complete.</p>
        </div>
      )}

      {/* ── Grouped sections ── */}
      <div className="mt-8 space-y-6">
        {Object.entries(grouped).map(([category, items]) => {
          const sectionDone = items.filter((t) => t.completed).length;
          return (
            <section key={category}>
              {/* Section header — raised pill with count badge */}
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-neu-muted">
                  {category}
                </span>
                <div className="flex-1 h-px rounded-full bg-neu-bg shadow-neu-inset-sm" />
                <span className="rounded-full bg-neu-bg shadow-neu-raised-sm px-2.5 py-0.5 text-[10px] font-bold text-neu-accent-secondary tabular-nums">
                  {sectionDone}/{items.length}
                </span>
              </div>

              {/* Task card — items grouped inside a raised container */}
              <div className="rounded-[24px] bg-neu-bg shadow-neu-raised overflow-hidden">
                {items.map((task, i) => (
                  <div key={task._index}>
                    <ChecklistItem
                      task={task}
                      onToggle={() => toggleTask(checklist._id, task._index, !task.completed)}
                      affiliateLink={task.affiliateCategory ? affiliateLinks[task.affiliateCategory] : undefined}
                    />
                    {i < items.length - 1 && (
                      <div className="mx-4 h-px bg-neu-bg shadow-[0_1px_0_rgb(163,177,198,0.25),0_-1px_0_rgba(255,255,255,0.6)]" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Add custom task ── */}
      <div className="mt-8">
        <AddTaskForm
          onAdd={(title, category) => addTask(checklist._id, title, category)}
          existingCategories={tasks.map((t) => t.category).filter(Boolean)}
        />
      </div>

      {/* ── Back link ── */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => navigate(location.key !== 'default' ? -1 : '/history')}
          className="inline-flex items-center gap-2 rounded-2xl bg-neu-bg shadow-neu-raised-sm hover:shadow-neu-raised px-5 py-2.5 text-sm font-medium text-neu-muted hover:text-neu-fg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
        >
          <BackIcon /> Back to history
        </button>
      </div>
    </div>
  );
}
