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

Set an LLM key in the **build environment** (Cloudflare Pages env / secret) so
the Signal summaries and roundups are original text, not excerpts. The build
already uses this for the AI tools:

- `GEMINI_API_KEY` (default, cheap/fast — `gemini-2.0-flash`), or
- `GROQ_API_KEY`, or `OPENROUTER_API_KEY`.

Optional tuning: `HUB_ARTICLES` (default 15), `MAX_NEW_SUMMARIES` per build
(default 120 — the cost cap; leftover articles get summaries on later builds).

To keep hubs fresh, rebuild on a schedule (the feed is pulled at build time).
**Automated:** `.github/workflows/rebuild-hubs.yml` rebuilds + deploys daily
(06:17 UTC) and can be run manually from the Actions tab. It needs these repo
secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `GEMINI_API_KEY`
(or GROQ/OPENROUTER). It also commits the grown `seo/summary-cache.json` back so
LLM cost stays near zero over time. If you deploy via Cloudflare's git-connected
Workers Builds instead, just add `GEMINI_API_KEY` to that build env and trigger a
scheduled deploy there.

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
