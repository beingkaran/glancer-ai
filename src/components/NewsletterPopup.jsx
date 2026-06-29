import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeNewsletter } from '../lib/newsletter';

/*
 * NewsletterPopup — appears once, ~60s after an UNSIGNED visitor lands, inviting
 * them to subscribe. Name + email are stored (plain text) in Supabase. Once a
 * visitor subscribes or dismisses, we never show it again (localStorage flag).
 */

const STORAGE_KEY = 'glancer_newsletter_seen';
const DELAY_MS = 60 * 1000; // 1 minute

const MailIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function NewsletterPopup() {
  const { isAuthed } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | busy | done | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthed) return;
    let seen = false;
    try { seen = localStorage.getItem(STORAGE_KEY) === '1'; } catch { /* ignore */ }
    if (seen) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [isAuthed]);

  // A signed-in user never needs the prompt — close it if they log in meanwhile.
  useEffect(() => { if (isAuthed) setOpen(false); }, [isAuthed]);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
    setOpen(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setState('busy');
    setError('');
    try {
      await subscribeNewsletter({ name, email });
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
      setState('done');
      setTimeout(() => setOpen(false), 2200);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setState('error');
    }
  };

  if (!open) return null;

  return (
    <div className="nl-overlay" role="dialog" aria-modal="true" aria-label="Subscribe to AI News">
      <div className="nl-card glass">
        <button type="button" className="nl-close" onClick={dismiss} aria-label="Close">
          <XIcon />
        </button>

        {state === 'done' ? (
          <div className="nl-success">
            <div className="nl-icon" aria-hidden="true">✓</div>
            <h3 className="nl-title">You&apos;re in! 🎉</h3>
            <p className="nl-sub">Your first AI digest lands tomorrow. Thanks for joining Glancer AI.</p>
          </div>
        ) : (
          <>
            <div className="nl-icon" aria-hidden="true"><MailIcon /></div>
            <h3 className="nl-title">Be updated with AI News</h3>
            <p className="nl-sub">
              Enter your email — <strong>we will never spam you</strong>, only 1 email daily to catch up
              with all things AI.
            </p>

            <form className="nl-form" onSubmit={submit}>
              <input
                className="nl-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Your name"
                autoComplete="name"
              />
              <input
                className="nl-input"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Your email"
                autoComplete="email"
                required
              />
              {error && <p className="nl-error">{error}</p>}
              <button type="submit" className="nl-submit" disabled={state === 'busy'}>
                {state === 'busy' ? 'Subscribing…' : 'Keep me updated'}
              </button>
            </form>
            <button type="button" className="nl-skip" onClick={dismiss}>No thanks</button>
          </>
        )}
      </div>
    </div>
  );
}
