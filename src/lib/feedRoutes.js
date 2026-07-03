import { NEWS_CATEGORIES } from '../data/newsData';

/*
 * feedRoutes — URL mapping for the multi-page home feed.
 *   all            → /
 *   news           → /news
 *   <category>     → /news/topic/<slug>   (e.g. "Open Source" → open-source)
 * Shared by HomePage (derives segment from URL) and IntelligenceFeed (renders
 * segment chips as real links).
 */

export const catSlug = (c) => c.toLowerCase().replace(/\s+/g, '-');

export const catFromSlug = (slug) =>
  NEWS_CATEGORIES.find((c) => c !== 'All' && catSlug(c) === slug);

export const segmentPath = (seg) =>
  seg === 'all' ? '/' : seg === 'news' ? '/news' : `/news/topic/${catSlug(seg)}`;
