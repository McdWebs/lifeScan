import { Link, useLocation } from 'react-router-dom';

export default function Register() {
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center font-display text-2xl font-bold text-neu-fg">
          Sign up with Google
        </h1>

        <div className="rounded-[32px] bg-neu-bg p-8 shadow-neu-raised">
          <a
            href={`/api/auth/google?redirect=${encodeURIComponent(from)}`}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 533.5 544.3"
              aria-hidden="true"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.5h147.3c-6.4 34.6-25.7 63.9-54.7 83.5v69.4h88.4c51.7-47.6 80.5-117.8 80.5-198z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c73.1 0 134.5-24.1 179.3-65.4l-88.4-69.4c-24.6 16.5-56.1 26-90.9 26-69.9 0-129.2-47.1-150.5-110.5H30.8v69.9C75.3 486.2 167 544.3 272 544.3z"
              />
              <path
                fill="#fbbc04"
                d="M121.5 325c-9.9-29.6-9.9-61.4 0-91l-90.7-69.9C4.5 205.7 0 238.1 0 272s4.5 66.3 30.8 107.9l90.7-69.9z"
              />
              <path
                fill="#ea4335"
                d="M272 107.7c38.9-.6 76.1 14.7 104.4 42.5l77.7-77.7C406.1 24.7 345.1 0 272 0 167 0 75.3 58.1 30.8 164.1l90.7 69.9C142.8 154.8 202.1 107.7 272 107.7z"
              />
            </svg>
            <span>Continue with Google</span>
          </a>
        </div>

        <p className="mt-6 text-center text-sm text-neu-muted">
          Already set up with Google?{' '}
          <Link
            to="/login"
            className="font-semibold text-neu-accent hover:text-neu-accent-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent rounded"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
