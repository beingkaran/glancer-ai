import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleG = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const DEMO_ACCOUNTS = [
  { name: 'Karan Shah', email: 'karan.igniite@gmail.com' },
  { name: 'Demo Writer', email: 'writer.demo@gmail.com' },
];

/*
 * Google-styled sign-in. The button opens an account-chooser modal that mimics
 * Google's flow but creates a profile locally (so it works on localhost and
 * any deployed host with no OAuth origin setup). To switch to real Google
 * Identity Services later, replace `completeSignIn` with the GIS callback —
 * every consumer keeps working unchanged.
 */
export default function GoogleSignIn({ onSuccess, label = 'Continue with Google', full = false }) {
  const { login } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function completeSignIn(profile) {
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setError('Enter a valid email address.');
      return;
    }
    const picture = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.email)}&background=7C3AED&color=fff&bold=true&size=128`;
    const user = login({ ...profile, picture, provider: 'google' });
    setOpen(false);
    setName(''); setEmail(''); setError('');
    onSuccess?.(user);
  }

  return (
    <>
      <button
        type="button"
        className={`google-btn${full ? ' google-btn-full' : ''}`}
        onClick={() => setOpen(true)}
      >
        <GoogleG /> {label}
      </button>

      {open && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Sign in with Google" onClick={() => setOpen(false)}>
          <div className="google-modal" onClick={(e) => e.stopPropagation()}>
            <div className="google-modal-head">
              <GoogleG size={22} />
              <span>Sign in with Google</span>
            </div>
            <p className="google-modal-sub">Choose an account to continue to <strong>Glancer AI</strong></p>

            <div className="google-accounts">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.email} className="google-account" onClick={() => completeSignIn(a)}>
                  <span className="google-account-avatar" style={{ background: 'linear-gradient(135deg,#7C3AED,#06B6D4)' }}>
                    {a.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </span>
                  <span className="google-account-info">
                    <span className="google-account-name">{a.name}</span>
                    <span className="google-account-email">{a.email}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="google-divider"><span>or use another account</span></div>

            <div className="google-form">
              <input className="field-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="field-input" type="email" placeholder="you@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              {error && <p className="google-error">{error}</p>}
              <button className="google-btn google-btn-full" onClick={() => completeSignIn({ name, email })}>
                <GoogleG /> Continue
              </button>
            </div>

            <p className="google-note">
              Demo sign-in — your profile is stored locally on this device. No password required.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
