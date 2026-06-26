/*
 * proxyCore — the shared logic for our first-party CORS proxy. Imported by both
 * the production Cloudflare Worker (worker/index.js) and the Vite dev middleware
 * (vite.config.js), so `/api/proxy` behaves identically in dev and prod.
 *
 * Why a first-party proxy exists: the live news feed must fetch third-party
 * RSS/XML and article HTML from the browser, which CORS forbids. Public CORS
 * proxies (allorigins, corsproxy.io, codetabs, …) keep dying or adding
 * paywalls, so we run our own — same-origin, no rate limits, no dependency.
 *
 * Only relies on globals that exist in BOTH the Workers runtime and Node 18+:
 * fetch, URL, Uint8Array.
 */

// Block requests to loopback / link-local / RFC-1918 private ranges (basic SSRF
// guard). This is a public proxy, so we never want it reaching internal hosts.
const PRIVATE_HOST =
  /^(localhost$|.*\.local$|127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/i;

export function validateTarget(target) {
  if (!target) return { error: 'Missing ?url= parameter', status: 400 };
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return { error: 'Invalid url', status: 400 };
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    return { error: 'Only http(s) URLs are allowed', status: 400 };
  }
  const host = parsed.hostname.replace(/^\[|\]$/g, ''); // strip IPv6 brackets
  if (host === '::1' || PRIVATE_HOST.test(host)) {
    return { error: 'Blocked host', status: 403 };
  }
  return { parsed };
}

/**
 * Fetch `target` server-side and return a normalized result the caller turns
 * into an HTTP response. Presents a browser-like User-Agent and a same-origin
 * Referer so publishers that hot-link-protect or bot-block a bare fetch still
 * serve us the page/feed. Returns { status, contentType, body } where body is a
 * Uint8Array (or a string for validation errors).
 */
export async function proxyFetch(target) {
  const v = validateTarget(target);
  if (v.error) return { status: v.status, contentType: 'text/plain; charset=utf-8', body: v.error };

  const upstream = await fetch(v.parsed.toString(), {
    redirect: 'follow',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; GlancerAIBot/1.0; +https://glancerai.com)',
      Accept:
        'text/html,application/xhtml+xml,application/xml,application/rss+xml;q=0.9,*/*;q=0.8',
      Referer: v.parsed.origin + '/',
    },
  });
  const body = new Uint8Array(await upstream.arrayBuffer());
  return {
    status: upstream.status,
    contentType: upstream.headers.get('content-type') || 'text/plain; charset=utf-8',
    body,
  };
}
