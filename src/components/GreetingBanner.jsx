import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
 * GreetingBanner — a warm, personalised welcome at the top of the home feed.
 *
 *  - Greets a signed-in reader by their first name; invites a guest to join.
 *  - Adapts the message + emoji to the local time of day.
 *  - Adds a friendly, low-pressure line and a couple of quick "where next?"
 *    chips so the app feels like it's speaking to *this* person, not everyone.
 *
 * Purely cosmetic + navigational — no data fetching, so it renders instantly.
 */

function partOfDay(hour) {
  if (hour < 5) return { label: 'up late', emoji: '🌙' };
  if (hour < 12) return { label: 'Good morning', emoji: '☀️' };
  if (hour < 17) return { label: 'Good afternoon', emoji: '👋' };
  if (hour < 21) return { label: 'Good evening', emoji: '🌆' };
  return { label: 'Winding down', emoji: '🌙' };
}

// A rotating friendly sub-line so repeat visits feel a little different.
const LINES = [
  "Here's what's moving in AI today — fresh from 60+ sources.",
  'Your AI briefing is ready. Swipe, skim, and share what sparks.',
  "The AI world's been busy. Caught the latest yet?",
  'Hand-balanced across research, models, tools and more — just for you.',
  'Five minutes here and you’re caught up on AI. Promise.',
];

export default function GreetingBanner() {
  const { user, isAuthed } = useAuth();

  // The banner is a warm hello, not a permanent fixture — fade it out after a
  // few seconds so it greets the reader, then gets out of the way of the feed.
  // `leaving` triggers the CSS fade; `gone` unmounts it once the fade finishes.
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const fade = setTimeout(() => setLeaving(true), 5000);
    const drop = setTimeout(() => setGone(true), 5600); // after the 0.5s fade
    return () => { clearTimeout(fade); clearTimeout(drop); };
  }, []);

  // Compute once per mount. Picks the time-of-day greeting and a friendly line.
  const { greeting, emoji, line } = useMemo(() => {
    const now = new Date();
    const { label, emoji } = partOfDay(now.getHours());
    const firstName = isAuthed ? (user?.name || '').split(' ')[0] : '';
    const greeting = firstName
      ? `${label}, ${firstName}`
      : label === 'Good morning' || label === 'Good afternoon' || label === 'Good evening'
        ? `${label}!`
        : `${label}?`;
    // Stable-ish pick: tie to the day so it changes daily, not every render.
    const line = LINES[(now.getDate() + (firstName ? firstName.length : 0)) % LINES.length];
    return { greeting, emoji, line };
  }, [isAuthed, user]);

  if (gone) return null;

  return (
    <div className={`greeting-wrap${leaving ? ' greeting-leaving' : ''}`}>
      <div className="container">
        <div className="greeting-card">
          <div className="greeting-text">
            <h2 className="greeting-title">
              <span className="greeting-emoji" aria-hidden="true">{emoji}</span>
              {greeting}
            </h2>
            <p className="greeting-line">{line}</p>
          </div>
          {!isAuthed && (
            <Link to="/profile" className="greeting-cta">
              Personalise your feed →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
