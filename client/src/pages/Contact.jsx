import { useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) {
      setStatus({ type: 'error', msg: 'Please include a message.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send feedback. Please try again.');
      }
      setStatus({ type: 'success', msg: 'Thanks for your feedback! We\'ll be in touch if needed.' });
      setMessage('');
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
        Feedback
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-neu-muted">
        Have a question, found a bug, or have an idea that would make LifeScan more useful?
        Use this form to send a message directly to the team.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-[28px] bg-neu-bg shadow-neu-raised p-6 sm:p-8">
        <div className="space-y-1.5">
          <label htmlFor="fb-name" className="block text-sm font-medium text-neu-muted">
            Name
          </label>
          <input
            id="fb-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
            className="input-neu w-full px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fb-email" className="block text-sm font-medium text-neu-muted">
            Email
          </label>
          <input
            id="fb-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Where we can reach you (optional)"
            className="input-neu w-full px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fb-subject" className="block text-sm font-medium text-neu-muted">
            Subject
          </label>
          <input
            id="fb-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Feedback, bug report, question…"
            className="input-neu w-full px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fb-message" className="block text-sm font-medium text-neu-muted">
            Message
          </label>
          <textarea
            id="fb-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="input-neu w-full px-4 py-3 text-sm resize-vertical"
            placeholder="Tell us what’s on your mind."
          />
        </div>

        {status && (
          <p className={`text-sm ${status.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
            {status.msg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary inline-flex items-center justify-center px-5 py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send feedback'}
        </button>
      </form>
    </div>
  );
}
