import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { NEWS_CATEGORIES } from '../data/newsData';
import { getNews, getCachedNews, STATIC_NEWS } from '../lib/newsFeed';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import { blogsToSlides } from '../lib/blogSlides';
import { useAuth } from '../context/AuthContext';
import NewsCarousel from './NewsCarousel';
import ReadLaterPanel from './ReadLaterPanel';
import SaveButton from './SaveButton';
import BlogBanner from './BlogBanner';
import UpcomingEventsTeaser from './UpcomingEventsTeaser';
import { Thumb, ArrowIcon } from './feedBits';
import { entryForNews, entryForBlog, getSavedCount } from '../lib/readLater';

/*
 * IntelligenceFeed — one continuous stream that merges live AI News with
 * long-form Analysis (blogs), so a reader never has to switch tabs to see both.
 *
 * Layout: a lead row (featured story 2/3 + "Latest" headline list 1/3) sits
 * above the card grid, so the top of the feed has editorial hierarchy instead
 * of a wall of identical cards.
 *
 * Seamlessness / fewer clicks:
 *  - A compact one-row sticky bar filters in place: All · News · Analysis plus
 *    a Topics dropdown; topic chips never wrap into a second row.
 *  - In "All", a full-width Deep Dive card is woven in every few cards so
 *    long-form is discovered without leaving the flow.
 *  - Infinite scroll: an IntersectionObserver reveals more items as you reach
 *    the bottom — no pagination clicks.
 *  - News cards open the in-app swipe reader (carousel) on click; analysis
 *    cards route straight to the article. The reader never opens on its own.
 */

const PAGE = 9;           // grid items revealed per "page"
const ANALYSIS_EVERY = 8; // in "All", insert one analysis card after every N news
const LATEST_COUNT = 5;   // headlines in the lead "Latest" list
const TEASER_AFTER = 7;   // grid index after which the events teaser is woven in

function formatBlogDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const submittedTime = (p) => new Date(p.submittedAt || p.date).getTime();
const byNewest = (list) => [...list].sort((a, b) => submittedTime(b) - submittedTime(a));

function greetingFor(hour) {
  if (hour < 5) return 'Up late';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const CaretIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Build the ordered feed for the active segment. Returns entries shaped
// { kind: 'news' | 'analysis', item }.
function buildEntries(segment, news, analysis) {
  const N = news.map((item) => ({ kind: 'news', item }));
  const A = analysis.map((item) => ({ kind: 'analysis', item }));

  if (segment === 'news') return N;
  if (segment === 'analysis') return A;

  if (segment !== 'all') {
    // Topic segment: news + analysis in that category, news first.
    const n = N.filter((e) => e.item.category === segment);
    const a = A.filter((e) => e.item.category === segment);
    return [...n, ...a];
  }

  // "All": weave analysis into the news stream.
  const out = [];
  let ai = 0;
  N.forEach((entry, i) => {
    out.push(entry);
    if ((i + 1) % ANALYSIS_EVERY === 0 && ai < A.length) out.push(A[ai++]);
  });
  while (ai < A.length) out.push(A[ai++]); // append any remaining analysis
  return out;
}

export default function IntelligenceFeed({ segment = 'all', onSegment }) {
  const { user, isAuthed } = useAuth();
  const [items, setItems] = useState(STATIC_NEWS);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(() => byNewest(BLOG_POSTS));
  const [blogSlides, setBlogSlides] = useState([]);
  const [visible, setVisible] = useState(PAGE);
  const [carouselAt, setCarouselAt] = useState(null);
  const [readLaterOpen, setReadLaterOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getSavedCount());
  const sentinelRef = useRef(null);
  const topicsRef = useRef(null);

  useEffect(() => {
    const sync = () => setSavedCount(getSavedCount());
    window.addEventListener('glancer:read-later-changed', sync);
    return () => window.removeEventListener('glancer:read-later-changed', sync);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { items: fresh, live: isLive } = await getNews();
        if (alive && fresh?.length) { setItems(fresh); setLive(isLive); }
      } catch {
        /* keep static fallback */
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const loadBlogs = async () => {
      const approved = (await getApprovedUserBlogs()).map((b) => ({ ...b, isUserBlog: true }));
      if (!alive) return;
      const merged = byNewest([...approved, ...BLOG_POSTS]);
      setAnalysis(merged);
      setBlogSlides(blogsToSlides(merged));
    };
    loadBlogs();
    window.addEventListener('glancer:blogs-changed', loadBlogs);

    const onUpdate = () => {
      const cached = getCachedNews();
      if (alive && cached?.items?.length) {
        setItems(cached.items);
        if (cached.live) setLive(true);
      }
    };
    window.addEventListener('glancer:news-updated', onUpdate);
    return () => {
      alive = false;
      window.removeEventListener('glancer:news-updated', onUpdate);
      window.removeEventListener('glancer:blogs-changed', loadBlogs);
    };
  }, []);

  // Close the Topics dropdown on any tap/click outside it.
  useEffect(() => {
    if (!topicsOpen) return undefined;
    const close = (e) => {
      if (!topicsRef.current?.contains(e.target)) setTopicsOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [topicsOpen]);

  // News ordering: frameable sources first, then those with real cover images.
  const sortedNews = useMemo(() => {
    return [...items].sort((a, b) => {
      const frame = (b.frameable ? 1 : 0) - (a.frameable ? 1 : 0);
      if (frame !== 0) return frame;
      return (b.image ? 1 : 0) - (a.image ? 1 : 0);
    });
  }, [items]);

  // Index of each news item within sortedNews, so a card click maps to the
  // right carousel slide.
  const newsIndex = useMemo(() => {
    const m = new Map();
    sortedNews.forEach((it, i) => m.set(it.rid, i));
    return m;
  }, [sortedNews]);

  const carouselItems = useMemo(() => [...sortedNews, ...blogSlides], [sortedNews, blogSlides]);

  const entries = useMemo(
    () => buildEntries(segment, sortedNews, analysis),
    [segment, sortedNews, analysis],
  );

  // Reset the reveal window whenever the segment changes.
  useEffect(() => { setVisible(PAGE); }, [segment]);

  // Infinite scroll: reveal another page when the sentinel scrolls into view.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) setVisible((v) => Math.min(v + PAGE, entries.length));
    }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [entries.length]);

  // Topic categories present in the live news set (shown in the dropdown).
  const present = new Set(sortedNews.map((i) => i.category));
  const topicCats = NEWS_CATEGORIES.filter((c) => c !== 'All' && present.has(c));
  const baseSegments = [
    { id: 'all', label: 'All' },
    { id: 'news', label: 'News' },
    { id: 'analysis', label: 'Analysis' },
  ];
  const isTopic = !baseSegments.some((s) => s.id === segment);

  // Lead row (featured + Latest list) consumes the first entries; the grid
  // starts after them so nothing appears twice.
  const lead = 1 + LATEST_COUNT;
  const featured = entries[0];
  const latest = entries.slice(1, lead);
  const rest = entries.slice(lead, lead + visible);
  const hasMore = lead + visible < entries.length;
  const teaserAt = Math.min(TEASER_AFTER, rest.length - 1);

  const openNews = (rid) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    const idx = newsIndex.get(rid);
    if (idx != null) setCarouselAt(idx);
  };

  const setSeg = useCallback((id) => { onSegment?.(id); }, [onSegment]);

  const hour = new Date().getHours();
  const firstName = isAuthed ? (user?.name || '').split(' ')[0] : '';
  const greeting = `${greetingFor(hour)}${firstName ? `, ${firstName}` : ''}`;

  return (
    <div className="content-section">
      <div className="container">
        <div className="news-header">
          <div>
            <p className="section-label">
              AI Intelligence · {loading ? 'Updating…' : live ? 'Live · 100+ sources' : 'Curated'} · Updated today
            </p>
            <h2 className="section-title-lg">The AI &amp; Observability Feed</h2>
            <p className="feed-sub">
              {greeting} — live headlines and practitioner-grade analysis in one stream.
            </p>
          </div>
        </div>

        {/* Compact one-row sticky bar: All/News/Analysis + Topics ▾ + Read Later */}
        <div className="feed-segment-bar">
          <div className="feed-segment" role="tablist" aria-label="Filter the feed">
            {baseSegments.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={segment === s.id}
                className={`filter-chip${segment === s.id ? ' active' : ''}`}
                onClick={() => setSeg(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          {topicCats.length > 0 && (
            <div className="feed-topics-wrap" ref={topicsRef}>
              <button
                type="button"
                className={`filter-chip feed-topics-btn${isTopic ? ' active' : ''}`}
                aria-haspopup="listbox"
                aria-expanded={topicsOpen}
                onClick={() => setTopicsOpen((o) => !o)}
              >
                {isTopic ? segment : 'Topics'} <CaretIcon />
              </button>
              {topicsOpen && (
                <div className="feed-topics-menu" role="listbox" aria-label="Topics">
                  {topicCats.map((c) => (
                    <button
                      key={c}
                      role="option"
                      aria-selected={segment === c}
                      className={`feed-topics-item${segment === c ? ' active' : ''}`}
                      onClick={() => { setSeg(c); setTopicsOpen(false); }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            className={`read-later-toggle${savedCount ? ' has-saved' : ''}`}
            onClick={() => setReadLaterOpen(true)}
            aria-label={`Read later (${savedCount} saved)`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={savedCount ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Read Later
            {savedCount > 0 && <span className="read-later-badge">{savedCount}</span>}
          </button>
        </div>

        {/* Lead row: featured story + Latest headline list */}
        {featured && (
          <div className="feed-lead">
            {featured.kind === 'news'
              ? <FeaturedNews item={featured.item} onOpen={openNews} />
              : <FeaturedAnalysis post={featured.item} />}
            {latest.length > 0 && (
              <aside className="latest-list" aria-label="Latest headlines">
                <p className="latest-list-head">Latest</p>
                {latest.map((entry) => (
                  entry.kind === 'news' ? (
                    <a
                      key={entry.item.rid}
                      className="latest-item"
                      href={entry.item.url}
                      onClick={openNews(entry.item.rid)}
                      rel="noopener noreferrer"
                    >
                      <span className="latest-item-title">{entry.item.title}</span>
                      <span className="latest-item-meta">{entry.item.source}{entry.item.date ? ` · ${entry.item.date}` : ''}</span>
                    </a>
                  ) : (
                    <Link
                      key={`b-${entry.item.id}`}
                      className="latest-item"
                      to={`/blog/${entry.item.id}`}
                      state={{ from: 'home-feed' }}
                    >
                      <span className="latest-item-title">{entry.item.title}</span>
                      <span className="latest-item-meta">Deep Dive · {entry.item.readTime} min read</span>
                    </Link>
                  )
                ))}
              </aside>
            )}
          </div>
        )}

        {/* Grid — the events teaser is woven in as a full-width band */}
        <div className="news-grid feed-grid">
          {rest.map((entry, i) => (
            <Fragment key={entry.kind === 'news' ? entry.item.rid : `b-${entry.item.id}`}>
              {entry.kind === 'news'
                ? <NewsCard item={entry.item} onOpen={openNews} />
                : <AnalysisCard post={entry.item} />}
              {segment === 'all' && i === teaserAt && (
                <div className="feed-inline-teaser"><UpcomingEventsTeaser /></div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Infinite-scroll sentinel */}
        {hasMore && (
          <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true">
            <span className="feed-spinner" /> Loading more…
          </div>
        )}

        {carouselAt !== null && (
          <NewsCarousel items={carouselItems} startIndex={carouselAt} onClose={() => setCarouselAt(null)} />
        )}
        {readLaterOpen && <ReadLaterPanel onClose={() => setReadLaterOpen(false)} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ cards */

function FeaturedNews({ item, onOpen }) {
  return (
    <a className="news-featured news-link" href={item.url} onClick={onOpen(item.rid)} rel="noopener noreferrer" aria-label={`Read: ${item.title}`}>
      <Thumb item={item} className="news-featured-img" emojiSize="5rem" eager />
      <div className="news-featured-body">
        <div>
          <span className={`news-category-tag ${item.categoryClass}`}>{item.category}</span>
          <h3 className="news-featured-title">{item.title}</h3>
          <p className="news-featured-excerpt">{item.excerpt}</p>
        </div>
        <div className="news-meta">
          <span>{item.source}</span>
          {item.date && <><span className="news-meta-dot" aria-hidden="true" /><span>{item.date}</span></>}
          <span className="news-meta-dot" aria-hidden="true" />
          <span>{item.readMin} min read</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <SaveButton entry={entryForNews(item)} className="news-share" />
            <span className="read-more-link">Read story <ArrowIcon /></span>
          </span>
        </div>
      </div>
    </a>
  );
}

function FeaturedAnalysis({ post }) {
  return (
    <Link to={`/blog/${post.id}`} state={{ from: 'home-feed' }} className="news-featured news-link" aria-label={`Read: ${post.title}`}>
      <BlogBanner post={post} className="news-featured-img" emojiSize="5rem" logoStyle={{ width: 120, height: 120 }} />
      <div className="news-featured-body">
        <div>
          <span className="news-category-tag tag-purple">Deep Dive · {post.category}</span>
          <h3 className="news-featured-title">{post.title}</h3>
          <p className="news-featured-excerpt">{post.subtitle}</p>
        </div>
        <div className="news-meta">
          <span>{post.author || 'Glancer AI'}</span>
          <span className="news-meta-dot" aria-hidden="true" />
          <span>{formatBlogDate(post.date)}</span>
          <span className="news-meta-dot" aria-hidden="true" />
          <span>{post.readTime} min read</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <SaveButton entry={entryForBlog(post)} className="news-share" />
            <span className="read-more-link">Read analysis <ArrowIcon /></span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function NewsCard({ item, onOpen }) {
  return (
    <a className="news-card news-link" href={item.url} onClick={onOpen(item.rid)} rel="noopener noreferrer" aria-label={`Read: ${item.title}`}>
      <Thumb item={item} className="news-card-thumb" emojiSize="3rem" />
      <div className="news-card-body">
        <span className={`news-category-tag ${item.categoryClass}`} style={{ marginBottom: 10, fontSize: '0.68rem' }}>{item.category}</span>
        <h3 className="news-card-title">{item.title}</h3>
        <p className="news-card-excerpt">{item.excerpt}</p>
        <div className="news-card-footer">
          <span>{item.source}{item.date ? ` · ${item.date}` : ''}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <SaveButton entry={entryForNews(item)} className="news-share" label={false} />
            <span className="read-more-link">Read <ArrowIcon /></span>
          </span>
        </div>
      </div>
    </a>
  );
}

// Analysis card — woven into the news grid as a full-width horizontal band,
// amber-accented with a "Deep Dive" ribbon so long-form reads stand apart.
function AnalysisCard({ post }) {
  return (
    <Link to={`/blog/${post.id}`} state={{ from: 'home-feed' }} className="news-card blog-in-feed news-link" style={{ textDecoration: 'none' }}>
      <div className="news-card-thumb" style={{ position: 'relative' }}>
        <BlogBanner post={post} className="blog-in-feed-banner" />
        <span className="deep-dive-ribbon">Deep Dive</span>
      </div>
      <div className="news-card-body">
        <span className="news-category-tag tag-purple" style={{ marginBottom: 10, fontSize: '0.68rem' }}>{post.category}</span>
        <h3 className="news-card-title">{post.title}</h3>
        <p className="news-card-excerpt">{post.subtitle}</p>
        <div className="news-card-footer">
          <span>{post.author || 'Glancer AI'} · {formatBlogDate(post.date)}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <SaveButton entry={entryForBlog(post)} className="news-share" label={false} />
            <span className="read-time-badge">{post.readTime} min</span>
            <span className="read-more-link">Read <ArrowIcon /></span>
          </span>
        </div>
      </div>
    </Link>
  );
}
