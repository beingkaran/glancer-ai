# Glancer AI — SEO Growth Playbook (implementation status)

This maps the SEO consultant's blueprint to what's now **shipped in code** vs.
what's **manual / operational** (the parts I can't do from the repo).

---

## ✅ Shipped in this change

### 1. Defeat "thin content"
- **"The Signal" summaries** — every article on a topic hub carries an original
  50–90 word LLM takeaway explaining *why it matters* (not a copied meta
  description). Generated at **build time**, cached in `seo/summary-cache.json`
  so each article is summarised **once ever** (bounded cost).
  - Requires an LLM key in the build env (see **Config** below). Without one,
    hubs fall back to the article excerpt.
- **Weekly Synthesis posts** — `npm run roundup` drafts a "The Signal: Top N AI
  Stories of the Week" pillar post (original prose, links out to sources) into
  `seo/drafts/`. Review → paste into `src/data/allBlogs.js` → it's prerendered
  with NewsArticle schema automatically. **Never auto-published.**

### 2. Programmatic SEO (pSEO) clusters
- **Dynamic entity hubs** at `/topic/<slug>` for 14 seeded entities (OpenAI,
  Anthropic, Google/Gemini, Meta, Microsoft, NVIDIA, Mistral, AI agents, image
  generation, coding assistants, RAG, AIOps, observability, APM).
  - Add a new hub = one object in `src/data/topics.js`.
  - **Prerendered** to static `dist/topic/<slug>.html` (crawlers/Discover see
    full text + schema without JS); the live React route shows the freshest feed
    to humans.
- **Hub index** at `/topics`, linked from the navbar and footer for crawl
  discovery.

### 3. Technical foundation
- **ItemList JSON-LD** on every hub + the `/topics` index; **BreadcrumbList** on
  each; **NewsArticle** schema on weekly roundups (via existing prerender).
  Helpers: `buildItemListSchema`, `buildNewsArticleSchema` in
  `src/lib/structuredData.js`.
- **Sitemap** now includes `/topics` + all `/topic/<slug>` URLs
  (`scripts/generate-sitemap.mjs`).
- **robots.txt** hardened: correctly blocks the real admin route
  (`/_glancer-admin`), auth/account pages, and all `?`-query permutations
  (crawl-budget hygiene). Canonicals were already per-route via
  `useDocumentMeta`.

### 5. Retention loop
- **Prominent inline email capture** (`NewsletterInline`) — "Get the signal,
  skip the fluff" — on every topic hub. Reuses `subscribeNewsletter`
  (`source` now tags where each signup came from).

---

## 🔧 Config needed for full effect

Deploy model: **Cloudflare git-connected Workers Builds** — Cloudflare runs
`npm run build` on every deploy, which is where the Signal summaries are baked.

The LLM key must be set in **TWO** places (they're different scopes):
- **Cloudflare _build_ environment** → so `npm run build` can generate the hub
  Signal summaries. ← the one that matters for SEO.
- **Cloudflare _runtime_ secret** (Worker binding) → so `/api/llm` powers the
  live AI tools.

Keys (checked in this order): `GEMINI_API_KEY` (default, `gemini-2.0-flash`),
`GROQ_API_KEY`, `OPENROUTER_API_KEY`. Without a build-time key, hubs fall back to
article excerpts (still non-thin, just not original analysis).

Optional tuning (build env vars): `HUB_ARTICLES` (default 15),
`MAX_NEW_SUMMARIES` per build (default 120 — cost cap).

**Daily freshness:** `.github/workflows/rebuild-hubs.yml` fires a Cloudflare
**Deploy Hook** daily (06:17 UTC) + on-demand from the Actions tab. One-time
setup: create a Deploy Hook in the Cloudflare project (Settings → Builds →
Deploy hooks) and store its URL as the GitHub secret
`CLOUDFLARE_DEPLOY_HOOK_URL`.

> Caching note: `seo/summary-cache.json` makes each article "summarised once
> ever" for **local** builds. Cloudflare's build sandbox is ephemeral and can't
> commit the grown cache back to git, so scheduled Cloudflare builds re-generate
> summaries each run (capped at `MAX_NEW_SUMMARIES`, Gemini-flash-cheap). If that
> cost ever matters, move the cache to Cloudflare KV — a small follow-up.

---

## ⛔ Manual / operational (not code — over to you)

### 4. Off-page growth & backlinks
- [ ] Submit Glancer AI to AI directories: **There's An AI For That**,
      **Product Hunt**, **Toolify**, **AIcyclopedia**, **Futurepedia**,
      **Future Tools**. (Easy high-authority backlinks.)
- [ ] "Featured On" loop: when a hub/roundup curates an indie dev's tool or
      post, tag them on X/LinkedIn so they reshare.
- [ ] Google Search Console: submit `sitemap.xml`, request indexing for
      `/topics` + the strongest hubs, watch the Discover report.
- [ ] Bing Webmaster Tools: submit the sitemap too.

### Content cadence
- [ ] Run `npm run roundup` weekly; edit the draft; publish.
- [ ] Periodically add high-intent hubs to `src/data/topics.js` as new entities
      trend (e.g. a hot new model or tool).

### Measurement
- [ ] Track hub impressions/clicks in Search Console by `/topic/` path.
- [ ] Track newsletter conversions by `source` in Supabase
      (`newsletter_subscribers.source`).
