import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import BlogBanner from './BlogBanner';

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const ALL_CATEGORIES = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];

// Newest first: order by submission time (full timestamp) when available,
// falling back to the day-precision publish date for curated posts.
const submittedTime = (p) => new Date(p.submittedAt || p.date).getTime();
const byNewest = (list) => [...list].sort((a, b) => submittedTime(b) - submittedTime(a));

export default function BlogsTab({ limit }) {
  const [filter, setFilter] = useState('All');
  const [userBlogs, setUserBlogs] = useState([]);

  useEffect(() => {
    const refresh = async () => setUserBlogs(await getApprovedUserBlogs());
    refresh();
    window.addEventListener('glancer:blogs-changed', refresh);
    return () => window.removeEventListener('glancer:blogs-changed', refresh);
  }, []);

  const allPosts = byNewest([...userBlogs, ...BLOG_POSTS]);
  const filtered = filter === 'All' ? allPosts : allPosts.filter(p => p.category === filter);
  const posts = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="content-section">
      <div className="container">
        <div className="news-header">
          <div>
            <p className="section-label">Expert Insights</p>
            <h2 className="section-title-lg">In-Depth Articles &amp; Guides</h2>
          </div>
          <div className="news-filter" role="group" aria-label="Filter by category">
            {ALL_CATEGORIES.slice(0, 6).map(cat => (
              <button key={cat} className={`filter-chip${filter === cat ? ' active' : ''}`} onClick={() => setFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="blogs-grid">
          {posts.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className="blog-card news-link" style={{ textDecoration: 'none' }}>
              <BlogBanner post={post} className="blog-card-banner" />
              <div className="blog-card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="news-category-tag tag-purple" style={{ fontSize: '0.68rem' }}>{post.category}</span>
                  {post.featured && <span className="news-category-tag tag-cyan" style={{ fontSize: '0.65rem' }}>Featured</span>}
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-subtitle">{post.subtitle}</p>
                <div className="tag-list">
                  {(post.tags || []).slice(0, 3).map(tag => (
                    <span key={tag} className="tag-pill">#{tag}</span>
                  ))}
                </div>
                <div className="blog-card-footer">
                  <span className="blog-meta">{formatDate(post.date)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="read-time-badge">{post.readTime} min</span>
                    <span className="read-more-link">Read <ArrowIcon /></span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {limit && filtered.length > limit && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/blogs" className="search-btn" style={{ display: 'inline-block', padding: '12px 32px', borderRadius: 12, textDecoration: 'none' }}>
              View all {filtered.length} articles →
            </Link>
          </div>
        )}

        <div className="section-site-link">
          More AI news, tools &amp; insights at{' '}
          <a href="https://glancerai.com" target="_blank" rel="noopener noreferrer">glancerai.com</a>
        </div>
      </div>
    </div>
  );
}
