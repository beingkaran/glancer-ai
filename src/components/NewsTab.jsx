import { useState, useEffect } from 'react';
import { NEWS_CATEGORIES } from '../data/newsData';
import { getNews, getCachedNews, STATIC_NEWS, displayImage } from '../lib/newsFeed';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import { blogsToSlides } from '../lib/blogSlides';
import { ShareButton } from './NewsSwipe';
import NewsCarousel from './NewsCarousel';

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// Renders the article's real image when available, else a gradient + emoji.
// stage 0 → proxied image (works past hot-link/CORS blocks), 1 → raw URL,
// 2 → emoji fallback. Reset whenever the item's image changes.
function Thumb({ item, className, emojiSize }) {
  const [stage, setStage] = useState(0);
  useEffect(() => { setStage(0); }, [item.image]);
  const src = stage === 0 ? displayImage(item.image) : stage === 1 ? item.image : null;
  if (item.image && src) {
    return (
      <div className={className} aria-hidden="true" style={{ padding: 0, overflow: 'hidden' }}>
        <img
          className="news-cover-img"
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setStage((s) => s + 1)}
        />
      </div>
    );
  }
  return (
    <div className={className} style={{ background: item.gradient }} aria-hidden="true">
      <span style={{ position: 'relative', zIndex: 1, fontSize: emojiSize }}>{item.emoji}</span>
    </div>
  );
}

export default function NewsTab() {
  const [activeFilter, setActiveFilter] = useState('All'); // "All" is the default category
  const [items, setItems] = useState(STATIC_NEWS);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  // Blog slides appended after the news in the carousel reader, so once the RSS
  // headlines run out the reader keeps going into curated + community blogs.
  const [blogSlides, setBlogSlides] = useState([]);
  // Index (within `filtered`) of the story to open the full-screen carousel at;
  // null = closed. Clicking any card opens it on both desktop and mobile.
  const [carouselAt, setCarouselAt] = useState(null);

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

    // Build the blog tail for the carousel: newest community posts first, then
    // the curated library. New approved blogs flow in automatically.
    const loadBlogs = async () => {
      const approved = await getApprovedUserBlogs();
      if (alive) setBlogSlides(blogsToSlides([...approved, ...BLOG_POSTS]));
    };
    loadBlogs();
    window.addEventListener('glancer:blogs-changed', loadBlogs);
    // When a background refresh (live re-pull or image-enrichment) finishes,
    // swap in the newest cached feed and flip the live badge if it went live.
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

  // Show only the chips that actually have stories in the current feed, in the
  // canonical order. Works for the live feed (categories come from each RSS
  // source) and the curated fallback alike.
  const present = new Set(items.map((i) => i.category));
  const categories = NEWS_CATEGORIES.filter((c) => c === 'All' || present.has(c));
  const filtered = activeFilter === 'All' ? items : items.filter((i) => i.category === activeFilter);
  const featured = filtered[0];
  const rest = filtered.slice(1);
  // The reader plays the visible news first, then continues into the blogs.
  const carouselItems = [...filtered, ...blogSlides];

  // Open the full-screen carousel at `idx` within `filtered`. Plain left-clicks
  // open the reader; ⌘/Ctrl/middle-click fall through to the source URL so the
  // card still behaves like a real link for power users.
  const openAt = (idx) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    setCarouselAt(idx);
  };

  return (
    <div className="content-section">
      <div className="container">
        <div className="news-header">
          <div>
            <p className="section-label">Latest Updates</p>
            <h2 className="section-title-lg">AI News &amp; Breakthroughs</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {loading ? 'Fetching the latest headlines…' : live ? '🟢 Live feed · 60+ AI sources · refreshes every visit · opens at the source' : 'Curated headlines · opens at the source'}
            </p>
          </div>
          {categories.length > 1 && (
            <div className="news-filter" role="group" aria-label="Filter by category">
              {categories.map((cat) => (
                <button key={cat} className={`filter-chip${activeFilter === cat ? ' active' : ''}`} onClick={() => setActiveFilter(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Featured */}
        {featured && (
          <a className="news-featured news-link" href={featured.url} onClick={openAt(0)} rel="noopener noreferrer" aria-label={`Read: ${featured.title}`}>
            <Thumb item={featured} className="news-featured-img" emojiSize="5rem" />
            <div className="news-featured-body">
              <div>
                <span className={`news-category-tag ${featured.categoryClass}`}>{featured.category}</span>
                <h3 className="news-featured-title">{featured.title}</h3>
                <p className="news-featured-excerpt">{featured.excerpt}</p>
              </div>
              <div className="news-meta">
                <span>{featured.source}</span>
                {featured.date && <><span className="news-meta-dot" aria-hidden="true" /><span>{featured.date}</span></>}
                <span className="news-meta-dot" aria-hidden="true" />
                <span>{featured.readMin} min read</span>
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                  <ShareButton item={featured} className="news-share" />
                  <span className="read-more-link">Read story <ArrowIcon /></span>
                </span>
              </div>
            </div>
          </a>
        )}

        {/* Grid */}
        <div className="news-grid">
          {rest.map((item, i) => (
            <a key={item.rid} className="news-card news-link" href={item.url} onClick={openAt(i + 1)} rel="noopener noreferrer" aria-label={`Read: ${item.title}`}>
              <Thumb item={item} className="news-card-thumb" emojiSize="3rem" />
              <div className="news-card-body">
                <span className={`news-category-tag ${item.categoryClass}`} style={{ marginBottom: 10, fontSize: '0.68rem' }}>
                  {item.category}
                </span>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-card-excerpt">{item.excerpt}</p>
                <div className="news-card-footer">
                  <span>{item.source}{item.date ? ` · ${item.date}` : ''}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <ShareButton item={item} className="news-share" />
                    <span className="read-more-link">Read <ArrowIcon /></span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="section-site-link">
          More AI news, tools &amp; insights at{' '}
          <a href="https://glancerai.com" target="_blank" rel="noopener noreferrer">glancerai.com</a>
        </div>

        {carouselAt !== null && (
          <NewsCarousel items={carouselItems} startIndex={carouselAt} onClose={() => setCarouselAt(null)} />
        )}
      </div>
    </div>
  );
}
