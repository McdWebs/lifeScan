import { useState } from 'react';
import { cn } from '../lib/utils';

export default function ChecklistItem({ task, onToggle, affiliateLink }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      'bg-neu-bg transition-colors duration-300',
      task.completed && 'bg-opacity-90'
    )}>
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 min-h-[52px]">

        {/* Toggle zone — checkbox + label */}
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle();
            }
          }}
          className="flex flex-1 items-center gap-3 cursor-pointer select-none min-w-0 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg rounded-xl"
        >
          {/* Checkbox — inset well, fills teal on complete */}
          <span className={cn(
            'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-lg transition-all duration-300',
            task.completed
              ? 'bg-neu-accent-secondary shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-1px_-1px_3px_rgba(255,255,255,0.15)]'
              : 'shadow-neu-inset-sm'
          )}>
            {task.completed && (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>

          <span className={cn(
            'text-sm leading-snug transition-all duration-300 truncate',
            task.completed
              ? 'line-through text-neu-muted font-normal'
              : 'text-neu-fg font-medium'
          )}>
            {task.title}
          </span>
        </div>

        {/* Actions — outside toggle zone */}
        <div className="flex shrink-0 items-center gap-1.5">
          {affiliateLink && (
            <a
              href={affiliateLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl bg-neu-bg shadow-neu-raised-sm px-2.5 py-1 text-[11px] font-semibold text-neu-accent hover:shadow-neu-raised transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg whitespace-nowrap"
            >
              {affiliateLink.label}
              <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14" />
              </svg>
            </a>
          )}

          {task.description && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-xl bg-neu-bg transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg',
                expanded
                  ? 'shadow-neu-inset-sm text-neu-accent'
                  : 'shadow-neu-raised-sm text-neu-muted hover:text-neu-fg'
              )}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className={cn('h-3.5 w-3.5 transition-transform duration-300', expanded && 'rotate-180')}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Expandable description */}
      <div className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <p className="px-4 pb-4 pt-0 pl-[52px] text-sm text-neu-muted leading-relaxed">
          {task.description}
        </p>
      </div>
    </div>
  );
}
