import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs, deleteBlog } from '../lib/blogStore';
import { useAuth } from '../context/AuthContext';
import BlogBanner from '../components/BlogBanner';
import SaveButton from '../components/SaveButton';
import ReadLaterPanel from '../components/ReadLaterPanel';
import { entryForBlog, getSavedCount } from '../lib/readLater';

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

// Newest first: order by submission time (full timestamp) when available,
// falling back to the day-precision publish date for curated posts.
const submittedTime = (p) => new Date(p.submittedAt || p.date).getTime();
const byNewest = (list) => [...list].sort((a, b) => submittedTime(b) - submittedTime(a));

const BLOG_LINK_STATE = { from: '/blogs' };

export default function BlogsPage() {
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [posts, setPosts] = useState(() => byNewest(BLOG_POSTS));
  const [busyId, setBusyId] = useState(null);
  const [readLaterOpen, setReadLaterOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getSavedCount());
  const boxRef = useRef(null);

  useEffect(() => {
    const sync = () => setSavedCount(getSavedCount());
    window.addEventListener('glancer:read-later-changed', sync);
    return () => window.removeEventListener('glancer:read-later-changed', sync);
  }, []);

  // Merge approved user blogs (newest first) ahead of curated posts; refresh on
  // changes. Tag user blogs so admins can delete them and we can feature them.
  useEffect(() => {
    const refresh = async () => {
      const userBlogs = (await getApprovedUserBlogs()).map((b) => ({ ...b, isUserBlog: true }));
      setPosts(byNewest([...userBlogs, ...BLOG_POSTS]));
    };
    refresh();
    window.addEventListener('glancer:blogs-changed', refresh);
    return () => window.removeEventListener('glancer:blogs-changed', refresh);
  }, []);

  // Admin-only: permanently delete a community article from the public list.
  async function handleDelete(e, post) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete "${post.title}" permanently?`)) return;
    setBusyId(post.id);
    try {
      await deleteBlog(post.id); // RLS allows this only for admins; fires a refresh
    } catch (err) {
      alert(err?.message || 'Could not delete the post.');
    } finally {
      setBusyId(null);
    }
  }

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

  // Spotlight the single newest article at the top (filtered is already sorted
  // newest-first), so the featured slot always respects the publish date.
  const featured = filtered[0];
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
          <div style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/blog/write" className="write-cta-btn"><PenIcon /> Write an Article</Link>
            <button type="button" className={`read-later-toggle${savedCount ? ' has-saved' : ''}`} onClick={() => setReadLaterOpen(true)} aria-label={`Read later (${savedCount} saved)`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill={savedCount ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Read Later
              {savedCount > 0 && <span className="read-later-badge">{savedCount}</span>}
            </button>
          </div>
        </div>
        {readLaterOpen && <ReadLaterPanel onClose={() => setReadLaterOpen(false)} />}

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
                  <Link key={p.id} to={`/blog/${p.id}`} state={BLOG_LINK_STATE} className="search-suggest-item" role="option" onClick={() => setShowSuggest(false)}>
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
          <Link to={`/blog/${featured.id}`} state={BLOG_LINK_STATE} className="news-featured news-link" style={{ marginBottom: 32, position: 'relative' }} aria-label={`Read: ${featured.title}`}>
            {isAdmin && featured.isUserBlog && (
              <button
                onClick={(e) => handleDelete(e, featured)}
                disabled={busyId === featured.id}
                className="blog-admin-delete"
                aria-label="Delete article"
                title="Delete article (admin)"
              >🗑 Delete</button>
            )}
            <BlogBanner post={featured} className="news-featured-img" emojiSize="5rem" logoStyle={{ width: 120, height: 120 }} />
            <div className="news-featured-body">
              <div>
                <span className="news-category-tag tag-purple">{featured.category}</span>
                <span className="news-category-tag tag-cyan" style={{ marginLeft: 6 }}>{featured.isUserBlog ? 'Latest' : 'Featured'}</span>
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
            <Link key={post.id} to={`/blog/${post.id}`} state={BLOG_LINK_STATE} className="blog-card news-link" style={{ textDecoration: 'none', position: 'relative' }}>
              {isAdmin && post.isUserBlog && (
                <button
                  onClick={(e) => handleDelete(e, post)}
                  disabled={busyId === post.id}
                  className="blog-admin-delete"
                  aria-label="Delete article"
                  title="Delete article (admin)"
                >🗑</button>
              )}
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
                    <SaveButton entry={entryForBlog(post)} className="news-share" label={false} />
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
