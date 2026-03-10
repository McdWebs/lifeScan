import { useEffect } from 'react';
import { cn } from '../../lib/utils';

const typeConfig = {
  success: { icon: '✓', color: 'text-neu-accent-secondary' },
  error:   { icon: '✕', color: 'text-red-500' },
  info:    { icon: 'ℹ', color: 'text-neu-accent' },
};

export default function Toast({ message, type = 'info', isVisible, onClose }) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  const config = typeConfig[type] ?? typeConfig.info;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[60] flex items-start gap-3 min-w-[280px] max-w-sm rounded-2xl bg-neu-bg px-4 py-4 shadow-neu-raised transition-all duration-300',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
      role="alert"
    >
      {/* Type indicator in a small inset well */}
      <span
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl shadow-neu-inset-sm text-sm font-bold',
          config.color
        )}
      >
        {config.icon}
      </span>

      <p className="flex-1 text-sm text-neu-fg leading-relaxed">{message}</p>

      <button
        onClick={onClose}
        className="flex h-7 w-7 items-center justify-center rounded-xl bg-neu-bg shadow-neu-raised-sm hover:shadow-neu-raised active:shadow-neu-inset-sm text-neu-muted hover:text-neu-fg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
        aria-label="Dismiss"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
