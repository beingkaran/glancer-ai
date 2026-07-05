import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only middleware so POST /api/llm works under `npm run dev`, mirroring the
// Vercel function in production. Reads the key from your local .env (any of
// GEMINI_API_KEY / GROQ_API_KEY / OPENROUTER_API_KEY — see .env.example).
function llmDevApi(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    name: 'llm-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/llm', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'Use POST.' })); return }
        try {
          const { runLLM } = await server.ssrLoadModule('/api/_llmCore.js')
          let raw = ''
          for await (const chunk of req) raw += chunk
          const { system, prompt, temperature } = raw ? JSON.parse(raw) : {}
          const byokKey = req.headers['x-llm-key']
          const { text, provider } = await runLLM({ system, prompt, temperature, env, byokKey })
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ text, provider }))
        } catch (e) {
          res.statusCode = e.status || 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: e.message || 'AI request failed' }))
        }
      })
    },
  }
}

// Dev-only middleware mirroring the production Worker's /api/proxy route, so the
// first-party CORS proxy (used by the live news feed) works under `npm run dev`.
function proxyDevApi() {
  return {
    name: 'proxy-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/proxy', async (req, res) => {
        try {
          const { proxyFetch } = await server.ssrLoadModule('/worker/proxyCore.js')
          const u = new URL(req.originalUrl, 'http://localhost')
          const { status, contentType, body } = await proxyFetch(u.searchParams.get('url'))
          res.statusCode = status
          res.setHeader('content-type', contentType)
          res.setHeader('access-control-allow-origin', '*')
          res.end(Buffer.from(body))
        } catch (e) {
          res.statusCode = 502
          res.end('Upstream fetch failed: ' + (e?.message || e))
        }
      })
    },
  }
}

// Dev-only middleware mirroring the production Worker's /api/news route, so the
// edge news aggregator works under `npm run dev` too (no edge cache in dev — it
// rebuilds each call, which is fine locally).
function newsDevApi() {
  return {
    name: 'news-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/news', async (req, res) => {
        try {
          const { buildRawNews } = await server.ssrLoadModule('/worker/newsCore.js')
          const items = await buildRawNews()
          res.setHeader('content-type', 'application/json')
          res.setHeader('access-control-allow-origin', '*')
          res.end(JSON.stringify({ ts: Date.now(), count: items.length, items }))
        } catch (e) {
          res.statusCode = 502
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: e?.message || 'news build failed', items: [] }))
        }
      })
    },
  }
}

// Dev-only middleware mirroring the production Worker's /api/events route, so
// the global tech-events aggregator works under `npm run dev` too (no KV/cron in
// dev — it rebuilds on each call, which is fine locally).
function eventsDevApi() {
  return {
    name: 'events-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/events', async (req, res) => {
        try {
          const { buildRawEvents } = await server.ssrLoadModule('/worker/eventsCore.js')
          const events = await buildRawEvents()
          res.setHeader('content-type', 'application/json')
          res.setHeader('access-control-allow-origin', '*')
          res.end(JSON.stringify({ ts: Date.now(), count: events.length, events }))
        } catch (e) {
          res.statusCode = 502
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: e?.message || 'events build failed', events: [] }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), llmDevApi(mode), proxyDevApi(), newsDevApi(), eventsDevApi()],
  // Honor a PORT assigned by the harness/preview tooling; fall back to Vite's
  // default when run directly.
  server: { port: Number(process.env.PORT) || 5184 },
}))
