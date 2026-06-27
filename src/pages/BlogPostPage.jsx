import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById, getApprovedUserBlogs } from '../lib/blogStore';
import { BLOG_POSTS } from '../data/allBlogs';
import BlogBanner from '../components/BlogBanner';

function formatDate(d) {
  const date = new Date(d);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found
  const [more, setMore] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const found = await getBlogById(id);
      if (!active) return;
      setPost(found);
      if (found) {
        const approved = await getApprovedUserBlogs();
        if (!active) return;
        setMore([...approved, ...BLOG_POSTS].filter((b) => String(b.id) !== String(id)).slice(0, 3));
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (post === undefined) {
    return (
      <div className="page-section">
        <div className="container" style={{ maxWidth: 700, textAlign: 'center', paddingTop: 'calc(var(--navbar-h) + 90px)', paddingBottom: 100 }}>
          <p className="hero-sub">Loading article…</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-section">
        <div className="container" style={{ maxWidth: 700, textAlign: 'center', paddingTop: 'calc(var(--navbar-h) + 90px)', paddingBottom: 100 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
          <h1 className="page-hero-title" style={{ fontSize: '1.8rem' }}>Article Not Found</h1>
          <p className="hero-sub" style={{ margin: '0 auto 28px' }}>
            This article may not exist, or it hasn't been approved for publication yet.
          </p>
          <Link to="/blogs" className="write-cta-btn">← Back to all articles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <article className="container" style={{ maxWidth: 760 }}>
        {/* Banner */}
        <BlogBanner post={post} className="blog-read-banner" emojiSize="5rem" />

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="news-category-tag tag-purple" style={{ margin: 0 }}>{post.category}</span>
            {(post.tags || []).slice(0, 3).map((t) => (
              <span key={t} className="tag-pill">#{t}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, lineHeight: 1.18, color: 'var(--text-primary)', marginBottom: 16 }}>
            {post.title}
          </h1>
          {post.subtitle && (
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{post.subtitle}</p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 24, borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
              {post.avatar || '👤'}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{post.author || 'Glancer AI'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {formatDate(post.date)} · {post.readTime} min read
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="blog-read-content" dangerouslySetInnerHTML={{ __html: post.body || '<p>This article has no content.</p>' }} />

        {/* More */}
        {more.length > 0 && (
          <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--glass-border)', marginBottom: 80 }}>
            <h2 className="section-title-lg" style={{ marginBottom: 20 }}>More Articles</h2>
            <div className="blogs-grid">
              {more.map((b) => (
                <Link key={b.id} to={`/blog/${b.id}`} className="blog-card" style={{ textDecoration: 'none' }}>
                  <BlogBanner post={b} className="blog-card-banner" emojiSize="2.6rem" />
                  <div className="blog-card-body">
                    <span className="news-category-tag tag-purple" style={{ fontSize: '0.66rem' }}>{b.category}</span>
                    <h3 className="blog-card-title">{b.title}</h3>
                    <div className="blog-card-footer" style={{ marginTop: 'auto' }}>
                      <span className="blog-meta">{formatDate(b.date)}</span>
                      <span className="read-time-badge">{b.readTime} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
