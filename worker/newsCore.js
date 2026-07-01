/*
 * newsCore — the edge-side AI-news aggregator. Runs inside the Cloudflare Worker
 * (and the vite dev middleware) so the heavy work — fetching 60+ RSS feeds and
 * parsing them — happens ONCE per hour at the edge and is cached + shared by
 * every visitor, instead of every browser doing its own 60-request waterfall.
 *
 * The browser then makes a single GET /api/news call and receives ready-to-use
 * raw items (same shape the client's per-feed fallback produces), which it runs
 * through its existing diversity/normalisation pass.
 *
 * Pure Workers-runtime globals only (fetch, URL, AbortController) + the shared
 * NEWS_FEEDS list. Category classification + diversity selection stay on the
 * client (it already owns that logic). No DOMParser (unavailable in Workers), so
 * feeds are parsed with focused regexes that handle RSS <item> and Atom <entry>,
 * CDATA, and the common image carriers (media:content / media:thumbnail /
 * enclosure / first <img> in the body).
 */
import { NEWS_FEEDS } from '../src/data/newsFeeds.js';

const UA = 'Mozilla/5.0 (compatible; GlancerAIBot/1.0; +https://glancerai.com)';

async function timedFetch(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'User-Agent': UA,
        Accept: 'application/rss+xml,application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
      },
      // Let Cloudflare cache the upstream feed too (belt and suspenders).
      cf: { cacheTtl: 1800, cacheEverything: true },
    });
  } finally {
    clearTimeout(t);
  }
}

// --- tiny XML helpers (regex-based; no DOMParser in the Workers runtime) -----

function decodeEntities(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function stripTags(html = '') {
  return decodeEntities(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Text content of the first <tag>…</tag> within `block` (namespaced names ok).
function tag(block, name) {
  const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i').exec(block);
  return m ? decodeEntities(m[1]).trim() : '';
}

// An attribute (e.g. url, href) off the first matching self/openn tag.
function attr(block, name, a) {
  const m = new RegExp(`<${name}\\b[^>]*\\b${a}=["']([^"']+)["']`, 'i').exec(block);
  return m ? m[1] : '';
}

function firstImg(html = '') {
  const m = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  return m ? m[1] : '';
}

// Cap items per feed — 6 freshest is ample for the client's 50-item diverse
// pick, and keeps the aggregated JSON small enough to send to every browser.
const PER_FEED = 6;
// Trim the summary to plain text so the payload stays light (the full article
// HTML would balloon the response into megabytes). The client builds the card
// excerpt + read-time estimate from this.
const SUMMARY_MAX = 320;

function blocksFor(xml, name, max) {
  const out = [];
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'gi');
  let m;
  while ((m = re.exec(xml)) && out.length < max) out.push(m[1]);
  return out;
}

// Parse one feed's XML into raw items (RSS <item> first, else Atom <entry>).
function parseFeed(xml, feed) {
  let raw = blocksFor(xml, 'item', PER_FEED);
  let atom = false;
  if (!raw.length) { raw = blocksFor(xml, 'entry', PER_FEED); atom = true; }

  return raw.map((b) => {
    // Atom <link href="…">, RSS <link>…</link>.
    const link = atom ? (attr(b, 'link', 'href') || tag(b, 'id')) : tag(b, 'link');
    const content = tag(b, 'content:encoded') || tag(b, 'content') || '';
    const description = tag(b, 'description') || tag(b, 'summary') || '';
    const image =
      attr(b, 'media:content', 'url') ||
      attr(b, 'media:thumbnail', 'url') ||
      attr(b, 'enclosure', 'url') ||
      firstImg(content) || firstImg(description) || '';
    // Send a compact plain-text summary instead of the full HTML body.
    const text = stripTags(content || description);
    return {
      title: stripTags(tag(b, 'title')),
      link: decodeEntities(link).trim(),
      description: text.length > SUMMARY_MAX ? text.slice(0, SUMMARY_MAX) + '…' : text,
      pubDate: tag(b, 'pubDate') || tag(b, 'updated') || tag(b, 'published') || '',
      guid: tag(b, 'guid') || link,
      image: image || null,
      _source: feed.source,
      _category: feed.category,
      _frameable: feed.frameable === true,
    };
  }).filter((it) => it.title && it.link);
}

async function fetchOneFeed(feed, ms) {
  const res = await timedFetch(feed.url, ms);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return parseFeed(xml, feed);
}

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Fetch a batch of feeds in parallel (edge network → fast, no CORS) and return
 * the pooled raw items. Failures are swallowed per-feed (allSettled), so a few
 * dead sources never sink the batch.
 *
 * `maxFeeds` caps how many feeds we hit in a single build so we stay under the
 * Workers free-tier 50-subrequest ceiling. The list is shuffled each build, so
 * across the hourly rebuilds every source still gets its turn.
 */
export async function buildRawNews({ perFeedTimeout = 6000, maxFeeds = 45 } = {}) {
  const feeds = shuffled(NEWS_FEEDS).slice(0, maxFeeds);
  const settled = await Promise.allSettled(
    feeds.map((f) => fetchOneFeed(f, perFeedTimeout)),
  );
  const items = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && Array.isArray(s.value)) items.push(...s.value);
  }
  return items;
}
