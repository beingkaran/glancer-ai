import { useState, useEffect, useRef } from 'react';
import { useSwipeDown } from '../lib/useSwipeDown';

/*
 * NewsReaderFrame — an in-carousel reader. Opens on top of the slideshow when a
 * story's "Read Story" is tapped.
 *
 * It loads the source's own page LIVE in an <iframe> — unmodified, exactly as
 * published, nothing scraped or re-rendered — and lets the reader interact with
 * it in place. If the page hasn't loaded within 10s (blocked by
 * X-Frame-Options/CSP, or too slow), the reader redirects to the original URL
 * instead of sitting on a blank frame. If it loads in time, nothing happens.
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


export default function NewsReaderFrame({ item, onBack, onNext, hasNext }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  // Ref mirror of "loaded" so the 10s timer reads the latest value without a
  // stale closure.
  const loadedRef = useRef(false);
  const swipe = useSwipeDown(onBack);

  // Esc returns to the slideshow rather than closing the whole reader.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onBack?.(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onBack]);

  // Give the source 10s to load inside the frame. If it loads, do nothing — the
  // user reads and interacts with the live page in the frame. If it hasn't
  // loaded by then (blocked by X-Frame-Options/CSP, or just too slow), redirect
  // the reader to the original article instead of leaving a blank frame.
  // Re-arms on every `item` change, so Next gets its own fresh 10s window.
  useEffect(() => {
    setIframeLoaded(false);
    loadedRef.current = false;
    const t = setTimeout(() => {
      if (!loadedRef.current) window.location.href = item.url;
    }, 10000);
    return () => clearTimeout(t);
  }, [item]);

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
        {!iframeLoaded && (
          <div className="reader-loading-pill reader-frame-live-loading">
            <span className="reader-spinner" /> Loading {item.source}…
          </div>
        )}

        {/* The live source page, unmodified — nothing scraped or re-rendered.
            The sandbox permits scripts/forms/popups so the page is fully
            interactive, but withholds top-navigation so the site can't frame-bust
            the reader out from under the user. */}
        <iframe
          className="reader-frame-iframe"
          src={item.url}
          title={item.title}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
          onLoad={() => { loadedRef.current = true; setIframeLoaded(true); }}
        />
      </div>
    </div>
  );
}
