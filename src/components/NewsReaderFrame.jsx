import { useState, useEffect } from 'react';
import { fetchArticle } from '../lib/articleReader';
import { displayImage } from '../lib/newsFeed';

/*
 * NewsReaderFrame — an in-carousel reader. Opens on top of the slideshow when a
 * story's "Read full story" is tapped, loads the linked article natively (via
 * fetchArticle) and renders it in a polished frame. A back button or the small
 * cross returns the user to the slideshow without leaving Glancer AI.
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

// Strip scripts/styles/iframes from RSS HTML so the summary renders safely.
function cleanRssHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
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

  // Esc returns to the slideshow rather than closing the whole reader.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onBack?.(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onBack]);

  const heroSrc = article?.heroImage || item.image;
  const rssHtml = cleanRssHtml(item.html || `<p>${item.excerpt || ''}</p>`);

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
          <HeroImage src={heroSrc} gradient={item.gradient} emoji={item.emoji} />

          <span className={`news-category-tag ${item.categoryClass}`} style={{ margin: '18px 0 12px' }}>{item.category}</span>
          <h1 className="reader-frame-title">{item.title}</h1>
          <div className="reader-frame-meta">
            <span>{item.source}</span>
            {item.date && <><span className="news-meta-dot" /><span>{item.date}</span></>}
            {item.readMin && <><span className="news-meta-dot" /><span>{item.readMin} min read</span></>}
          </div>

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
                <div className="reader-rss" dangerouslySetInnerHTML={{ __html: rssHtml }} />
                <div className="reader-fallback-note">
                  <p>{state === 'error' ? "The full article couldn't be loaded inside Glancer AI for this source." : 'Showing the summary while the full story loads…'}</p>
                  <a className="write-cta-btn" href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                    Read the full story at {item.source} <ExtIcon />
                  </a>
                </div>
              </>
            )}
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
