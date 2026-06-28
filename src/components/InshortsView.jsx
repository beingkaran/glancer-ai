import { useState, useEffect, useRef } from 'react';
import { displayImage } from '../lib/newsFeed';

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// Same image-fallback ladder as NewsTab's Thumb: proxied → raw → emoji.
function CardImage({ item }) {
  const [stage, setStage] = useState(0);
  useEffect(() => { setStage(0); }, [item.image]);
  const src = stage === 0 ? displayImage(item.image) : stage === 1 ? item.image : null;
  if (item.image && src) {
    return (
      <div className="inshorts-card-img" aria-hidden="true">
        <img className="news-cover-img" src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setStage((s) => s + 1)} />
      </div>
    );
  }
  return (
    <div className="inshorts-card-img" style={{ background: item.gradient }} aria-hidden="true">
      <span style={{ fontSize: '3.4rem' }}>{item.emoji}</span>
    </div>
  );
}

/**
 * Inshorts-style mobile feed: one full-screen card per article, vertically
 * snap-scrolled. Image on top, headline + summary below, source + "full story"
 * link at the foot. Rendered only on small screens — desktop keeps the grid.
 */
export default function InshortsView({ items }) {
  const feedRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Track which card is centered to drive the "n / total" progress pill.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const onScroll = () => {
      const card = feed.clientHeight || 1;
      setIndex(Math.round(feed.scrollTop / card));
    };
    feed.addEventListener('scroll', onScroll, { passive: true });
    return () => feed.removeEventListener('scroll', onScroll);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div className="inshorts-wrap">
      <div className="inshorts-feed" ref={feedRef}>
        {items.map((item, i) => (
          <article className="inshorts-card" key={item.rid ?? i}>
            <CardImage item={item} />
            <div className="inshorts-card-body">
              <span className={`news-category-tag ${item.categoryClass}`}>{item.category}</span>
              <h3 className="inshorts-card-title">{item.title}</h3>
              <p className="inshorts-card-text">{item.excerpt}</p>
              <a
                className="inshorts-card-foot news-link"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read full story: ${item.title}`}
              >
                <span className="inshorts-source">
                  {item.source}{item.date ? ` · ${item.date}` : ''}{item.readMin ? ` · ${item.readMin} min read` : ''}
                </span>
                <span className="read-more-link">full story <ArrowIcon /></span>
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="inshorts-progress" aria-hidden="true">
        {index + 1} / {items.length}
      </div>
      {index === 0 && items.length > 1 && (
        <div className="inshorts-hint" aria-hidden="true">swipe up ↑</div>
      )}
    </div>
  );
}
