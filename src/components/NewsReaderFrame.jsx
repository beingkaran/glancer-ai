import { useState, useEffect, useRef } from 'react';
import { useSwipeDown } from '../lib/useSwipeDown';

/*
 * NewsReaderFrame — an in-carousel reader. Opens on top of the slideshow when a
 * story's "Read Story" is tapped.
 *
 * It loads the source's own page LIVE in an <iframe> — unmodified, exactly as
 * published, nothing scraped or re-rendered — and lets the reader interact with
 * it in place. If the page hasn't loaded within 10s (blocked by
 * X-Frame-Options/CSP, or too slow), the reader opens the original article in a
 * NEW TAB and returns to the slideshow — glancerai.com stays open behind it,
 * rather than the whole tab navigating away. If it loads in time, nothing happens.
 *
 * The Next button loads the following story straight into the reader, so the
 * reader can move through the feed without dropping back to the slideshow.
 *
 * Swipe down on the top bar, or the X, returns to the slideshow.
 */

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ExtIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);


// One or two short summary paragraphs for the blocked-page fallback panel.
function summaryParas(item) {
  const raw = item.excerpt || item.html || '';
  const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? [text.length > 600 ? `${text.slice(0, 597).trim()}…` : text] : [];
}

export default function NewsReaderFrame({ item, onBack, onNext, hasNext }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  // 'checking' → asking /api/framecheck whether the article allows embedding;
  // 'frame'    → publisher allows it (or the check was unavailable) — live iframe;
  // 'blocked'  → publisher forbids framing — show the summary + link-out panel
  //              instead of the browser's grey "content is blocked" error page.
  const [mode, setMode] = useState('checking');
  // Ref mirror of "loaded" so the slow-load timer reads the latest value
  // without a stale closure.
  const loadedRef = useRef(false);
  const swipe = useSwipeDown(onBack);

  // Esc returns to the slideshow rather than closing the whole reader.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onBack?.(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onBack]);

  // Preflight: ask our own edge (/api/framecheck) whether THIS article's
  // headers allow cross-origin framing. The static per-source `frameable` flag
  // samples the site root, but article pages can be stricter — and a blocked
  // iframe still fires onLoad on its error page, so the browser gives us no
  // reliable signal after the fact. If the check itself is unavailable, fall
  // back to the optimistic iframe path.
  //
  // Keyed on `item.url` (a stable string), NOT the `item` object: the live news
  // feed revalidates in the background and hands down fresh item objects every
  // few seconds — see the git history of the old 10s-timer version.
  useEffect(() => {
    let alive = true;
    setMode('checking');
    setIframeLoaded(false);
    loadedRef.current = false;
    (async () => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        const res = await fetch(`/api/framecheck?url=${encodeURIComponent(item.url)}`, {
          signal: ctrl.signal,
          headers: { accept: 'application/json' },
        });
        clearTimeout(t);
        const ct = res.headers.get('content-type') || '';
        if (!res.ok || !ct.includes('application/json')) throw new Error('framecheck unavailable');
        const verdict = await res.json();
        if (alive) setMode(verdict.frameable === false ? 'blocked' : 'frame');
      } catch {
        if (alive) setMode('frame');
      }
    })();
    return () => { alive = false; };
  }, [item.url]);

  // Even for allowed sources, give the page 12s to actually render; if it's
  // still blank (slow network, or a policy the headers didn't declare), swap to
  // the summary panel — its "Read on <source>" button is a real user gesture,
  // so it never trips popup blockers the way an automatic window.open did.
  useEffect(() => {
    if (mode !== 'frame') return undefined;
    const t = setTimeout(() => {
      if (!loadedRef.current) setMode('blocked');
    }, 12000);
    return () => clearTimeout(t);
  }, [mode, item.url]);

  return (
    <div className="reader-frame reader-frame-live" role="dialog" aria-modal="true" aria-label={`Reader: ${item.title}`}>
      {/* Sticky frame bar — our own chrome, doubles as the swipe-down handle */}
      <div className="reader-frame-bar" onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd}>
        <span className="reader-frame-grabber" aria-hidden="true" />
        <button type="button" className="reader-frame-back" onClick={onBack} aria-label="Back to slideshow">
          <BackIcon /> Slideshow
        </button>
        <a className="reader-frame-source-link" href={item.url} target="_blank" rel="noopener noreferrer" title={item.url}>
          {item.source}
        </a>
        <div className="reader-frame-bar-right">
          <a className="reader-frame-ext" href={item.url} target="_blank" rel="noopener noreferrer" aria-label="Open original article">
            Original <ExtIcon />
          </a>
          {onNext && hasNext && (
            <button type="button" className="reader-frame-next" onClick={onNext} aria-label="Next story">
              Next <NextIcon />
            </button>
          )}
          <button type="button" className="reader-frame-close" onClick={onBack} aria-label="Close reader">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="reader-frame-live-body">
        {mode !== 'blocked' && !iframeLoaded && (
          <div className="reader-loading-pill reader-frame-live-loading">
            <span className="reader-spinner" /> Loading {item.source}…
          </div>
        )}

        {/* The live source page, unmodified — nothing scraped or re-rendered.
            The sandbox permits scripts/forms/popups so the page is fully
            interactive, but withholds top-navigation so the site can't frame-bust
            the reader out from under the user. */}
        {mode === 'frame' && (
          <iframe
            className="reader-frame-iframe"
            src={item.url}
            title={item.title}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
            onLoad={() => { loadedRef.current = true; setIframeLoaded(true); }}
          />
        )}

        {/* Publisher forbids embedding (X-Frame-Options / CSP) — we respect
            that and show our own summary with a link out, instead of the
            browser's grey error page. */}
        {mode === 'blocked' && (
          <div className="reader-blocked">
            <span className={`news-category-tag ${item.categoryClass || ''}`}>{item.category}</span>
            <h2 className="reader-blocked-title">{item.title}</h2>
            <p className="reader-blocked-meta">
              {item.source}{item.date ? ` · ${item.date}` : ''}
            </p>
            {summaryParas(item).map((p, i) => <p key={i} className="reader-blocked-text">{p}</p>)}
            <a className="carousel-btn primary reader-blocked-cta" href={item.url} target="_blank" rel="noopener noreferrer">
              Read on {item.source} <ExtIcon />
            </a>
            <p className="reader-blocked-note">
              {item.source} doesn't allow reading inside other sites, so this story opens in a new tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
