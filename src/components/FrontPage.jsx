import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNews, STATIC_NEWS } from '../lib/newsFeed';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import { blogsToSlides } from '../lib/blogSlides';
import BlogBanner from './BlogBanner';
import NewsCarousel from './NewsCarousel';

/*
 * FrontPage — the above-the-fold split. Two content types, two visual
 * grammars, one glance:
 *
 *   left  (cyan accent) — the Live Feed: news AND deep dives as a tailing
 *                        log stream that advances one entry every 7 seconds
 *                        (paused while hovered, so nothing moves mid-click).
 *                        News leads the page, so it takes the wide column.
 *   right (pink accent) — the analysis desk: newest Deep Dive as a lead
 *                        story plus a 3-item headline rail, editorial type.
 *
 * Everything opens in the swipe reader: news entries open the news slideshow,
 * deep dives (desk and feed alike) open the blogs slideshow — same behavior
 * as the cards in the main feed below.
 *
 * The desk shows the newest FRONT_DESK_COUNT analysis pieces; the feed below
 * skips those so the lead never repeats directly underneath. The live feed is
 * purely chronological (unlike the feed's frameable-first sort) because a
 * ticker that isn't in time order reads as broken.
 */

export const FRONT_DESK_COUNT = 4;
const FEED_VISIBLE = 8;
// One new entry surfaces every 7s. Every 4th slot is a Deep Dive so analysis
// keeps flowing through the ticker between headlines.
const ROTATE_MS = 7000;
const DIVE_EVERY = 4;

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

function shortDate(d) {
  const parsed = new Date(d);
  return isNaN(parsed) ? '' : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function FrontPage() {
  const [news, setNews] = useState(STATIC_NEWS);
  const [live, setLive] = useState(false);
  const [analysis, setAnalysis] = useState(() => byNewest(BLOG_POSTS));
  // { mode: 'news' | 'blogs', at } — which slideshow is open, and where.
  const [carousel, setCarousel] = useState(null);
  const [offset, setOffset] = useState(0);
  const pausedRef = useRef(false);

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

  // The ticker pool: chronological news with a Deep Dive woven in every
  // DIVE_EVERY-th slot, so both content types keep cycling through.
  const pool = useMemo(() => {
    const mixed = [];
    let n = 0;
    let a = 0;
    while (n < news.length || a < analysis.length) {
      const wantDive = (mixed.length + 1) % DIVE_EVERY === 0;
      if (wantDive && a < analysis.length) {
        mixed.push({ kind: 'dive', post: analysis[a], blogAt: a });
        a += 1;
      } else if (n < news.length) {
        mixed.push({ kind: 'news', item: news[n], newsAt: n });
        n += 1;
      } else if (a < analysis.length) {
        mixed.push({ kind: 'dive', post: analysis[a], blogAt: a });
        a += 1;
      }
    }
    return mixed;
  }, [news, analysis]);

  // Advance one entry every 7s; hold still while the pointer is over the list
  // so a link can't move out from under a click.
  useEffect(() => {
    if (pool.length <= FEED_VISIBLE) return undefined;
    const id = window.setInterval(() => {
      if (!pausedRef.current && !document.hidden) {
        setOffset((o) => (o + 1) % pool.length);
      }
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [pool.length]);

  const visible = useMemo(
    () => Array.from({ length: Math.min(FEED_VISIBLE, pool.length) }, (_, k) => pool[(offset + k) % pool.length]),
    [pool, offset],
  );

  const blogSlides = useMemo(() => blogsToSlides(analysis), [analysis]);

  const desk = analysis.slice(0, FRONT_DESK_COUNT);
  const [lead, ...rail] = desk;

  const openNews = (newsAt) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    setCarousel({ mode: 'news', at: newsAt });
  };

  const openDive = (blogAt) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    setCarousel({ mode: 'blogs', at: blogAt });
  };

  const scrollToFeed = () => {
    document.getElementById('intelligence-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!lead) return null;

  return (
    <section className="front-page" aria-label="Today's front page">
      <div className="container">
        <div className="front-grid">
          <aside
            className="front-wire"
            aria-label="Live feed of news and deep dives"
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
          >
            <header className="front-kicker front-kicker--wire">
              <span className={`front-wire-dot${live ? ' is-live' : ''}`} aria-hidden="true" />
              <span className="front-kicker-label">Live Feed</span>
              <span className="front-kicker-sub">{live ? 'news + deep dives · live' : 'news + deep dives'}</span>
            </header>

            <ol key={offset} className="front-wire-list front-wire-list--tick" aria-live="off">
              {visible.map((entry) => (
                entry.kind === 'news' ? (
                  <li key={`n-${entry.item.rid}`}>
                    <a
                      href={entry.item.url}
                      className="front-wire-item"
                      onClick={openNews(entry.newsAt)}
                      rel="noopener noreferrer"
                      aria-label={`Read: ${entry.item.title}`}
                    >
                      <span className="front-wire-meta">
                        <span className="front-wire-time">{wireTime(entry.item)}</span>
                        <span className={`news-category-tag ${entry.item.categoryClass}`}>{entry.item.category}</span>
                      </span>
                      <span className="front-wire-title">{entry.item.title}</span>
                    </a>
                  </li>
                ) : (
                  <li key={`d-${entry.post.id}`}>
                    <Link
                      to={`/blog/${entry.post.id}`}
                      state={{ from: 'front-page' }}
                      className="front-wire-item front-wire-item--dive"
                      onClick={openDive(entry.blogAt)}
                      aria-label={`Read deep dive: ${entry.post.title}`}
                    >
                      <span className="front-wire-meta">
                        <span className="front-wire-time front-wire-time--dive">{shortDate(entry.post.date)}</span>
                        <span className="news-category-tag tag-purple">Deep Dive</span>
                      </span>
                      <span className="front-wire-title">{entry.post.title}</span>
                    </Link>
                  </li>
                )
              ))}
            </ol>

            <Link to="/news" state={{ keepScroll: true }} className="front-more front-more--wire">
              Full feed →
            </Link>
          </aside>

          <div className="front-desk">
            <header className="front-kicker front-kicker--desk">
              <span className="front-kicker-mark" aria-hidden="true" />
              <span className="front-kicker-label">Deep Dives</span>
              <span className="front-kicker-sub">practitioner analysis</span>
            </header>

            <Link to={`/blog/${lead.id}`} state={{ from: 'front-page' }} className="front-lead" onClick={openDive(0)}>
              <div className="front-lead-banner">
                <BlogBanner post={lead} className="feed-blog-banner" />
              </div>
              <span className="front-lead-tag">Deep Dive · {lead.category}</span>
              <h2 className="front-lead-title">{lead.title}</h2>
              <p className="front-lead-sub">{lead.subtitle}</p>
              <p className="front-lead-meta">
                {lead.readTime ? `${lead.readTime} min read · ` : ''}{shortDate(lead.date)}
              </p>
            </Link>

            {rail.length > 0 && (
              <div className="front-rail">
                {rail.map((post, i) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    state={{ from: 'front-page' }}
                    className="front-rail-item"
                    onClick={openDive(i + 1)}
                  >
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
        </div>
      </div>

      {carousel !== null && (
        <NewsCarousel
          items={carousel.mode === 'blogs' ? blogSlides : news}
          startIndex={carousel.at}
          onClose={() => setCarousel(null)}
        />
      )}
    </section>
  );
}
