/*
 * /api/proxy — Cloudflare Pages Function. First-party CORS proxy used by the
 * live news feed, the card image / og:image enrichment pass, and the in-site
 * article reader to fetch third-party RSS/XML and article HTML that the browser
 * cannot fetch directly (CORS).
 *
 * Why this file exists: glancerai.com deploys on Cloudflare Pages. Pages serves
 * /api/llm via functions/api/llm.js, but there was no matching function for
 * /api/proxy — so on production the request fell through to the SPA fallback and
 * returned index.html instead of the proxied feed. The news feed's proxy
 * fallback and og:image enrichment then received HTML instead of feed/article
 * data, no image could be extracted, and every card dropped to the emoji
 * placeholder. (It worked locally because vite.config.js serves /api/proxy via
 * a dev middleware.)
 *
 * Mirrors worker/proxyCore.js but is self-contained so it bundles cleanly as a
 * Pages Function — the same convention functions/api/llm.js follows. Relies only
 * on globals present in the Workers runtime: fetch, URL, Response.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

// Block loopback / link-local / RFC-1918 private ranges (basic SSRF guard).
// This is a public proxy, so it must never reach internal hosts.
const PRIVATE_HOST =
  /^(localhost$|.*\.local$|127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/i;

function validateTarget(target) {
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

export function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

// Presents a browser-like User-Agent and a same-origin Referer so publishers
// that hot-link-protect or bot-block a bare fetch still serve us the feed/page.
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const v = validateTarget(url.searchParams.get('url'));
  if (v.error) {
    return new Response(v.error, {
      status: v.status,
      headers: { ...CORS, 'content-type': 'text/plain; charset=utf-8' },
    });
  }
  try {
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
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: {
        ...CORS,
        'content-type': upstream.headers.get('content-type') || 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=600',
      },
    });
  } catch (e) {
    return new Response('Upstream fetch failed: ' + (e?.message || e), {
      status: 502,
      headers: CORS,
    });
  }
}
