import { cn } from '../lib/utils';

function ArrowIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/**
 * `icon` is a React component (function), not a string.
 * Pass it like: icon={HouseIcon}  — then it's rendered as <Icon className="..." />
 */
export default function EventCard({ title, tagline, icon: Icon, category, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex w-full flex-col rounded-[28px] bg-neu-bg text-left shadow-neu-raised',
        'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-neu-raised-hover',
        'active:translate-y-0.5 active:shadow-neu-inset cursor-pointer overflow-hidden',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg',
        className
      )}
    >
      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Icon well */}
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-inset-deep transition-transform duration-500 ease-out group-hover:scale-110">
          {Icon && (
            <Icon className="h-5 w-5 text-neu-fg transition-colors duration-300 group-hover:text-neu-accent" />
          )}
        </span>

        {/* Text */}
        <div className="flex flex-col gap-1">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-neu-accent">
              {category}
            </span>
          )}
          <h3 className="font-display text-base font-bold text-neu-fg leading-snug transition-colors duration-300 group-hover:text-neu-accent">
            {title}
          </h3>
          <p className="text-xs leading-relaxed text-neu-muted">{tagline}</p>
        </div>
      </div>

      {/* ── Bottom action strip ── */}
      <div
        className={cn(
          'flex items-center justify-between px-6 py-3.5',
          'border-t transition-colors duration-300',
          'border-[color-mix(in_srgb,var(--color-neu-fg)_6%,transparent)]',
          'group-hover:border-[color-mix(in_srgb,var(--color-neu-accent)_15%,transparent)]',
        )}
      >
        <span className="text-xs font-semibold text-neu-accent opacity-0 transition-all duration-300 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0">
          Get started
        </span>
        <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-neu-bg shadow-neu-raised-sm text-neu-accent transition-all duration-300 group-hover:shadow-neu-raised group-hover:translate-x-0.5">
          <ArrowIcon className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}
