import { useState } from 'react';
import { blogPostUrl, formatSharePost, offlineHooks, PLATFORMS } from '../lib/socialShare';

/*
 * ShareBar — share the current post to social platforms via each network's
 * public share-intent URL (no SDKs, no tracking). Uses an engaging hook + blog link.
 */

function shareUrl() {
  return typeof window !== 'undefined' ? window.location.href : '';
}

const ICONS = {
  twitter: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  ),
  linkedin: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  ),
  facebook: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  ),
  whatsapp: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24Zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.83 9.83 0 0 0 1.51 5.26l-.999 3.648 3.728-.978Zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414Z" />
    </svg>
  ),
};

function ShareBtn({ label, href, onClick, color, children }) {
  const common = {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px',
    borderRadius: 10, border: '1px solid var(--glass-border)', background: 'var(--surface)',
    color: color || 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
    textDecoration: 'none', lineHeight: 1,
  };
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={common}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} style={common}>
      {children}
    </button>
  );
}

export default function ShareBar({ post }) {
  const [copied, setCopied] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const url = post ? blogPostUrl(post) : shareUrl();
  const hook = post ? offlineHooks(post)[0] : `${post?.title || 'Glancer AI'} — worth a read.`;
  const postText = formatSharePost(hook, url, { tags: post?.tags });

  const mainPlatforms = PLATFORMS.filter((p) =>
    ['x', 'linkedin', 'facebook', 'whatsapp', 'reddit', 'bluesky'].includes(p.id),
  );

  const iconFor = {
    x: ICONS.twitter,
    linkedin: ICONS.linkedin,
    facebook: ICONS.facebook,
    whatsapp: ICONS.whatsapp,
  };

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  async function copyFullPost() {
    try {
      await navigator.clipboard.writeText(postText);
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 1800);
    } catch {
      window.prompt('Copy this post:', postText);
    }
  }

  return (
    <div style={{ margin: '8px 0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 }}>
          Share
        </span>
        {mainPlatforms.map((p) => (
          <ShareBtn
            key={p.id}
            label={`Share on ${p.name}`}
            href={p.buildUrl(postText, url, post?.title)}
            color={p.id === 'x' ? 'var(--text-primary)' : p.color}
          >
            {iconFor[p.id] || <span>{p.icon}</span>} {p.name.split(' ')[0]}
          </ShareBtn>
        ))}
        <ShareBtn label="Copy full post" onClick={copyFullPost} color={copiedPost ? '#22C55E' : 'var(--text-secondary)'}>
          {copiedPost ? 'Copied!' : 'Copy post'}
        </ShareBtn>
        <ShareBtn label="Copy link" onClick={copyLink} color={copied ? '#22C55E' : 'var(--text-secondary)'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {copied ? 'Copied!' : 'Link'}
        </ShareBtn>
      </div>
    </div>
  );
}
