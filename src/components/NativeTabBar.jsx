import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import ReadLaterPanel from './ReadLaterPanel';
import { getSavedCount } from '../lib/readLater';

/*
 * NativeTabBar — the bottom tab bar that only exists inside the Capacitor
 * shells. The website keeps its masthead + hamburger; an app that navigates
 * through a hamburger feels like a bookmark, not an app.
 *
 * Deliberately NOT the same list as the website's NAV_LINKS. Events, Glossary
 * and About are browsing destinations that belong in a menu. Saved is the thing
 * a phone reader actually reaches for and has no top-level home on the web, so
 * it gets a tab here: it opens the existing ReadLaterPanel drawer rather than a
 * route, since there is no /saved page and inventing one would mean a route
 * that only ever renders inside the app.
 *
 * Rendered only when Capacitor reports a native platform, so the web bundle
 * mounts nothing and the DOM is unchanged for crawlers.
 */

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);
const NewsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 5h11a1 1 0 0 1 1 1v13H5a1 1 0 0 1-1-1z" /><path d="M16 9h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3" />
    <line x1="7" y1="9" x2="13" y2="9" /><line x1="7" y1="13" x2="13" y2="13" />
  </svg>
);
const TopicsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const SavedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const LINK_TABS = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/news', label: 'News', Icon: NewsIcon },
  { to: '/topics', label: 'Topics', Icon: TopicsIcon },
];

/* Full-screen surfaces own the whole viewport — a tab bar floating over the
 * article reader or the blog editor is in the way, not helpful.
 * The /news/:id reader is matched without swallowing /news/topic/:slug, which
 * is a feed page and should keep its tabs. */
const HIDE_ON = [/^\/news\/(?!topic\/)[^/]+$/, /^\/blog\/write/, /^\/blog\/edit\//, /^\/_glancer-admin/];

export default function NativeTabBar() {
  const { pathname } = useLocation();
  const [savedOpen, setSavedOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getSavedCount());

  useEffect(() => {
    const sync = () => setSavedCount(getSavedCount());
    window.addEventListener('glancer:read-later-changed', sync);
    return () => window.removeEventListener('glancer:read-later-changed', sync);
  }, []);

  if (!Capacitor.isNativePlatform()) return null;
  if (HIDE_ON.some((re) => re.test(pathname))) return null;

  return (
    <>
      <nav className="tabbar" aria-label="Main">
        {LINK_TABS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `tabbar-item${isActive ? ' is-active' : ''}`}
          >
            <span className="tabbar-icon"><Icon /></span>
            <span className="tabbar-label">{label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className={`tabbar-item${savedOpen ? ' is-active' : ''}`}
          onClick={() => setSavedOpen(true)}
          aria-label={`Saved (${savedCount})`}
        >
          <span className="tabbar-icon">
            <SavedIcon />
            {savedCount > 0 && <span className="tabbar-badge">{savedCount > 99 ? '99+' : savedCount}</span>}
          </span>
          <span className="tabbar-label">Saved</span>
        </button>

        <NavLink to="/profile" className={({ isActive }) => `tabbar-item${isActive ? ' is-active' : ''}`}>
          <span className="tabbar-icon"><ProfileIcon /></span>
          <span className="tabbar-label">You</span>
        </NavLink>
      </nav>

      {savedOpen && <ReadLaterPanel onClose={() => setSavedOpen(false)} />}
    </>
  );
}
