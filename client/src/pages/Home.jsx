import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import EventCard from '../components/EventCard';
import useChecklist from '../hooks/useChecklist';
import useSession from '../hooks/useSession';
import { useAuth } from '../context/AuthContext';

// ── SVG icon components ───────────────────────────────────────────────────────

function HouseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
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
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function RingsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </svg>
  );
}

function SparkleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M3 12h1m16 0h1M4.92 19.08l.7-.7M18.36 5.64l.7-.7" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" opacity="0.3" />
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" strokeWidth={1.5} />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function GraduationIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function PlaneIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

function ZapIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ScaleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" /><path d="M3 6l9-3 9 3" />
      <path d="M6 15l-3-9 6 2.25" /><path d="M18 15l3-9-6 2.25" />
      <path d="M3 15a3 3 0 0 0 6 0H3z" /><path d="M15 15a3 3 0 0 0 6 0h-6z" />
    </svg>
  );
}

function PencilIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// Icon options shown in the picker
const ICON_OPTIONS = [
  { key: 'pencil',     Icon: PencilIcon,     label: 'Custom'      },
  { key: 'house',      Icon: HouseIcon,      label: 'Home'        },
  { key: 'heart',      Icon: HeartIcon,      label: 'Family'      },
  { key: 'briefcase',  Icon: BriefcaseIcon,  label: 'Work'        },
  { key: 'map-pin',    Icon: MapPinIcon,     label: 'Travel'      },
  { key: 'rings',      Icon: RingsIcon,      label: 'Relationship' },
  { key: 'star',       Icon: StarIcon,       label: 'Goal'        },
  { key: 'graduation', Icon: GraduationIcon, label: 'Education'   },
  { key: 'plane',      Icon: PlaneIcon,      label: 'Trip'        },
  { key: 'zap',        Icon: ZapIcon,        label: 'Life change' },
  { key: 'scale',      Icon: ScaleIcon,      label: 'Legal'       },
  { key: 'sparkle',    Icon: SparkleIcon,    label: 'Other'       },
];

// ── Event data ────────────────────────────────────────────────────────────────

const events = [
  { type: 'boughtHouse', title: 'Bought a House',     tagline: 'Everything to do after closing day',  icon: HouseIcon,     category: 'Real Estate'   },
  { type: 'newBaby',     title: 'Had a Baby',          tagline: 'Your first weeks survival guide',     icon: HeartIcon,     category: 'Family'        },
  { type: 'newJob',      title: 'Started a New Job',   tagline: 'Hit the ground running',              icon: BriefcaseIcon, category: 'Career'        },
  { type: 'movedCity',   title: 'Moved to a New City', tagline: 'Get settled in fast',                 icon: MapPinIcon,    category: 'Lifestyle'     },
  { type: 'gotMarried',  title: 'Got Married',         tagline: 'Post-wedding action plan',            icon: RingsIcon,     category: 'Relationships' },
];

// ── Greeting helpers ──────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getFirstName(user) {
  if (!user) return null;
  if (user.name) return user.name.split(' ')[0];
  if (user.email) return user.email.split('@')[0];
  return null;
}

// ── Custom event card ─────────────────────────────────────────────────────────

function CustomEventCard({ onGenerate, loading }) {
  const [name, setName]               = useState('');
  const [iconKey, setIconKey]         = useState('pencil');
  const [pickerOpen, setPickerOpen]   = useState(false);
  const [description, setDescription] = useState('');
  const [inputError, setInputError]   = useState('');
  const nameRef = useRef(null);

  const selectedIcon = ICON_OPTIONS.find((o) => o.key === iconKey) || ICON_OPTIONS[0];
  const SelectedIcon = selectedIcon.Icon;

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed || trimmed.length < 5) {
      setInputError('Please describe your event (at least a few words).');
      return;
    }
    setInputError('');
    onGenerate(trimmed, name.trim() || null, iconKey);
  }

  return (
    <div className="relative rounded-[24px] transition-all duration-500 ease-out overflow-hidden self-start bg-neu-bg shadow-neu-raised">
      <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neu-bg shadow-neu-inset-sm">
                <SparkleIcon className="h-4 w-4 text-neu-accent" />
              </div>
              <p className="font-display text-sm font-bold text-neu-fg">Custom checklist</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-raised-sm hover:shadow-neu-raised transition-all duration-300 text-neu-accent"
                aria-label="Choose icon"
                onClick={(e) => { e.stopPropagation(); setPickerOpen((v) => !v); }}
              >
                <SelectedIcon className="h-5 w-5" />
              </button>
              {pickerOpen && (
                <div className="absolute left-0 top-12 z-50 rounded-2xl bg-neu-bg shadow-neu-raised p-2 grid grid-cols-4 gap-1 w-[168px]">
                  {ICON_OPTIONS.map(({ key, Icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      title={label}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIconKey(key);
                        setPickerOpen(false);
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                        iconKey === key
                          ? 'bg-neu-bg shadow-neu-inset-sm text-neu-accent'
                          : 'bg-neu-bg shadow-neu-raised-sm text-neu-muted hover:text-neu-fg'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              ref={nameRef}
              type="text"
              className="input-neu flex-1 px-3.5 py-2 text-sm"
              placeholder="Name your checklist (optional)"
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <textarea
              className="input-neu w-full px-3.5 py-2.5 text-sm resize-none leading-relaxed"
              rows={2}
              maxLength={300}
              placeholder="Describe what happened… e.g. just got divorced and need to reorganise finances, find a new place to live…"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setInputError(''); }}
              disabled={loading}
            />
            <div className="absolute bottom-2 right-3 text-[10px] text-neu-muted select-none pointer-events-none">
              {description.length}/300
            </div>
          </div>

          {inputError && (
            <p className="text-xs font-medium text-red-500">{inputError}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Building…
                </>
              ) : (
                <>
                  <SendIcon className="h-3 w-3" />
                  Generate checklist
                </>
              )}
            </button>
            {!loading && <p className="text-[11px] text-neu-muted">~5–10 sec</p>}
          </div>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const sessionId = useSession();
  const { user } = useAuth();
  const { generateCustomChecklist, loading: customLoading } = useChecklist();
  const [customError, setCustomError] = useState('');

  const greeting = getGreeting();
  const firstName = getFirstName(user);

  async function handleCustomGenerate(description, name, iconKey) {
    setCustomError('');
    try {
      const data = await generateCustomChecklist(description, sessionId, name, iconKey);
      navigate(`/checklist/${data._id}`);
    } catch (err) {
      setCustomError(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4">

      {/* ══ PERSONAL GREETING ════════════════════════════════════════════════════ */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-neu-accent mb-2">
            {greeting}{firstName ? `, ${firstName}` : ''}
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
            What just happened in your life?
          </h1>
          <p className="mt-3 text-base text-neu-muted max-w-lg">
            Pick an event below and we'll build your personalised action plan — tailored to your situation, ready in minutes.
          </p>
        </div>
      </section>

      {/* ── Section divider ── */}
      <div className="h-px rounded-full bg-neu-bg shadow-neu-inset-sm mx-4 mb-8" />

      {/* ══ CUSTOM AI CHECKLIST ══════════════════════════════════════════════════ */}
      <section className="pb-10">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neu-accent mb-3">
            AI custom checklist
          </p>
          <p className="text-sm text-neu-muted mb-4">
            Describe any life event in your own words — we&apos;ll build a personalised action plan just for you.
          </p>
        </div>

        <div className="w-full">
          <CustomEventCard onGenerate={handleCustomGenerate} loading={customLoading} />
        </div>

        {customError && (
          <p className="mt-4 text-center text-sm font-medium text-red-500">{customError}</p>
        )}
      </section>

      {/* ── Section divider ── */}
      <div className="h-px rounded-full bg-neu-bg shadow-neu-inset-sm mx-4 mb-8" />

      {/* ══ DEFAULT EVENT CARDS ══════════════════════════════════════════════════ */}
      <section className="pb-24">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-neu-fg">
            Or pick a common life event
          </h2>
          <p className="text-xs text-neu-muted">
            We&apos;ll guide you step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard
              key={event.type}
              title={event.title}
              tagline={event.tagline}
              icon={event.icon}
              category={event.category}
              onClick={() => navigate(`/questions/${event.type}`)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
