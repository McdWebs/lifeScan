import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function AddTaskForm({ onAdd, existingCategories = [] }) {
  const [open,        setOpen]        = useState(false);
  const [title,       setTitle]       = useState('');
  const [category,    setCategory]    = useState('');
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [showCatPick, setShowCatPick] = useState(false);
  const titleRef    = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => titleRef.current?.focus(), 80);
  }, [open]);

  const catSuggestions = [...new Set(existingCategories)].filter(
    (c) => c && c !== 'Custom'
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) { setError('Task title is required.'); return; }
    setError('');
    setSaving(true);
    try {
      await onAdd(trimmed, category.trim() || 'Custom');
      setTitle('');
      setCategory('');
      setOpen(false);
    } catch {
      setError('Could not save task. Try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTitle('');
    setCategory('');
    setError('');
    setShowCatPick(false);
    setOpen(false);
  }

  return (
    /*
      No overflow-hidden on the outer card — the dropdown must be able to
      escape vertically. The expand animation uses opacity + translateY on
      the form itself instead of max-h on a clipping wrapper.
    */
    <div className={cn(
      'rounded-[32px] bg-neu-bg transition-all duration-300',
      open ? 'shadow-neu-raised' : 'shadow-neu-raised-sm'
    )}>

      {/* ── Toggle trigger ── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-3 px-6 py-4 rounded-[32px] transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg'
        )}
      >
        <span className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-neu-bg transition-all duration-300',
          open ? 'shadow-neu-inset-sm text-neu-accent' : 'shadow-neu-raised-sm text-neu-muted'
        )}>
          <PlusIcon className="h-4 w-4" />
        </span>

        <span className={cn(
          'flex-1 text-left text-sm font-semibold transition-colors duration-300',
          open ? 'text-neu-accent' : 'text-neu-muted'
        )}>
          Add a custom task
        </span>

        <ChevronDownIcon className={cn(
          'h-4 w-4 text-neu-muted transition-transform duration-300',
          open && 'rotate-180'
        )} />
      </button>

      {/* ── Form — shown/hidden via opacity + translate, NOT max-h/overflow-hidden ── */}
      <div
        aria-hidden={!open}
        className={cn(
          'transition-all duration-300 ease-out',
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden'
        )}
      >
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4">

          {/* Task title */}
          <div>
            <label htmlFor="custom-task-title" className="block text-xs font-semibold uppercase tracking-widest text-neu-muted mb-2">
              Task
            </label>
            <input
              ref={titleRef}
              id="custom-task-title"
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Call the HOA about parking"
              className="input-neu w-full px-4 py-3 text-sm"
              maxLength={200}
            />
          </div>

          {/* Category — dropdown is a sibling of the input wrapper, not nested inside it */}
          <div>
            <label htmlFor="custom-task-category" className="block text-xs font-semibold uppercase tracking-widest text-neu-muted mb-2">
              Category <span className="normal-case font-normal">(optional)</span>
            </label>

            {/* Outer div is position:relative and has NO overflow constraint */}
            <div className="relative">
              <input
                ref={categoryRef}
                id="custom-task-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onFocus={() => catSuggestions.length > 0 && setShowCatPick(true)}
                onBlur={() => setTimeout(() => setShowCatPick(false), 150)}
                placeholder="e.g. Admin — or leave blank for 'Custom'"
                className="input-neu w-full px-4 py-3 text-sm"
                maxLength={60}
                autoComplete="off"
              />

              {/*
                Dropdown: position:absolute, z-50 (higher than any sticky header),
                top-full so it opens downward.
                The parent card has no overflow-hidden, so this renders freely.
              */}
              {showCatPick && catSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl bg-neu-bg shadow-neu-raised-hover">
                  {catSuggestions.map((cat, i) => (
                    <button
                      key={cat}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent input blur before click registers
                        setCategory(cat);
                        setShowCatPick(false);
                        categoryRef.current?.blur();
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-3 text-sm text-neu-fg',
                        'hover:text-neu-accent transition-colors duration-150',
                        i === 0 && 'rounded-t-2xl',
                        i === catSuggestions.length - 1 && 'rounded-b-2xl',
                        i > 0 && 'border-t border-neu-bg shadow-[0_-1px_0_rgb(163,177,198,0.2)]'
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-neu-accent shrink-0" />
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-2xl bg-neu-bg shadow-neu-inset-sm px-4 py-2.5 text-xs text-red-400">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="btn-primary px-5 py-2.5 text-sm"
            >
              {saving ? 'Saving…' : 'Add task'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
