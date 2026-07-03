#!/usr/bin/env node
/*
 * prerender-static-pages.mjs — bake crawlable HTML for key routes SEO tools audit.
 * Targets 600+ words on home, full FAQ text, glossary sample, events, tools, etc.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://glancerai.com';
const DIST = resolve(__dirname, '../dist');

const { BLOG_POSTS } = await import('../src/data/allBlogs.js');
const { FAQS, AI_NEWS_FAQS } = await import('../src/data/faqContent.js');
const { HOME_EDITORIAL, TOPIC_GUIDES } = await import('../src/data/seoGuides.js');
const { TOPICS } = await import('../src/data/topics.js');
const { TECH_EVENTS } = await import('../src/data/techEvents.js');
const { GLOSSARY_TERMS } = await import('../src/data/allGlossary.js');
const { EXTRA_GLOSSARY_TERMS } = await import('../src/data/extraGlossary.js');
const { EXTRA_GLOSSARY_BATCH4 } = await import('../src/data/extraGlossaryBatch4.js');
const { FEATURED_TERMS } = await import('../src/data/glossaryMeta.js');
const { AI_TOOLS } = await import('../src/data/aiTools.js');

/** Lightweight catalog for prerender — customTools.js pulls browser-only engines. */
const BROWSER_TOOLS = [
  { name: 'Word to PDF Converter', category: 'PDF & Word', blurb: 'Convert .docx to PDF in your browser without uploading to a server.' },
  { name: 'PDF to Word Converter', category: 'PDF & Word', blurb: 'Extract text from PDFs into an editable Word-compatible document locally.' },
  { name: 'Sitemap Finder & Checker', category: 'Sitemap & SEO', blurb: 'Discover and validate XML sitemaps on any website.' },
  { name: 'Sitemap Validator', category: 'Sitemap & SEO', blurb: 'Check sitemap XML for errors, broken URLs and policy issues.' },
  { name: 'XML Sitemap Generator', category: 'Sitemap & SEO', blurb: 'Build a standards-compliant sitemap from a list of URLs.' },
  { name: 'Robots.txt Generator', category: 'Sitemap & SEO', blurb: 'Generate robots.txt rules for crawlers and AI bots.' },
  { name: 'CSV to Markdown', category: 'Convert to Markdown', blurb: 'Turn spreadsheet exports into clean Markdown tables.' },
  { name: 'JSON to Markdown', category: 'Convert to Markdown', blurb: 'Convert JSON arrays and objects into readable Markdown.' },
  { name: 'HTML to Markdown', category: 'Convert to Markdown', blurb: 'Strip HTML pages down to portable Markdown text.' },
  { name: 'Blog Title Generator', category: 'Generators', blurb: 'Brainstorm SEO-friendly blog headlines from a topic seed.' },
  { name: 'Chatbot ROI Calculator', category: 'Calculators', blurb: 'Estimate savings from automating support with an AI chatbot.' },
  { name: 'AI Prompt Optimizer', category: 'AI Prompts', blurb: 'Refine rough prompts into structured instructions for LLMs.' },
  { name: 'FAQ Generator', category: 'Writing', blurb: 'Draft FAQ sections from product notes or documentation.' },
  { name: 'Email Response Generator', category: 'Writing', blurb: 'Compose professional email replies from bullet points.' },
];

let shell;
try {
  shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');
} catch {
  console.error('✗ dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

const esc = (s) =>
  String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

function mergeGlossary() {
  const seen = new Set();
  const out = [];
  for (const t of [...GLOSSARY_TERMS, ...EXTRA_GLOSSARY_TERMS, ...EXTRA_GLOSSARY_BATCH4]) {
    const k = (t.term || '').trim().toLowerCase();
    if (k && !seen.has(k)) { seen.add(k); out.push(t); }
  }
  return out;
}

const GLOSSARY = mergeGlossary();

function blogListHtml(posts, heading) {
  const items = posts
    .map(
      (p) =>
        `<li><a href="/blog/${esc(p.id)}">${esc(p.title)}</a>${p.subtitle ? ` — <span>${esc(p.subtitle.slice(0, 140))}</span>` : ''}</li>`,
    )
    .join('\n');
  return `<h2>${heading}</h2><ul>${items}</ul>`;
}

function faqSectionHtml(faqs, heading) {
  const blocks = faqs
    .map((f) => {
      const list = f.items
        ? `<ul>${f.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
        : '';
      return `<section><h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>${list}</section>`;
    })
    .join('\n');
  return `<h2>${heading}</h2>${blocks}`;
}

function homeBody() {
  const paras = HOME_EDITORIAL.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n');
  const featured = BLOG_POSTS.filter((p) => p.featured);
  const comparisons = BLOG_POSTS.filter((p) => (p.tags || []).some((t) => /datadog|new relic|splunk|apm/i.test(t)) || /vs|comparison/i.test(p.title));
  const topicLinks = TOPICS.map(
    (t) => `<li><a href="/topic/${esc(t.slug)}">${esc(t.title)}</a> — ${esc(t.tagline)}</li>`,
  ).join('\n');
  return `
    ${paras}
    ${blogListHtml(featured.length ? featured : BLOG_POSTS.slice(0, 8), 'Featured Deep Dives')}
    ${blogListHtml(comparisons.length ? comparisons : BLOG_POSTS.slice(8, 16), 'APM &amp; observability comparisons')}
    ${blogListHtml(BLOG_POSTS, 'All Deep Dive articles')}
    <h2>Topic news hubs</h2>
    <p>Continuously refreshed feeds for AI labs, agentic AI, observability, AIOps, and APM — each with an editorial guide and original Signal takeaways.</p>
    <ul>${topicLinks}</ul>
    <p><a href="/glossary">Glossary</a> · <a href="/events">Events</a> · <a href="/ai-tools">Free AI Tools</a> · <a href="/privacy">Privacy Policy</a></p>
  `;
}

function glossaryBody() {
  const featured = FEATURED_TERMS.map((name) => GLOSSARY.find((t) => t.term === name)).filter(Boolean);
  const sample = [...featured, ...GLOSSARY.filter((t) => !FEATURED_TERMS.includes(t.term)).slice(0, 40)];
  const terms = sample
    .map(
      (t) =>
        `<article style="margin-bottom:18px"><h2>${esc(t.term)}</h2><p><strong>${esc(t.category)}</strong> — ${esc(t.definition)}</p></article>`,
    )
    .join('\n');
  return `
    <p>Searchable definitions for ${GLOSSARY.length.toLocaleString()}+ terms across AI/ML, AIOps, observability, Kubernetes, DevOps, tracing, metrics, and platform engineering — with an interactive category map.</p>
    <p>Sample definitions (${sample.length} of ${GLOSSARY.length.toLocaleString()}):</p>
    ${terms}
    <p><a href="/">Back to Glancer AI home</a></p>
  `;
}

function eventsBody() {
  const cards = TECH_EVENTS.map(
    (e) =>
      `<article style="margin-bottom:16px"><h2>${esc(e.name)}</h2><p>${esc(e.start)}${e.end ? ` – ${esc(e.end)}` : ''} · ${esc(e.city)}, ${esc(e.country)} · ${esc(e.format)}</p><p>${esc(e.blurb)}</p><p><a href="${esc(e.url)}" rel="noopener">Official site</a></p></article>`,
  ).join('\n');
  return `
    <p>Curated calendar of major AI, observability, cloud-native, and SRE conferences — KubeCon, ObservabilityCON, SREcon, NVIDIA GTC, AWS re:Invent, and more. Dates verified against official pages; always confirm on the organizer site before booking travel.</p>
    ${cards}
  `;
}

function toolsBody() {
  const ai = AI_TOOLS.map(
    (t) => `<li><strong>${esc(t.name)}</strong> — ${esc(t.blurb)} <em>(${esc(t.category)})</em></li>`,
  ).join('\n');
  const custom = BROWSER_TOOLS.map(
    (t) => `<li><strong>${esc(t.name)}</strong> — ${esc(t.blurb)} <em>(${esc(t.category)})</em></li>`,
  ).join('\n');
  return `
    <p>Free in-browser AI and SEO utilities — no sign-up, no server upload. Humanizers, detectors, token counters, sitemap validators, Markdown converters, prompt generators, and more run locally in your browser.</p>
    <h2>AI utilities</h2><ul>${ai}</ul>
    <h2>SEO &amp; document tools</h2><ul>${custom}</ul>
    <p><a href="/glossary">Glossary</a> · <a href="/faq">FAQ</a></p>
  `;
}

function topicsIndexBody() {
  const links = TOPICS.map((t) => {
    const guide = TOPIC_GUIDES[t.slug];
    return `<li style="margin-bottom:20px"><a href="/topic/${esc(t.slug)}"><strong>${esc(t.title)}</strong></a><br><span>${esc(t.tagline)}</span>${guide ? `<p style="margin:8px 0 0;line-height:1.6">${esc(guide.slice(0, 280))}…</p>` : ''}</li>`;
  }).join('\n');
  return `
    <p>Programmatic news hubs for the companies and technologies shaping AI and observability. Each hub includes an editorial guide, filtered headlines, and original Signal takeaways — refreshed on every build.</p>
    <ul style="list-style:none;padding:0">${links}</ul>
  `;
}

const PAGES = [
  {
    path: '/',
    out: 'index.html',
    title: 'AI News Today — Latest AI News & Breakthroughs | Glancer AI',
    description:
      'Practitioner-grade AIOps and observability intelligence — in-depth APM comparisons, OpenTelemetry guides, 2,200-term glossary, and live AI news.',
    h1: 'Observability intelligence, without the vendor spin',
    body: homeBody(),
  },
  {
    path: '/privacy',
    out: 'privacy.html',
    title: 'Privacy Policy | Glancer AI',
    description: 'How Glancer AI collects, uses, and protects your data — Google AdSense, cookies, GDPR and CCPA rights.',
    h1: 'Privacy Policy',
    body: `<p><a href="/">Glancer AI</a> privacy policy covering account data, cookies, Google AdSense (ca-pub-9454848033838064), analytics, and your rights. <a href="/privacy">View the full interactive policy</a> in the app for complete details.</p>`,
  },
  {
    path: '/glossary',
    out: 'glossary.html',
    title: `AI, AIOps & Observability Glossary — ${GLOSSARY.length.toLocaleString()}+ Terms`,
    description: `Free glossary of ${GLOSSARY.length.toLocaleString()}+ AI, AIOps, observability and DevOps terms with definitions and category map.`,
    h1: 'AI, AIOps & Observability Glossary',
    body: glossaryBody(),
  },
  {
    path: '/events',
    out: 'events.html',
    title: 'Upcoming Major Tech Events | Glancer AI',
    description: 'AI, observability, Kubernetes and SRE conference calendar — KubeCon, ObservabilityCON, re:Invent, GTC and more.',
    h1: 'Upcoming Major Tech Events',
    body: eventsBody(),
  },
  {
    path: '/ai-tools',
    out: 'ai-tools.html',
    title: 'Free AI Tools — No Sign-Up | Glancer AI',
    description: '25+ free in-browser AI and SEO tools — humanizer, detector, sitemap validator, Markdown converters, prompt generators.',
    h1: 'Free AI Tools',
    body: toolsBody(),
  },
  {
    path: '/metrics',
    out: 'metrics.html',
    title: 'AI Industry Metrics & Benchmarks | Glancer AI',
    description: 'Interactive charts tracking AI funding, model benchmarks, adoption, latency, and ecosystem metrics with cited sources.',
    h1: 'AI Industry Metrics',
    body: `
      <p>Glancer AI tracks the numbers that matter in the artificial intelligence ecosystem — venture funding into AI startups, the count of foundation models on public leaderboards, SWE-bench scores for coding models, Fortune 500 adoption rates, aggregate AI market capitalisation, daily ChatGPT user estimates, median LLM API latency, and uptime across major model providers.</p>
      <p>Each metric links to its primary source (CB Insights, Stanford HAI, SWE-bench, McKinsey, Bloomberg Intelligence, Similarweb, Artificial Analysis, and official status pages) so you can verify figures and drill into methodology. Charts update with modest synthetic movement for demonstration; always cite the upstream source for published work.</p>
      <p>Pair this dashboard with our <a href="/">live news feed</a>, <a href="/blog/datadog-vs-newrelic-vs-splunk-2026">APM comparisons</a>, and <a href="/glossary">glossary</a> for qualitative context behind the numbers.</p>
    `,
  },
  {
    path: '/faq',
    out: 'faq.html',
    title: 'AI News FAQ | Glancer AI',
    description: 'FAQ: AI news, generative AI, agents, LLMs, AIOps, observability, free tools, and how Glancer AI works.',
    h1: 'AI News — Frequently Asked Questions',
    body: `${faqSectionHtml(AI_NEWS_FAQS, 'AI News & Artificial Intelligence')}${faqSectionHtml(FAQS, 'About Glancer AI')}`,
  },
  {
    path: '/about',
    out: 'about.html',
    title: 'About Glancer AI',
    description: 'Why Glancer AI exists — practitioner-grade observability intelligence without vendor spin.',
    h1: 'Built to Make Sense of AI',
    body: `
      <p>Glancer AI began as a searchable glossary for AIOps, observability, and APM terminology and evolved into an intelligence desk for engineers: vendor comparisons, OpenTelemetry guides, live news from 100+ feeds, topic hubs, metrics, events, and free browser-based tools.</p>
      <p>Everything is written and maintained by <strong>Karan Shah</strong>, an engineer — not a marketing team. We prioritise clarity, primary sources, and production relevance over hype cycles.</p>
      <p><a href="/blog/datadog-vs-newrelic-vs-splunk-2026">Read our APM shootouts</a> · <a href="/glossary">Browse the glossary</a> · <a href="/topics">Explore topic hubs</a> · <a href="mailto:karan.igniite@gmail.com">Contact</a></p>
    `,
  },
  {
    path: '/terms',
    out: 'terms.html',
    title: 'Terms of Use | Glancer AI',
    description: 'Terms governing use of Glancer AI.',
    h1: 'Terms of Use',
    body: `<p>By using Glancer AI you agree to our terms and <a href="/privacy">Privacy Policy</a>. Do not abuse the service, scrape excessively, or post unlawful content. News headlines link to original publishers. Contact <a href="mailto:karan.igniite@gmail.com">karan.igniite@gmail.com</a>.</p>`,
  },
  {
    path: '/topics',
    out: 'topics.html',
    title: 'AI Topics — News Hubs by Company & Technology | Glancer AI',
    description: 'Curated AI news hubs — OpenAI, Anthropic, Gemini, AI agents, observability, AIOps, APM and more.',
    h1: 'AI News by Topic',
    body: topicsIndexBody(),
  },
];

function bakePage({ path, out, title, description, h1, body }) {
  const url = ORIGIN + (path === '/' ? '/' : path);
  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);

  const prerendered = `<main style="max-width:820px;margin:0 auto;padding:calc(var(--navbar-h,56px) + 48px) 20px 80px">
      <h1 style="font-family:Georgia,serif;font-size:2.2rem;line-height:1.2;font-weight:700;margin-bottom:20px">${esc(h1)}</h1>
      <div style="font-size:1rem;line-height:1.7;color:#475569">${body}</div>
    </main>`;

  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${prerendered}</div>`);
  writeFileSync(resolve(DIST, out), html, 'utf8');
}

for (const page of PAGES) bakePage(page);

const counts = PAGES.map((p) => {
  const html = readFileSync(resolve(DIST, p.out), 'utf8');
  const root = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/)?.[1] || '';
  const words = root.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  return `${words}w ${p.path}`;
});
console.log(`✓ prerendered ${PAGES.length} static pages → dist/*.html\n  ${counts.join('\n  ')}`);