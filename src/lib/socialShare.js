/*
 * socialShare — generate engaging hooks + build share-intent URLs for every
 * major platform. Uses /api/llm when available; falls back to offline templates.
 * No social API keys required — opens each network's native compose window.
 */

import { askLLM } from './llm';

export const ORIGIN = 'https://glancerai.com';

// A subtle, consistent attribution appended to everything shared from the app.
// Keeps the brand + domain in front of every new audience without shouting.
export const SHARE_TAGLINE = 'via Glancer AI · glancerai.com';

/*
 * shareArticle — open the device's native share sheet for a news article (or any
 * { title, url, source } shape). On phones this is the OS share menu
 * (WhatsApp / Messages / X / etc.); inside the iOS & Android app shells the same
 * navigator.share call bridges straight to the native sheet. Everywhere the
 * shared text carries a subtle "via Glancer AI · glancerai.com" line so the
 * brand travels with the link. Falls back to clipboard when sharing is
 * unavailable. Returns 'shared' | 'copied' | 'cancelled'.
 */
export async function shareArticle(item = {}) {
  const title = item.title || 'Glancer AI';
  const url = item.url || ORIGIN;
  const src = item.source ? ` (${item.source})` : '';
  const text = `${title}${src}\n\n${SHARE_TAGLINE}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (err) {
      // User dismissed the sheet — not an error worth surfacing.
      if (err && err.name === 'AbortError') return 'cancelled';
      /* fall through to clipboard */
    }
  }
  try {
    await navigator.clipboard.writeText(`${title}\n${url}\n\n${SHARE_TAGLINE}`);
    return 'copied';
  } catch {
    if (typeof window !== 'undefined') window.prompt('Copy this link:', url);
    return 'copied';
  }
}

export function blogPostUrl(post) {
  const id = post?.id ?? post?.slug;
  if (!id) return ORIGIN;
  return `${ORIGIN}/blog/${encodeURIComponent(String(id))}`;
}

/** Offline hook templates when AI is unavailable. */
export function offlineHooks(post) {
  const t = post?.title || 'New on Glancer AI';
  const s = post?.subtitle || '';
  const cat = post?.category || 'AI';
  return [
    s ? `${s} — and most teams are getting this wrong.` : `Why ${cat} teams are rethinking their stack in 2026.`,
    `New deep-dive: "${t}" — worth 5 minutes if you care about ${cat}.`,
    `Hot take after reading "${t}": the observability playbook just changed.`,
    `Curious about ${cat}? This article breaks it down without the jargon: "${t}"`,
  ];
}

/**
 * Generate 4 interactive hook variants via LLM (or offline fallback).
 * @returns {Promise<string[]>}
 */
export async function generateShareHooks(post) {
  const system = [
    'You write scroll-stopping social media hooks for AI/SRE/observability blogs.',
    'Return EXACTLY 4 hooks, one per line, no numbering, no bullets, no hashtags.',
    'Each hook must be under 180 characters.',
    'Mix these styles: (1) provocative question, (2) surprising insight, (3) "most teams miss this", (4) curiosity gap.',
    'Sound human, not corporate. Do not include URLs.',
  ].join(' ');

  const prompt = [
    `Title: ${post?.title || ''}`,
    `Subtitle: ${post?.subtitle || ''}`,
    `Category: ${post?.category || ''}`,
    `Tags: ${(post?.tags || []).join(', ')}`,
    `Read time: ${post?.readTime || '?'} min`,
  ].join('\n');

  try {
    const { text } = await askLLM(prompt, { system, temperature: 0.85 });
    const hooks = text
      .split('\n')
      .map((l) => l.replace(/^[\d.)\-*•]+\s*/, '').trim())
      .filter((l) => l.length > 15 && l.length < 220);
    if (hooks.length >= 2) return hooks.slice(0, 4);
  } catch {
    /* fall through */
  }
  return offlineHooks(post);
}

/** Full post text: hook + link + light hashtags. */
export function formatSharePost(hook, url, { tags = [] } = {}) {
  const tagStr = ['#AIOps', '#Observability', '#AI', ...tags.slice(0, 2).map((t) => `#${t.replace(/\s+/g, '')}`)]
    .slice(0, 5)
    .join(' ');
  return `${hook.trim()}\n\n🔗 ${url}\n\n${tagStr}\n\n${SHARE_TAGLINE}`;
}

const enc = encodeURIComponent;

/**
 * Platform share-intent definitions. buildUrl(text, url, title) → compose URL.
 */
export const PLATFORMS = [
  {
    id: 'x',
    name: 'X (Twitter)',
    color: '#000000',
    maxChars: 280,
    icon: '𝕏',
    buildUrl: (text, url) => `https://twitter.com/intent/tweet?text=${enc(text)}`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    maxChars: 3000,
    icon: 'in',
    buildUrl: (text, url) =>
      `https://www.linkedin.com/feed/?shareActive=true&text=${enc(text)}`,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    maxChars: 63206,
    icon: 'f',
    buildUrl: (_text, url) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(_text.split('\n')[0])}`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    maxChars: 65536,
    icon: 'WA',
    buildUrl: (text) => `https://wa.me/?text=${enc(text)}`,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    color: '#FF4500',
    maxChars: 300,
    icon: 'r/',
    buildUrl: (text, url, title) =>
      `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title || text.split('\n')[0])}`,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    color: '#26A5E4',
    maxChars: 4096,
    icon: 'TG',
    buildUrl: (text, url) => `https://t.me/share/url?url=${enc(url)}&text=${enc(text.split('\n')[0])}`,
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    color: '#0085FF',
    maxChars: 300,
    icon: '🦋',
    buildUrl: (text) => `https://bsky.app/intent/compose?text=${enc(text)}`,
  },
  {
    id: 'threads',
    name: 'Threads',
    color: '#101010',
    maxChars: 500,
    icon: '@',
    buildUrl: (text) => `https://www.threads.net/intent/post?text=${enc(text)}`,
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    color: '#FF6600',
    maxChars: 80,
    icon: 'Y',
    buildUrl: (_text, url, title) =>
      `https://news.ycombinator.com/submitlink?u=${enc(url)}&t=${enc(title || _text.split('\n')[0])}`,
  },
  {
    id: 'email',
    name: 'Email',
    color: '#6366F1',
    maxChars: 10000,
    icon: '✉',
    buildUrl: (text, url, title) =>
      `mailto:?subject=${enc(`📖 ${title || 'New on Glancer AI'}`)}&body=${enc(text)}`,
  },
];

/** Open a platform compose window (must be called from a user click). */
export function openPlatformShare(platform, postText, url, title) {
  const href = platform.buildUrl(postText, url, title);
  window.open(href, '_blank', 'noopener,noreferrer,width=600,height=700');
}

/**
 * Open all platform compose windows with staggered delay.
 * Browsers may block pop-ups after the first — user should allow pop-ups.
 */
export function openAllPlatformShares(postText, url, title, { delayMs = 600, onProgress } = {}) {
  PLATFORMS.forEach((p, i) => {
    setTimeout(() => {
      openPlatformShare(p, postText, url, title);
      onProgress?.(p, i + 1, PLATFORMS.length);
    }, i * delayMs);
  });
}