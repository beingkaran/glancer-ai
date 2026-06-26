# Enabling Live AI for the Custom AI Tools

The AI-powered tools (FAQ Generator, Email/Letter writer, Prompt Optimizer,
name & title generators, customer-service scripts) call a real LLM through a
small serverless proxy at **`/api/llm`**. Your API key lives **only on the
server** — it is never exposed to visitors, so people can use the tools for
free without their own key (the SiteGPT model).

Until a key is set, every AI tool automatically falls back to its built-in
offline template, so nothing breaks.

---

## 1. Get a free API key (pick one)

### ⭐ Google Gemini — recommended (best free tier, no credit card)
1. Go to **https://aistudio.google.com/apikey**
2. Sign in with a Google account.
3. Click **Create API key** → copy it.
   Free tier: ~15 requests/min, 1,500 requests/day on `gemini-2.0-flash`.

### Groq — free & extremely fast (Llama 3.3)
1. Go to **https://console.groq.com/keys** → sign in.
2. **Create API Key** → copy it.

### OpenRouter — free `:free` community models
1. Go to **https://openrouter.ai/keys** → sign in.
2. **Create Key** → copy it.

---

## 2. Add the key

### Local development
```bash
cp .env.example .env
# then edit .env and set, e.g.:
# GEMINI_API_KEY=AIza...your-key...
npm run dev
```
The Vite dev server serves `/api/llm` using this key.

### Production — Vercel
Project → **Settings → Environment Variables** → add
`GEMINI_API_KEY` (or `GROQ_API_KEY` / `OPENROUTER_API_KEY`) → **Redeploy**.
The function in `api/llm.js` is deployed automatically.

### Production — Cloudflare Pages
Project → **Settings → Environment variables & secrets** → add the same
variable → redeploy. The function in `functions/api/llm.js` handles it.

That's it — the AI tools light up with live AI the moment a key is present.

---

## Notes
- **Switching provider:** just set a different key var; the proxy auto-detects
  it (Groq → OpenRouter → Gemini). Force one with `LLM_PROVIDER`, change the
  model with `LLM_MODEL`.
- **Bring-your-own-key:** visitors can optionally paste their own key in any AI
  tool ("Use your own API key"). It is stored only in their browser and sent
  per-request — useful if you host the static site without the serverless
  function.
- **Cost control:** all three providers have free tiers. If you expect heavy
  traffic, monitor usage in the provider dashboard and consider rate-limiting
  `/api/llm`.
