/*
 * frameCheckCore — would this URL load inside an <iframe> on another origin?
 *
 * Publishers state their policy via X-Frame-Options / CSP frame-ancestors; we
 * read the ARTICLE page's own headers and obey them. Article pages can be
 * stricter than the site root (which is what scripts/check-frameable.mjs
 * samples per source), so the reader asks per-article at runtime. The verdict
 * only decides whether the reader shows a live iframe or a summary + link-out —
 * a publisher's block is never worked around.
 *
 * Shared by worker/index.js (GET /api/framecheck) and the dev middleware in
 * vite.config.js.
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

export function frameDecision(xfo, csp) {
  const m = csp && /frame-ancestors\s+([^;]+)/i.exec(csp);
  if (m) {
    const sources = m[1].trim().toLowerCase().split(/\s+/);
    if (sources.includes('*')) return { frameable: true, reason: 'csp frame-ancestors *' };
    return { frameable: false, reason: `csp frame-ancestors ${sources.join(' ')}` };
  }
  if (xfo) return { frameable: false, reason: `x-frame-options: ${xfo}` };
  return { frameable: true, reason: 'no framing restriction declared' };
}

export async function frameCheck(rawUrl) {
  let target;
  try {
    target = new URL(rawUrl);
    if (target.protocol !== 'https:' && target.protocol !== 'http:') throw new Error('bad protocol');
  } catch {
    return { frameable: false, reason: 'invalid url' };
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    // GET (not HEAD): some CDNs omit security headers on HEAD responses.
    const res = await fetch(target.toString(), {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html' },
    });
    clearTimeout(t);
    // Headers are all we need — cancel the body politely.
    try { await res.body?.cancel(); } catch { /* already consumed */ }
    return frameDecision(res.headers.get('x-frame-options'), res.headers.get('content-security-policy'));
  } catch (e) {
    // Unreachable from here → the browser's iframe won't fare better.
    return { frameable: false, reason: `fetch failed: ${e?.message || e}` };
  }
}
