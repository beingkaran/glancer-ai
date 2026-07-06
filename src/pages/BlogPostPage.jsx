import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getBlogById, getApprovedUserBlogs } from '../lib/blogStore';
import { BLOG_POSTS } from '../data/allBlogs';
import { figuresForPost, injectFiguresIntoHtml } from '../lib/blogImages';
import { sanitizeBlogHtml } from '../lib/sanitizeHtml';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { buildArticleSchema, buildBreadcrumb, useArticleSchema } from '../lib/structuredData';
import BlogBanner from '../components/BlogBanner';
import ShareBar from '../components/ShareBar';
import SaveButton from '../components/SaveButton';
import { entryForBlog } from '../lib/readLater';
import Comments from '../components/Comments';
import AdSlot from '../components/AdSlot';
import StickyAnchorAd from '../components/StickyAnchorAd';
import { AD_SLOTS } from '../lib/adsense';
import { getRelatedPosts } from '../lib/blogRelated';
import AuthorBio from '../components/AuthorBio';
import { PRIMARY_AUTHOR } from '../data/authorMeta';

// Split article HTML roughly in half on a paragraph boundary, so a single
// in-content ad can sit in the natural flow of reading (mid-article).
function splitHtmlForMidAd(html) {
  if (!html) return [html, ''];
  const parts = html.split('</p>');
  if (parts.length < 4) return [html, '']; // too short to break sensibly
  const mid = Math.ceil(parts.length / 2);
  const first = parts.slice(0, mid).join('</p>') + '</p>';
  const second = parts.slice(mid).join('</p>');
  return [first, second];
}

function formatDate(d) {
  const date = new Date(d);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function blogsReturnPath(from) {
  if (from === '/profile') return '/profile';
  return '/';
}

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found
  const [more, setMore] = useState([]);

  // Article HTML with relevant in-body figures injected (curated posts only;
  // posts that already embed their own <img> are left untouched).
  const bodyHtml = useMemo(() => {
    if (!post) return '';
    // Sanitize the stored body BEFORE any figure injection — this is the gate
    // that neutralizes stored XSS in community-authored posts.
    const base = sanitizeBlogHtml(post.body) || '<p>This article has no content.</p>';
    if (base.includes('<img')) return base;
    return injectFiguresIntoHtml(base, figuresForPost(post));
  }, [post]);

  // Halves of the body for a single mid-article ad in the reading flow.
  const [bodyFirst, bodySecond] = useMemo(() => splitHtmlForMidAd(bodyHtml), [bodyHtml]);

  useEffect(() => {
    let active = true;
    (async () => {
      const found = await getBlogById(id);
      if (!active) return;
      setPost(found);
      if (found) {
        const approved = await getApprovedUserBlogs();
        if (!active) return;
        setMore(getRelatedPosts(found, [...approved, ...BLOG_POSTS], 4));
      }
    })();
    return () => { active = false; };
  }, [id]);

  const goBack = () => {
    const from = location.state?.from;
    navigate(from ? blogsReturnPath(from) : '/');
  };

  // Per-article SEO: title/description/canonical/OG + Article & Breadcrumb
  // JSON-LD. Hooks run every render (no-op while loading) to respect hook order.
  const path = `/blog/${id}`;
  useDocumentMeta(
    post
      ? {
          title: post.title,
          description: post.subtitle || (post.body || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160),
          path,
          type: 'article',
          image: post.bannerImage ? `https://glancerai.com${post.bannerImage}` : undefined,
        }
      : {}
  );
  useArticleSchema(
    post
      ? [
          buildArticleSchema(post, { type: 'Article', path }),
          buildBreadcrumb([
            { name: 'Home', path: '/' },
            { name: post.title, path },
          ]),
        ]
      : null
  );

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
          <button type="button" className="write-cta-btn" onClick={goBack}>← Back to Blogs</button>
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
          <div className="blog-byline">
            {/karan|admin|glancer/i.test(post.author || '') ? (
              <picture>
                <source srcSet="/karan.webp" type="image/webp" />
                <img
                  className="blog-byline-photo author-portrait author-portrait-sm"
                  src="/karan.jpg"
                  alt={PRIMARY_AUTHOR.name}
                  width={52}
                  height={52}
                  loading="eager"
                />
              </picture>
            ) : (
              <div className="blog-byline-avatar">{post.avatar || '👤'}</div>
            )}
            <div>
              <div className="blog-byline-name">{post.author || PRIMARY_AUTHOR.name}</div>
              <div className="blog-byline-meta">
                {post.authorRole || PRIMARY_AUTHOR.role} · {formatDate(post.date)}{post.updatedAt && post.updatedAt !== post.date ? ` · Updated ${formatDate(post.updatedAt)}` : ''} · {post.readTime} min read
              </div>
            </div>
          </div>
        </div>

        <AuthorBio post={post} />

        {/* ① Ad — after the intro/byline, top viewability */}
        <AdSlot slot={AD_SLOTS.articleTop} className="ad-in-article" />

        {/* Body — split so a mid-article ad sits in the reading flow */}
        {bodySecond ? (
          <>
            <div className="blog-read-content" dangerouslySetInnerHTML={{ __html: bodyFirst }} />
            {/* ② Ad — mid-article */}
            <AdSlot slot={AD_SLOTS.articleMid} className="ad-in-article" />
            <div className="blog-read-content" dangerouslySetInnerHTML={{ __html: bodySecond }} />
          </>
        ) : (
          <div className="blog-read-content" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        )}

        {/* Save + Share */}
        <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ShareBar post={post} />
          <div><SaveButton entry={entryForBlog(post)} className="news-share" /></div>
        </div>

        {/* ③ Ad — end of article, high completion intent */}
        <AdSlot slot={AD_SLOTS.articleEnd} className="ad-in-article" />

        {/* Comments */}
        <Comments postId={post.id} />

        {/* More */}
        {more.length > 0 && (
          <nav aria-label="Related articles" style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--glass-border)', marginBottom: 80 }}>
            <h2 className="section-title-lg" style={{ marginBottom: 8 }}>Related reading</h2>
            <p className="hero-sub" style={{ marginBottom: 20, maxWidth: 'none' }}>Continue with these connected guides and comparisons.</p>
            <div className="blogs-grid">
              {more.map((b) => (
                <Link key={b.id} to={`/blog/${b.id}`} state={{ from: location.state?.from || 'home-blogs' }} className="blog-card" style={{ textDecoration: 'none' }}>
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
          </nav>
        )}
      </article>

      {/* ④ Sticky bottom anchor ad (mobile) */}
      <StickyAnchorAd />
    </div>
  );
}
