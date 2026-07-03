/*
 * Cloudflare Worker entry. Runs in front of the static Vite build:
 *   - GET /api/proxy?url=…  → first-party CORS proxy (see proxyCore.js)
 *   - GET /api/news         → edge-aggregated AI news feed (see newsCore.js),
 *                             cached at the edge for 1 hour and shared by all
 *                             visitors so the browser makes ONE fast request
 *   - everything else       → served from ./dist via the ASSETS binding,
 *                             with SPA fallback (configured in wrangler.jsonc)
 */
import { proxyFetch } from './proxyCore.js';
import { buildRawNews } from './newsCore.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

/** Security headers for AdSense review, HSTS preload scanners, and baseline CSP. */
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google",
    "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; '),
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/proxy') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
      try {
        const { status, contentType, body } = await proxyFetch(url.searchParams.get('url'));
        return new Response(body, {
          status,
          headers: { ...CORS, 'content-type': contentType, 'cache-control': 'public, max-age=600' },
        });
      } catch (e) {
        return new Response('Upstream fetch failed: ' + (e?.message || e), { status: 502, headers: CORS });
      }
    }

    // Edge-cached news aggregator. The first request each hour (per edge PoP)
    // pays the feed-fetch cost; every other request is served instantly from
    // Cloudflare's cache. s-maxage governs that shared cache TTL.
    if (url.pathname === '/api/news') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
      const cache = caches.default;
      const cacheKey = new Request(new URL('/api/news', url.origin).toString());
      const hit = await cache.match(cacheKey);
      if (hit) return hit;
      try {
        const items = await buildRawNews();
        const resp = new Response(JSON.stringify({ ts: Date.now(), count: items.length, items }), {
          headers: {
            ...CORS,
            'content-type': 'application/json; charset=utf-8',
            // Browser may reuse for 5 min; the shared edge cache holds 1 hour.
            'cache-control': 'public, max-age=300, s-maxage=3600',
          },
        });
        ctx.waitUntil(cache.put(cacheKey, resp.clone()));
        return resp;
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e?.message || e), items: [] }), {
          status: 502,
          headers: { ...CORS, 'content-type': 'application/json; charset=utf-8' },
        });
      }
    }

    // Static assets (the Vite build) + SPA fallback for client-side routes.
    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};
