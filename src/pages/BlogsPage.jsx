import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import BlogBanner from '../components/BlogBanner';

const PenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const ALL_CATEGORIES = ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export default function BlogsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [posts, setPosts] = useState(BLOG_POSTS);
  const boxRef = useRef(null);

  // Merge approved user blogs with curated posts; refresh on changes.
  useEffect(() => {
    const refresh = () => setPosts([...getApprovedUserBlogs(), ...BLOG_POSTS]);
    refresh();
    window.addEventListener('glancer:blogs-changed', refresh);
    return () => window.removeEventListener('glancer:blogs-changed', refresh);
  }, []);

  // Close suggestion dropdown on outside click.
  useEffect(() => {
    const onClick = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setShowSuggest(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const q = search.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!q) return [];
    return posts
      .filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.subtitle || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [q, posts]);

  const filtered = posts.filter((p) => {
    const catMatch = filter === 'All' || p.category === filter;
    const searchMatch = !q ||
      p.title.toLowerCase().includes(q) ||
      (p.subtitle || '').toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q));
    return catMatch && searchMatch;
  });

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => p !== featured);
  const showFeatured = featured && filter === 'All' && !q;

  return (
    <div className="page-section">
      <div className="container">
        {/* Header */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 36, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>All Articles</p>
          <h1 className="page-hero-title">In-Depth Guides &amp; Insights</h1>
          <p className="hero-sub" style={{ margin: '0 auto 28px' }}>
            Deep dives into AIOps, Observability, APM, and the AI ecosystem — written for practitioners.
          </p>
          <Link to="/blog/write" className="write-cta-btn"><PenIcon /> Write an Article</Link>
        </div>

        {/* Search — full width with live suggestions */}
        <div className="blog-search-wrap" ref={boxRef}>
          <span className="blog-search-icon" aria-hidden="true"><SearchIcon /></span>
          <input
            className="blog-search-input"
            type="text"
            placeholder="Search articles by title, topic, or tag…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggest(true); }}
            onFocus={() => setShowSuggest(true)}
            aria-label="Search articles"
            autoComplete="off"
          />
          {search && (
            <button className="blog-search-clear" onClick={() => { setSearch(''); setShowSuggest(false); }} aria-label="Clear search">✕</button>
          )}
          {showSuggest && q && (
            <div className="search-suggest" role="listbox">
              {suggestions.length === 0 ? (
                <div className="search-suggest-empty">No articles match "{search}"</div>
              ) : (
                suggestions.map((p) => (
                  <Link key={p.id} to={`/blog/${p.id}`} className="search-suggest-item" role="option" onClick={() => setShowSuggest(false)}>
                    <span className="search-suggest-icon" style={p.bannerImage ? null : { background: p.bgGradient || p.gradient }}>
                      {p.bannerImage
                        ? <img className="blog-banner-img" src={p.bannerImage} alt="" />
                        : p.logo ? <img className="blog-logo-img" src={p.logo} alt="" /> : (p.icon || p.emoji)}
                    </span>
                    <span className="search-suggest-text">
                      <span className="search-suggest-title">{p.title}</span>
                      <span className="search-suggest-cat">{p.category} · {p.readTime} min</span>
                    </span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="news-filter" role="group" aria-label="Filter by category" style={{ justifyContent: 'center', marginBottom: 28 }}>
          {ALL_CATEGORIES.map((cat) => (
            <button key={cat} className={`filter-chip${filter === cat ? ' active' : ''}`} onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 24, textAlign: 'center' }}>
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Featured */}
        {showFeatured && (
          <Link to={`/blog/${featured.id}`} className="news-featured news-link" style={{ marginBottom: 32 }} aria-label={`Read: ${featured.title}`}>
            <BlogBanner post={featured} className="news-featured-img" emojiSize="5rem" logoStyle={{ width: 120, height: 120 }} />
            <div className="news-featured-body">
              <div>
                <span className="news-category-tag tag-purple">{featured.category}</span>
                <span className="news-category-tag tag-cyan" style={{ marginLeft: 6 }}>Featured</span>
                <h2 className="news-featured-title" style={{ marginTop: 12 }}>{featured.title}</h2>
                <p className="news-featured-excerpt">{featured.subtitle}</p>
              </div>
              <div className="news-meta">
                <span>{featured.author || 'Glancer AI'}</span>
                <span className="news-meta-dot" />
                <span>{formatDate(featured.date)}</span>
                <span className="news-meta-dot" />
                <span>{featured.readTime} min read</span>
                <span style={{ marginLeft: 'auto' }}><span className="read-more-link">Read article →</span></span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="blogs-grid">
          {(showFeatured ? rest : filtered).map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="blog-card news-link" style={{ textDecoration: 'none' }}>
              <BlogBanner post={post} className="blog-card-banner" />
              <div className="blog-card-body">
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <span className="news-category-tag tag-purple" style={{ fontSize: '0.68rem' }}>{post.category}</span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-subtitle">{post.subtitle}</p>
                <div className="tag-list">
                  {(post.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="tag-pill">#{tag}</span>
                  ))}
                </div>
                <div className="blog-card-footer">
                  <span className="blog-meta">{formatDate(post.date)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="read-time-badge">{post.readTime} min</span>
                    <span className="read-more-link">Read →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            No articles match your search.
          </div>
        )}
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
