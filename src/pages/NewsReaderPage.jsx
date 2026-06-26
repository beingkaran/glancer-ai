import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCachedNewsItem, displayImage } from '../lib/newsFeed';
import { fetchArticle } from '../lib/articleReader';

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const ExtIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// Strip scripts/styles from RSS HTML so it can be shown immediately and safely.
function cleanRssHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
}

// stage 0 → proxied image (past hot-link/CORS blocks), 1 → raw URL, 2 → emoji.
function HeroImage({ src, gradient, emoji }) {
  const [stage, setStage] = useState(0);
  useEffect(() => { setStage(0); }, [src]);
  const shown = stage === 0 ? displayImage(src, 1400) : stage === 1 ? src : null;
  if (src && shown) {
    return (
      <img
        className="reader-hero-img"
        src={shown}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setStage((s) => s + 1)}
      />
    );
  }
  return (
    <div className="reader-hero-fallback" style={{ background: gradient }}>
      <span>{emoji}</span>
    </div>
  );
}

export default function NewsReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Memoize so the object reference is stable across renders (otherwise the
  // effect below would re-fire on every render and never settle).
  const item = useMemo(() => getCachedNewsItem(id), [id]);

  const [state, setState] = useState('loading'); // loading | ready | error
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (!item) return;
    let alive = true;
    setState('loading');
    setArticle(null);
    fetchArticle(item.url)
      .then((res) => { if (alive) { setArticle(res); setState('ready'); } })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, [item]);

  // Robust back: go to the previous page if there is one, else the news feed.
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  // Item not in cache (e.g. opened via a stale/direct link).
  if (!item) {
    return (
      <div className="page-section">
        <div className="container" style={{ maxWidth: 680, textAlign: 'center', paddingTop: 'calc(var(--navbar-h) + 90px)', paddingBottom: 100 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📰</div>
          <h1 className="page-hero-title" style={{ fontSize: '1.7rem' }}>This story isn't loaded</h1>
          <p className="hero-sub" style={{ margin: '0 auto 28px' }}>
            Head back to the news feed and open it from there.
          </p>
          <Link to="/" className="write-cta-btn">← Back to News</Link>
        </div>
      </div>
    );
  }

  const heroSrc = article?.heroImage || item.image;
  const rssHtml = cleanRssHtml(item.html || `<p>${item.excerpt || ''}</p>`);

  return (
    <div className="page-section">
      <article className="container" style={{ maxWidth: 760 }}>
        {/* Sticky back bar */}
        <div className="reader-backbar">
          <button className="reader-back-btn" onClick={goBack}>
            <BackIcon /> Back
          </button>
          <a className="reader-source-link" href={item.url} target="_blank" rel="noopener noreferrer">
            Open original <ExtIcon />
          </a>
        </div>

        <HeroImage src={heroSrc} gradient={item.gradient} emoji={item.emoji} />

        <div style={{ marginBottom: 24 }}>
          <span className={`news-category-tag ${item.categoryClass}`} style={{ margin: '0 0 14px' }}>{item.source}</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 14 }}>
            {item.title}
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 20, borderBottom: '1px solid var(--glass-border)' }}>
            <span>{item.source}</span>
            {item.date && <><span className="news-meta-dot" /><span>{item.date}</span></>}
            <span className="news-meta-dot" /><span>{item.readMin} min read</span>
          </div>
        </div>

        {/* Body — full extracted article when ready, otherwise the RSS summary
            (so the page is always visual and never blank). */}
        <div className="blog-read-content reader-content">
          {state === 'ready' ? (
            article.blocks.map((b, i) => {
              if (b.type === 'img') return <img key={i} src={b.src} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
              if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
              if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>;
              if (b.type === 'quote') return <blockquote key={i}>{b.text}</blockquote>;
              return <p key={i}>{b.text}</p>;
            })
          ) : (
            <>
              {state === 'loading' && (
                <div className="reader-loading-pill">
                  <span className="reader-spinner" /> Loading the full story…
                </div>
              )}
              {/* RSS summary shown immediately so there's always something visible */}
              <div className="reader-rss" dangerouslySetInnerHTML={{ __html: rssHtml }} />
              <div className="reader-fallback-note">
                <p>{state === 'error' ? 'The full article couldn\'t be loaded inside Glancer AI for this source.' : 'Showing the summary while the full story loads…'}</p>
                <a className="write-cta-btn" href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                  Read the full story at {item.source} <ExtIcon />
                </a>
              </div>
            </>
          )}
        </div>

        {/* Footer nav */}
        <div className="reader-footer-nav">
          <button className="reader-back-btn" onClick={goBack}><BackIcon /> Back to News</button>
          <a className="reader-source-link" href={item.url} target="_blank" rel="noopener noreferrer">
            View source: {item.source} <ExtIcon />
          </a>
        </div>
      </article>
    </div>
  );
}
