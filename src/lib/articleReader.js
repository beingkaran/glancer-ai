/*
 * articleReader — fetches a news article via a CORS proxy and extracts a clean,
 * readable version (hero image + content blocks) so it can be rendered natively
 * inside Glancer AI, rather than linking out or embedding a (often blocked)
 * iframe. Falls back gracefully to the RSS summary when extraction fails.
 */

import { proxiedText } from './proxy';

function absolutize(src, base) {
  try {
    return new URL(src, base).href;
  } catch {
    return src;
  }
}

const JUNK = /(^|\s)(ad|ads|advert|promo|newsletter|related|share|social|cookie|subscribe|paywall|comment|footer|nav|menu|caption|byline|author|tags?)(\s|$|-|_)/i;

function isJunk(el) {
  const id = `${el.id} ${el.className}`.toString();
  return JUNK.test(id);
}

/**
 * Returns { blocks, heroImage } or throws.
 * blocks: [{ type: 'p'|'h2'|'h3'|'img'|'quote'|'li', text?, src? }]
 */
// Priority order: specific article-body containers first, generic last.
const CONTAINER_SELECTORS = [
  '[itemprop="articleBody"]',
  '.article-content', '.entry-content', '.post-content', '.wp-block-post-content',
  '.article-body', '.post-body', '.c-entry-content', '.article__content',
  'article', 'main', '[role="main"]',
];

export async function fetchArticle(url) {
  const htmlText = await proxiedText(url, 11000);
  const doc = new DOMParser().parseFromString(htmlText, 'text/html');

  const heroImage =
    doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
    null;

  // Prefer the first specific container with real prose; fall back to densest.
  let container = null;
  for (const sel of CONTAINER_SELECTORS) {
    const el = doc.querySelector(sel);
    if (el && el.querySelectorAll('p').length >= 3) { container = el; break; }
  }
  if (!container) {
    container = [...doc.querySelectorAll(CONTAINER_SELECTORS.join(','))]
      .map((el) => ({ el, score: el.querySelectorAll('p').length }))
      .sort((a, b) => b.score - a.score)[0]?.el || doc.body;
  }

  const blocks = [];
  const walk = container.querySelectorAll('p, h2, h3, blockquote, figure img, img');
  walk.forEach((el) => {
    if (isJunk(el) || (el.closest && el.closest('figcaption'))) return;
    const tag = el.tagName.toLowerCase();
    if (tag === 'img') {
      const src = el.getAttribute('src') || el.getAttribute('data-src');
      if (src && !/\.svg($|\?)/i.test(src)) {
        const abs = absolutize(src, url);
        if (!blocks.some((b) => b.type === 'img' && b.src === abs)) blocks.push({ type: 'img', src: abs });
      }
      return;
    }
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text || text.length < 25) return;
    if (tag === 'h2' || tag === 'h3') blocks.push({ type: tag, text });
    else if (tag === 'blockquote') blocks.push({ type: 'quote', text });
    else blocks.push({ type: 'p', text });
  });

  // De-dupe consecutive identical paragraphs and cap length.
  const seen = new Set();
  const cleaned = blocks.filter((b) => {
    if (b.type !== 'p') return true;
    if (seen.has(b.text)) return false;
    seen.add(b.text);
    return true;
  });

  if (cleaned.filter((b) => b.type === 'p').length < 2) throw new Error('thin content');
  return { blocks: cleaned.slice(0, 60), heroImage };
}
