/*
 * Cloudflare Worker entry. Runs in front of the static Vite build:
 *   - GET /api/proxy?url=…  → first-party CORS proxy (see proxyCore.js)
 *   - everything else       → served from ./dist via the ASSETS binding,
 *                             with SPA fallback (configured in wrangler.jsonc)
 */
import { proxyFetch } from './proxyCore.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export default {
  async fetch(request, env) {
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

    // Static assets (the Vite build) + SPA fallback for client-side routes.
    return env.ASSETS.fetch(request);
  },
};
