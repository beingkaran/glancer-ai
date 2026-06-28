import { useState, useEffect, useRef } from 'react';
import { displayImage } from '../lib/newsFeed';
import { shareArticle } from '../lib/socialShare';

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const ShareIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// A small share control that opens the native share sheet for one article.
export function ShareButton({ item, className = 'swipe-share' }) {
  const [done, setDone] = useState(false);
  const onShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await shareArticle(item);
    if (res === 'copied') {
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    }
  };
  return (
    <button type="button" className={className} onClick={onShare} aria-label={`Share: ${item.title}`}>
      <ShareIcon /> {done ? 'Copied!' : 'Share'}
    </button>
  );
}

const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

// Same image-fallback ladder as NewsTab's Thumb: proxied → raw → emoji.
function CardImage({ item }) {
  const [stage, setStage] = useState(0);
  useEffect(() => { setStage(0); }, [item.image]);
  const src = stage === 0 ? displayImage(item.image) : stage === 1 ? item.image : null;
  if (item.image && src) {
    return (
      <div className="swipe-card-img" aria-hidden="true">
        <img className="news-cover-img" src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setStage((s) => s + 1)} />
      </div>
    );
  }
  return (
    <div className="swipe-card-img" style={{ background: item.gradient }} aria-hidden="true">
      <span style={{ fontSize: '3.4rem' }}>{item.emoji}</span>
    </div>
  );
}

/**
 * Mobile-only news view: one full-screen card per article, swiped
 * horizontally (left/right). Image on top, headline + summary below,
 * source + "full story" link at the foot. A back button returns the
 * reader to the top of the page. Desktop keeps the featured+grid layout.
 */
export default function NewsSwipe({ items }) {
  const feedRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Track which card is centered to drive the "n / total" progress pill.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const onScroll = () => {
      const card = feed.clientWidth || 1;
      setIndex(Math.round(feed.scrollLeft / card));
    };
    feed.addEventListener('scroll', onScroll, { passive: true });
    return () => feed.removeEventListener('scroll', onScroll);
  }, [items.length]);

  // Return to the top of the page (hero + tab switcher = the "main" view).
  const goBack = () => {
    const el = document.scrollingElement || document.documentElement;
    el.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <div className="swipe-wrap">
      <button type="button" className="swipe-back" onClick={goBack} aria-label="Back to top">
        <BackIcon /> Back
      </button>

      <div className="swipe-progress" aria-hidden="true">{index + 1} / {items.length}</div>

      <div className="swipe-feed" ref={feedRef}>
        {items.map((item, i) => (
          <article className="swipe-card" key={item.rid ?? i}>
            <CardImage item={item} />
            <div className="swipe-card-body">
              <div className="swipe-card-toprow">
                <span className={`news-category-tag ${item.categoryClass}`}>{item.category}</span>
                <ShareButton item={item} />
              </div>
              <h3 className="swipe-card-title">{item.title}</h3>
              <p className="swipe-card-text">{item.excerpt}</p>
              <a
                className="swipe-card-foot news-link"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read full story: ${item.title}`}
              >
                <span className="swipe-source">
                  {item.source}{item.date ? ` · ${item.date}` : ''}{item.readMin ? ` · ${item.readMin} min read` : ''}
                </span>
                <span className="read-more-link">full story <ArrowIcon /></span>
              </a>
            </div>
          </article>
        ))}
      </div>

      {index === 0 && items.length > 1 && (
        <div className="swipe-hint" aria-hidden="true">swipe ←</div>
      )}
    </div>
  );
}
