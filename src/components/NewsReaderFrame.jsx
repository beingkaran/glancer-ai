import { useState, useEffect } from 'react';
import { displayImage } from '../lib/newsFeed';

/*
 * NewsReaderFrame — an in-carousel preview. Opens on top of the slideshow when a
 * story's "Read full story" is tapped. Glancer AI is an aggregator, so this shows
 * the publisher-provided headline, a short RSS summary and a link-preview image,
 * then links out to the original article on the source's own site. It does NOT
 * reproduce the publisher's full article text.
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
// show a brief excerpt (never the publisher's full body).
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
  // Esc returns to the slideshow rather than closing the whole reader.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onBack?.(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onBack]);

  const summary = summaryText(item);

  return (
    <div className="reader-frame" role="dialog" aria-modal="true" aria-label={`Reader: ${item.title}`}>
      {/* Sticky frame bar — back + small cross both return to the slideshow */}
      <div className="reader-frame-bar">
        <button type="button" className="reader-frame-back" onClick={onBack} aria-label="Back to slideshow">
          <BackIcon /> Slideshow
        </button>
        <span className="reader-frame-source">{item.source}</span>
        <div className="reader-frame-bar-right">
          <a className="reader-frame-ext" href={item.url} target="_blank" rel="noopener noreferrer" aria-label="Open original article">
            Original <ExtIcon />
          </a>
          <button type="button" className="reader-frame-close" onClick={onBack} aria-label="Close reader">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="reader-frame-scroll">
        <article className="reader-frame-inner">
          <HeroImage src={item.image} gradient={item.gradient} emoji={item.emoji} />

          <span className={`news-category-tag ${item.categoryClass}`} style={{ margin: '18px 0 12px' }}>{item.category}</span>
          <h1 className="reader-frame-title">{item.title}</h1>
          <div className="reader-frame-meta">
            <span>{item.source}</span>
            {item.date && <><span className="news-meta-dot" /><span>{item.date}</span></>}
            {item.readMin && <><span className="news-meta-dot" /><span>{item.readMin} min read</span></>}
          </div>

          <div className="blog-read-content reader-content">
            {summary && <p>{summary}</p>}
            <div className="reader-fallback-note">
              <p>This is a short summary. Read the full article on {item.source}:</p>
              <a className="write-cta-btn" href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                Read the full story at {item.source} <ExtIcon />
              </a>
            </div>
          </div>

          <div className="reader-frame-footer">
            <button type="button" className="reader-frame-back" onClick={onBack}>
              <BackIcon /> Back to slideshow
            </button>
            <a className="reader-frame-ext" href={item.url} target="_blank" rel="noopener noreferrer">
              View source: {item.source} <ExtIcon />
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
