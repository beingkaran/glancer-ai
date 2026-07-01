import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/*
 * CookieConsent — a lightweight first-visit consent banner. It records the
 * visitor's choice in localStorage and dispatches a `glancer-consent` event so
 * other code (analytics, ad personalization) can react. Essential cookies
 * (auth, preferences) always work; this governs non-essential/advertising use.
 */

const KEY = 'glancer.cookieConsent'; // 'accepted' | 'declined'

export function getCookieConsent() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => getCookieConsent());

  useEffect(() => {
    // Re-check on mount in case another tab set it.
    setChoice(getCookieConsent());
  }, []);

  if (choice === 'accepted' || choice === 'declined') return null;

  const decide = (value) => {
    try { localStorage.setItem(KEY, value); } catch { /* storage blocked */ }
    setChoice(value);
    try { window.dispatchEvent(new CustomEvent('glancer-consent', { detail: value })); } catch { /* noop */ }
  };

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <p>
        We use cookies to keep you signed in, remember your preferences, and — with your consent —
        to show personalized ads that keep Glancer AI free. See our{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn" onClick={() => decide('declined')}>Decline</button>
        <button type="button" className="cookie-btn accept" onClick={() => decide('accepted')}>Accept</button>
      </div>
    </div>
  );
}
