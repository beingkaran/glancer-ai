# ObservaPedia 📡

A free, searchable glossary of **AIOps, Observability & Application Performance Monitoring (APM)** terms — built as a fast, beautiful, multi-page static website with a dynamic, typo-tolerant search engine.

> Inspired by the clean reference style of sites like GeeksforGeeks, and grounded in terminology used across **Datadog, Dynatrace, New Relic, Splunk, AppDynamics and Broadcom (DX) APM**.

---

## ✨ Features

- **1,000+ curated terms** across **27 categories** spanning core observability plus the adjacent domains practitioners actually use: Cloud Native, Containers, Kubernetes, Service Mesh, DevOps & CI/CD, Networking, Databases, Data & Streaming, Security & SIEM, Cloud Providers, Distributed Systems, Architecture, Compute & Runtime, IT Operations and Data Formats.
- **Dynamic search** on the home page — ranked, typo-tolerant ("did you mean?"), with live autocomplete and keyboard navigation. Returns a full definition card the instant you search.
- **User comments stored in a local database** — each term has a "Community Notes" section. Comments are saved privately in the browser via **IndexedDB** (with a localStorage fallback) and never leave the device.
- **Related-term linking** — every definition links to connected concepts you can click through.
- **A–Z Glossary page** with instant filtering, a 27-category dropdown, alphabet jump-nav, search highlighting and per-card community notes.
- **Data-driven category pages** — the home and Categories grids and the glossary filter are generated from the data, so they stay in sync automatically as you add terms.
- **Light / dark theme** with system-preference detection and a saved toggle.
- **Fully responsive** and accessible; no build step, no dependencies, no framework.
- **SEO + AdSense ready** — semantic HTML, meta tags, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`, `ads.txt`, plus About / Contact / Privacy / Terms / Disclaimer pages.

> **A note on the term count.** Genuine, pure-observability glossaries (Honeycomb, Splunk, Datadog, etc.) each contain only ~50–300 terms — there is no pool of 1,500 distinct observability-only terms. To reach 1,000+ credibly, the glossary deliberately broadens into the adjacent cloud-native, SRE/DevOps, networking, data and security domains, with every definition rewritten in plain English rather than copied.

## 📁 Project structure

```
observapedia/
├── index.html          # Home + dynamic search + comments
├── glossary.html       # A–Z browsable glossary + per-card comments
├── categories.html     # Category overview (data-driven)
├── about.html          # About (AdSense requirement)
├── contact.html        # Contact form (mailto-based)
├── privacy.html        # Privacy Policy (AdSense requirement)
├── terms.html          # Terms of Use
├── disclaimer.html     # Disclaimer
├── robots.txt
├── sitemap.xml
├── ads.txt
└── assets/
    ├── css/style.css   # All styling + theming (incl. comments UI)
    └── js/
        ├── data.js                  # Core observability/APM/AIOps terms
        ├── data-cloudnative.js      # Cloud Native, Containers, Service Mesh, GitOps
        ├── data-kubernetes.js       # Kubernetes objects & concepts
        ├── data-devops.js           # DevOps, CI/CD, deployment strategies
        ├── data-networking.js       # DNS, CDN, load balancing, protocols
        ├── data-databases.js        # Databases, storage, data & streaming
        ├── data-security.js         # Security, SIEM, SOAR, threat detection
        ├── data-cloud.js            # Cloud computing & provider services
        ├── data-distributed.js      # Distributed systems & architecture
        ├── data-observability-ext.js  # Prometheus/Grafana stack, web vitals, AI obs
        ├── data-compute.js          # Compute, runtime, OS & performance
        ├── data-itops.js            # ITSM/ITIL & IT operations
        ├── data-observability-more.js # Deeper metrics/logs/traces/RUM/APM/AIOps
        ├── data-general.js          # Web, data formats, general computing
        ├── data-extra.js            # Vendor platforms, cloud services, data eng, AI/ML
        ├── data-supplement.js       # Fills common references, rounds out coverage
        ├── comments.js              # IndexedDB-backed comments (local DB)
        └── app.js                   # Search engine, glossary, categories, theme
```

All `data*.js` files append to one global `window.OBSERVA_TERMS` array using a load-order-safe `concat` pattern, so order doesn't matter and you can add or split files freely.

## 💬 Comments & the local database

Each term shows a **Community Notes** section where visitors can post comments. These are stored **locally in the visitor's own browser**:

- Primary store: **IndexedDB** — the correct browser-native database for structured, indexed, potentially large records. A `comments` object store keyed by an auto-increment `id`, indexed by `termKey` for fast per-term lookup.
- Fallback: **localStorage** (used automatically if IndexedDB is unavailable, e.g. some private-mode browsers).
- Comments are **never uploaded or shared** — they are private to each device. To make comments global/shared, point `comments.js` at a backend (e.g. Firebase, Supabase, or your own API) instead of IndexedDB.

The comments API lives in `assets/js/comments.js`: `Comments.add(term, name, text)`, `Comments.list(term)`, `Comments.remove(id, term)`, `Comments.count(term)` and `Comments.mount(container, term)`.

## 🚀 Run it locally

It's a static site — just open `index.html` in a browser. Search works from `file://` because data loads via `<script>` tags (no fetch).

For a local server (nicer URLs):

```bash
cd observapedia
python3 -m http.server 8765
# visit http://localhost:8765
```

## ➕ Add or edit a term

Open `assets/js/data.js` (or any `data-*.js` file — or create a new one and add a `<script>` tag for it) and add an object to the `concat([ ... ])` list:

```js
{
  term: "Your Term",
  abbr: "ABC",                 // optional
  category: "AIOps",           // use an existing category for consistency
  definition: "Plain-English explanation…",
  related: ["Related Term A", "Related Term B"],   // optional
  vendors: ["Datadog", "Splunk"]                   // optional
}
```

Counts, search, glossary grouping and category pages update automatically.

## 💰 Enabling Google AdSense (after approval)

The site is structured to meet AdSense's content/policy expectations (original content, clear navigation, privacy policy, about & contact pages). To activate ads:

1. **Apply** at [adsense.google.com](https://adsense.google.com) and add your domain.
2. **Add the loader** to the `<head>` of every page. In `index.html` there is a commented block — uncomment it and replace `ca-pub-XXXXXXXXXXXXXXXX` with your real Publisher ID. Copy the same `<script>` into the other pages' `<head>`.
3. **Update `ads.txt`** at the site root: replace `pub-0000000000000000` with your Publisher ID.
4. **Place ad units** in the `<div class="ad-slot">` containers already positioned on the home and glossary pages (drop your AdSense `<ins class="adsbygoogle">` snippet inside, and add the `filled` class to remove the "Advertisement" placeholder label).
5. Update the domain in `sitemap.xml`, `robots.txt` and the `<link rel="canonical">` tags from `observapedia.com` to your real domain.

> **Tip for approval:** publish on a real custom domain, submit your sitemap in Google Search Console, and keep adding terms/articles. Thin or duplicate content is the most common rejection reason — this glossary's original definitions help, but more long-form pages improve your odds.

## 🚢 Deploy

Drop the `observapedia/` folder on any static host:

- **GitHub Pages** — push the folder to a repo, enable Pages.
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop or connect the repo (no build command needed; output dir is the folder itself).

## ⚖️ Notes

ObservaPedia is an independent educational project and is **not affiliated with or endorsed by** any monitoring vendor. Product names are trademarks of their respective owners, referenced for identification and education only.

## 📝 Contact form

The contact form is client-side (opens the user's mail app via `mailto:`). For a hosted form, wire it to [Formspree](https://formspree.io), Netlify Forms, or your own endpoint — see the comment in `contact.html`.
