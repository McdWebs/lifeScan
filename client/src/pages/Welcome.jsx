import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── Icon components ────────────────────────────────────────────────────────────

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

function SparkleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M3 12h1m16 0h1M4.92 19.08l.7-.7M18.36 5.64l.7-.7" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" opacity="0.3" />
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" strokeWidth={1.5} />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ListIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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

// ── Static preview tasks ───────────────────────────────────────────────────────

const previewTasks = [
  { done: true,  label: 'Set up utilities & internet' },
  { done: true,  label: 'Transfer home insurance' },
  { done: true,  label: 'Update mailing address' },
  { done: false, label: 'Register to vote at new address' },
  { done: false, label: 'Schedule deep clean' },
];

// ── How it works steps ────────────────────────────────────────────────────────

const steps = [
  { num: '1', icon: MapPinIcon,  title: 'Pick your event',   desc: 'Choose what just happened in your life — house, baby, new job, and more.' },
  { num: '2', icon: SparkleIcon, title: 'Answer a few Qs',   desc: 'We ask a handful of questions to tailor the list to your exact situation.' },
  { num: '3', icon: ListIcon,    title: 'Get your plan',     desc: 'A clear, personalised checklist — ready in under 2 minutes.' },
];

// ── Feature cards ─────────────────────────────────────────────────────────────

const features = [
  {
    icon: SparkleIcon,
    title: 'AI-personalised',
    desc: 'No generic templates. Every checklist is generated by AI based on your specific answers — your location, family size, situation.',
  },
  {
    icon: ClockIcon,
    title: 'Ready in minutes',
    desc: 'From choosing your event to having a full action plan takes less than 2 minutes. No account setup required to try it.',
  },
  {
    icon: ListIcon,
    title: 'Track your progress',
    desc: 'Check off tasks as you go. Your progress is saved automatically so you can pick up right where you left off.',
  },
  {
    icon: ShieldIcon,
    title: 'Nothing slips through',
    desc: 'Our checklists cover the things people forget — the admin, the paperwork, the small stuff that adds up.',
  },
  {
    icon: ZapIcon,
    title: 'Any life event',
    desc: 'Preset events for the most common moments, plus a custom option so you can describe anything and get a plan.',
  },
  {
    icon: UserIcon,
    title: 'Built for real life',
    desc: 'Made by people who\'ve been through the chaos of big life changes and wished they had a smarter checklist.',
  },
];

// ── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "We moved cities and had a baby in the same month. I was completely overwhelmed until I found this. The checklist covered things I never would have thought of on my own.",
    name: "Sarah M.",
    context: "New mum & recent mover",
  },
  {
    quote: "Started a new job and used the checklist to get my admin sorted in the first week. Honestly saved me so much mental energy.",
    name: "James T.",
    context: "Software engineer",
  },
  {
    quote: "Buying our first home was stressful enough. Having a personalised action plan for the weeks after closing was a game-changer.",
    name: "Priya & Daniel",
    context: "First-time homeowners",
  },
];

// ── Life events covered ───────────────────────────────────────────────────────

const lifeEvents = [
  { icon: HouseIcon,     label: 'Bought a house'    },
  { icon: HeartIcon,     label: 'Had a baby'         },
  { icon: BriefcaseIcon, label: 'New job'            },
  { icon: MapPinIcon,    label: 'Moved to a new city'},
  { icon: SparkleIcon,   label: 'Any life event…'    },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Welcome() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4">

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <section className="pt-14 pb-10 sm:pt-20 sm:pb-14 lg:pt-28 lg:pb-20">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-center lg:gap-14">

          {/* ── Copy ── */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 rounded-full bg-neu-bg shadow-neu-inset-sm px-4 py-1.5 animate-fade-up"
              style={{ animationDelay: '0.05s' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neu-accent animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-neu-accent">
                AI-powered · Personalised for you
              </span>
            </div>

            <h1
              className="mt-6 font-display text-5xl font-extrabold tracking-tight text-neu-fg sm:text-6xl xl:text-[4.5rem] xl:leading-[1.08] animate-fade-up"
              style={{ animationDelay: '0.15s' }}
            >
              Something big<br />
              just happened.{' '}
              <span className="relative inline-block">
                <span className="text-neu-accent">Now what?</span>
                <span
                  className="absolute -bottom-1.5 left-0 right-0 h-1 rounded-full bg-neu-bg shadow-neu-inset-sm"
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p
              className="mx-auto mt-7 max-w-[440px] text-lg leading-relaxed text-neu-muted lg:mx-0 animate-fade-up"
              style={{ animationDelay: '0.28s' }}
            >
              Buying a house, having a baby, starting a new job — life's biggest
              moments come with a hundred things to sort out. We turn that
              overwhelm into a clear, personalised checklist so nothing slips
              through the cracks.
            </p>

            {/* Steps strip */}
            <div
              className="mt-11 flex flex-col gap-3 sm:flex-row sm:gap-0 sm:items-stretch rounded-2xl sm:rounded-2xl sm:bg-neu-bg sm:shadow-neu-inset-sm sm:overflow-hidden lg:max-w-[480px] animate-fade-up"
              style={{ animationDelay: '0.42s' }}
            >
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex sm:flex-col sm:flex-1 items-center sm:items-start gap-3 sm:gap-2 rounded-2xl bg-neu-bg shadow-neu-inset-sm sm:shadow-none sm:rounded-none px-4 py-3 sm:px-5 sm:py-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-neu-bg shadow-neu-raised-sm text-xs font-extrabold text-neu-accent">
                    {step.num}
                  </span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-neu-fg leading-tight">{step.title}</p>
                    <p className="mt-0.5 text-[11px] text-neu-muted leading-snug hidden sm:block">{step.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRightIcon className="hidden sm:block ml-auto h-3.5 w-3.5 shrink-0 text-neu-muted opacity-40 self-center" />
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-fade-up"
              style={{ animationDelay: '0.54s' }}
            >
              {user ? (
                <Link
                  to="/home"
                  className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold"
                >
                  <SparkleIcon className="h-4 w-4" />
                  Go to your dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold"
                  >
                    <SparkleIcon className="h-4 w-4" />
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ── Product preview (desktop) ── */}
          <div className="relative hidden lg:block shrink-0 w-[380px] xl:w-[420px] animate-scale-in" style={{ animationDelay: '0.4s' }}>
            {/* Ambient orbs */}
            <div className="absolute -top-10 left-10 h-16 w-16 rounded-full bg-neu-bg shadow-neu-raised animate-float animate-drift" style={{ animationDelay: '0s', animationDuration: '4s' }} />
            <div className="absolute -top-5 right-2 h-10 w-10 rounded-full bg-neu-bg shadow-neu-raised-sm animate-float" style={{ animationDelay: '1.3s', animationDuration: '3.2s' }} />
            <div className="absolute top-1/2 -right-8 h-8 w-8 rounded-full bg-neu-bg shadow-neu-inset-sm animate-drift" style={{ animationDelay: '1s', animationDuration: '9s' }} />
            <div className="absolute -bottom-8 left-16 h-12 w-12 rounded-full bg-neu-bg shadow-neu-raised animate-float" style={{ animationDelay: '0.7s', animationDuration: '3.7s' }} />
            <div className="absolute bottom-10 -left-5 h-7 w-7 rounded-full bg-neu-bg shadow-neu-raised-sm animate-float animate-drift" style={{ animationDelay: '2s', animationDuration: '5s' }} />

            <div className="relative rounded-[40px] bg-neu-bg shadow-neu-raised p-7">
              <div className="absolute inset-x-8 -bottom-4 h-12 rounded-[32px] bg-neu-bg shadow-neu-raised-sm" />
              <div className="relative rounded-[28px] bg-neu-bg shadow-neu-raised p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-inset-deep">
                    <HouseIcon className="h-5 w-5 text-neu-fg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-bold text-neu-fg leading-tight">Bought a House</p>
                    <p className="mt-0.5 text-xs font-medium text-neu-accent">Real Estate · 2 tasks remaining</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neu-bg shadow-neu-inset-sm">
                    <div className="h-full rounded-full bg-neu-accent-secondary transition-all duration-700 ease-out" style={{ width: '60%' }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] font-medium text-neu-muted">
                    <span>3 of 5 complete</span>
                    <span className="text-neu-accent-secondary font-bold">60%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {previewTasks.map((task, i) => (
                    <div key={i} className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 bg-neu-bg ${task.done ? 'shadow-neu-inset-sm opacity-70' : 'shadow-neu-raised-sm'}`}>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ${task.done ? 'bg-neu-accent-secondary shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-1px_-1px_3px_rgba(255,255,255,0.15)]' : 'shadow-neu-inset-sm'}`}>
                        {task.done && <CheckIcon className="h-3 w-3 text-white" />}
                      </span>
                      <span className={`text-xs leading-snug flex-1 min-w-0 truncate ${task.done ? 'line-through text-neu-muted' : 'font-medium text-neu-fg'}`}>
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neu-bg shadow-neu-raised-sm px-3 py-1.5 text-[10px] font-semibold text-neu-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-neu-accent animate-pulse" />
                  AI-personalized for you
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile preview */}
        <div className="mt-10 lg:hidden animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="mx-auto max-w-sm rounded-[28px] bg-neu-bg shadow-neu-raised p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-inset-deep">
                <HouseIcon className="h-5 w-5 text-neu-fg" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-neu-fg">Bought a House</p>
                <p className="text-xs font-medium text-neu-accent">Real Estate · 2 tasks remaining</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-neu-bg shadow-neu-inset-sm">
                <div className="h-full w-3/5 rounded-full bg-neu-accent-secondary" />
              </div>
              <div className="mt-1 flex justify-between text-[10px] font-medium text-neu-muted">
                <span>3 of 5 complete</span>
                <span className="text-neu-accent-secondary font-bold">60%</span>
              </div>
            </div>
            <div className="space-y-2">
              {previewTasks.slice(0, 3).map((task, i) => (
                <div key={i} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 bg-neu-bg ${task.done ? 'shadow-neu-inset-sm' : 'shadow-neu-raised-sm'}`}>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ${task.done ? 'bg-neu-accent-secondary shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]' : 'shadow-neu-inset-sm'}`}>
                    {task.done && <CheckIcon className="h-3 w-3 text-white" />}
                  </span>
                  <span className={`text-xs flex-1 truncate ${task.done ? 'line-through text-neu-muted' : 'font-medium text-neu-fg'}`}>{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px rounded-full bg-neu-bg shadow-neu-inset-sm mx-4 mb-16" />

      {/* ══ LIFE EVENTS COVERED ═════════════════════════════════════════════════ */}
      <section className="pb-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-neu-accent mb-4">What we cover</p>
        <h2 className="font-display text-3xl font-bold text-neu-fg mb-3">Built for life's biggest moments</h2>
        <p className="text-sm text-neu-muted max-w-md mx-auto mb-10">
          Whether you've just signed the mortgage papers, brought a newborn home, or quit your job to start fresh — we've got a plan for you.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {lifeEvents.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-2xl bg-neu-bg shadow-neu-raised-sm px-4 py-3 hover:shadow-neu-raised transition-all duration-300"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neu-bg shadow-neu-inset-sm">
                <Icon className="h-4 w-4 text-neu-accent" />
              </div>
              <span className="text-sm font-medium text-neu-fg">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px rounded-full bg-neu-bg shadow-neu-inset-sm mx-4 mb-16" />

      {/* ══ HOW IT WORKS — DETAILED ════════════════════════════════════════════ */}
      <section className="pb-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-neu-accent mb-4">Simple by design</p>
          <h2 className="font-display text-3xl font-bold text-neu-fg mb-3">From chaos to clarity in 3 steps</h2>
          <p className="text-sm text-neu-muted max-w-md mx-auto">
            No complicated setup. No fluff. Just tell us what happened and we'll build you a checklist that's actually useful.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div key={i} className="rounded-[28px] bg-neu-bg shadow-neu-raised p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-raised-sm text-lg font-extrabold text-neu-accent">
                  {step.num}
                </span>
                <step.icon className="h-5 w-5 text-neu-muted" />
              </div>
              <h3 className="font-display text-base font-bold text-neu-fg mb-2">{step.title}</h3>
              <p className="text-sm text-neu-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px rounded-full bg-neu-bg shadow-neu-inset-sm mx-4 mb-16" />

      {/* ══ FEATURES ════════════════════════════════════════════════════════════ */}
      <section className="pb-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-neu-accent mb-4">Why LifeScan</p>
          <h2 className="font-display text-3xl font-bold text-neu-fg mb-3">Everything you need, nothing you don't</h2>
          <p className="text-sm text-neu-muted max-w-md mx-auto">
            We built the tool we wished existed every time life got complicated.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="rounded-[28px] bg-neu-bg shadow-neu-raised p-6 flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-inset-deep">
                <f.icon className="h-5 w-5 text-neu-accent" />
              </div>
              <h3 className="font-display text-sm font-bold text-neu-fg">{f.title}</h3>
              <p className="text-sm text-neu-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px rounded-full bg-neu-bg shadow-neu-inset-sm mx-4 mb-16" />

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════════════ */}
      <section className="pb-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-neu-accent mb-4">Real stories</p>
          <h2 className="font-display text-3xl font-bold text-neu-fg mb-3">Life happened. They were ready.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-[28px] bg-neu-bg shadow-neu-raised p-6 flex flex-col gap-4">
              {/* Quote mark */}
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neu-bg shadow-neu-inset-sm text-neu-accent font-display text-xl font-extrabold leading-none select-none">
                "
              </div>
              <p className="text-sm text-neu-fg leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-2.5 pt-2 border-t border-transparent" style={{ borderColor: 'color-mix(in srgb, var(--color-neu-fg) 8%, transparent)' }}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neu-bg shadow-neu-raised-sm">
                  <UserIcon className="h-4 w-4 text-neu-muted" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neu-fg leading-tight">{t.name}</p>
                  <p className="text-[11px] text-neu-muted">{t.context}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px rounded-full bg-neu-bg shadow-neu-inset-sm mx-4 mb-16" />

      {/* ══ FINAL CTA ════════════════════════════════════════════════════════════ */}
      <section className="pb-24 text-center">
        <div className="inline-block rounded-[40px] bg-neu-bg shadow-neu-raised px-10 py-12 max-w-xl mx-auto w-full">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-[22px] bg-neu-bg shadow-neu-inset-deep mb-5">
            <SparkleIcon className="h-6 w-6 text-neu-accent" />
          </div>
          <h2 className="font-display text-2xl font-bold text-neu-fg mb-3">Ready to take control?</h2>
          <p className="text-sm text-neu-muted leading-relaxed mb-8 max-w-sm mx-auto">
            Create a free account and get your personalised action plan in under 2 minutes. No credit card, no fluff.
          </p>
          {user ? (
            <Link
              to="/home"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold"
            >
              <SparkleIcon className="h-4 w-4" />
              Go to your dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold"
              >
                <SparkleIcon className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
