import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

/*
 * ResetPasswordPage — where the "forgot password" email link lands.
 *
 * Supabase detects the recovery token in the URL and fires a PASSWORD_RECOVERY
 * auth event, which gives a short-lived session. While that session is active,
 * the user can set a new password via updateUser().
 */
export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false); // recovery session present?
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) { setChecking(false); return; }

    // The recovery event may fire just after load; also check any existing session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) { setReady(true); setChecking(false); }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      setChecking(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err?.message || 'Could not update your password. The link may have expired — request a new one.');
    } finally {
      setBusy(false);
    }
  }

  const wrap = (children) => (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 28, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Account</p>
          <h1 className="page-hero-title" style={{ fontSize: '2rem' }}>Set a new password</h1>
        </div>
        <div className="chart-card" style={{ padding: 32, marginBottom: 80 }}>{children}</div>
      </div>
    </div>
  );

  if (checking) return wrap(<p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Verifying your link…</p>);

  if (done) {
    return wrap(
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.6rem', marginBottom: 12 }}>✅</div>
        <p style={{ color: 'var(--text-secondary)' }}>Password updated! Taking you to your profile…</p>
      </div>,
    );
  }

  if (!ready) {
    return wrap(
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>⏳</div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
          This page only works when opened from a password-reset email link, and the link may have expired.
        </p>
        <Link to="/profile" className="write-cta-btn">← Back to sign in</Link>
      </div>,
    );
  }

  return wrap(
    <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
      <div style={{ marginBottom: 12, position: 'relative' }}>
        <label className="field-label">New password</label>
        <input className="field-input" type={showPw ? 'text' : 'password'} style={{ paddingRight: 44 }}
          value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
        <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
          style={{ position: 'absolute', right: 10, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
          {showPw ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="field-label">Confirm new password</label>
        <input className="field-input" type={showPw ? 'text' : 'password'}
          value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" />
      </div>
      {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}
      <button type="submit" disabled={busy} className="search-btn"
        style={{ width: '100%', border: 'none', cursor: busy ? 'wait' : 'pointer', padding: '13px', borderRadius: 10, fontSize: '0.95rem', opacity: busy ? 0.7 : 1 }}>
        {busy ? 'Updating…' : 'Update Password'}
      </button>
    </form>,
  );
}
