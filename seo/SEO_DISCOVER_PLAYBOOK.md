# Glancer AI — SEO & Google Discover Playbook (2026)

**Goal:** get glancerai.com ranking in **Google Discover**.
**Site reality:** React + Vite **client-rendered SPA**, served by a Cloudflare Worker, Supabase-backed blogs, and an aggregated AI-news RSS feed.

This document explains (1) what was blocking Discover, (2) what I changed in the code, (3) the agents now doing the work, and (4) what only you can do next. It avoids generic advice — every item is specific to this codebase and to how Discover behaves in 2026.

---

## 1. Why the site could not appear in Discover (root causes)

| # | Problem found | Why it kills Discover |
|---|---------------|------------------------|
| 1 | **`max-image-preview:large` was missing.** `index.html` had `robots = "index, follow"` only. | This is the single most important Discover tag. Without it Google cannot render the large image card — and the large card drives the bulk of Discover CTR. |
| 2 | **Article pages served an empty `<div id="root">`.** All content (blogs, news) rendered client-side only. | Discover strongly favours content present in the initial HTML. Non-JS crawlers and many AI/social scrapers saw blank pages. |
| 3 | **Sitemap listed only 7 section pages.** No `/blog/:id` URLs at all. | Google can only feature pages it has discovered and indexed. The actual ranking pages were invisible. |
| 4 | **No Article / NewsArticle structured data anywhere.** | Discover uses Article schema (author, date, image, publisher) to classify content and pick the card image. |
| 5 | **Blog pages set no per-page title/description.** `useDocumentMeta` existed but `BlogPostPage` never called it. | Every article shared the homepage title/description — no topical signal. |
| 6 | **News reader (`/news/:id`) is aggregated RSS.** | The **Feb 2026 Discover Core Update** penalizes republished/thin content. Aggregated headlines won't rank and can drag down site quality. |
| 7 | **Banner images are SVG.** | Discover image cards require **raster images ≥1200px wide, 16:9**. SVGs are ignored for the card. |

---

## 2. What I changed in the code (shipped)

All changes are in the connected `glancer-ai` folder. **Run `npm run build` and redeploy for them to take effect.**

- **`index.html`**
  - `robots` now includes `max-image-preview:large, max-snippet:-1, max-video-preview:-1` (fixes #1).
  - Added default `og:image` / `twitter:image`.
  - Added site-wide **Organization + WebSite JSON-LD** graph (publisher identity = an E-E-A-T signal; also enables the sitelinks search box).

- **`scripts/generate-sitemap.mjs`** (new) — generates a complete `public/sitemap.xml` with **all 20 curated posts + 7 sections (27 URLs)**, each with `lastmod` and an image-sitemap entry (fixes #3).

- **`scripts/prerender-blogs.mjs`** (new) — after `vite build`, writes a static **`dist/blog/<id>.html`** for every curated post containing the real headline, byline, image, body **and** Article + Breadcrumb JSON-LD in the `<head>`. Cloudflare serves these directly, so crawlers get a full document; React then boots and replaces `#root` with the live app (fixes #2, #4).

- **`src/lib/structuredData.js`** (new) — builds Article/NewsArticle + BreadcrumbList JSON-LD; used by both the prerender script and the live app.

- **`src/pages/BlogPostPage.jsx`** — now calls `useDocumentMeta` (per-article title/description/canonical/OG) and injects Article + Breadcrumb JSON-LD on client navigation (fixes #4, #5).

- **`package.json`** — `build` is now `generate-sitemap → vite build → prerender-blogs`. (`build:vite` keeps the raw Vite build if you need it.)

> Verified in-sandbox: both scripts run cleanly, the sitemap produces 27 valid URLs, and prerender produces 20 article files each with the correct `<title>` and two JSON-LD blocks. `vite`/`oxlint` themselves can't run in my Linux sandbox because `node_modules` holds Mac-native binaries — run `npm run build` on your machine to confirm end-to-end.

---

## 3. The agents now doing the SEO

### A. On-demand agents (Claude Code subagents)
Definitions are in **`seo/agents/`**. To activate them, copy the folder into `.claude/agents/` (that path is locked in this session, so I couldn't write there directly):

```bash
mkdir -p .claude/agents && cp seo/agents/*.md .claude/agents/
```

Then in Claude Code:
- **`seo-discover-auditor`** — audits the repo or a live URL against the 2026 Discover rubric and returns a P0/P1/P2 fix list.
- **`seo-article-writer`** — researches a topic and writes an **original** Discover-optimized article straight into `src/data/allBlogs.js`, then regenerates the sitemap.
- **`seo-schema-sitemap`** — validates/repairs JSON-LD and the sitemap after content changes.

### B. Recurring agents (scheduled, run automatically in Cowork)
- **`glancer-discover-readiness-daily`** — every day 7:00 AM: checks for Discover regressions, verifies the sitemap, and proposes 2–3 timely original article ideas from the day's AI news.
- **`glancer-content-gap-weekly`** — Mondays 8:30 AM: content-gap + keyword analysis (uses your Ahrefs/Semrush exports if present in the folder), internal-linking suggestions, and refresh candidates.

Manage or "Run now" both from the **Scheduled** section in the sidebar. Tip: run each once manually to pre-approve its tools so future runs don't pause on permission prompts.

---

## 4. What only you can do (highest-leverage, in order)

1. **Replace SVG banners with 1200×675 raster images (JPG/WebP).** This is now the #1 remaining Discover blocker. Put them in `public/blog-banners/` and point each post's `bannerImage` at the raster file. Without this, pages can be *eligible* for Discover but won't get the big image card.
2. **Verify the property in Google Search Console** and submit `https://glancerai.com/sitemap.xml`. Watch the **Discover** report (it appears once you get Discover impressions) and the Page Indexing report. There is no other way to confirm Discover entry.
3. **Decide the news strategy.** Aggregated `/news/:id` pages won't rank and risk quality. Either (a) add a `rel=canonical` to the original source on those pages, or (b) convert the most important stories into **original** write-ups via `seo-article-writer`. Originality is the core of the Feb 2026 update.
4. **Publish original content consistently.** Discover favours fresh, timely, original pieces with strong visuals and clear (non-clickbait) headlines. The daily agent feeds you ideas; the writer agent drafts them.
5. **Fix the placeholder AdSense ID** (`ca-pub-0000…` in `index.html`) before relying on monetization — not an SEO blocker, but it's live in the markup.
6. **Strengthen E-E-A-T:** real author bio pages, an About page that establishes expertise, and consistent `author` values that map to a Person/Organization in schema.

### Realistic expectation on Discover
Discover is not keyword-driven and you can't "rank" for it on demand. Eligibility = indexed + policy-compliant + great mobile UX + strong image + original content. With the technical blockers now removed, the path is: **raster banners → consistent original publishing → GSC monitoring.** Entry typically follows a few weeks of fresh, original, well-imaged posts being indexed.

---

## Quick reference — commands
```bash
npm run build          # generate sitemap → vite build → prerender blog pages
node scripts/generate-sitemap.mjs   # refresh sitemap only
```
Sources for the 2026 Discover rules used here are listed in the chat message that accompanied this playbook.
