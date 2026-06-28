import { useState, useEffect, useRef, useCallback } from 'react';
import { displayImage } from '../lib/newsFeed';
import { shareArticle } from '../lib/socialShare';
import { shareInfographic } from '../lib/infographic';

/*
 * NewsCarousel — a full-screen, swipeable reader that opens when a reader taps
 * any news card (desktop AND mobile). One story per slide; swipe / arrow-key /
 * button to move left↔right. Each slide can be shared as a link or as a
 * generated infographic carrying the "Visit glancerai.com…" call-to-action.
 */

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const ChevronRight = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const ExtIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const CardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="M21 15l-5-5L5 19" />
  </svg>
);

// Cover image with the same proxied → raw → emoji fallback ladder used elsewhere.
function SlideImage({ item }) {
  const [stage, setStage] = useState(0);
  useEffect(() => { setStage(0); }, [item.image]);
  const src = stage === 0 ? displayImage(item.image, 1400) : stage === 1 ? item.image : null;
  if (item.image && src) {
    return (
      <div className="carousel-img" aria-hidden="true">
        <img src={src} alt="" referrerPolicy="no-referrer" onError={() => setStage((s) => s + 1)} />
      </div>
    );
  }
  return (
    <div className="carousel-img carousel-img-fallback" style={{ background: item.gradient }} aria-hidden="true">
      <span>{item.emoji}</span>
    </div>
  );
}

function Slide({ item }) {
  // 'idle' | 'busy' | 'done' for each share action.
  const [linkState, setLinkState] = useState('idle');
  const [cardState, setCardState] = useState('idle');

  const onShareLink = async () => {
    setLinkState('busy');
    const r = await shareArticle(item);
    setLinkState(r === 'copied' ? 'done' : 'idle');
    if (r === 'copied') setTimeout(() => setLinkState('idle'), 1800);
    else setLinkState('idle');
  };
  const onShareCard = async () => {
    setCardState('busy');
    const r = await shareInfographic(item);
    setCardState(r === 'downloaded' ? 'done' : 'idle');
    if (r === 'downloaded') setTimeout(() => setCardState('idle'), 2200);
    else setCardState('idle');
  };

  return (
    <article className="carousel-slide">
      <div className="carousel-slide-inner">
        <SlideImage item={item} />
        <div className="carousel-body">
          <span className={`news-category-tag ${item.categoryClass}`}>{item.category}</span>
          <h2 className="carousel-title">{item.title}</h2>
          <div className="carousel-meta">
            <span>{item.source}</span>
            {item.date && <><span className="news-meta-dot" /><span>{item.date}</span></>}
            {item.readMin && <><span className="news-meta-dot" /><span>{item.readMin} min read</span></>}
          </div>
          <p className="carousel-text">{item.excerpt}</p>
          <div className="carousel-actions">
            <a className="carousel-btn primary" href={item.url} target="_blank" rel="noopener noreferrer">
              Read full story <ExtIcon />
            </a>
            <button type="button" className="carousel-btn" onClick={onShareCard} disabled={cardState === 'busy'}>
              <CardIcon /> {cardState === 'busy' ? 'Creating…' : cardState === 'done' ? 'Saved!' : 'Share infographic'}
            </button>
            <button type="button" className="carousel-btn" onClick={onShareLink} disabled={linkState === 'busy'}>
              <ShareIcon /> {linkState === 'done' ? 'Copied!' : 'Share link'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NewsCarousel({ items, startIndex = 0, onClose }) {
  const feedRef = useRef(null);
  const [index, setIndex] = useState(startIndex);

  // Jump to the tapped story on open (no smooth scroll for the initial jump).
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    feed.scrollTo({ left: startIndex * feed.clientWidth, behavior: 'auto' });
    setIndex(startIndex);
  }, [startIndex]);

  // Track the centered slide for the "n / total" pill + arrow disabling.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const onScroll = () => setIndex(Math.round(feed.scrollLeft / (feed.clientWidth || 1)));
    feed.addEventListener('scroll', onScroll, { passive: true });
    return () => feed.removeEventListener('scroll', onScroll);
  }, [items.length]);

  const go = useCallback((dir) => {
    const feed = feedRef.current;
    if (!feed) return;
    const next = Math.max(0, Math.min(items.length - 1, index + dir));
    feed.scrollTo({ left: next * feed.clientWidth, behavior: 'smooth' });
  }, [index, items.length]);

  // Keyboard: ← → to move, Esc to close. Lock body scroll while open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [go, onClose]);

  if (!items.length) return null;

  return (
    <div className="carousel-overlay" role="dialog" aria-modal="true" aria-label="News story reader">
      <div className="carousel-topbar">
        <span className="carousel-progress">{index + 1} / {items.length}</span>
        <button type="button" className="carousel-close" onClick={onClose} aria-label="Close reader">
          <CloseIcon />
        </button>
      </div>

      <button type="button" className="carousel-nav prev" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous story">
        <ChevronLeft />
      </button>
      <button type="button" className="carousel-nav next" onClick={() => go(1)} disabled={index === items.length - 1} aria-label="Next story">
        <ChevronRight />
      </button>

      <div className="carousel-feed" ref={feedRef}>
        {items.map((item, i) => <Slide item={item} key={item.rid ?? i} />)}
      </div>

      <div className="carousel-dots" aria-hidden="true">
        {items.slice(0, 12).map((_, i) => (
          <span key={i} className={`carousel-dot${i === Math.min(index, 11) ? ' active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
