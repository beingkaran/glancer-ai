import { useEffect, useRef, useState } from 'react';

/*
 * Cloudflare Turnstile — a free, privacy-friendly CAPTCHA that protects the
 * auth endpoints from bots/abuse.
 *
 * Opt-in: only renders when VITE_TURNSTILE_SITE_KEY is set. When unset, this
 * component renders nothing and immediately reports an empty token, so local
 * dev and unconfigured installs are unaffected.
 *
 * Pair it with Supabase: enable Bot/Abuse protection (Turnstile) in
 * Authentication → Settings and paste the matching SECRET key there. The token
 * produced here is then passed as `captchaToken` to signUp/signIn/reset.
 */

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
export const isCaptchaEnabled = Boolean(TURNSTILE_SITE_KEY);

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    let s = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (s) {
      s.addEventListener('load', () => resolve());
      s.addEventListener('error', reject);
      return;
    }
    s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/*
 * Props:
 *   onToken(token)  — called with a fresh token (or '' when it expires)
 *   theme           — 'dark' | 'light' (default 'dark')
 *   resetKey        — change this value to force a re-render of the widget
 *                     (Turnstile tokens are single-use; reset after a failed try)
 */
export default function Turnstile({ onToken, theme = 'dark', resetKey = 0 }) {
  const ref = useRef(null);
  const widgetId = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCaptchaEnabled) {
      onToken?.(''); // nothing to solve — let the form proceed
      return;
    }
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        // Clean any prior instance before (re)rendering.
        if (widgetId.current != null) {
          try { window.turnstile.remove(widgetId.current); } catch { /* ignore */ }
        }
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme,
          callback: (token) => onToken?.(token),
          'expired-callback': () => onToken?.(''),
          'error-callback': () => { onToken?.(''); setError('CAPTCHA failed to load — please retry.'); },
        });
      })
      .catch(() => setError('Could not load CAPTCHA. Check your connection and retry.'));

    return () => {
      cancelled = true;
      if (widgetId.current != null && window.turnstile) {
        try { window.turnstile.remove(widgetId.current); } catch { /* ignore */ }
        widgetId.current = null;
      }
    };
    // resetKey forces a fresh widget (and thus a fresh token) on demand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, theme]);

  if (!isCaptchaEnabled) return null;

  return (
    <div style={{ marginBottom: 14 }}>
      <div ref={ref} />
      {error && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 6 }}>{error}</p>}
    </div>
  );
}
