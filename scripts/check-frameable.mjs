// One-off / periodic checker: for each NEWS_FEEDS source, fetch its site root
// and inspect X-Frame-Options / CSP frame-ancestors to decide whether Glancer AI
// may embed it in an <iframe> without circumventing the publisher's own
// technical block. Re-run this occasionally (`node scripts/check-frameable.mjs`)
// since publishers change their framing policy without notice — a source can
// silently flip from frameable to blocked.
import { NEWS_FEEDS } from '../src/data/newsFeeds.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

function originOf(feedUrl) {
  try { return new URL(feedUrl).origin; } catch { return null; }
}

// Parse a CSP frame-ancestors directive → list of sources (lowercased), or null if absent.
function frameAncestors(csp) {
  if (!csp) return null;
  const m = /frame-ancestors\s+([^;]+)/i.exec(csp);
  if (!m) return null;
  return m[1].trim().split(/\s+/).map((s) => s.toLowerCase());
}

function decide(xfo, csp) {
  const fa = frameAncestors(csp);
  if (fa) {
    if (fa.includes("'none'")) return { frameable: false, reason: "csp frame-ancestors 'none'" };
    if (fa.includes('*')) return { frameable: true, reason: 'csp frame-ancestors *' };
    return { frameable: false, reason: `csp frame-ancestors: ${fa.join(' ')}` };
  }
  if (xfo) {
    const v = xfo.trim().toLowerCase();
    if (v === 'deny' || v === 'sameorigin') return { frameable: false, reason: `x-frame-options: ${xfo}` };
    return { frameable: false, reason: `x-frame-options: ${xfo}` };
  }
  return { frameable: true, reason: 'no x-frame-options / csp frame-ancestors found' };
}

async function checkOne(feed) {
  const origin = originOf(feed.url);
  if (!origin) return { source: feed.source, origin: null, frameable: false, reason: 'bad url' };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(origin + '/', {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html' },
    });
    clearTimeout(t);
    const xfo = res.headers.get('x-frame-options');
    const csp = res.headers.get('content-security-policy');
    const { frameable, reason } = decide(xfo, csp);
    return { source: feed.source, origin, status: res.status, frameable, reason };
  } catch (err) {
    return { source: feed.source, origin, frameable: false, reason: `fetch failed: ${err.message}` };
  }
}

async function pool(items, worker, concurrency = 8) {
  const out = new Array(items.length);
  let i = 0;
  async function lane() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await worker(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane));
  return out;
}

const results = await pool(NEWS_FEEDS, checkOne, 8);
results.sort((a, b) => (a.frameable === b.frameable ? 0 : a.frameable ? -1 : 1));
for (const r of results) {
  console.log(`${r.frameable ? 'YES' : 'no '}  ${r.source.padEnd(24)} ${r.reason}`);
}
console.log(`\nframeable: ${results.filter((r) => r.frameable).length} / ${results.length}`);
