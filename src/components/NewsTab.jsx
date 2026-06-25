import { useState, useEffect } from 'react';
import { NEWS_CATEGORIES } from '../data/newsData';
import { getNews, getCachedNews, STATIC_NEWS } from '../lib/newsFeed';

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// Renders the article's real image when available, else a gradient + emoji.
function Thumb({ item, className, emojiSize }) {
  const [broken, setBroken] = useState(false);
  if (item.image && !broken) {
    return (
      <div className={className} aria-hidden="true" style={{ padding: 0, overflow: 'hidden' }}>
        <img className="news-cover-img" src={item.image} alt="" loading="lazy" onError={() => setBroken(true)} />
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
  const [activeFilter, setActiveFilter] = useState('All');
  const [items, setItems] = useState(STATIC_NEWS);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { items: fresh, live: isLive } = await getNews(15);
        if (alive && fresh?.length) { setItems(fresh); setLive(isLive); }
      } catch {
        /* keep static fallback */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    // When background image-enrichment finishes, refresh from cache.
    const onUpdate = () => {
      const cached = getCachedNews();
      if (alive && cached?.items?.length) setItems(cached.items);
    };
    window.addEventListener('glancer:news-updated', onUpdate);
    return () => { alive = false; window.removeEventListener('glancer:news-updated', onUpdate); };
  }, []);

  const categories = live ? ['All'] : NEWS_CATEGORIES;
  const filtered = activeFilter === 'All' ? items : items.filter((i) => i.category === activeFilter);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="content-section">
      <div className="container">
        <div className="news-header">
          <div>
            <p className="section-label">Latest Updates</p>
            <h2 className="section-title-lg">AI News &amp; Breakthroughs</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {loading ? 'Fetching the latest headlines…' : live ? '🟢 Live feed · updates every 12 hours · opens at the source' : 'Curated headlines · opens at the source'}
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
          <a className="news-featured news-link" href={featured.url} target="_blank" rel="noopener noreferrer" aria-label={`Read: ${featured.title}`}>
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
                <span style={{ marginLeft: 'auto' }}><span className="read-more-link">Read story <ArrowIcon /></span></span>
              </div>
            </div>
          </a>
        )}

        {/* Grid */}
        <div className="news-grid">
          {rest.map((item) => (
            <a key={item.rid} className="news-card news-link" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Read: ${item.title}`}>
              <Thumb item={item} className="news-card-thumb" emojiSize="3rem" />
              <div className="news-card-body">
                <span className={`news-category-tag ${item.categoryClass}`} style={{ marginBottom: 10, fontSize: '0.68rem' }}>
                  {item.category}
                </span>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-card-excerpt">{item.excerpt}</p>
                <div className="news-card-footer">
                  <span>{item.source}{item.date ? ` · ${item.date}` : ''}</span>
                  <span className="read-more-link">Read <ArrowIcon /></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
