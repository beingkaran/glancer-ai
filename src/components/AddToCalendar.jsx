import { useState, useEffect, useRef } from 'react';
import { googleCalUrl, outlookUrl, eventIcsText, downloadIcs } from '../lib/calendarLinks';

const CalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
  </svg>
);
const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Per-event "Add to Calendar" split menu: Google, Outlook, Apple/other (.ics).
export default function AddToCalendar({ event, compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onEsc); };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="cal-menu-wrap" ref={ref}>
      <button
        type="button"
        className={`cal-add-btn${compact ? ' cal-add-btn--sm' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Add ${event.name} to your calendar`}
      >
        <CalIcon />
        {compact ? 'Add' : 'Add to Calendar'}
        <Chevron />
      </button>

      {open && (
        <div className="cal-menu" role="menu">
          <a className="cal-menu-item" role="menuitem" href={googleCalUrl(event)} target="_blank" rel="noopener noreferrer" onClick={close}>
            <span className="cal-menu-glyph" aria-hidden="true">📅</span> Google Calendar
          </a>
          <a className="cal-menu-item" role="menuitem" href={outlookUrl(event)} target="_blank" rel="noopener noreferrer" onClick={close}>
            <span className="cal-menu-glyph" aria-hidden="true">📧</span> Outlook
          </a>
          <button
            type="button"
            className="cal-menu-item"
            role="menuitem"
            onClick={() => { downloadIcs(event.id, eventIcsText(event)); close(); }}
          >
            <span className="cal-menu-glyph" aria-hidden="true">🍎</span> Apple / .ics file
          </button>
        </div>
      )}
    </div>
  );
}
