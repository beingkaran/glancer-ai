import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Turnstile, { isCaptchaEnabled } from './Turnstile';

/*
 * AuthForm — real email + password sign in / sign up / password reset (Supabase).
 *
 * A password is always required; identity is verified by the server, so no user
 * can sign in as another, and no user data is visible without a valid session.
 * Optionally protected by a Cloudflare Turnstile CAPTCHA (see Turnstile.jsx).
 */
export default function AuthForm({ onSuccess }) {
  const { signIn, signUp, resetPassword, configured } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0); // bump to reset the widget

  if (!configured) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚙️</div>
        Sign-in isn't configured yet. Add <code>VITE_SUPABASE_URL</code> and{' '}
        <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file and restart the dev server.
      </div>
    );
  }

  // Tokens are single-use — force a fresh CAPTCHA after each attempt.
  function resetCaptcha() {
    setCaptchaToken('');
    setCaptchaKey((k) => k + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    const mail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (mode !== 'forgot' && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (isCaptchaEnabled && !captchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signup') {
        const { needsConfirmation } = await signUp({ name, email: mail, password, captchaToken });
        if (needsConfirmation) {
          setInfo('Account created! Check your email to confirm, then sign in.');
          setMode('signin');
          setPassword('');
        } else {
          onSuccess?.();
        }
      } else if (mode === 'forgot') {
        await resetPassword({ email: mail, captchaToken });
        setInfo('If an account exists for that email, a password-reset link is on its way.');
      } else {
        await signIn({ email: mail, password, captchaToken });
        onSuccess?.();
      }
    } catch (err) {
      setError(friendlyError(err?.message));
    } finally {
      setBusy(false);
      resetCaptcha();
    }
  }

  function switchMode(m) {
    setMode(m);
    setError('');
    setInfo('');
    resetCaptcha();
  }

  const submitLabel =
    mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In';

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
      {/* Tabs (hidden in forgot mode) */}
      {mode !== 'forgot' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'var(--surface)', padding: 4, borderRadius: 10 }}>
          {['signin', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 600,
                background: mode === m ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>
      )}

      {mode === 'forgot' && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Reset your password
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            Enter your email and we'll send a link to set a new password.
          </p>
        </div>
      )}

      {mode === 'signup' && (
        <div style={{ marginBottom: 12 }}>
          <label className="field-label">Full name</label>
          <input className="field-input" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your name" autoComplete="name" />
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label className="field-label">Email</label>
        <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" autoComplete="email" />
      </div>

      {mode !== 'forgot' && (
        <div style={{ marginBottom: 6, position: 'relative' }}>
          <label className="field-label">Password</label>
          <input
            className="field-input"
            type={showPw ? 'text' : 'password'}
            style={{ paddingRight: 44 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
          <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 10, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
            {showPw ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
      )}

      {/* Forgot-password link (sign-in only) */}
      {mode === 'signin' && (
        <div style={{ textAlign: 'right', marginBottom: 14 }}>
          <button type="button" onClick={() => switchMode('forgot')}
            style={{ background: 'none', border: 'none', color: 'var(--purple)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>
            Forgot password?
          </button>
        </div>
      )}
      {mode === 'signup' && <div style={{ height: 8 }} />}

      {/* CAPTCHA (renders only when VITE_TURNSTILE_SITE_KEY is set) */}
      <Turnstile onToken={setCaptchaToken} resetKey={captchaKey} theme="dark" />

      {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}
      {info && <p style={{ color: '#22C55E', fontSize: '0.8rem', marginBottom: 12 }}>{info}</p>}

      <button type="submit" disabled={busy} className="search-btn"
        style={{ width: '100%', border: 'none', cursor: busy ? 'wait' : 'pointer', padding: '13px', borderRadius: 10, fontSize: '0.95rem', opacity: busy ? 0.7 : 1 }}>
        {busy ? 'Please wait…' : submitLabel}
      </button>

      {mode === 'forgot' && (
        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <button type="button" onClick={() => switchMode('signin')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem' }}>
            ← Back to sign in
          </button>
        </p>
      )}
    </form>
  );
}

// Map Supabase's raw messages to something friendlier.
function friendlyError(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'Wrong email or password.';
  if (m.includes('already registered')) return 'That email already has an account — try signing in.';
  if (m.includes('email not confirmed')) return 'Please confirm your email first (check your inbox).';
  if (m.includes('captcha')) return 'CAPTCHA check failed. Please try again.';
  return msg || 'Something went wrong. Please try again.';
}
