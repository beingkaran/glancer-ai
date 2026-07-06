import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignalTicker from './SignalTicker';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const PenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// Primary nav leads with the dev/enterprise thesis. "Free AI Tools" is demoted
// to a secondary utility link (mobile menu + footer) so it still gets crawled
// for long-tail SEO without diluting the observability positioning.
const NAV_LINKS = [
  { label: 'News', to: '/news' },
  { label: 'Events', to: '/events' },
  { label: 'Topics', to: '/topics' },
  { label: 'Glossary', to: '/glossary' },
  { label: 'About', to: '/about' },
];

function UserIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export default function Navbar({ theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isAuthed } = useAuth();
  // Signal ticker lives in the masthead on the front page only.
  const showTicker = pathname === '/';

  // Slide the floating menu up out of the way when the reader scrolls down into
  // page content (e.g. the Write editor), and bring it back on scroll up. Keeps
  // the glass navbar from overlapping content beneath it.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80 || mobileOpen) {
        setHidden(false);
      } else if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current);
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  // Writing requires an account; send signed-out users to the profile page.
  const handleWrite = (e) => {
    if (!isAuthed) {
      e.preventDefault();
      navigate('/profile');
    }
  };

  const initials = isAuthed
    ? (user.name || user.email).split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <header className={`navbar${hidden ? ' navbar-hidden' : ''}`}>
      <div className="masthead-top">
        <div className="masthead-left">
          <button
            type="button"
            className="masthead-pill"
            onClick={() => window.dispatchEvent(new Event('glancer:newsletter-open'))}
          >
            Get the newsletter
          </button>
          <div className="masthead-utils">
            <Link to="/ai-tools">Free AI tools</Link>
            <Link to="/metrics">Live metrics</Link>
            <Link to="/blog/write" onClick={handleWrite}>Write a blog</Link>
          </div>
        </div>

        <div className="masthead-right">
          <div className="nav-actions">
            <Link to="/blog/write" className="write-btn" aria-label="Publish your own blogs" title="Publish your own blogs" onClick={handleWrite}>
              <PenIcon />
            </Link>
            {isAuthed ? (
              <Link to="/profile" className="nav-avatar" aria-label="Your profile" title={user.name}>
                {user.picture
                  ? <img src={user.picture} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  : <span>{initials}</span>}
              </Link>
            ) : (
              <Link to="/profile" className="icon-btn" aria-label="Sign in">
                <UserIcon />
              </Link>
            )}
            <button
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              className="icon-btn menu-btn"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
          <Link className="nav-logo" to="/" aria-label="Glancer AI home">
            <span className="nav-logo-word">
              <span className="nav-logo-text">Glancer</span>
              <span className="nav-logo-dot">AI</span>
            </span>
            <span className="nav-logo-sub">The AI Intelligence Desk</span>
          </Link>
        </div>
      </div>

      <nav className="masthead-pillars" aria-label="Main navigation">
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <nav className={`mobile-nav${mobileOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.label}
            to={link.to}
            className="nav-link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/ai-tools" className="nav-link" onClick={() => setMobileOpen(false)}>
          Free AI Tools
        </Link>
        <Link to="/blog/write" className="nav-link" onClick={(e) => { setMobileOpen(false); handleWrite(e); }}>
          Write a Blog
        </Link>
        <Link to="/profile" className="nav-link" onClick={() => setMobileOpen(false)}>
          {isAuthed ? 'My Profile' : 'Sign In'}
        </Link>
        <Link to="/privacy" className="nav-link" onClick={() => setMobileOpen(false)}>
          Privacy Policy
        </Link>
      </nav>

      {showTicker && <SignalTicker />}
    </header>
  );
}
