import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCachedNewsItem, getCachedNews, displayImage } from '../lib/newsFeed';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useNewsFrame } from '../lib/useNewsFrame';
import { openSourcePopup } from '../lib/openPopup';

/*
 * NewsReaderPage — the route-based reader for one story (/news/:id). Used by
 * in-app news clicks and by the Signal ticker, and it shares its framing logic
 * with the in-carousel reader (NewsReaderFrame) via useNewsFrame.
 *
 * It loads the source's own page LIVE in a sandboxed <iframe> — unmodified,
 * exactly as published. For publishers that block embedding
 * (X-Frame-Options/CSP) it never works around their headers; instead it falls
 * back to a short summary and a link to read the story on their site.
 */

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ExtIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// Turn the RSS summary HTML into a plain-text snippet, capped so we only ever
// show a brief excerpt (never the publisher's full body) for non-frameable sources.
function summaryText(item) {
  const raw = item.excerpt || item.html || '';
  const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > 600 ? `${text.slice(0, 600).trim()}…` : text;
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
  const item = useMemo(() => getCachedNewsItem(id), [id]);
  // Shared framing logic (framecheck preflight + 3s escape / 6s blank safety
  // nets), identical to the in-carousel reader. See src/lib/useNewsFrame.js.
  const { mode, iframeLoaded, showEscape, onIframeLoad } = useNewsFrame(item);

  // Next-story target: find this item in the cached, frameable-first ordered
  // feed (the same global order the home feed uses) and take the one after it.
  // null when the item isn't in the cache (cold/shared link) or it's the last
  // story — in both cases the Next button is hidden.
  const nextRid = useMemo(() => {
    const list = getCachedNews()?.items;
    if (!list?.length) return null;
    const idx = list.findIndex((it) => it.rid === id);
    if (idx === -1) return null;
    return list[idx + 1]?.rid ?? null;
  }, [id]);

  // Advance to the next story by changing the route — the page re-renders with
  // the new item and re-runs its framecheck. Keeping it in the URL makes the
  // position shareable.
  const goNext = useCallback(() => {
    if (nextRid) navigate(`/news/${nextRid}`);
  }, [nextRid, navigate]);

  // Reader URLs are ephemeral (cache-backed RSS ids) and mirror the
  // publisher's content — noindex them so crawl budget goes to real pages.
  useDocumentMeta({
    title: item ? item.title : 'News Reader',
    description: item ? summaryText(item).slice(0, 160) : undefined,
    path: `/news/${id}`,
    robots: 'noindex, follow',
  });

  // Robust close: go to the previous page if there is one, else the home feed.
  const goBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  // Blocked mode only: open the publisher's real page in a browser popup window
  // (a top-level context, so no X-Frame-Options issue) instead of a new tab, so
  // the user stays here on glancerai.com and the reader route never navigates.
  // If the browser blocks the popup, fall back to a normal new tab so the link
  // is never dead.
  const openInPopup = useCallback((e) => {
    e.preventDefault();
    if (!openSourcePopup(item?.url)) window.open(item?.url, '_blank', 'noopener,noreferrer');
  }, [item]);

  // Esc closes the reader (back to where the reader was opened from).
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') goBack(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goBack]);

  // Item not in cache (e.g. opened via a stale/direct link). The home feed load
  // populates the cache, so in-app navigation always resolves; this only catches
  // cold/shared links.
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

  // Live frame (or still checking) — load the source page in a sandboxed iframe,
  // exactly as the in-carousel reader does.
  if (mode !== 'blocked') {
    return (
      <div className="page-section reader-page-live">
        <div className="reader-backbar reader-backbar-live">
          <button className="reader-back-btn" onClick={goBack} aria-label="Close reader" title="Close">
            <CloseIcon />
          </button>
          <span className="reader-frame-source">{item.source}</span>
          {nextRid && (
            <button type="button" className="reader-frame-next" onClick={goNext} aria-label="Next story" title="Next story">
              Next <NextIcon />
            </button>
          )}
          <a className="reader-source-link" href={item.url} target="_blank" rel="noopener noreferrer">
            Open original <ExtIcon />
          </a>
        </div>
        <div className="reader-page-live-body">
          {!iframeLoaded && (
            <div className="reader-loading-pill reader-frame-live-loading">
              <span className="reader-spinner" /> Loading {item.source}…
            </div>
          )}
          {/* The live source page, unmodified. The sandbox permits scripts/forms/
              popups so the page is fully interactive, but withholds top-navigation
              so the site can't frame-bust the reader out from under the user. */}
          {mode === 'frame' && (
            <iframe
              className="reader-frame-iframe"
              src={item.url}
              title={item.title}
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
              onLoad={onIframeLoad}
            />
          )}
          {/* Manual escape over the live frame, shown after a short grace: the
              only rescue for a page that painted the browser's grey "content is
              blocked" error (undetectable from JS). */}
          {mode === 'frame' && showEscape && !item.internal && (
            <a className="reader-frame-escape" href={item.url} target="_blank" rel="noopener noreferrer">
              Not loading? Read on {item.source} <ExtIcon />
            </a>
          )}
        </div>
      </div>
    );
  }

  // Blocked — publisher forbids embedding. Respect it: show a short summary and
  // a link out, never the browser's grey error page.
  const summary = summaryText(item);

  return (
    <div className="page-section">
      <article className="container" style={{ maxWidth: 760 }}>
        {/* Sticky back bar */}
        <div className="reader-backbar">
          <button className="reader-back-btn" onClick={goBack} aria-label="Close reader" title="Close">
            <CloseIcon />
          </button>
          {nextRid && (
            <button type="button" className="reader-frame-next" onClick={goNext} aria-label="Next story" title="Next story">
              Next <NextIcon />
            </button>
          )}
          <a className="reader-source-link" href={item.url} target="_blank" rel="noopener noreferrer" onClick={openInPopup}>
            Open original <ExtIcon />
          </a>
        </div>

        <HeroImage src={item.image} gradient={item.gradient} emoji={item.emoji} />

        <div style={{ marginBottom: 24 }}>
          <span className={`news-category-tag ${item.categoryClass}`} style={{ margin: '0 0 14px' }}>{item.source}</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 14 }}>
            {item.title}
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 20, borderBottom: '1px solid var(--glass-border)' }}>
            <span>{item.source}</span>
            {item.date && <><span className="news-meta-dot" /><span>{item.date}</span></>}
            {item.readMin && <><span className="news-meta-dot" /><span>{item.readMin} min read</span></>}
          </div>
        </div>

        {/* Body — a short summary only. The full article lives on the source's
            site; we link there rather than reproducing their content. */}
        <div className="blog-read-content reader-content">
          {summary && <p>{summary}</p>}
          <div className="reader-fallback-note">
            <p>This is a short summary. Read the full article on {item.source}:</p>
            <a className="write-cta-btn" href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }} onClick={openInPopup}>
              Read the full story at {item.source} <ExtIcon />
            </a>
          </div>
        </div>

        {/* Footer nav */}
        <div className="reader-footer-nav">
          <button className="reader-back-btn" onClick={goBack}><BackIcon /> Back to News</button>
          <a className="reader-source-link" href={item.url} target="_blank" rel="noopener noreferrer" onClick={openInPopup}>
            View source: {item.source} <ExtIcon />
          </a>
        </div>
      </article>
    </div>
  );
}
