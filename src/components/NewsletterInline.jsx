import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeNewsletter } from '../lib/newsletter';

/*
 * NewsletterInline — a prominent, in-page email capture band. Unlike the
 * time-delayed popup, this is a permanent, high-visibility conversion point
 * placed on high-intent pages (topic hubs, home). Converting search traffic
 * into owned email subscribers is the retention loop that reduces reliance on
 * Google's algorithm over time.
 */
export default function NewsletterInline({ source = 'inline', compact = false }) {
  const { isAuthed } = useAuth();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | busy | done | error
  const [error, setError] = useState('');

  // Signed-in readers already get the digest — no need to nag them.
  if (isAuthed) return null;

  const submit = async (e) => {
    e.preventDefault();
    setState('busy');
    setError('');
    try {
      await subscribeNewsletter({ email, source });
      setState('done');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setState('error');
    }
  };

  return (
    <section className={`nl-inline${compact ? ' nl-inline-compact' : ''}`} aria-label="Subscribe to the weekly AI digest">
      <div className="nl-inline-copy">
        <h2 className="nl-inline-title">Get the signal, skip the fluff</h2>
        <p className="nl-inline-sub">The week’s most important AI news — curated, summarised, delivered weekly. No spam.</p>
      </div>
      {state === 'done' ? (
        <p className="nl-inline-done" role="status">You’re in. Watch your inbox for the next issue. ✓</p>
      ) : (
        <form className="nl-inline-form" onSubmit={submit}>
          <input
            type="email"
            className="nl-inline-input"
            placeholder="you@work.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
            autoComplete="email"
          />
          <button type="submit" className="nl-inline-btn" disabled={state === 'busy'}>
            {state === 'busy' ? 'Subscribing…' : 'Get the digest'}
          </button>
          {state === 'error' && <span className="nl-inline-err" role="alert">{error}</span>}
        </form>
      )}
    </section>
  );
}
