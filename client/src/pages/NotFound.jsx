import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* 404 inside nested neumorphic circles */}
      <div className="relative mb-10 flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-neu-bg shadow-neu-raised" />
        <div className="absolute inset-6 rounded-full bg-neu-bg shadow-neu-inset-deep" />
        <span className="relative font-display text-4xl font-extrabold text-neu-muted select-none">
          404
        </span>
      </div>

      <h2 className="font-display text-2xl font-bold text-neu-fg">Page not found</h2>
      <p className="mt-3 max-w-xs text-sm text-neu-muted leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="btn-primary mt-8 inline-flex items-center px-6 py-3 text-sm"
      >
        Go home
      </Link>
    </div>
  );
}
