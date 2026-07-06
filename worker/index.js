/*
 * Cloudflare Worker entry. Runs in front of the static Vite build:
 *   - GET /api/proxy?url=…  → first-party CORS proxy (see proxyCore.js)
 *   - GET /api/framecheck?url=… → does this article allow being iframed?
 *                             Inspects the page's own X-Frame-Options / CSP
 *                             frame-ancestors (the reader respects the block —
 *                             it never works around it)
 *   - GET /api/news         → edge-aggregated AI news feed (see newsCore.js),
 *                             cached at the edge for 1 hour and shared by all
 *                             visitors so the browser makes ONE fast request
 *   - GET /api/events       → aggregated global tech-events feed (eventsCore.js),
 *                             refreshed daily by a Cron Trigger into KV and read
 *                             KV-first, so every visitor gets the same fresh list
 *   - GET /events.ics       → the same events as a live subscribable calendar
 *   - everything else       → served from ./dist via the ASSETS binding,
 *                             with SPA fallback (configured in wrangler.jsonc)
 */
import { proxyFetch } from './proxyCore.js';
import { frameCheck } from './frameCheckCore.js';
import { buildRawNews } from './newsCore.js';
import { buildRawEvents } from './eventsCore.js';
import { calendarText } from '../src/lib/calendarLinks.js';

// Events are rebuilt at most daily, so a long shared TTL is fine. Browsers may
// reuse for 5 min; the edge/KV copy is authoritative for a day.
const EVENTS_CACHE_CONTROL = 'public, max-age=300, s-maxage=86400';
const EVENTS_KV_KEY = 'events:v1';

function jsonResponse(bodyStr, { status = 200, cacheControl } = {}) {
  const headers = { ...CORS, 'content-type': 'application/json; charset=utf-8' };
  if (cacheControl) headers['cache-control'] = cacheControl;
  return new Response(bodyStr, { status, headers });
}

// Build the events payload once (shared by the request path and the cron job).
async function buildEventsPayload() {
  const events = await buildRawEvents();
  return JSON.stringify({ ts: Date.now(), count: events.length, events });
}

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

    // Per-article frameability check, edge-cached for a day per URL so repeat
    // readers don't re-hit the publisher.
    if (url.pathname === '/api/framecheck') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
      const target = url.searchParams.get('url') || '';
      const cache = caches.default;
      const cacheKey = new Request(new URL(`/api/framecheck?url=${encodeURIComponent(target)}`, url.origin).toString());
      const hit = await cache.match(cacheKey);
      if (hit) return hit;
      const verdict = await frameCheck(target);
      const resp = jsonResponse(JSON.stringify(verdict), {
        cacheControl: 'public, max-age=3600, s-maxage=86400',
      });
      ctx.waitUntil(cache.put(cacheKey, resp.clone()));
      return resp;
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

    // Global tech-events feed. Read order: KV (written daily by the cron) →
    // edge cache → build on demand. KV-first means every visitor gets the same
    // list the cron produced, and the binding is optional so the site keeps
    // working (edge-cache + on-demand build) before the namespace is wired up.
    if (url.pathname === '/api/events') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
      try {
        if (env.EVENTS_KV) {
          const cached = await env.EVENTS_KV.get(EVENTS_KV_KEY);
          if (cached) return jsonResponse(cached, { cacheControl: EVENTS_CACHE_CONTROL });
        }
      } catch { /* KV miss/unavailable → fall through to build */ }

      const cache = caches.default;
      const cacheKey = new Request(new URL('/api/events', url.origin).toString());
      const hit = await cache.match(cacheKey);
      if (hit) return hit;
      try {
        const bodyStr = await buildEventsPayload();
        const resp = jsonResponse(bodyStr, { cacheControl: EVENTS_CACHE_CONTROL });
        ctx.waitUntil(cache.put(cacheKey, resp.clone()));
        if (env.EVENTS_KV) ctx.waitUntil(env.EVENTS_KV.put(EVENTS_KV_KEY, bodyStr, { expirationTtl: 172800 }));
        return resp;
      } catch (e) {
        return jsonResponse(JSON.stringify({ error: String(e?.message || e), events: [] }), { status: 502 });
      }
    }

    // Live subscribable calendar built from the same events. Falls through to the
    // build-time static /events.ics asset when KV hasn't been populated yet.
    if (url.pathname === '/events.ics') {
      try {
        if (env.EVENTS_KV) {
          const cached = await env.EVENTS_KV.get(EVENTS_KV_KEY);
          if (cached) {
            const { events } = JSON.parse(cached);
            if (Array.isArray(events) && events.length) {
              return new Response(calendarText(events), {
                headers: {
                  'content-type': 'text/calendar; charset=utf-8',
                  'cache-control': EVENTS_CACHE_CONTROL,
                  'access-control-allow-origin': '*',
                },
              });
            }
          }
        }
      } catch { /* fall through to the static asset */ }
    }

    // Static assets (the Vite build) + SPA fallback for client-side routes.
    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },

  // Cron Trigger (see wrangler.jsonc `triggers.crons`): rebuild the events feed
  // once a day and store it in KV so the next request serves it instantly. The
  // request path reads KV first, so no cache purge is needed.
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        const bodyStr = await buildEventsPayload();
        if (env.EVENTS_KV) await env.EVENTS_KV.put(EVENTS_KV_KEY, bodyStr, { expirationTtl: 172800 });
      } catch (e) {
        console.error('events cron failed:', e?.message || e);
      }
    })());
  },
};
