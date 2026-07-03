import { useState, useEffect, useRef, useMemo, useCallback, Children } from 'react';
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
 * Layout: two responsive card grids — Deep Dives first, then News Right Now.
 * Each section shows the top 9 items with an expand control for the full list.
 *
 * Seamlessness / fewer clicks:
 *  - A compact sticky bar filters in place: All · News · Analysis plus Topics.
 *  - Blogs lead the page in "All" so long-form is surfaced before headlines.
 *  - News and analysis cards open the in-app swipe reader on tap.
 */

const TOP = 9;

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

function filterBySegment(segment, news, analysis) {
  if (segment === 'news') return { news, analysis: [] };
  if (segment === 'all') return { news, analysis };

  // Topic segment: both streams filtered to the category.
  return {
    news: news.filter((item) => item.category === segment),
    analysis: analysis.filter((item) => item.category === segment),
  };
}

export default function IntelligenceFeed({ segment = 'all', onSegment }) {
  const { user, isAuthed } = useAuth();
  const [items, setItems] = useState(STATIC_NEWS);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(() => byNewest(BLOG_POSTS));
  const [blogSlides, setBlogSlides] = useState([]);
  const [carouselAt, setCarouselAt] = useState(null);
  const [readLaterOpen, setReadLaterOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getSavedCount());
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

  const { news: feedNews, analysis: feedAnalysis } = useMemo(
    () => filterBySegment(segment, sortedNews, analysis),
    [segment, sortedNews, analysis],
  );

  // Index of each blog within carouselItems (news slides come first).
  const blogCarouselIndex = useMemo(() => {
    const m = new Map();
    analysis.forEach((post, i) => m.set(post.id, sortedNews.length + i));
    return m;
  }, [analysis, sortedNews.length]);

  // Topic categories present in the live news set (shown in the dropdown).
  const present = new Set(sortedNews.map((i) => i.category));
  const topicCats = NEWS_CATEGORIES.filter((c) => c !== 'All' && present.has(c));
  const baseSegments = [
    { id: 'all', label: 'All' },
    { id: 'news', label: 'News' },
  ];
  const isTopic = !baseSegments.some((s) => s.id === segment);

  const showAnalysis = segment === 'all' || isTopic;
  const showNews = segment === 'all' || segment === 'news' || isTopic;

  const openNews = (rid) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    const idx = newsIndex.get(rid);
    if (idx != null) setCarouselAt(idx);
  };

  const openBlog = (postId) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    const idx = blogCarouselIndex.get(postId);
    if (idx != null) setCarouselAt(idx);
  };

  const setSeg = useCallback((id) => { onSegment?.(id); }, [onSegment]);

  const hour = new Date().getHours();
  const firstName = isAuthed ? (user?.name || '').split(' ')[0] : '';
  const greeting = `${greetingFor(hour)}${firstName ? `, ${firstName}` : ''}`;

  return (
    <div className="content-section" id="intelligence-feed">
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

        {showAnalysis && feedAnalysis.length > 0 && (
          <FeedSection
            key={`analysis-${segment}`}
            label="Practitioner Analysis"
            title="Deep Dives"
            count={feedAnalysis.length}
            subtitle="Articles created by tech authors in AI and observability — practitioner guides, comparisons and deep dives."
            initialCount={TOP}
          >
            {feedAnalysis.map((post) => (
              <BlogCard key={post.id} post={post} onOpen={openBlog} />
            ))}
          </FeedSection>
        )}

        {segment === 'all' && <UpcomingEventsTeaser />}

        {showNews && feedNews.length > 0 && (
          <FeedSection
            key={`news-${segment}`}
            label={loading ? 'Updating…' : live ? 'Live · 100+ sources' : 'Curated'}
            title="News Right Now"
            count={feedNews.length}
            subtitle="Today's AI headlines — tap any card to read in the swipe reader."
            className={showAnalysis ? 'feed-section-spaced' : ''}
            initialCount={TOP}
          >
            {feedNews.map((item) => (
              <NewsCard key={item.rid} item={item} onOpen={openNews} />
            ))}
          </FeedSection>
        )}

        {carouselAt !== null && (
          <NewsCarousel items={carouselItems} startIndex={carouselAt} onClose={() => setCarouselAt(null)} />
        )}
        {readLaterOpen && <ReadLaterPanel onClose={() => setReadLaterOpen(false)} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ sections + cards */

function FeedSection({
  label, title, subtitle, count, children, className = '', initialCount = TOP,
}) {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  const total = count ?? items.length;
  const capped = items.length > initialCount;
  const visible = expanded || !capped ? items : items.slice(0, initialCount);
  const hidden = total - visible.length;

  return (
    <section className={`feed-section${className ? ` ${className}` : ''}`} aria-label={title}>
      <header className="feed-section-head">
        <p className="section-label">{label}</p>
        <h3 className="feed-section-title">
          {title}
          <span className="feed-section-count">{total}</span>
        </h3>
        {subtitle && <p className="feed-section-sub">{subtitle}</p>}
      </header>
      <div className="news-grid feed-card-grid">{visible}</div>
      {capped && (
        <div className="feed-expand-wrap">
          <button
            type="button"
            className="feed-expand-btn"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded
              ? `Show top ${initialCount} only`
              : `Show all ${total}${hidden > 0 ? ` (+${hidden} more)` : ''}`}
          </button>
        </div>
      )}
    </section>
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

// Blog card — mirrors the news card layout so analysis reads like "News Right Now".
function BlogCard({ post, onOpen }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      state={{ from: 'home-feed' }}
      className="news-card news-link"
      onClick={onOpen(post.id)}
      aria-label={`Read: ${post.title}`}
    >
      <div className="news-card-thumb">
        <BlogBanner post={post} className="feed-blog-banner" />
      </div>
      <div className="news-card-body">
        <span className="news-category-tag tag-purple" style={{ marginBottom: 10, fontSize: '0.68rem' }}>
          Deep Dive · {post.category}
        </span>
        <h3 className="news-card-title">{post.title}</h3>
        <p className="news-card-excerpt">{post.subtitle}</p>
        <div className="news-card-footer">
          <span>{post.author || 'Glancer AI'}{post.date ? ` · ${formatBlogDate(post.date)}` : ''}</span>
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
