import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TECH_EVENTS, EVENT_CATEGORIES } from '../data/techEvents';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const parse = (d) => new Date(`${d}T00:00:00`);
const dayOf = (ev) => {
  const s = parse(ev.start);
  if (!ev.end || ev.end === ev.start) return String(s.getDate());
  return `${s.getDate()}–${parse(ev.end).getDate()}`;
};

/*
 * UpcomingEventsTeaser — a slim band woven into the home feed showing the next
 * major events (US, India, Australia, Europe) as an auto-scrolling marquee that
 * drifts left. Hover/focus pauses it; prefers-reduced-motion falls back to a
 * plain scrollable row. The list re-filters against "today" once an hour, so
 * past events drop off within 24 hours without a reload.
 */
export default function UpcomingEventsTeaser({ limit = 10 }) {
  const [dayKey, setDayKey] = useState(() => new Date().toDateString());
  useEffect(() => {
    const t = setInterval(() => setDayKey(new Date().toDateString()), 60 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const events = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return TECH_EVENTS
      .filter((ev) => parse(ev.end || ev.start) >= today)
      .sort((a, b) => parse(a.start) - parse(b.start))
      .slice(0, limit);
  }, [limit, dayKey]);

  if (!events.length) return null;

  const card = (ev, dup) => {
    const cat = EVENT_CATEGORIES[ev.category];
    return (
      <Link
        key={dup ? `${ev.id}-dup` : ev.id}
        to="/events"
        className={`events-teaser-card ${cat?.class || ''}`}
        aria-hidden={dup || undefined}
        tabIndex={dup ? -1 : undefined}
      >
        <div className="events-teaser-date">
          <span className="events-teaser-mon">{MONTHS[parse(ev.start).getMonth()]}</span>
          <span className="events-teaser-day">{dayOf(ev)}</span>
        </div>
        <div className="events-teaser-info">
          <span className="events-teaser-name">{ev.name}</span>
          <span className="events-teaser-loc">{ev.city}, {ev.country} · {ev.format}</span>
        </div>
      </Link>
    );
  };

  return (
    <section className="events-teaser" aria-label="Upcoming tech events">
      <div className="events-teaser-head">
        <div>
          <p className="section-label" style={{ marginBottom: 4 }}>Tech Calendar</p>
          <h3 className="events-teaser-title">Upcoming major tech events</h3>
        </div>
        <Link to="/events" className="events-teaser-all">Open calendar &amp; subscribe →</Link>
      </div>

      <div className="events-teaser-marquee">
        {/* Track holds the list twice; translateX(-50%) loops seamlessly. */}
        <div className="events-teaser-track" style={{ '--marquee-dur': `${events.length * 6}s` }}>
          {events.map((ev) => card(ev, false))}
          {events.map((ev) => card(ev, true))}
        </div>
      </div>
    </section>
  );
}
