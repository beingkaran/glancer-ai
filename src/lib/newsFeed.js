import { NEWS_ITEMS } from '../data/newsData';
import { proxiedText } from './proxy';

/*
 * newsFeed — fetches live AI headlines and normalizes them into the card
 * shape the UI expects.
 *
 *  - Primary:  rss2json (clean JSON, CORS-enabled, rate-limited)
 *  - Fallback: allorigins CORS proxy + in-browser XML parse (no rate limit)
 *  - Last:     curated static list in ../data/newsData
 *
 * Results are cached in localStorage for 12 hours (CACHE_TTL) so the feed
 * refreshes at most twice a day. Each item gets a stable route id (`rid`) so
 * the in-site reader (/news/:rid) can look it up from the cache.
 */

// AI-specific feeds that ship a real image per item (media:content / enclosure /
// inline <img>), so cards render a photo instead of the emoji placeholder.
// Verified: The Verge, VentureBeat, Wired, Ars Technica, AI News all return an
// image on ~10/10 items via rss2json. TechCrunch's feed carries no inline image,
// so its cards rely on the og:image enrichment pass (fetchOgImage) below.
const FEEDS = [
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge' },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat' },
  { url: 'https://www.wired.com/feed/tag/ai/latest/rss', source: 'Wired' },
  { url: 'https://arstechnica.com/ai/feed/', source: 'Ars Technica' },
  { url: 'https://www.artificialintelligence-news.com/feed/', source: 'AI News' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch' },
];

const CACHE_KEY = 'glancer_news_cache';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

const GRADIENTS = [
  'linear-gradient(135deg, #1a0533 0%, #4c1d95 50%, #7c3aed 100%)',
  'linear-gradient(135deg, #0a2240 0%, #0e4d8a 50%, #0284c7 100%)',
  'linear-gradient(135deg, #2d0a2e 0%, #831843 50%, #ec4899 100%)',
  'linear-gradient(135deg, #0d2400 0%, #166534 50%, #16a34a 100%)',
  'linear-gradient(135deg, #1c1200 0%, #78350f 50%, #d97706 100%)',
  'linear-gradient(135deg, #000f40 0%, #1e3a8a 50%, #3b82f6 100%)',
];
const EMOJIS = ['🧠', '⚡', '🤖', '🚀', '💡', '🔬', '📡', '🌐', '🛰️', '💬'];
const TAG_CLASSES = ['tag-purple', 'tag-cyan', 'tag-pink', 'tag-blue', 'tag-orange'];

function stripHtml(html = '') {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function firstImageFrom(html = '') {
  const m = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  return m ? m[1] : null;
}

/*
 * displayImage — route a remote article image through the wsrv.nl image proxy
 * so it actually renders in the browser. Publisher CDNs (TechCrunch, The Verge,
 * etc.) often block hot-linked images via a Referer check, and some serve over
 * http (mixed-content) — both make a plain <img src> fail and fall back to the
 * emoji placeholder. wsrv.nl fetches the image server-side and re-serves it
 * CORS-enabled, https, and referrer-free. Returns null for empty input and
 * passes data:/already-proxied URLs through untouched.
 */
export function displayImage(url, width = 1000) {
  if (!url) return null;
  let u = String(url).trim();
  if (!u) return null;
  if (u.startsWith('//')) u = 'https:' + u;
  if (u.startsWith('data:') || u.includes('wsrv.nl') || u.includes('images.weserv.nl')) return u;
  return `https://wsrv.nl/?url=${encodeURIComponent(u)}&w=${width}&output=webp&q=82&we`;
}

function formatDate(d) {
  const date = new Date(d);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function normalize(item, i) {
  const html = item.content || item.description || '';
  const text = stripHtml(html);
  const image = item.image || item.thumbnail || item.enclosure?.link || firstImageFrom(html) || null;
  return {
    id: item.guid || item.link || `live-${i}`,
    title: stripHtml(item.title || 'Untitled'),
    excerpt: text.length > 180 ? text.slice(0, 177) + '…' : text,
    html,
    url: item.link,
    source: item._source,
    category: item._source,
    categoryClass: TAG_CLASSES[i % TAG_CLASSES.length],
    emoji: EMOJIS[i % EMOJIS.length],
    gradient: GRADIENTS[i % GRADIENTS.length],
    date: formatDate(item.pubDate),
    readMin: Math.max(2, Math.round((text.split(' ').length || 200) / 200)),
    image,
    live: true,
  };
}

// ---- fetching -------------------------------------------------------------

async function timedFetch(url, ms = 7000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function fetchViaRss2Json(feed) {
  // NOTE: do NOT pass &count — rss2json's free tier now rejects it with HTTP 422
  // ("you need a valid api key"), which previously broke every feed and forced
  // the whole UI onto the static (emoji-only) fallback. Default count is ~10.
  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
  const res = await timedFetch(endpoint, 5000);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('bad feed');
  return data.items.map((it) => ({ ...it, _source: feed.source }));
}

async function fetchViaProxy(feed) {
  const xml = await proxiedText(feed.url, 8000);
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('xml parse error');
  const nodes = [...doc.querySelectorAll('item'), ...doc.querySelectorAll('entry')].slice(0, 8);
  if (!nodes.length) throw new Error('no items');
  return nodes.map((n) => {
    const linkEl = n.querySelector('link');
    const link = linkEl?.textContent?.trim() || linkEl?.getAttribute('href') || '';
    const content = n.getElementsByTagName('content:encoded')[0]?.textContent
      || n.querySelector('content')?.textContent || '';
    const description = n.querySelector('description')?.textContent || n.querySelector('summary')?.textContent || '';
    // image: media:content / media:thumbnail / enclosure / first <img> in body
    const image =
      n.getElementsByTagName('media:content')[0]?.getAttribute('url') ||
      n.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url') ||
      n.querySelector('enclosure')?.getAttribute('url') ||
      firstImageFrom(content) || firstImageFrom(description) || null;
    return {
      title: n.querySelector('title')?.textContent || '',
      link,
      content: content || description,
      description,
      pubDate: n.querySelector('pubDate')?.textContent || n.querySelector('updated')?.textContent || '',
      guid: n.querySelector('guid')?.textContent || link,
      image,
      _source: feed.source,
    };
  });
}

async function fetchFeed(feed) {
  try {
    return await fetchViaRss2Json(feed);
  } catch {
    return await fetchViaProxy(feed);
  }
}

async function fetchLiveNews(limit = 10) {
  const settled = await Promise.allSettled(FEEDS.map(fetchFeed));
  const items = settled.filter((r) => r.status === 'fulfilled').flatMap((r) => r.value);
  if (!items.length) return null;

  const seen = new Set();
  return items
    .filter((it) => it.title && it.link)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .filter((it) => {
      const key = it.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map(normalize);
}

// ---- cache + public API ---------------------------------------------------

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveCache(items, live) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), live, items }));
  } catch {
    /* ignore quota errors */
  }
}

function withRouteIds(items) {
  return items.map((it, i) => ({ ...it, rid: `n-${i}` }));
}

// Fetch a single article's og:image (used to give every card a real image).
async function fetchOgImage(url) {
  try {
    const html = await proxiedText(url, 7000);
    const m =
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i.exec(html) ||
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i.exec(html) ||
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i.exec(html);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

// Progressively fill in images for items the RSS feed didn't include one for,
// then re-cache and notify the UI. Fire-and-forget so the feed renders fast.
function enrichImagesInBackground(items, live) {
  const missing = items.filter((it) => !it.image && it.url);
  if (!missing.length) return;
  Promise.allSettled(
    missing.map(async (it) => {
      const img = await fetchOgImage(it.url);
      if (img) it.image = img;
    })
  ).then(() => {
    saveCache(items, live);
    try { window.dispatchEvent(new Event('glancer:news-updated')); } catch { /* noop */ }
  });
}

/**
 * Returns { items, live, cached }. Serves the 12-hour cache when fresh,
 * otherwise fetches live and (failing that) falls back to the static list.
 */
export async function getNews(limit = 10) {
  const cache = loadCache();
  if (cache?.items?.length && Date.now() - cache.ts < CACHE_TTL) {
    return { items: cache.items, live: cache.live, cached: true };
  }
  const fresh = await fetchLiveNews(limit);
  if (fresh && fresh.length) {
    const items = withRouteIds(fresh);
    saveCache(items, true);
    enrichImagesInBackground(items, true); // fill missing card images, then notify
    return { items, live: true, cached: false };
  }
  const items = withRouteIds(STATIC_NEWS);
  saveCache(items, false);
  enrichImagesInBackground(items, false); // curated items still get real source images
  return { items, live: false, cached: false };
}

/** Read whatever news is currently cached (used after a background update). */
export function getCachedNews() {
  const cache = loadCache();
  return cache?.items?.length ? { items: cache.items, live: cache.live } : null;
}

/** Look up a single cached news item by its route id (for the reader page). */
export function getCachedNewsItem(rid) {
  const cache = loadCache();
  return cache?.items?.find((it) => it.rid === rid) || null;
}

export const STATIC_NEWS = NEWS_ITEMS.map((it, i) => ({ ...it, rid: `n-${i}`, html: `<p>${it.excerpt}</p>` }));
