import { NEWS_ITEMS } from '../data/newsData';
import { NEWS_FEEDS } from '../data/newsFeeds';
import { proxiedText } from './proxy';
import { classify } from './categorize';

/*
 * newsFeed — turns live AI headlines into the card shape the UI expects.
 *
 *  - Primary:   GET /api/news — our edge aggregator (worker/newsCore.js) pulls
 *               all feeds server-side and Cloudflare caches the result for an
 *               hour, SHARED across every visitor. One fast request, with images
 *               already resolved → no 60-feed waterfall, no emoji flash.
 *  - Fallback:  per-feed fetch from the browser (rss2json → CORS proxy + XML),
 *               used in local dev (no Worker) or if /api/news is unavailable.
 *  - Last:      curated static list in ../data/newsData.
 *
 * Results are cached in localStorage and served stale-while-revalidate: a cached
 * feed paints instantly while a fresh pull happens in the background. Each item
 * gets a stable route id (`rid`) so the reader (/news/:rid) can look it up.
 */

// FEEDS now lives in src/data/newsFeeds.js (shared with the edge aggregator).
const FEEDS = NEWS_FEEDS;

// Bump the version suffix whenever the feed list / item shape changes. This
// abandons every visitor's old cache on their next load — without it, anyone who
// saw the previous (broken, emoji-only) feed would keep seeing it from cache for
// up to CACHE_TTL even after a fix ships.
const CACHE_KEY = 'glancer_news_cache_v7';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour — refresh the live feed hourly
// Static fallback is cached only briefly so a transient feed outage can't pin
// the emoji placeholders for an hour; the next visit retries the live feed.
const FALLBACK_TTL = 20 * 60 * 1000; // 20 minutes
// How many headlines to surface on the page (was 24). The diverse selector
// round-robins across 60+ sources so 50 stays category-balanced and fresh.
export const NEWS_LIMIT = 50;

// One-time cleanup of older cache keys so they don't linger.
try { ['glancer_news_cache', 'glancer_news_cache_v2', 'glancer_news_cache_v3', 'glancer_news_cache_v4', 'glancer_news_cache_v5', 'glancer_news_cache_v6'].forEach((k) => localStorage.removeItem(k)); } catch { /* noop */ }

// Restrained, technical card headers — deep desaturated slate/teal/blue/amber,
// no purple/magenta. Keeps category differentiation without the "AI slop" look.
const GRADIENTS = [
  'linear-gradient(150deg, #0B1220 0%, #12303a 55%, #16a9c4 100%)',
  'linear-gradient(150deg, #0A1420 0%, #103048 55%, #2a7fb8 100%)',
  'linear-gradient(150deg, #0B141C 0%, #14343a 55%, #2cc9e0 100%)',
  'linear-gradient(150deg, #0E1510 0%, #143a2a 55%, #2f9e6e 100%)',
  'linear-gradient(150deg, #171208 0%, #3a2a12 55%, #d0a23b 100%)',
  'linear-gradient(150deg, #0B0E14 0%, #1a2432 55%, #4a5c72 100%)',
];
const EMOJIS = ['🧠', '⚡', '🤖', '🚀', '💡', '🔬', '📡', '🌐', '🛰️', '💬'];
const TAG_CLASSES = ['tag-purple', 'tag-cyan', 'tag-pink', 'tag-blue', 'tag-orange'];

// Stable colour per category so the same category always reads the same hue
// across the live feed and the curated fallback. Falls back to a hashed pick.
const CATEGORY_CLASS = {
  Research: 'tag-purple',
  Models: 'tag-pink',
  Industry: 'tag-cyan',
  'Open Source': 'tag-blue',
  Tools: 'tag-cyan',
  Hardware: 'tag-orange',
  AIOps: 'tag-blue',
  Policy: 'tag-orange',
};
function classFor(category, i = 0) {
  return CATEGORY_CLASS[category] || TAG_CLASSES[i % TAG_CLASSES.length];
}

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

/*
 * sourceFavicon — a crisp, instantly-available brand logo for an item, derived
 * from its article domain. Used as the image fallback so a card without a real
 * cover image shows the publisher's logo on its gradient instead of a bare emoji
 * placeholder. Google's favicon service always resolves and is CDN-cached.
 */
export function sourceFavicon(item, size = 128) {
  try {
    const host = new URL(item.url).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${host}`;
  } catch {
    return null;
  }
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
  const title = stripHtml(item.title || 'Untitled');
  // _category was auto-classified in selectDiverse (article content → best-fit
  // chip). Re-classify defensively only if it's somehow missing.
  const category = item._category || classify(title, text, 'Industry');
  return {
    id: item.guid || item.link || `live-${i}`,
    title,
    // Keep a full paragraph of context (~360 chars) so readers can judge from
    // the card whether the story is worth opening, not just a one-line teaser.
    excerpt: text.length > 360 ? text.slice(0, 357).replace(/\s+\S*$/, '') + '…' : text,
    html,
    url: item.link,
    source: item._source,
    category,
    categoryClass: classFor(category, i),
    emoji: EMOJIS[i % EMOJIS.length],
    gradient: GRADIENTS[i % GRADIENTS.length],
    date: formatDate(item.pubDate),
    // Raw publish timestamp — the front-page wire renders it as HH:MM.
    ts: item.pubDate || '',
    readMin: Math.max(2, Math.round((text.split(' ').length || 200) / 200)),
    image,
    live: true,
    // Only true for sources verified (scripts/check-frameable.mjs) not to block
    // third-party framing — gates whether the reader opens a live iframe of the
    // source or falls back to a summary + link-out. Never bypass this to work
    // around a publisher's X-Frame-Options/CSP.
    frameable: item._frameable === true,
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
  return data.items.map((it) => ({ ...it, _source: feed.source, _category: feed.category, _frameable: feed.frameable === true }));
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
      _category: feed.category,
      _frameable: feed.frameable === true,
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

// Fisher–Yates shuffle (on a copy) so each refresh prioritises a different
// slice of the (large) feed list — over repeat visits every source gets a turn,
// and a few rate-limited feeds never starve the same categories every time.
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Run `worker` over `items` with bounded concurrency. With 60+ feeds, firing
// them all at once would hammer rss2json's free tier (and the browser's per-host
// socket cap); a pool keeps it civil while still finishing quickly. Mirrors
// Promise.allSettled — a failing feed resolves to null and is filtered out.
async function runPool(items, worker, concurrency = 6) {
  const out = new Array(items.length).fill(null);
  let cursor = 0;
  async function lane() {
    while (cursor < items.length) {
      const i = cursor++;
      try { out[i] = await worker(items[i]); } catch { out[i] = null; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane));
  return out;
}

// Pick `limit` items with category diversity. We bucket the (date-sorted) pool
// by category and round-robin across buckets, so the default "All" view always
// surfaces several categories — not just whichever publishers happened to post
// most often — while still preferring the freshest item within each category.
// A per-source cap stops any single outlet from dominating.
function selectDiverse(items, limit, maxPerSource = 3) {
  const sorted = items
    .filter((it) => it.title && it.link)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const seenTitle = new Set();
  const buckets = new Map(); // category → date-desc items
  for (const it of sorted) {
    const key = it.title.toLowerCase();
    if (seenTitle.has(key)) continue;
    seenTitle.add(key);
    // Auto-categorise here too so the diverse round-robin balances by the
    // chips the cards will actually show (set once; normalize trusts it).
    const cat = classify(stripHtml(it.title), stripHtml(it.content || it.description || ''), it._category || 'Industry');
    it._category = cat;
    if (!buckets.has(cat)) buckets.set(cat, []);
    buckets.get(cat).push(it);
  }

  const order = [...buckets.keys()];
  const perSource = new Map();
  const picked = [];
  let progressed = true;
  while (picked.length < limit && progressed) {
    progressed = false;
    for (const cat of order) {
      if (picked.length >= limit) break;
      const bucket = buckets.get(cat);
      while (bucket.length) {
        const it = bucket.shift();
        const n = perSource.get(it._source) || 0;
        if (n >= maxPerSource) continue; // skip, try next in this bucket
        perSource.set(it._source, n + 1);
        picked.push(it);
        progressed = true;
        break;
      }
    }
  }
  return picked;
}

// Primary path: one request to our edge aggregator (worker/newsCore.js), which
// has already fetched + parsed every feed and cached the result for an hour,
// shared across all visitors. Returns the same raw-item shape the per-feed
// fallback produces, so the diversity + normalise pass below is identical.
async function fetchViaApi() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch('/api/news', { signal: ctrl.signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // In local dev without the Worker/middleware, /api/news falls through to the
    // SPA and returns index.html — guard against parsing that as JSON.
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('not json');
    const data = await res.json();
    if (!Array.isArray(data.items) || !data.items.length) throw new Error('empty');
    return data.items;
  } finally {
    clearTimeout(t);
  }
}

async function fetchLiveNews(limit = NEWS_LIMIT) {
  // 1) Edge aggregator (fast, shared, image-rich).
  try {
    const apiItems = await fetchViaApi();
    if (apiItems?.length) return selectDiverse(apiItems, limit).map(normalize);
  } catch { /* fall through to per-feed fetch */ }

  // 2) Fallback: pull each feed straight from the browser (dev / Worker down).
  const results = await runPool(shuffled(FEEDS), fetchFeed, 6);
  const items = results.filter(Boolean).flat();
  if (!items.length) return null;
  return selectDiverse(items, limit).map(normalize);
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

// Fetch live → cache → (fallback to static). Returns the render-ready result.
async function fetchAndCache(limit) {
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

// Guard so overlapping page loads / event handlers don't spawn duplicate
// background fetches against the feed list.
let revalidating = false;

// Refresh the live feed in the background, then notify the UI to swap it in.
// This is what makes the feed current on EVERY visit/login: even when a fresh
// cache is served instantly, we still re-pull behind it so the next paint (and
// the next session) shows the very latest headlines.
function revalidateInBackground(limit) {
  if (revalidating) return;
  revalidating = true;
  fetchLiveNews(limit)
    .then((fresh) => {
      if (fresh && fresh.length) {
        const items = withRouteIds(fresh);
        saveCache(items, true);
        enrichImagesInBackground(items, true);
        try { window.dispatchEvent(new Event('glancer:news-updated')); } catch { /* noop */ }
      }
    })
    .catch(() => { /* keep whatever is cached */ })
    .finally(() => { revalidating = false; });
}

/**
 * Returns { items, live, cached }. Stale-while-revalidate: if ANY cached feed
 * exists it paints INSTANTLY (even past its TTL) while a fresh pull runs in the
 * background — so only the very first visit ever blocks on the network. A LIVE
 * cache past its 1-hour TTL still revalidates; a stale STATIC fallback past its
 * short TTL also revalidates so it can upgrade to the live feed. With no cache
 * at all we fetch inline (edge aggregator first) and fall back to static.
 */
export async function getNews(limit = NEWS_LIMIT) {
  const cache = loadCache();
  if (cache?.items?.length) {
    const ttl = cache.live ? CACHE_TTL : FALLBACK_TTL;
    const stale = Date.now() - cache.ts >= ttl;
    // Revalidate when stale, OR when the cached feed is only the static fallback
    // (so it keeps trying to upgrade to the live edge feed on each visit).
    if (stale || !cache.live) revalidateInBackground(limit);
    return { items: cache.items, live: cache.live, cached: true };
  }
  return fetchAndCache(limit);
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
