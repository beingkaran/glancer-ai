import { useEffect } from 'react';
import { useSwipeDown } from '../lib/useSwipeDown';
import { useNewsFrame } from '../lib/useNewsFrame';
import { openSourcePopup } from '../lib/openPopup';

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
  // Shared live-iframe logic (framecheck preflight + the 3s escape / 6s blank
  // safety nets). See src/lib/useNewsFrame.js.
  const { mode, iframeLoaded, showEscape, onIframeLoad } = useNewsFrame(item);
  const swipe = useSwipeDown(onBack);

  // Blocked mode only: open the publisher's real page in a browser popup window
  // (a top-level context, so no X-Frame-Options issue) instead of a new tab, so
  // glancerai.com stays open behind the reader. If the browser blocks the popup,
  // fall back to a normal new tab so the link is never dead.
  const openInPopup = (e) => {
    e.preventDefault();
    if (!openSourcePopup(item.url)) window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  // Esc returns to the slideshow rather than closing the whole reader.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onBack?.(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onBack]);

  return (
    <div className="reader-frame reader-frame-live" role="dialog" aria-modal="true" aria-label={`Reader: ${item.title}`}>
      {/* Sticky frame bar — our own chrome, doubles as the swipe-down handle */}
      <div className="reader-frame-bar" onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd}>
        <span className="reader-frame-grabber" aria-hidden="true" />
        <button type="button" className="reader-frame-back" onClick={onBack} aria-label="Back to slideshow">
          <BackIcon /> Slideshow
        </button>
        <a className="reader-frame-source-link" href={item.url} target="_blank" rel="noopener noreferrer" title={item.url} onClick={mode === 'blocked' ? openInPopup : undefined}>
          {item.source}
        </a>
        <div className="reader-frame-bar-right">
          <a className="reader-frame-ext" href={item.url} target="_blank" rel="noopener noreferrer" aria-label="Open original article" onClick={mode === 'blocked' ? openInPopup : undefined}>
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
            onLoad={onIframeLoad}
          />
        )}

        {/* Manual escape over the live frame. Appears after a short grace so that
            if the page rendered the browser's grey "content is blocked" error
            (undetectable from JS — see the timer effect), the reader is never a
            dead end: one tap opens the article on its own site. Hidden for our
            own same-origin Deep Dives, which always frame cleanly. */}
        {mode === 'frame' && showEscape && !item.internal && (
          <a
            className="reader-frame-escape"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Not loading? Read on {item.source} <ExtIcon />
          </a>
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
            <a className="carousel-btn primary reader-blocked-cta" href={item.url} target="_blank" rel="noopener noreferrer" onClick={openInPopup}>
              Read on {item.source} <ExtIcon />
            </a>
            <p className="reader-blocked-note">
              {item.source} doesn't allow reading inside other sites, so this story opens in a separate window.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
