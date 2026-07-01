import { useState } from 'react';
import { blogPostUrl, shareArticle } from '../lib/socialShare';

/*
 * ShareBar — one reliable share button.
 *
 * The old multi-platform buttons relied on each network's share-intent URL to
 * pre-fill the post text (twitter.com/intent, linkedin shareActive, facebook
 * quote, …). Most networks have since stopped honouring those params, so the
 * compose window opened empty — "the content disappears". The fix is the native
 * Web Share API: the OS share sheet hands the title + link + tagline straight to
 * whichever app the user picks, so nothing is dropped. On desktops without a
 * share sheet it falls back to copying a ready-made post to the clipboard.
 */

const ShareIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export default function ShareBar({ post }) {
  const [state, setState] = useState('idle'); // idle | shared | copied
  const url = post ? blogPostUrl(post) : (typeof window !== 'undefined' ? window.location.href : '');

  async function onShare() {
    const res = await shareArticle({ title: post?.title || 'Glancer AI', url });
    if (res === 'cancelled') return;
    setState(res === 'copied' ? 'copied' : 'shared');
    setTimeout(() => setState('idle'), 2000);
  }

  const label = state === 'copied' ? 'Copied to clipboard!' : state === 'shared' ? 'Shared — thanks!' : 'Share this article';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={onShare}
        aria-label="Share this article"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 20px',
          borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
          color: '#fff', background: 'var(--accent)', lineHeight: 1,
          boxShadow: 'none',
        }}
      >
        <ShareIcon /> {label}
      </button>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Your AI — News, Blogs &amp; Trends, all in one platform ·{' '}
        <a href="https://glancerai.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>
          glancerai.com
        </a>
      </span>
    </div>
  );
}
