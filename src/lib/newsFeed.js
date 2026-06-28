import { NEWS_ITEMS } from '../data/newsData';
import { proxiedText } from './proxy';
import { classify } from './categorize';

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

// AI news RSS feeds. Every entry carries a `category` so each headline lands
// under a filter chip (Research / Models / Industry / Open Source / Tools /
// Hardware / AIOps / Policy) regardless of which publisher it came from.
// Dead or unreachable feeds are skipped gracefully (Promise pool below uses
// allSettled semantics), so the list can be generous — more sources means a
// fuller, fresher feed. Each fetch shuffles this list and pulls with bounded
// concurrency so we stay friendly to the free rss2json tier.
const FEEDS = [
  // ── Major tech press (Industry) ──────────────────────────────────────────
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge', category: 'Industry' },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat', category: 'Industry' },
  { url: 'https://www.wired.com/feed/tag/ai/latest/rss', source: 'Wired', category: 'Industry' },
  { url: 'https://arstechnica.com/ai/feed/', source: 'Ars Technica', category: 'Industry' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch', category: 'Industry' },
  { url: 'https://www.artificialintelligence-news.com/feed/', source: 'AI News', category: 'Industry' },
  { url: 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', source: 'ZDNet', category: 'Industry' },
  { url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', source: 'MIT Tech Review', category: 'Industry' },
  { url: 'https://www.theregister.com/software/ai_ml/headlines.atom', source: 'The Register', category: 'Industry' },
  { url: 'https://the-decoder.com/feed/', source: 'The Decoder', category: 'Industry' },
  { url: 'https://www.unite.ai/feed/', source: 'Unite.AI', category: 'Industry' },
  { url: 'https://aibusiness.com/rss.xml', source: 'AI Business', category: 'Industry' },
  { url: 'https://siliconangle.com/category/ai/feed/', source: 'SiliconANGLE', category: 'Industry' },
  { url: 'https://analyticsindiamag.com/feed/', source: 'Analytics India', category: 'Industry' },
  { url: 'https://www.engadget.com/rss.xml', source: 'Engadget', category: 'Industry' },
  { url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', source: 'CNBC Tech', category: 'Industry' },
  { url: 'https://bdtechtalks.com/feed/', source: 'BD Tech Talks', category: 'Industry' },
  { url: 'https://dailyai.com/feed/', source: 'DailyAI', category: 'Industry' },

  // ── Frontier labs & model makers (Models) ────────────────────────────────
  { url: 'https://openai.com/blog/rss.xml', source: 'OpenAI', category: 'Models' },
  { url: 'https://deepmind.google/blog/rss.xml', source: 'Google DeepMind', category: 'Models' },
  { url: 'https://blog.google/technology/ai/rss/', source: 'Google AI', category: 'Models' },
  { url: 'https://www.interconnects.ai/feed', source: 'Interconnects', category: 'Models' },

  // ── Research labs & academia (Research) ──────────────────────────────────
  { url: 'https://bair.berkeley.edu/blog/feed.xml', source: 'Berkeley BAIR', category: 'Research' },
  { url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml', source: 'MIT News', category: 'Research' },
  { url: 'https://www.microsoft.com/en-us/research/feed/', source: 'Microsoft Research', category: 'Research' },
  { url: 'https://blog.research.google/feeds/posts/default', source: 'Google Research', category: 'Research' },
  { url: 'https://thegradient.pub/rss/', source: 'The Gradient', category: 'Research' },
  { url: 'https://syncedreview.com/feed/', source: 'Synced', category: 'Research' },
  { url: 'https://www.marktechpost.com/feed/', source: 'MarkTechPost', category: 'Research' },
  { url: 'https://www.amazon.science/index.rss', source: 'Amazon Science', category: 'Research' },
  { url: 'https://research.facebook.com/feed/', source: 'Meta Research', category: 'Research' },
  { url: 'https://magazine.sebastianraschka.com/feed', source: 'Sebastian Raschka', category: 'Research' },

  // ── Open source & ML engineering (Open Source) ───────────────────────────
  { url: 'https://huggingface.co/blog/feed.xml', source: 'Hugging Face', category: 'Open Source' },
  { url: 'https://pytorch.org/blog/feed.xml', source: 'PyTorch', category: 'Open Source' },
  { url: 'https://blog.tensorflow.org/feeds/posts/default', source: 'TensorFlow', category: 'Open Source' },
  { url: 'https://github.blog/ai-and-ml/feed/', source: 'GitHub', category: 'Open Source' },

  // ── Tooling, applied ML & how-to (Tools) ─────────────────────────────────
  { url: 'https://blog.langchain.dev/rss.xml', source: 'LangChain', category: 'Tools' },
  { url: 'https://www.kdnuggets.com/feed', source: 'KDnuggets', category: 'Tools' },
  { url: 'https://machinelearningmastery.com/feed/', source: 'ML Mastery', category: 'Tools' },
  { url: 'https://towardsdatascience.com/feed', source: 'Towards Data Science', category: 'Tools' },
  { url: 'https://blog.roboflow.com/rss/', source: 'Roboflow', category: 'Tools' },
  { url: 'https://www.latent.space/feed', source: 'Latent Space', category: 'Tools' },
  { url: 'https://simonwillison.net/atom/everything/', source: 'Simon Willison', category: 'Tools' },
  { url: 'https://www.oreilly.com/radar/topics/ai-ml/feed/index.xml', source: "O'Reilly Radar", category: 'Tools' },

  // ── Compute & hardware (Hardware) ────────────────────────────────────────
  { url: 'https://blogs.nvidia.com/feed/', source: 'NVIDIA', category: 'Hardware' },
  { url: 'https://developer.nvidia.com/blog/feed/', source: 'NVIDIA Developer', category: 'Hardware' },
  { url: 'https://aws.amazon.com/blogs/machine-learning/feed/', source: 'AWS ML', category: 'Hardware' },
  { url: 'https://www.therobotreport.com/feed/', source: 'The Robot Report', category: 'Hardware' },

  // ── Observability & AIOps (AIOps) ────────────────────────────────────────
  { url: 'https://opentelemetry.io/blog/index.xml', source: 'OpenTelemetry', category: 'AIOps' },
  { url: 'https://www.datadoghq.com/blog/index.xml', source: 'Datadog', category: 'AIOps' },
  { url: 'https://grafana.com/blog/index.xml', source: 'Grafana', category: 'AIOps' },
  { url: 'https://newrelic.com/blog/feed', source: 'New Relic', category: 'AIOps' },

  // ── Policy, safety & society (Policy) ────────────────────────────────────
  { url: 'https://www.brookings.edu/topic/artificial-intelligence/feed/', source: 'Brookings', category: 'Policy' },
  { url: 'https://importai.substack.com/feed', source: 'Import AI', category: 'Policy' },
  { url: 'https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss', source: 'IEEE Spectrum', category: 'Policy' },
  { url: 'https://lastweekin.ai/feed', source: 'Last Week in AI', category: 'Policy' },
];

// Bump the version suffix whenever the feed list / item shape changes. This
// abandons every visitor's old cache on their next load — without it, anyone who
// saw the previous (broken, emoji-only) feed would keep seeing it from cache for
// up to CACHE_TTL even after a fix ships.
const CACHE_KEY = 'glancer_news_cache_v4';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours — for a successful LIVE fetch
// Static fallback is cached only briefly so a transient feed outage can't pin
// the emoji placeholders for 12 hours; the next visit retries the live feed.
const FALLBACK_TTL = 20 * 60 * 1000; // 20 minutes

// One-time cleanup of older cache keys so they don't linger.
try { ['glancer_news_cache', 'glancer_news_cache_v2', 'glancer_news_cache_v3'].forEach((k) => localStorage.removeItem(k)); } catch { /* noop */ }

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
    excerpt: text.length > 180 ? text.slice(0, 177) + '…' : text,
    html,
    url: item.link,
    source: item._source,
    category,
    categoryClass: classFor(category, i),
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
  return data.items.map((it) => ({ ...it, _source: feed.source, _category: feed.category }));
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

async function fetchLiveNews(limit = 24) {
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
 * Returns { items, live, cached }. Stale-while-revalidate: serves the cache
 * instantly when it's fresh for a fast first paint, but ALWAYS kicks off a live
 * refresh in the background so the RSS feed is up to date no matter when the
 * user last opened the page. With no usable cache it fetches live inline and
 * falls back to the curated static list.
 */
export async function getNews(limit = 24) {
  const cache = loadCache();
  const ttl = cache?.live ? CACHE_TTL : FALLBACK_TTL;
  const fresh = cache?.items?.length && Date.now() - cache.ts < ttl;
  if (fresh) {
    revalidateInBackground(limit); // keep it current for this paint + next visit
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
