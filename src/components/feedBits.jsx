import { useState, useEffect } from 'react';
import { displayImage, sourceFavicon } from '../lib/newsFeed';
import { getLike, toggleLike } from '../lib/newsLikes';
import { useAuth } from '../context/AuthContext';
import SocialShareSheet from './SocialShareSheet';

/*
 * feedBits — the small, shared card affordances (thumbnail resolver, like
 * buttons, share button, icons) used across the unified IntelligenceFeed cards.
 * Extracted so the news and analysis cards stay visually consistent.
 */

export const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const ThumbUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);
const ThumbDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  </svg>
);

// Renders the article's real image when available, else the publisher's brand
// logo on the gradient, and only as a last resort a bare emoji.
export function Thumb({ item, className, emojiSize, eager }) {
  const [stage, setStage] = useState(item.image ? 0 : 2);
  useEffect(() => { setStage(item.image ? 0 : 2); }, [item.image]);

  const coverSrc = stage === 0 ? displayImage(item.image) : stage === 1 ? item.image : null;
  if (coverSrc) {
    return (
      <div className={className} aria-hidden="true" style={{ padding: 0, overflow: 'hidden' }}>
        <img
          className="news-cover-img"
          src={coverSrc}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          onError={() => setStage((s) => s + 1)}
        />
      </div>
    );
  }

  const favicon = stage === 2 ? sourceFavicon(item) : null;
  if (favicon) {
    return (
      <div className={`${className} news-thumb-logo`} style={{ background: item.gradient }} aria-hidden="true">
        <img className="news-source-logo" src={favicon} alt="" loading="lazy" onError={() => setStage(3)} />
      </div>
    );
  }

  return (
    <div className={className} style={{ background: item.gradient }} aria-hidden="true">
      <span style={{ position: 'relative', zIndex: 1, fontSize: emojiSize }}>{item.emoji}</span>
    </div>
  );
}

// Like / dislike thumbs, shown only for authenticated users.
export function LikeBtns({ item }) {
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
    <span className="card-like-btns">
      <button type="button" className={`card-like-btn${liked === 'like' ? ' active like' : ''}`} onClick={(e) => onTap(e, 'like')} aria-label="Like" aria-pressed={liked === 'like'}>
        <ThumbUpIcon />
      </button>
      <button type="button" className={`card-like-btn${liked === 'dislike' ? ' active dislike' : ''}`} onClick={(e) => onTap(e, 'dislike')} aria-label="Dislike" aria-pressed={liked === 'dislike'}>
        <ThumbDownIcon />
      </button>
    </span>
  );
}

// Share button that opens the SocialShareSheet platform picker.
export function ShareBtn({ item, className }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className || 'news-share'}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        aria-label={`Share: ${item.title}`}
      >
        <ShareIcon /> Share
      </button>
      {open && <SocialShareSheet item={item} onClose={() => setOpen(false)} />}
    </>
  );
}
