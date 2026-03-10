import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-neu-bg shadow-neu-raised">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to={user ? '/home' : '/'}
            className="flex items-center gap-3 font-display text-xl font-bold text-neu-accent tracking-tight rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-raised-sm">
              <img
                src="/life-check-icon.svg"
                alt="LifeScan logo"
                className="h-7 w-7"
              />
            </span>
            <span className="leading-none">LifeScan</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg',
                      isActive
                        ? 'text-neu-accent shadow-neu-inset-sm'
                        : 'text-neu-muted shadow-neu-raised-sm hover:text-neu-fg hover:shadow-neu-raised'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={cn(
                    'px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg',
                    location.pathname === '/login'
                      ? 'text-neu-accent shadow-neu-inset-sm'
                      : 'text-neu-muted shadow-neu-raised-sm hover:text-neu-fg hover:shadow-neu-raised'
                  )}
                >
                  Sign in with Google
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            type="button"
            className="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-raised-sm text-neu-muted hover:text-neu-fg active:shadow-neu-inset-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={cn(
          'sm:hidden overflow-hidden transition-all duration-300 ease-out',
          mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mx-4 mb-4 rounded-[24px] bg-neu-bg shadow-neu-raised px-3 py-3 space-y-1">
          {user ? (
            navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg',
                    isActive
                      ? 'text-neu-accent shadow-neu-inset-sm'
                      : 'text-neu-muted hover:text-neu-fg shadow-neu-raised-sm'
                  )}
                >
                  {link.label}
                </Link>
              );
            })
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300',
                  location.pathname === '/login'
                    ? 'text-neu-accent shadow-neu-inset-sm'
                    : 'text-neu-muted hover:text-neu-fg shadow-neu-raised-sm'
                )}
              >
                Sign in with Google
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
