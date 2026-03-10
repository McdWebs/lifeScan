import { Link } from 'react-router-dom';

const links = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-neu-bg">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Subtle inset separator */}
        <div className="mb-8 h-0.5 rounded-full shadow-neu-inset-sm" />

        <div className="flex justify-center gap-3 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-2xl text-neu-muted shadow-neu-raised-sm hover:text-neu-accent hover:shadow-neu-raised transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neu-bg"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-neu-muted max-w-md mx-auto leading-relaxed">
          Some links may earn us a commission at no extra cost to you.
        </p>
        <p className="mt-2 text-center text-xs text-neu-muted">
          &copy; {new Date().getFullYear()} LifeScan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
