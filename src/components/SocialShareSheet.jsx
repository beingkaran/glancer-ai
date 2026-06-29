import { useState } from 'react';
import { PLATFORMS, ORIGIN, SHARE_TAGLINE } from '../lib/socialShare';
import { shareInfographic } from '../lib/infographic';

const SHOWN_PLATFORMS = ['x', 'linkedin', 'whatsapp', 'telegram', 'facebook', 'reddit', 'bluesky', 'email'];
const platforms = PLATFORMS.filter((p) => SHOWN_PLATFORMS.includes(p.id));

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const CardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 15l-5-5L5 19"/>
  </svg>
);

export default function SocialShareSheet({ item, onClose }) {
  const [copied, setCopied] = useState(false);
  const [cardState, setCardState] = useState('idle');

  const articleUrl = item.url || ORIGIN;
  const shareText = `${item.title}\n\n${articleUrl}\n\nDiscover more AI news at glancerai.com\n\n${SHARE_TAGLINE}`;

  const onPlatform = (platform) => {
    const href = platform.buildUrl(shareText, articleUrl, item.title);
    window.open(href, '_blank', 'noopener,noreferrer,width=620,height=680');
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${item.title}\n\n${articleUrl}\n\nglancerai.com\n\n${SHARE_TAGLINE}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const onShareCard = async () => {
    setCardState('busy');
    const r = await shareInfographic(item);
    setCardState(r !== 'failed' ? 'done' : 'idle');
    if (r !== 'failed') setTimeout(() => setCardState('idle'), 2200);
    else setCardState('idle');
  };

  return (
    <div className="share-sheet-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Share story">
      <div className="share-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="share-sheet-header">
          <span className="share-sheet-title">Share this story</span>
          <button type="button" className="share-sheet-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>

        {/* News image preview card */}
        <div className="share-sheet-preview">
          {item.image && (
            <img src={item.image} alt="" className="share-sheet-img" referrerPolicy="no-referrer" />
          )}
          <div className="share-sheet-preview-text">
            <span className="share-sheet-headline">{item.title}</span>
            <span className="share-sheet-domain">glancerai.com · {item.source}</span>
          </div>
        </div>

        {/* Platform grid */}
        <div className="share-sheet-platforms">
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              className="share-platform-btn"
              style={{ '--p-color': p.color }}
              onClick={() => onPlatform(p)}
              aria-label={`Share on ${p.name}`}
            >
              <span className="share-platform-icon">{p.icon}</span>
              <span className="share-platform-name">{p.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="share-sheet-actions">
          <button type="button" className="share-action-btn" onClick={onShareCard} disabled={cardState === 'busy'}>
            <CardIcon />
            {cardState === 'busy' ? 'Creating…' : cardState === 'done' ? 'Saved!' : 'Share infographic'}
          </button>
          <button type="button" className={`share-action-btn${copied ? ' copied' : ''}`} onClick={onCopy}>
            <CopyIcon />
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
}
