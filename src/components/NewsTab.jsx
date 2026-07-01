import { useState, useEffect } from 'react';
import { NEWS_CATEGORIES } from '../data/newsData';
import { getNews, getCachedNews, STATIC_NEWS, displayImage, sourceFavicon } from '../lib/newsFeed';
import { getLike, toggleLike } from '../lib/newsLikes';
import { useAuth } from '../context/AuthContext';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import { blogsToSlides } from '../lib/blogSlides';
import NewsCarousel from './NewsCarousel';
import SocialShareSheet from './SocialShareSheet';
import SaveButton from './SaveButton';
import ReadLaterPanel from './ReadLaterPanel';
import { entryForNews, getSavedCount } from '../lib/readLater';

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const ThumbUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);
const ThumbDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
);

// Renders the article's real image when available, else the publisher's brand
// logo on the gradient, and only as a last resort a bare emoji.
function Thumb({ item, className, emojiSize, eager }) {
  const [stage, setStage] = useState(item.image ? 0 : 2);
  useEffect(() => { setStage(item.image ? 0 : 2); }, [item.image]);

  const coverSrc = stage === 0 ? displayImage(item.image) : stage === 1 ? item.image : null;
  if (coverSrc) {
    return (
      <div className={className} aria-hidden="true" style={{ padding: 0, overflow: 'hidden' }}>
        <img
          className="news-cover-img"
          src={coverSrc}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          onError={() => setStage((s) => s + 1)}
        />
      </div>
    );
  }

  const favicon = stage === 2 ? sourceFavicon(item) : null;
  if (favicon) {
    return (
      <div className={`${className} news-thumb-logo`} style={{ background: item.gradient }} aria-hidden="true">
        <img className="news-source-logo" src={favicon} alt="" loading="lazy" onError={() => setStage(3)} />
      </div>
    );
  }

  return (
    <div className={className} style={{ background: item.gradient }} aria-hidden="true">
      <span style={{ position: 'relative', zIndex: 1, fontSize: emojiSize }}>{item.emoji}</span>
    </div>
  );
}

// Like / dislike thumbs, shown only for authenticated users.
function LikeBtns({ item }) {
  const { isAuthed } = useAuth();
  const rid = item.rid;
  const [liked, setLiked] = useState(() => (rid ? getLike(rid) : null));

  if (!isAuthed || !rid) return null;

  const onTap = (e, val) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(toggleLike(rid, val));
  };

  return (
    <span className="card-like-btns">
      <button type="button" className={`card-like-btn${liked === 'like' ? ' active like' : ''}`} onClick={(e) => onTap(e, 'like')} aria-label="Like" aria-pressed={liked === 'like'}>
        <ThumbUpIcon />
      </button>
      <button type="button" className={`card-like-btn${liked === 'dislike' ? ' active dislike' : ''}`} onClick={(e) => onTap(e, 'dislike')} aria-label="Dislike" aria-pressed={liked === 'dislike'}>
        <ThumbDownIcon />
      </button>
    </span>
  );
}

// Share button that opens the SocialShareSheet platform picker.
function ShareBtn({ item, className }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className || 'news-share'}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        aria-label={`Share: ${item.title}`}
      >
        <ShareIcon /> Share
      </button>
      {open && <SocialShareSheet item={item} onClose={() => setOpen(false)} />}
    </>
  );
}

export default function NewsTab() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [items, setItems] = useState(STATIC_NEWS);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogSlides, setBlogSlides] = useState([]);
  const [carouselAt, setCarouselAt] = useState(null);
  const [readLaterOpen, setReadLaterOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getSavedCount());

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
      const approved = await getApprovedUserBlogs();
      if (alive) setBlogSlides(blogsToSlides([...approved, ...BLOG_POSTS]));
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

  // Any device, every visit, all users: automatically open the swipe slideshow
  // after 13 s so users experience the immersive reader without tapping a card.
  useEffect(() => {
    const t = setTimeout(() => {
      setCarouselAt((cur) => (cur === null ? 0 : cur));
    }, 13000);
    return () => clearTimeout(t);
  }, []);

  const present = new Set(items.map((i) => i.category));
  const categories = NEWS_CATEGORIES.filter((c) => c === 'All' || present.has(c));

  // Sort so items with a real cover image always appear before emoji/gradient
  // placeholders, preserving the original feed order within each group.
  const base = activeFilter === 'All' ? items : items.filter((i) => i.category === activeFilter);
  const sorted = [...base].sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0));
  const featured = sorted[0];
  const rest = sorted.slice(1);
  const carouselItems = [...sorted, ...blogSlides];

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
        </div>

        {/* Category filter bar — chips on the left, Read Later flush right, one row. */}
        <div className="news-filter-bar">
          {categories.length > 1 && (
            <div className="news-filter" role="group" aria-label="Filter by category">
              {categories.map((cat) => (
                <button key={cat} className={`filter-chip${activeFilter === cat ? ' active' : ''}`} onClick={() => setActiveFilter(cat)}>
                  {cat}
                </button>
              ))}
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

        {/* Featured */}
        {featured && (
          <a className="news-featured news-link" href={featured.url} onClick={openAt(0)} rel="noopener noreferrer" aria-label={`Read: ${featured.title}`}>
            <Thumb item={featured} className="news-featured-img" emojiSize="5rem" eager />
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
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <LikeBtns item={featured} />
                  <SaveButton entry={entryForNews(featured)} className="news-share" />
                  <ShareBtn item={featured} className="news-share" />
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
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <LikeBtns item={item} />
                    <SaveButton entry={entryForNews(item)} className="news-share" label={false} />
                    <ShareBtn item={item} className="news-share" />
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

        {readLaterOpen && <ReadLaterPanel onClose={() => setReadLaterOpen(false)} />}
      </div>
    </div>
  );
}
