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

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), llmDevApi(mode)],
  // Honor a PORT assigned by the harness/preview tooling; fall back to Vite's
  // default when run directly.
  server: { port: Number(process.env.PORT) || 5173 },
}))
