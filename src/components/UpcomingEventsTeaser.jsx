import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TECH_EVENTS, EVENT_CATEGORIES } from '../data/techEvents';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const parse = (d) => new Date(`${d}T00:00:00`);
const dayOf = (ev) => {
  const s = parse(ev.start);
  if (!ev.end || ev.end === ev.start) return String(s.getDate());
  return `${s.getDate()}–${parse(ev.end).getDate()}`;
};

// A slim horizontal band woven into the feed: the next few big events with a
// one-tap route into the full subscribable calendar. Purely additive — never
// blocks the feed if the list is empty.
export default function UpcomingEventsTeaser({ limit = 4 }) {
  const events = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return TECH_EVENTS
      .filter((ev) => parse(ev.end || ev.start) >= today)
      .sort((a, b) => parse(a.start) - parse(b.start))
      .slice(0, limit);
  }, [limit]);

  if (!events.length) return null;

  return (
    <section className="events-teaser" aria-label="Upcoming tech events">
      <div className="events-teaser-head">
        <div>
          <p className="section-label" style={{ marginBottom: 4 }}>Tech Calendar</p>
          <h3 className="events-teaser-title">Upcoming major tech events</h3>
        </div>
        <Link to="/events" className="events-teaser-all">Open calendar &amp; subscribe →</Link>
      </div>

      <div className="events-teaser-scroll">
        {events.map((ev) => {
          const cat = EVENT_CATEGORIES[ev.category];
          return (
            <Link key={ev.id} to="/events" className={`events-teaser-card ${cat?.class || ''}`}>
              <div className="events-teaser-date">
                <span className="events-teaser-mon">{MONTHS[parse(ev.start).getMonth()]}</span>
                <span className="events-teaser-day">{dayOf(ev)}</span>
              </div>
              <div className="events-teaser-info">
                <span className="events-teaser-name">{ev.name}</span>
                <span className="events-teaser-loc">{ev.city} · {ev.format}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
