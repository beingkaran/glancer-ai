/*
 * proxy — fetches a URL's text through a chain of public CORS proxies, trying
 * each in turn until one succeeds. Browsers can't fetch most news sites/feeds
 * directly (CORS), so this is how the live feed, image enrichment, and the
 * in-site article reader reach the source.
 */

// Raw-passthrough CORS proxies, raced in parallel (Promise.any) so the first to
// respond wins and dead ones don't matter.
//   1. /api/proxy — our own first-party Cloudflare Worker (worker/index.js).
//      Same-origin, no rate limits, no third-party dependency: this should win
//      almost every time in production and dev.
//   2-3. Public proxies as a safety net (these come and go — corsproxy.io now
//      needs a key, allorigins is frequently down — so first-party is primary).
const PROXIES = [
  (u) => `/api/proxy?url=${encodeURIComponent(u)}`,
  (u) => `https://proxy.cors.sh/${u}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
];

async function timedFetch(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

/**
 * Returns the response body text from whichever proxy responds first with a
 * valid body. Racing (rather than sequential fallback) keeps latency low even
 * when one proxy is down or slow. Rejects only if every proxy fails.
 */
export async function proxiedText(url, ms = 9000) {
  const attempts = PROXIES.map(async (make) => {
    const res = await timedFetch(make(url), ms);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text || text.length < 200) throw new Error('empty body');
    return text;
  });
  return Promise.any(attempts);
}
