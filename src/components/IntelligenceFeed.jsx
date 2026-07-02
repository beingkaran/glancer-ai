import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { NEWS_CATEGORIES } from '../data/newsData';
import { getNews, getCachedNews, STATIC_NEWS } from '../lib/newsFeed';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import { blogsToSlides } from '../lib/blogSlides';
import NewsCarousel from './NewsCarousel';
import ReadLaterPanel from './ReadLaterPanel';
import SaveButton from './SaveButton';
import BlogBanner from './BlogBanner';
import UpcomingEventsTeaser from './UpcomingEventsTeaser';
import { Thumb, LikeBtns, ShareBtn, ArrowIcon } from './feedBits';
import { entryForNews, entryForBlog, getSavedCount } from '../lib/readLater';

/*
 * IntelligenceFeed — one continuous stream that merges live AI News with
 * long-form Analysis (blogs), so a reader never has to switch tabs to see both.
 *
 * Seamlessness / fewer clicks:
 *  - A sticky segmented control (All · News · Analysis · topics) filters in place.
 *  - In "All", analysis cards are woven into the news grid every few cards so
 *    long-form is discovered without leaving the flow.
 *  - Infinite scroll: an IntersectionObserver reveals more items as you reach
 *    the bottom — no pagination clicks.
 *  - News cards open the in-app swipe reader (carousel); analysis cards route
 *    straight to the article.
 */

const PAGE = 9;          // items revealed per "page"
const ANALYSIS_EVERY = 4; // in "All", insert one analysis card after every N news

function formatBlogDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const submittedTime = (p) => new Date(p.submittedAt || p.date).getTime();
const byNewest = (list) => [...list].sort((a, b) => submittedTime(b) - submittedTime(a));

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
  const [items, setItems] = useState(STATIC_NEWS);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(() => byNewest(BLOG_POSTS));
  const [blogSlides, setBlogSlides] = useState([]);
  const [visible, setVisible] = useState(PAGE);
  const [carouselAt, setCarouselAt] = useState(null);
  const [readLaterOpen, setReadLaterOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getSavedCount());
  const sentinelRef = useRef(null);

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

  // Any device, every visit: auto-open the swipe reader after 13s so the
  // immersive experience surfaces without a tap. Skipped if already opened.
  useEffect(() => {
    const t = setTimeout(() => setCarouselAt((cur) => (cur === null ? 0 : cur)), 13000);
    return () => clearTimeout(t);
  }, []);

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

  // Segments available: All / News / Analysis + any news categories present.
  const present = new Set(sortedNews.map((i) => i.category));
  const topicCats = NEWS_CATEGORIES.filter((c) => c !== 'All' && present.has(c));
  const segments = [
    { id: 'all', label: 'All' },
    { id: 'news', label: 'News' },
    { id: 'analysis', label: 'Analysis' },
    ...topicCats.map((c) => ({ id: c, label: c })),
  ];

  const featured = entries[0];
  const rest = entries.slice(1, visible);
  const hasMore = visible < entries.length;

  const openNews = (rid) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    const idx = newsIndex.get(rid);
    if (idx != null) setCarouselAt(idx);
  };

  const setSeg = useCallback((id) => { onSegment?.(id); }, [onSegment]);

  return (
    <div className="content-section">
      <div className="container">
        <div className="news-header">
          <div>
            <p className="section-label">AI Intelligence · Updated Today</p>
            <h2 className="section-title-lg">The AI &amp; Observability Feed</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: '64ch', lineHeight: 1.55 }}>
              Live headlines from 100+ sources and practitioner-grade analysis, in one stream.
              Filter by what you care about — the feed keeps loading as you scroll.
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
              {loading ? 'Fetching the latest AI headlines…' : live ? '🟢 Live feed · 100+ AI sources · refreshes every visit' : 'Curated AI headlines & analysis'}
            </p>
          </div>
        </div>

        {/* Sticky segmented control + Read Later */}
        <div className="feed-segment-bar">
          <div className="feed-segment" role="tablist" aria-label="Filter the feed">
            {segments.map((s) => (
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

        {/* Featured (news or analysis, whichever leads the segment) */}
        {featured && (featured.kind === 'news'
          ? <FeaturedNews item={featured.item} onOpen={openNews} />
          : <FeaturedAnalysis post={featured.item} />)}

        {/* Woven events teaser — only in the blended "All" view */}
        {segment === 'all' && <UpcomingEventsTeaser />}

        {/* Grid */}
        <div className="news-grid feed-grid">
          {rest.map((entry) => (
            entry.kind === 'news'
              ? <NewsCard key={entry.item.rid} item={entry.item} onOpen={openNews} />
              : <AnalysisCard key={`b-${entry.item.id}`} post={entry.item} />
          ))}
        </div>

        {/* Infinite-scroll sentinel */}
        {hasMore && (
          <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true">
            <span className="feed-spinner" /> Loading more…
          </div>
        )}

        <div className="section-site-link">
          More AI news, tools &amp; insights at{' '}
          <a href="https://glancerai.com" target="_blank" rel="noopener noreferrer">glancerai.com</a>
        </div>

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
            <LikeBtns item={item} />
            <SaveButton entry={entryForNews(item)} className="news-share" />
            <ShareBtn item={item} className="news-share" />
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
          <span className="news-category-tag tag-purple">{post.category}</span>
          <span className="news-category-tag tag-cyan" style={{ marginLeft: 6 }}>Deep Dive</span>
          <h3 className="news-featured-title" style={{ marginTop: 12 }}>{post.title}</h3>
          <p className="news-featured-excerpt">{post.subtitle}</p>
        </div>
        <div className="news-meta">
          <span>{post.author || 'Glancer AI'}</span>
          <span className="news-meta-dot" aria-hidden="true" />
          <span>{formatBlogDate(post.date)}</span>
          <span className="news-meta-dot" aria-hidden="true" />
          <span>{post.readTime} min read</span>
          <span style={{ marginLeft: 'auto' }}><span className="read-more-link">Read analysis <ArrowIcon /></span></span>
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
            <LikeBtns item={item} />
            <SaveButton entry={entryForNews(item)} className="news-share" label={false} />
            <ShareBtn item={item} className="news-share" />
            <span className="read-more-link">Read <ArrowIcon /></span>
          </span>
        </div>
      </div>
    </a>
  );
}

// Analysis card — visually distinguished by the amber "Deep Dive" ribbon so
// long-form reads are legible inside the news stream.
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
