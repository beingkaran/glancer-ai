import { useState, useMemo } from 'react';
import { EVENT_CATEGORIES } from '../data/techEvents';
import { useLiveEvents } from '../lib/eventsFeed';
import {
  calendarText, downloadIcs, WEBCAL_URL, FEED_URL, googleSubscribeUrl,
} from '../lib/calendarLinks';
import AddToCalendar from '../components/AddToCalendar';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useArticleSchema, buildBreadcrumb, buildItemListSchema } from '../lib/structuredData';

/* -------------------------------------------------------------- date utils */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parse(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}
function monthKey(dateStr) {
  const d = parse(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
}
function monthLabel(dateStr) {
  const d = parse(dateStr);
  return `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
}

// "10–13", "Nov 30 – Dec 4", or a single "9".
function dayRange(ev) {
  const s = parse(ev.start);
  if (!ev.end || ev.end === ev.start) return String(s.getDate());
  const e = parse(ev.end);
  if (s.getMonth() === e.getMonth()) return `${s.getDate()}–${e.getDate()}`;
  return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${MONTHS[e.getMonth()]} ${e.getDate()}`;
}

/* ---------------------------------------------------------------- schema */

const ATTEND = {
  'In-person': 'https://schema.org/OfflineEventAttendanceMode',
  Virtual: 'https://schema.org/OnlineEventAttendanceMode',
  Hybrid: 'https://schema.org/MixedEventAttendanceMode',
};

function eventSchema(ev) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: ev.name,
    startDate: ev.start,
    endDate: ev.end || ev.start,
    eventAttendanceMode: ATTEND[ev.format] || ATTEND['In-person'],
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: ev.venue || ev.city,
      address: [ev.city, ev.country].filter(Boolean).join(', '),
    },
    organizer: { '@type': 'Organization', name: ev.organizer },
    description: ev.blurb,
    url: ev.url,
  };
}

/* ------------------------------------------------------------------- view */

const LinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

export default function EventsPage() {
  const [filter, setFilter] = useState('All');
  const [copied, setCopied] = useState(false);

  useDocumentMeta({
    title: 'Upcoming Major Tech Events — AI, Observability & Cloud Calendar',
    description:
      'A live calendar of the biggest AI, AIOps, observability, cloud-native and SRE conferences — KubeCon, re:Invent, GTC, NeurIPS and more. Add any event to your calendar or subscribe to the whole feed.',
    path: '/events',
  });

  // Live global feed (curated flagships + aggregated long-tail), with the static
  // list as the instant-paint fallback. Keep only events that haven't finished
  // yet, sorted soonest-first.
  const liveEvents = useLiveEvents();
  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return liveEvents
      .filter((ev) => parse(ev.end || ev.start) >= today)
      .sort((a, b) => parse(a.start) - parse(b.start));
  }, [liveEvents]);

  useArticleSchema([
    buildBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Tech Events', path: '/events' },
    ]),
    buildItemListSchema(
      upcoming.map((ev) => ({ name: ev.name, url: ev.url })),
      { name: 'Upcoming Major Tech Events', path: '/events', description: 'AI, observability and cloud-native conferences.' },
    ),
    ...upcoming.map(eventSchema),
  ]);

  const categories = ['All', ...Object.keys(EVENT_CATEGORIES)];
  const filtered = filter === 'All' ? upcoming : upcoming.filter((ev) => ev.category === filter);

  // Group the filtered list into month buckets, preserving chronological order.
  const groups = useMemo(() => {
    const map = new Map();
    for (const ev of filtered) {
      const key = monthKey(ev.start);
      if (!map.has(key)) map.set(key, { label: monthLabel(ev.start), events: [] });
      map.get(key).events.push(ev);
    }
    return [...map.values()];
  }, [filtered]);

  const copyFeed = async () => {
    try {
      await navigator.clipboard.writeText(FEED_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  return (
    <div className="page-section">
      <div className="container">
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 28, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Tech Calendar</p>
          <h1 className="page-hero-title">Upcoming Major Tech Events</h1>
          <p className="hero-sub" style={{ margin: '0 auto 26px' }}>
            The conferences that move AI, observability and the cloud-native stack — one scannable agenda.
            Add any event to your calendar in a click, or subscribe once and let the feed keep itself current.
          </p>

          {/* Subscribe-to-all bar */}
          <div className="subscribe-bar" role="group" aria-label="Subscribe to all events">
            <div className="subscribe-bar-label">
              <span className="subscribe-bar-icon" aria-hidden="true">🔔</span>
              <span>Subscribe to <b>all {upcoming.length} events</b> — auto-updates as we add more</span>
            </div>
            <div className="subscribe-bar-actions">
              <a className="sub-btn sub-btn--primary" href={googleSubscribeUrl()} target="_blank" rel="noopener noreferrer">Google Calendar</a>
              <a className="sub-btn" href={WEBCAL_URL}>Apple / Outlook</a>
              <button type="button" className="sub-btn" onClick={() => downloadIcs('glancer-tech-events', calendarText(upcoming))}>Download .ics</button>
              <button type="button" className="sub-btn sub-btn--ghost" onClick={copyFeed}>{copied ? 'Copied ✓' : 'Copy feed URL'}</button>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="news-filter" role="group" aria-label="Filter by category" style={{ justifyContent: 'center', marginBottom: 30 }}>
          {categories.map((cat) => (
            <button key={cat} className={`filter-chip${filter === cat ? ' active' : ''}`} onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Agenda grouped by month */}
        {groups.map((group) => (
          <section key={group.label} className="event-month">
            <div className="event-month-head">
              <h2 className="event-month-title">{group.label}</h2>
              <span className="event-month-rule" aria-hidden="true" />
              <span className="event-month-count">{group.events.length} event{group.events.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="event-list">
              {group.events.map((ev) => {
                const cat = EVENT_CATEGORIES[ev.category];
                return (
                  <article key={ev.id} className={`event-row ${cat?.class || ''}`}>
                    <div className="event-date-badge" aria-hidden="true">
                      <span className="event-date-mon">{MONTHS[parse(ev.start).getMonth()]}</span>
                      <span className="event-date-day">{dayRange(ev)}</span>
                    </div>

                    <div className="event-body">
                      <div className="event-tags-row">
                        <span className={`event-cat-tag ${cat?.class || ''}`}>{ev.category}</span>
                        <span className="event-format">{ev.format}</span>
                      </div>
                      <h3 className="event-name">
                        <a href={ev.url} target="_blank" rel="noopener noreferrer">{ev.name}</a>
                      </h3>
                      <p className="event-blurb">{ev.blurb}</p>
                      <div className="event-meta">
                        <span className="event-meta-loc"><PinIcon /> {ev.city}, {ev.country}</span>
                        <span className="event-meta-dot" aria-hidden="true" />
                        <span>{ev.organizer}</span>
                      </div>
                    </div>

                    <div className="event-actions">
                      <AddToCalendar event={ev} />
                      <a className="event-details-link" href={ev.url} target="_blank" rel="noopener noreferrer">
                        Details <LinkIcon />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            No upcoming events in this category yet — check back soon.
          </div>
        )}

        <p className="event-disclaimer">
          Dates and venues are shown as publicly announced and can change. Always confirm on the
          official event page before booking travel. Times are all-day entries in your local calendar.
        </p>

        <div className="section-site-link">
          More AIOps &amp; observability deep dives, tools &amp; insights at{' '}
          <a href="https://glancerai.com" target="_blank" rel="noopener noreferrer">glancerai.com</a>
        </div>
      </div>
    </div>
  );
}
