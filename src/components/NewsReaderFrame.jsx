import { useState, useEffect } from 'react';
import { displayImage } from '../lib/newsFeed';
import { useSwipeDown } from '../lib/useSwipeDown';

/*
 * NewsReaderFrame — an in-carousel reader. Opens on top of the slideshow when a
 * story's "Read full story" is tapped.
 *
 * For sources verified NOT to block third-party framing (item.frameable, see
 * src/data/newsFeeds.js + scripts/check-frameable.mjs), this loads the source's
 * own page LIVE in an <iframe> — unmodified, exactly as published, nothing
 * scraped or re-rendered. For every other source we never work around their
 * X-Frame-Options/CSP — instead we show a short summary and a link to read it
 * on their site.
 *
 * Swipe down on the top bar, or the X, returns to the slideshow.
 */

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
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

// Turn the RSS summary HTML into a plain-text snippet, capped so we only ever
// show a brief excerpt (never the publisher's full body) for non-frameable sources.
function summaryText(item) {
  const raw = item.excerpt || item.html || '';
  const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length > 600 ? `${text.slice(0, 600).trim()}…` : text;
}

function HeroImage({ src, gradient, emoji }) {
  const [stage, setStage] = useState(0);
  useEffect(() => { setStage(0); }, [src]);
  const shown = stage === 0 ? displayImage(src, 1400) : stage === 1 ? src : null;
  if (src && shown) {
    return (
      <img className="frame-hero-img" src={shown} alt="" referrerPolicy="no-referrer" onError={() => setStage((s) => s + 1)} />
    );
  }
  return (
    <div className="frame-hero-fallback" style={{ background: gradient }}>
      <span>{emoji}</span>
    </div>
  );
}

export default function NewsReaderFrame({ item, onBack }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  // Many publishers block third-party framing (X-Frame-Options / CSP). We always
  // TRY the live iframe, but if it hasn't fired `load` within a few seconds it's
  // almost certainly blocked, so we surface a fallback card with the source link.
  const [blocked, setBlocked] = useState(false);
  const swipe = useSwipeDown(onBack);

  // Esc returns to the slideshow rather than closing the whole reader.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onBack?.(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onBack]);

  useEffect(() => {
    setIframeLoaded(false);
    setBlocked(false);
    const t = setTimeout(() => setBlocked((b) => (iframeLoaded ? b : true)), 4500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const summary = summaryText(item);

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
          <button type="button" className="reader-frame-close" onClick={onBack} aria-label="Close reader">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="reader-frame-live-body">
        {!iframeLoaded && !blocked && (
          <div className="reader-loading-pill reader-frame-live-loading">
            <span className="reader-spinner" /> Loading {item.source}…
          </div>
        )}

        {/* The live source page, unmodified — nothing scraped or re-rendered. */}
        <iframe
          className="reader-frame-iframe"
          src={item.url}
          title={item.title}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          onLoad={() => { setIframeLoaded(true); setBlocked(false); }}
        />

        {/* Shown only if the publisher blocks embedding (iframe never loaded). */}
        {blocked && !iframeLoaded && (
          <div className="reader-frame-blocked">
            <article className="reader-frame-blocked-card">
              <HeroImage src={item.image} gradient={item.gradient} emoji={item.emoji} />
              <span className={`news-category-tag ${item.categoryClass}`} style={{ margin: '16px 0 10px' }}>{item.category}</span>
              <h1 className="reader-frame-title">{item.title}</h1>
              <div className="reader-frame-meta">
                <span>{item.source}</span>
                {item.date && <><span className="news-meta-dot" /><span>{item.date}</span></>}
              </div>
              {summary && <p className="reader-frame-blocked-summary">{summary}</p>}
              <p className="reader-frame-blocked-note">
                {item.source} doesn’t allow embedding. Open the original article:
              </p>
              <a className="write-cta-btn" href={item.url} target="_blank" rel="noopener noreferrer">
                Read at {item.source} <ExtIcon />
              </a>
              <div className="reader-frame-blocked-url">{item.url}</div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}
