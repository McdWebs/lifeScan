import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import useSession from '../hooks/useSession';
import useChecklist from '../hooks/useChecklist';
import Loader from '../components/ui/Loader';
import ChecklistItem from '../components/ChecklistItem';
import AddTaskForm from '../components/AddTaskForm';
import affiliateLinks from '../lib/affiliateLinks';
import { useAuth } from '../context/AuthContext';
import { track } from '../utils/analytics';

const eventMeta = {
  boughtHouse: { name: 'Bought a House',     category: 'Real Estate'   },
  newBaby:     { name: 'Had a Baby',          category: 'Family'        },
  newJob:      { name: 'Started a New Job',   category: 'Career'        },
  movedCity:   { name: 'Moved to a New City', category: 'Lifestyle'     },
  gotMarried:  { name: 'Got Married',         category: 'Relationships' },
};

export default function Checklist() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const sessionId = useSession();
  const { token } = useAuth();
  const {
    checklist,
    loading,
    personalizing,
    generateChecklist,
    toggleTask,
    addTask,
    stopPolling,
  } = useChecklist();
  const celebratedRef  = useRef(false);
  const generatedRef   = useRef(false);

  const state = location.state;

  useEffect(() => {
    if (!state?.eventType || !state?.answers) {
      navigate('/', { replace: true });
      return;
    }
    if (generatedRef.current) return;
    generatedRef.current = true;
    generateChecklist(state.eventType, state.answers, sessionId);
    if (token) {
      track('page_view', { page: 'checklist', eventType: state.eventType, sessionId }, { token });
    }
    return () => stopPolling();
  }, [state, navigate, generateChecklist, sessionId, stopPolling, token]);

  const tasks     = checklist?.tasks ?? [];
  const completed = tasks.filter((t) => t.completed).length;
  const total     = tasks.length;
  const allDone   = total > 0 && completed === total;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
  const meta      = state?.eventType === 'custom'
    ? { name: checklist?.answers?.eventTitle || checklist?.answers?.eventDescription || 'Custom Checklist', category: 'AI Generated' }
    : (eventMeta[state?.eventType] ?? { name: 'Your Checklist', category: null });

  useEffect(() => {
    if (allDone && !celebratedRef.current) {
      celebratedRef.current = true;
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [allDone]);

  if (!state?.eventType) return null;
  if (loading && !checklist) return <Loader />;

  const grouped = tasks.reduce((acc, task, idx) => {
    const cat = task.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...task, _index: idx });
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 -mx-4 bg-neu-bg/95 backdrop-blur-md px-4 pt-4 pb-4 shadow-neu-raised">
        <div className="flex items-center gap-3">

          <div className="flex-1 min-w-0">
            {meta.category && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-neu-accent mb-0.5">
                {meta.category}
              </p>
            )}
            <h1 className="font-display text-lg font-bold text-neu-fg leading-snug truncate">
              {meta.name}
            </h1>
          </div>

          {/* Personalizing badge OR ring */}
          {personalizing ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neu-bg shadow-neu-raised-sm px-3 py-1.5 text-xs font-semibold text-neu-accent shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-neu-accent animate-pulse" />
              Personalizing…
            </span>
          ) : (
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
          )}
        </div>

        {/* Thin progress track */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neu-bg shadow-neu-inset-sm">
          <div
            className="h-full rounded-full bg-neu-accent-secondary transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

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
              {/* Section header row */}
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-neu-muted">
                  {category}
                </span>
                <div className="flex-1 h-px rounded-full bg-neu-bg shadow-neu-inset-sm" />
                <span className="rounded-full bg-neu-bg shadow-neu-raised-sm px-2.5 py-0.5 text-[10px] font-bold text-neu-accent-secondary tabular-nums">
                  {sectionDone}/{items.length}
                </span>
              </div>

              {/* Grouped task card */}
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
      {checklist && (
        <div className="mt-8">
          <AddTaskForm
            onAdd={(title, category) => addTask(checklist._id, title, category)}
            existingCategories={tasks.map((t) => t.category).filter(Boolean)}
          />
        </div>
      )}
    </div>
  );
}
