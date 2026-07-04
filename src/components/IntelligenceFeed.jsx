import { useState, useEffect, useRef, useMemo, Children } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/allBlogs';
import { getApprovedUserBlogs } from '../lib/blogStore';
import { blogsToSlides } from '../lib/blogSlides';
import { useAuth } from '../context/AuthContext';
import NewsCarousel from './NewsCarousel';
import ReadLaterPanel from './ReadLaterPanel';
import SaveButton from './SaveButton';
import BlogBanner from './BlogBanner';
import UpcomingEventsTeaser from './UpcomingEventsTeaser';
import { ArrowIcon } from './feedBits';
import { entryForBlog, getSavedCount } from '../lib/readLater';

/*
 * IntelligenceFeed — the home stream of long-form Deep Dives (practitioner
 * analysis, comparisons and guides). The live RSS news section was removed;
 * this is now a single responsive card grid of blogs, newest first, with an
 * expand control for the full list. Cards open the in-app swipe reader.
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

export default function IntelligenceFeed() {
  const { user, isAuthed } = useAuth();
  const [analysis, setAnalysis] = useState(() => byNewest(BLOG_POSTS));
  // Carousel opens a blogs-only slideshow starting at the tapped card.
  const [carousel, setCarousel] = useState(null);
  const [readLaterOpen, setReadLaterOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getSavedCount());

  useEffect(() => {
    const sync = () => setSavedCount(getSavedCount());
    window.addEventListener('glancer:read-later-changed', sync);
    return () => window.removeEventListener('glancer:read-later-changed', sync);
  }, []);

  useEffect(() => {
    let alive = true;
    const loadBlogs = async () => {
      const approved = (await getApprovedUserBlogs()).map((b) => ({ ...b, isUserBlog: true }));
      if (!alive) return;
      setAnalysis(byNewest([...approved, ...BLOG_POSTS]));
    };
    loadBlogs();
    window.addEventListener('glancer:blogs-changed', loadBlogs);
    return () => {
      alive = false;
      window.removeEventListener('glancer:blogs-changed', loadBlogs);
    };
  }, []);

  // Blog slides derive straight from the analysis list, so the slideshow is
  // always in sync with what the cards show.
  const blogSlides = useMemo(() => blogsToSlides(analysis), [analysis]);

  // Index of each blog within the slideshow, so a card click maps to its slide.
  const blogIndex = useMemo(() => {
    const m = new Map();
    analysis.forEach((post, i) => m.set(post.id, i));
    return m;
  }, [analysis]);

  const openBlog = (postId) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    const idx = blogIndex.get(postId);
    if (idx != null) setCarousel({ at: idx });
  };

  const hour = new Date().getHours();
  const firstName = isAuthed ? (user?.name || '').split(' ')[0] : '';
  const greeting = `${greetingFor(hour)}${firstName ? `, ${firstName}` : ''}`;

  return (
    <div className="content-section" id="intelligence-feed">
      <div className="container">
        <div className="news-header">
          <div>
            <p className="section-label">Practitioner Analysis · Updated regularly</p>
            <h2 className="section-title-lg">The AI &amp; Observability Deep Dives</h2>
            <p className="feed-sub">
              {greeting} — practitioner-grade guides, comparisons and deep dives in one place.
            </p>
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

        {analysis.length > 0 && (
          <FeedSection
            label="Practitioner Analysis"
            title="Deep Dives"
            count={analysis.length}
            subtitle="Articles created by tech authors in AI and observability — practitioner guides, comparisons and deep dives."
            initialCount={TOP}
          >
            {analysis.map((post) => (
              <BlogCard key={post.id} post={post} onOpen={openBlog} />
            ))}
          </FeedSection>
        )}

        <UpcomingEventsTeaser />

        {carousel !== null && (
          <NewsCarousel
            items={blogSlides}
            startIndex={carousel.at}
            onClose={() => setCarousel(null)}
          />
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

  // Front-page arrangement: the newest story runs as a large lead on the
  // left, the next three as a headline-only rail behind a vertical hairline;
  // everything else flows into the regular card grid below.
  const useLead = visible.length >= 4;
  const lead = useLead ? visible[0] : null;
  const rail = useLead ? visible.slice(1, 4) : [];
  const rest = useLead ? visible.slice(4) : visible;

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
      {useLead && (
        <div className="feed-lead-package">
          <div className="feed-lead-slot">{lead}</div>
          <div className="feed-rail">{rail}</div>
        </div>
      )}
      {rest.length > 0 && <div className="news-grid feed-card-grid">{rest}</div>}
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

// Blog card — mirrors the old news card layout so analysis reads like a feed.
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
