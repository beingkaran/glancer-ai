import { useState } from 'react';
import { SHARE_TAGLINE, shareArticle, shareUrlFor } from '../lib/socialShare';
import { shareInfographic } from '../lib/infographic';

/*
 * SocialShareSheet — one reliable share button (plus an infographic + copy
 * helper). The old per-network buttons opened empty compose windows because the
 * platforms dropped the pre-filled text params; this uses the native share sheet
 * so the headline, link and tagline always travel together.
 */

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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
  const [shared, setShared] = useState(false);
  const [cardState, setCardState] = useState('idle');

  // Always the glancerai.com preview link — never the external publisher URL —
  // so every share surface drives traffic back to our own site.
  const articleUrl = shareUrlFor(item);

  const onShare = async () => {
    const r = await shareArticle({ ...item, url: articleUrl });
    if (r === 'shared') { onClose(); return; }
    if (r === 'copied') { setShared(true); setTimeout(() => setShared(false), 1800); }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${item.title}\n\n${articleUrl}\n\n${SHARE_TAGLINE}`);
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

        {/* Primary share — native share sheet (content never disappears) */}
        <button
          type="button"
          onClick={onShare}
          aria-label="Share"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
            padding: '13px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontSize: '0.95rem', fontWeight: 700, color: '#fff',
            background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
          }}
        >
          <ShareIcon /> {shared ? 'Copied to clipboard!' : 'Share'}
        </button>

        {/* Secondary actions */}
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

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', margin: '14px 0 2px', lineHeight: 1.5 }}>
          Your AI — News, Blogs &amp; Trends, all in one platform ·{' '}
          {/* button, not <a>: this sheet can render inside a news-card link and nested anchors are invalid */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); window.open('https://glancerai.com', '_blank', 'noopener,noreferrer'); }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--cyan)', fontWeight: 600, fontSize: 'inherit', fontFamily: 'inherit' }}
          >
            glancerai.com
          </button>
        </p>
      </div>
    </div>
  );
}
