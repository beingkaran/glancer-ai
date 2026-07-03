#!/usr/bin/env node
/*
 * generate-topic-hubs.mjs — prerender the programmatic SEO topic hubs.
 *
 * Runs AFTER `vite build`. For every entry in src/data/topics.js it:
 *   1. pulls the current live AI-news feed (worker/newsCore buildRawNews),
 *   2. filters it into that topic (src/data/topics articlesForTopic),
 *   3. writes an original 50–90 word "Signal" takeaway for each article via the
 *      configured LLM (Gemini by default) — cached in seo/summary-cache.json so
 *      each article is summarised ONCE EVER (bounded cost across builds), and
 *   4. bakes a static dist/topic/<slug>.html with that unique text + ItemList /
 *      BreadcrumbList JSON-LD, so crawlers and Google Discover see real,
 *      non-thin content without running JS.
 *
 * It also writes dist/topics.html (the hub index) and dist/topic-signals.json
 * (url → Signal map) so the live React hub can show the same takeaways to users.
 *
 * Cloudflare's static-asset handler serves /topic/<slug> from
 * /topic/<slug>.html (same mechanism prerender-blogs.mjs relies on for blogs).
 * When the React bundle boots it takes over with the freshest live feed.
 *
 * Degrades gracefully: no network → no items → it skips (build still succeeds,
 * the live SPA route still works). No LLM key → hubs are built with the article
 * excerpt as the takeaway instead of an LLM Signal line.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://glancerai.com';
const DIST = resolve(__dirname, '../dist');
const CACHE_PATH = resolve(__dirname, '../seo/summary-cache.json');

const ARTICLES_PER_HUB = Number(process.env.HUB_ARTICLES || 15);
const MAX_NEW_SUMMARIES = Number(process.env.MAX_NEW_SUMMARIES || 120); // per build, cost cap
const CACHE_MAX = 3000; // keep the cache file from growing unbounded

const { TOPICS, articlesForTopic } = await import('../src/data/topics.js');
const { guideForTopic } = await import('../src/data/seoGuides.js');
const { buildRawNews } = await import('../worker/newsCore.js');
const { buildItemListSchema, buildBreadcrumb, schemaToJson } = await import('../src/lib/structuredData.js');

// ---- shell -----------------------------------------------------------------
let shell;
try {
  shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');
} catch {
  console.error('✗ dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

const esc = (s) =>
  String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

function plain(s, max = 300) {
  const t = String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

// ---- summary cache ---------------------------------------------------------
let cache = {};
try { cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8')); } catch { cache = {}; }

// ---- LLM (Gemini / Groq / OpenRouter) --------------------------------------
const DEFAULT_MODELS = {
  gemini: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'meta-llama/llama-3.3-70b-instruct:free',
};
function llmProvider() {
  if (process.env.LLM_PROVIDER) return process.env.LLM_PROVIDER;
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENROUTER_API_KEY) return 'openrouter';
  return null;
}
const PROVIDER = llmProvider();
const MODEL = process.env.LLM_MODEL || (PROVIDER && DEFAULT_MODELS[PROVIDER]);

const SYSTEM =
  'You are the editor of Glancer AI, an AI-news aggregator whose entire promise is ' +
  'cutting through the noise and delivering only the signal. You write tight, original ' +
  'analysis — never marketing fluff, never restating the headline.';

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: SYSTEM }] },
    generationConfig: { temperature: 0.6, maxOutputTokens: 160 },
  };
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json();
  if (!res.ok) throw new Error(j?.error?.message || `Gemini ${res.status}`);
  return (j.candidates?.[0]?.content?.parts || []).map((p) => p.text).join('').trim();
}

async function callOpenAICompat(base, key, prompt) {
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }],
      temperature: 0.6, max_tokens: 160,
    }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(j?.error?.message || `LLM ${res.status}`);
  return (j.choices?.[0]?.message?.content || '').trim();
}

async function generateSignal(article, topic) {
  const prompt =
    `Topic hub: ${topic.title}.\n` +
    `Headline: ${article.title}\n` +
    `Source: ${article._source || 'unknown'}\n` +
    `Snippet: ${plain(article.description, 400) || '(none)'}\n\n` +
    'Write a 50–90 word original takeaway explaining WHY this update actually matters for ' +
    'developers and technical teams. Do not copy or paraphrase the snippet sentence-by-sentence; ' +
    'add perspective (impact, what changes, who should care). Plain prose, no preamble, no headline, ' +
    'no markdown, no bullet points, no quotes.';
  let text;
  if (PROVIDER === 'gemini') text = await callGemini(prompt);
  else if (PROVIDER === 'groq') text = await callOpenAICompat('https://api.groq.com/openai/v1', process.env.GROQ_API_KEY, prompt);
  else if (PROVIDER === 'openrouter') text = await callOpenAICompat('https://openrouter.ai/api/v1', process.env.OPENROUTER_API_KEY, prompt);
  text = (text || '').replace(/\s+/g, ' ').trim();
  return text || null;
}

// ---- gather feed + per-topic selections ------------------------------------
console.log('· fetching live feed for topic hubs…');
let items = [];
try {
  items = await buildRawNews({ perFeedTimeout: 7000, maxFeeds: 45 });
} catch (e) {
  console.warn('⚠ feed fetch failed:', e.message);
}
if (!items.length) {
  console.warn('⚠ no news items available — skipping topic-hub prerender (live SPA routes still work).');
  process.exit(0);
}
console.log(`· ${items.length} raw items fetched`);

// De-dupe by link so the same story doesn't repeat within a hub.
const seenLink = new Set();
items = items.filter((it) => {
  if (!it.link || seenLink.has(it.link)) return false;
  seenLink.add(it.link);
  return true;
});

const selections = TOPICS.map((topic) => ({
  topic,
  articles: articlesForTopic(items, topic, ARTICLES_PER_HUB),
}));

// ---- generate missing Signal summaries (cached, capped, concurrency-limited) -
const toGenerate = [];
const wanted = new Set();
for (const { topic, articles } of selections) {
  for (const a of articles) {
    if (!a.link || cache[a.link] || wanted.has(a.link)) continue;
    wanted.add(a.link);
    toGenerate.push({ article: a, topic });
  }
}

let generated = 0;
if (!PROVIDER) {
  console.warn('⚠ no LLM key (GEMINI_API_KEY / GROQ_API_KEY / OPENROUTER_API_KEY) — hubs use excerpts as the takeaway.');
} else {
  const batch = toGenerate.slice(0, MAX_NEW_SUMMARIES);
  console.log(`· generating ${batch.length} new Signal summaries via ${PROVIDER}/${MODEL} (${toGenerate.length - batch.length} deferred, ${Object.keys(cache).length} cached)…`);
  const CONCURRENCY = 5;
  let cursor = 0;
  async function worker() {
    while (cursor < batch.length) {
      const { article, topic } = batch[cursor++];
      try {
        const signal = await generateSignal(article, topic);
        if (signal) { cache[article.link] = signal; generated++; }
      } catch (e) {
        if (cursor <= 3) console.warn(`  ⚠ summary failed (${e.message}) — falling back to excerpt`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`· generated ${generated} summaries`);
}

// The takeaway shown for an article: LLM Signal if we have one, else the excerpt.
const takeaway = (a) => cache[a.link] || plain(a.description, 240);

// ---- render one hub --------------------------------------------------------
function renderHub({ topic, articles }) {
  const path = `/topic/${topic.slug}`;
  const url = ORIGIN + path;
  const title = `${topic.title} — Curated & Cut to the Signal · Glancer AI`;
  const desc = plain(`${topic.intro} Refreshed continuously by Glancer AI.`, 160);
  const image = `${ORIGIN}/icon-1024.png`;

  const listSchema = schemaToJson(
    buildItemListSchema(
      articles.map((a) => ({ url: a.link, name: a.title })),
      { name: topic.title, path, description: topic.tagline },
    ),
  );
  const crumbSchema = schemaToJson(
    buildBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Topics', path: '/topics' },
      { name: topic.title, path },
    ]),
  );

  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(topic.title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="website" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${image}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${image}" />`);

  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${listSchema}</script>\n` +
      `    <script type="application/ld+json">${crumbSchema}</script>\n  </head>`,
  );

  const cards = articles.map((a) => {
    const date = a.pubDate ? esc(new Date(a.pubDate).toISOString().slice(0, 10)) : '';
    return `<article style="padding:18px 0;border-bottom:1px solid rgba(120,130,150,.18)">
        <a href="${esc(a.link)}" rel="noopener" style="color:#0EA5E9;text-decoration:none;font-size:1.15rem;font-weight:700;line-height:1.35">${esc(a.title)}</a>
        <p style="font-size:.78rem;color:#64748b;margin:6px 0 8px">${esc(a._source || '')}${date ? ' · ' + date : ''}</p>
        <p style="font-size:.92rem;line-height:1.6;color:#334155;margin:0"><strong style="color:#0f172a">The Signal —</strong> ${esc(takeaway(a))}</p>
      </article>`;
  }).join('\n');

  const guide = guideForTopic(topic.slug);
  const guideBlock = guide
    ? `<section style="margin:20px 0 28px;padding:18px 20px;border:1px solid rgba(120,130,150,.2);border-radius:8px;background:rgba(255,255,255,.02)"><p style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#0EA5E9;margin:0 0 10px">Topic guide</p><p style="font-size:.95rem;line-height:1.75;color:#334155;margin:0">${esc(guide)}</p></section>`
    : '';

  const prerendered = `<main style="max-width:820px;margin:0 auto;padding:96px 20px 80px">
        <p style="font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:#0EA5E9">Topic Hub</p>
        <h1 style="font-size:2.3rem;line-height:1.18;font-weight:800;margin:.2em 0">${esc(topic.title)}</h1>
        <p style="font-size:1.05rem;line-height:1.6;color:#475569;max-width:720px">${esc(topic.intro)}</p>
        ${guideBlock}
        <p style="font-size:.82rem;color:#64748b">${articles.length} recent ${articles.length === 1 ? 'story' : 'stories'}, each cut to the signal · updated continuously</p>
        <div style="margin-top:24px">${cards}</div>
      </main>`;
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${prerendered}</div>`);

  const outDir = resolve(DIST, 'topic');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, `${topic.slug}.html`), html, 'utf8');
}

// ---- render the /topics index ---------------------------------------------
function renderIndex() {
  const path = '/topics';
  const url = ORIGIN + path;
  const title = 'AI Topics — News Hubs by Company & Technology · Glancer AI';
  const desc = 'Curated, continuously-refreshed AI news hubs — OpenAI, Anthropic, Google Gemini, AI agents, observability, AIOps and more. Cut to the signal.';

  const listSchema = schemaToJson(
    buildItemListSchema(
      TOPICS.map((t) => ({ url: `/topic/${t.slug}`, name: t.title })),
      { name: 'AI News Topics', path, description: 'Curated AI news hubs by company and technology.' },
    ),
  );

  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="AI News by Topic" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);

  html = html.replace('</head>', `  <script type="application/ld+json">${listSchema}</script>\n  </head>`);

  const enriched = TOPICS.map((t) => {
    const guide = guideForTopic(t.slug);
    const excerpt = guide ? `<p style="margin:6px 0 0;font-size:.88rem;line-height:1.6;color:#64748b">${esc(guide.slice(0, 220))}…</p>` : '';
    return `<li style="margin:0 0 18px"><a href="/topic/${t.slug}" style="color:#0EA5E9;text-decoration:none;font-weight:700;font-size:1.1rem">${esc(t.title)}</a><br><span style="color:#64748b;font-size:.9rem">${esc(t.tagline)}</span>${excerpt}</li>`;
  }).join('\n');
  const prerendered = `<main style="max-width:760px;margin:0 auto;padding:96px 20px 80px">
        <h1 style="font-size:2.3rem;font-weight:800">AI News by Topic</h1>
        <p style="font-size:1.05rem;color:#475569">Continuously-refreshed news hubs for the companies and technologies that matter — each includes an editorial guide, filtered headlines, and original Signal takeaways.</p>
        <ul style="list-style:none;padding:0;margin:28px 0 0">${enriched}</ul>
      </main>`;
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${prerendered}</div>`);

  writeFileSync(resolve(DIST, 'topics.html'), html, 'utf8');
}

// ---- write everything ------------------------------------------------------
let hubCount = 0;
for (const sel of selections) {
  if (!sel.articles.length) continue; // don't publish an empty (thin) hub
  renderHub(sel);
  hubCount++;
}
renderIndex();

// Ship the Signal map for the live client hub (url → takeaway for shown items).
const signalMap = {};
for (const { articles } of selections) {
  for (const a of articles) if (cache[a.link]) signalMap[a.link] = cache[a.link];
}
writeFileSync(resolve(DIST, 'topic-signals.json'), JSON.stringify(signalMap), 'utf8');

// Persist the cache, trimmed to the most recent CACHE_MAX entries.
const entries = Object.entries(cache);
const trimmed = entries.length > CACHE_MAX ? Object.fromEntries(entries.slice(entries.length - CACHE_MAX)) : cache;
if (!existsSync(dirname(CACHE_PATH))) mkdirSync(dirname(CACHE_PATH), { recursive: true });
writeFileSync(CACHE_PATH, JSON.stringify(trimmed, null, 2), 'utf8');

console.log(`✓ prerendered ${hubCount} topic hubs + /topics → dist/topic/*.html (${Object.keys(signalMap).length} Signal lines shipped, +${generated} new)`);
