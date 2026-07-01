import { useState, useEffect, useRef, useCallback } from 'react';
import { displayImage, sourceFavicon } from '../lib/newsFeed';
import { getLike, toggleLike } from '../lib/newsLikes';
import { useAuth } from '../context/AuthContext';
import SocialShareSheet from './SocialShareSheet';
import SaveButton from './SaveButton';
import NewsReaderFrame from './NewsReaderFrame';
import { entryForSlide } from '../lib/readLater';

/*
 * NewsCarousel — full-screen swipeable reader. Opens when any news card is
 * tapped (desktop AND mobile). Like/dislike for signed-in users; social share
 * sheet with platform picker on every slide.
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
const ThumbUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);
const ThumbDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
);

// Cover image with proxied → raw → favicon → emoji fallback ladder. Tapping it
// opens the in-app reader directly (no separate "read" button needed).
function SlideImage({ item, onOpen }) {
  const [stage, setStage] = useState(item.image ? 0 : 2);
  useEffect(() => { setStage(item.image ? 0 : 2); }, [item.image]);

  const canOpen = !item.internal && !!onOpen;
  const openProps = canOpen ? { onClick: onOpen, role: 'button', tabIndex: 0, 'aria-label': `Read: ${item.title}` } : { 'aria-hidden': true };

  const coverSrc = stage === 0 ? displayImage(item.image, 1400) : stage === 1 ? item.image : null;
  if (coverSrc) {
    return (
      <div className={`carousel-img${canOpen ? ' carousel-img-tap' : ''}`} {...openProps}>
        <img src={coverSrc} alt="" referrerPolicy="no-referrer" onError={() => setStage((s) => s + 1)} />
      </div>
    );
  }

  const favicon = stage === 2 ? sourceFavicon(item) : null;
  if (favicon) {
    return (
      <div className={`carousel-img carousel-img-fallback carousel-img-logo${canOpen ? ' carousel-img-tap' : ''}`} style={{ background: item.gradient }} {...openProps}>
        <img className="news-source-logo" src={favicon} alt="" onError={() => setStage(3)} />
      </div>
    );
  }

  return (
    <div className={`carousel-img carousel-img-fallback${canOpen ? ' carousel-img-tap' : ''}`} style={{ background: item.gradient }} {...openProps}>
      <span>{item.emoji}</span>
    </div>
  );
}

function LikeButtons({ item }) {
  const { isAuthed } = useAuth();
  const rid = item.rid;
  const [liked, setLiked] = useState(() => (rid ? getLike(rid) : null));

  if (!isAuthed || !rid) return null;

  const onTap = (e, val) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(toggleLike(rid, val));
  };

  return (
    <div className="like-btns">
      <button
        type="button"
        className={`like-btn${liked === 'like' ? ' active like' : ''}`}
        onClick={(e) => onTap(e, 'like')}
        aria-label="Like this story"
        aria-pressed={liked === 'like'}
      >
        <ThumbUpIcon />
      </button>
      <button
        type="button"
        className={`like-btn${liked === 'dislike' ? ' active dislike' : ''}`}
        onClick={(e) => onTap(e, 'dislike')}
        aria-label="Dislike this story"
        aria-pressed={liked === 'dislike'}
      >
        <ThumbDownIcon />
      </button>
    </div>
  );
}

// Two short paragraphs of the story summary, so each slide shows a real preview
// (not a single line). Splits the RSS summary on a sentence boundary near the
// middle; falls back to one paragraph when there isn't enough text.
function twoParagraphs(item) {
  const raw = item.excerpt || item.html || item.summary || '';
  const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return [];
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!sentences || sentences.length < 2) return [text];
  const mid = Math.ceil(sentences.length / 2);
  const p1 = sentences.slice(0, mid).join(' ').trim();
  let p2 = sentences.slice(mid).join(' ').trim();
  if (p2.length > 420) p2 = `${p2.slice(0, 420).trim()}…`;
  return [p1, p2].filter(Boolean);
}

function Slide({ item, onRead }) {
  const [shareOpen, setShareOpen] = useState(false);

  // "Read Story" behaviour depends on the source:
  //  • internal blog  → its own in-app route
  //  • frameable news → in-app iframe reader (never leaves glancerai.com)
  //  • blocked news   → opens the original in a NEW tab (publisher forbids
  //    embedding via X-Frame-Options/CSP, so an iframe would just show
  //    "refused to connect"). frameable is precomputed in src/data/newsFeeds.js.
  const openReader = () => {
    if (item.internal) return;
    if (item.frameable) onRead(item);
    else window.open(item.url, '_blank', 'noopener,noreferrer');
  };
  const paras = twoParagraphs(item);

  const ReadBtn = item.internal ? (
    <a className="carousel-btn primary" href={item.url} target="_self" rel="noopener noreferrer">
      Read full article <ExtIcon />
    </a>
  ) : item.frameable ? (
    <button type="button" className="carousel-btn primary" onClick={() => onRead(item)}>
      Read Story <ExtIcon />
    </button>
  ) : (
    <a
      className="carousel-btn primary"
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      Read Story <ExtIcon />
    </a>
  );

  return (
    <article className="carousel-slide">
      <div className="carousel-slide-inner">
        <SlideImage item={item} onOpen={openReader} />
        <div className="carousel-body">
          <span className={`news-category-tag ${item.categoryClass}`}>{item.category}</span>
          <h2
            className={`carousel-title${item.internal ? '' : ' carousel-title-tap'}`}
            {...(item.internal ? {} : { role: 'button', tabIndex: 0, onClick: openReader })}
          >
            {item.title}
          </h2>
          <div className="carousel-meta">
            <span>{item.source}</span>
            {item.date && <><span className="news-meta-dot" /><span>{item.date}</span></>}
            {item.readMin && <><span className="news-meta-dot" /><span>{item.readMin} min read</span></>}
          </div>
          <div className="carousel-text">
            {(paras.length ? paras : [item.excerpt]).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="carousel-actions">
            {ReadBtn}
            <button type="button" className="carousel-btn" onClick={() => setShareOpen(true)}>
              <ShareIcon /> Share
            </button>
            <SaveButton entry={entryForSlide(item)} className="carousel-btn" />
            <LikeButtons item={item} />
          </div>
          <p className="carousel-site-link">
            <a href="https://glancerai.com" target="_blank" rel="noopener noreferrer">glancerai.com</a>
          </p>
        </div>
      </div>
      {shareOpen && <SocialShareSheet item={item} onClose={() => setShareOpen(false)} />}
    </article>
  );
}

export default function NewsCarousel({ items, startIndex = 0, onClose }) {
  const feedRef = useRef(null);
  const [index, setIndex] = useState(startIndex);
  const [readerItem, setReaderItem] = useState(null);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    feed.scrollTo({ left: startIndex * feed.clientWidth, behavior: 'auto' });
    setIndex(startIndex);
  }, [startIndex]);

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

  useEffect(() => {
    const onKey = (e) => {
      if (readerItem) return; // reader frame handles its own keys
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [go, onClose, readerItem]);

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
        {items.map((item, i) => <Slide item={item} key={item.rid ?? i} onRead={setReaderItem} />)}
      </div>

      <div className="carousel-dots" aria-hidden="true">
        {items.slice(0, 12).map((_, i) => (
          <span key={i} className={`carousel-dot${i === Math.min(index, 11) ? ' active' : ''}`} />
        ))}
      </div>

      {readerItem && <NewsReaderFrame item={readerItem} onBack={() => setReaderItem(null)} />}
    </div>
  );
}
