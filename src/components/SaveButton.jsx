import { useState, useEffect } from 'react';
import { isSaved, toggleSave } from '../lib/readLater';

/*
 * SaveButton — a bookmark toggle for "Read Later".
 *
 * Pass a precomputed `entry` (from entryForNews / entryForBlog). The button is
 * safe to nest inside a clickable card <a>: it stops propagation so saving never
 * triggers the card's navigation. Stays in sync via the read-later event.
 */

const Bookmark = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export default function SaveButton({ entry, className, label = true }) {
  const [saved, setSaved] = useState(() => isSaved(entry.key));

  useEffect(() => {
    const sync = () => setSaved(isSaved(entry.key));
    window.addEventListener('glancer:read-later-changed', sync);
    return () => window.removeEventListener('glancer:read-later-changed', sync);
  }, [entry.key]);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(toggleSave(entry));
  };

  return (
    <button
      type="button"
      className={`${className || 'news-share'}${saved ? ' saved' : ''}`}
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from Read Later' : 'Save to Read Later'}
      title={saved ? 'Saved — tap to remove' : 'Read later'}
    >
      <Bookmark filled={saved} /> {label && (saved ? 'Saved' : 'Save')}
    </button>
  );
}
