import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSaved, removeSaved, clearSaved } from '../lib/readLater';

/*
 * ReadLaterPanel — a slide-over drawer listing everything the user saved for
 * later (news + blogs together). News opens at the source; blogs open the
 * in-app article route. Re-reads on the read-later event so saves/removes made
 * elsewhere reflect instantly.
 */

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function ReadLaterPanel({ onClose }) {
  const [items, setItems] = useState(() => getSaved());

  useEffect(() => {
    const sync = () => setItems(getSaved());
    window.addEventListener('glancer:read-later-changed', sync);
    return () => window.removeEventListener('glancer:read-later-changed', sync);
  }, []);

  const Cover = ({ it }) => (
    it.image
      ? <img src={it.image} alt="" className="read-later-thumb" loading="lazy" referrerPolicy="no-referrer" />
      : <div className="read-later-thumb read-later-thumb-fallback">{it.type === 'blog' ? '📝' : '📰'}</div>
  );

  const Row = ({ it }) => {
    const meta = `${it.type === 'blog' ? 'Blog' : it.source || 'News'}${it.date ? ` · ${it.date}` : ''}`;
    const body = (
      <>
        <Cover it={it} />
        <div className="read-later-text">
          <span className="read-later-title">{it.title}</span>
          {it.excerpt && <span className="read-later-excerpt">{it.excerpt}</span>}
          <span className="read-later-meta">{meta}</span>
        </div>
      </>
    );
    return (
      <div className="read-later-item">
        {it.type === 'blog'
          ? <Link to={it.url} state={{ from: 'home-blogs' }} className="read-later-link" onClick={onClose}>{body}</Link>
          : <a href={it.url} target="_blank" rel="noopener noreferrer" className="read-later-link">{body}</a>}
        <button type="button" className="read-later-remove" onClick={() => removeSaved(it.key)} aria-label="Remove" title="Remove">
          <TrashIcon />
        </button>
      </div>
    );
  };

  return (
    <div className="read-later-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Read later">
      <div className="read-later-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="read-later-header">
          <span className="read-later-heading">🔖 Read Later <span className="read-later-count">{items.length}</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {items.length > 0 && (
              <button type="button" className="read-later-clear" onClick={clearSaved}>Clear all</button>
            )}
            <button type="button" className="share-sheet-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="read-later-empty">
            <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🔖</div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>Nothing saved yet</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Tap <strong>Save</strong> on any news story or blog to keep it here for later.
            </p>
          </div>
        ) : (
          <div className="read-later-list">
            {items.map((it) => <Row key={it.key} it={it} />)}
          </div>
        )}
      </div>
    </div>
  );
}
