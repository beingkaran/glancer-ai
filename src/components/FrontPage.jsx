import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNews, STATIC_NEWS } from '../lib/newsFeed';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import BlogBanner from './BlogBanner';
import NewsCarousel from './NewsCarousel';

/*
 * FrontPage — the above-the-fold split. Two content types, two visual
 * grammars, one glance:
 *
 *   left  (pink accent) — the analysis desk: newest Deep Dive as a lead
 *                         story plus a 3-item headline rail, editorial type.
 *   right (cyan accent)  — "The Wire": the newest headlines rendered like a
 *                         tailing log stream (HH:MM timestamps, category
 *                         tags, live dot), operational type.
 *
 * The desk shows the newest FRONT_DESK_COUNT analysis pieces; the feed below
 * skips those so the lead never repeats directly underneath. The wire is
 * purely chronological (unlike the feed's frameable-first sort) because a
 * wire that isn't in time order reads as broken.
 */

export const FRONT_DESK_COUNT = 4;
const WIRE_COUNT = 8;

const submittedTime = (p) => new Date(p.submittedAt || p.date).getTime();
const byNewest = (list) => [...list].sort((a, b) => submittedTime(b) - submittedTime(a));

function wireTime(item) {
  if (item.ts) {
    const d = new Date(item.ts);
    if (!isNaN(d)) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }
  // Cached/static items predate the ts field — fall back to a short date.
  return (item.date || '').replace(/,\s*\d{4}$/, '') || '—';
}

function leadDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function FrontPage() {
  const [news, setNews] = useState(STATIC_NEWS);
  const [live, setLive] = useState(false);
  const [analysis, setAnalysis] = useState(() => byNewest(BLOG_POSTS));
  const [carouselAt, setCarouselAt] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { items, live: isLive } = await getNews();
        if (alive && items?.length) { setNews(items); setLive(isLive); }
      } catch {
        /* keep static fallback */
      }
    })();

    const loadBlogs = async () => {
      const approved = (await getApprovedUserBlogs()).map((b) => ({ ...b, isUserBlog: true }));
      if (alive) setAnalysis(byNewest([...approved, ...BLOG_POSTS]));
    };
    loadBlogs();
    window.addEventListener('glancer:blogs-changed', loadBlogs);
    return () => {
      alive = false;
      window.removeEventListener('glancer:blogs-changed', loadBlogs);
    };
  }, []);

  const wire = useMemo(() => news.slice(0, WIRE_COUNT), [news]);
  const desk = analysis.slice(0, FRONT_DESK_COUNT);
  const [lead, ...rail] = desk;

  const openWire = (idx) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    setCarouselAt(idx);
  };

  const scrollToFeed = () => {
    document.getElementById('intelligence-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!lead) return null;

  return (
    <section className="front-page" aria-label="Today's front page">
      <div className="container">
        <div className="front-grid">
          <div className="front-desk">
            <header className="front-kicker front-kicker--desk">
              <span className="front-kicker-mark" aria-hidden="true" />
              <span className="front-kicker-label">Deep Dives</span>
              <span className="front-kicker-sub">practitioner analysis</span>
            </header>

            <Link to={`/blog/${lead.id}`} state={{ from: 'front-page' }} className="front-lead">
              <div className="front-lead-banner">
                <BlogBanner post={lead} className="feed-blog-banner" />
              </div>
              <span className="front-lead-tag">Deep Dive · {lead.category}</span>
              <h2 className="front-lead-title">{lead.title}</h2>
              <p className="front-lead-sub">{lead.subtitle}</p>
              <p className="front-lead-meta">
                {lead.readTime ? `${lead.readTime} min read · ` : ''}{leadDate(lead.date)}
              </p>
            </Link>

            {rail.length > 0 && (
              <div className="front-rail">
                {rail.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`} state={{ from: 'front-page' }} className="front-rail-item">
                    <span className="front-rail-cat">{post.category}</span>
                    <span className="front-rail-title">{post.title}</span>
                  </Link>
                ))}
              </div>
            )}

            <button type="button" className="front-more" onClick={scrollToFeed}>
              All deep dives ↓
            </button>
          </div>

          <aside className="front-wire" aria-label="Live news wire">
            <header className="front-kicker front-kicker--wire">
              <span className={`front-wire-dot${live ? ' is-live' : ''}`} aria-hidden="true" />
              <span className="front-kicker-label">The Wire</span>
              <span className="front-kicker-sub">{live ? 'live · 100+ sources' : 'curated today'}</span>
            </header>

            <ol className="front-wire-list">
              {wire.map((item, i) => (
                <li key={item.rid}>
                  <a
                    href={item.url}
                    className="front-wire-item"
                    onClick={openWire(i)}
                    rel="noopener noreferrer"
                    aria-label={`Read: ${item.title}`}
                  >
                    <span className="front-wire-meta">
                      <span className="front-wire-time">{wireTime(item)}</span>
                      <span className={`news-category-tag ${item.categoryClass}`}>{item.category}</span>
                    </span>
                    <span className="front-wire-title">{item.title}</span>
                  </a>
                </li>
              ))}
            </ol>

            <Link to="/news" state={{ keepScroll: true }} className="front-more front-more--wire">
              Full wire →
            </Link>
          </aside>
        </div>
      </div>

      {carouselAt !== null && (
        <NewsCarousel items={news} startIndex={carouselAt} onClose={() => setCarouselAt(null)} />
      )}
    </section>
  );
}
