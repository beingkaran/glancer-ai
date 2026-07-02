#!/usr/bin/env node
/*
 * generate-weekly-roundup.mjs — draft a long-form "Weekly Synthesis" pillar post
 * from the week's live feed.
 *
 *   npm run roundup            # draft using the default 6 top stories
 *   TOP=8 npm run roundup      # 8 stories
 *
 * These bundle the week's best links into a single shareable, backlink-friendly
 * article ("The Signal: Top AI Stories of <week>") — the pillar-post half of the
 * anti-thin-content strategy. It writes a DRAFT to seo/drafts/ in the exact
 * blog-post object shape (src/data/allBlogs.js) plus NewsArticle-ready fields.
 * It never publishes on its own — you review the draft, tweak the framing, then
 * paste the object into src/data/allBlogs.js (or post it via /blog/write). The
 * build's prerender-blogs.mjs + NewsArticle schema then do the rest.
 *
 * Needs a live feed (network) and, for original prose, an LLM key
 * (GEMINI_API_KEY / GROQ_API_KEY / OPENROUTER_API_KEY). Without a key it still
 * assembles a draft using article excerpts so you can edit from a skeleton.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRAFTS = resolve(__dirname, '../seo/drafts');
const TOP = Number(process.env.TOP || 6);

const { buildRawNews } = await import('../worker/newsCore.js');
const { TOPICS, topicScore } = await import('../src/data/topics.js');

const plain = (s, max = 320) => {
  const t = String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

// ---- LLM (optional) --------------------------------------------------------
const MODELS = { gemini: 'gemini-2.0-flash', groq: 'llama-3.3-70b-versatile', openrouter: 'meta-llama/llama-3.3-70b-instruct:free' };
const PROVIDER = process.env.LLM_PROVIDER
  || (process.env.GEMINI_API_KEY && 'gemini')
  || (process.env.GROQ_API_KEY && 'groq')
  || (process.env.OPENROUTER_API_KEY && 'openrouter')
  || null;
const MODEL = process.env.LLM_MODEL || (PROVIDER && MODELS[PROVIDER]);
const SYSTEM = 'You are the editor of Glancer AI, an AI-news aggregator. You write tight, original analysis that cuts through the noise — never marketing fluff, never restating a headline.';

async function ask(prompt, maxTokens = 220) {
  if (!PROVIDER) return null;
  try {
    if (PROVIDER === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: SYSTEM }] }, generationConfig: { temperature: 0.6, maxOutputTokens: maxTokens } }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error?.message || res.status);
      return (j.candidates?.[0]?.content?.parts || []).map((p) => p.text).join('').trim();
    }
    const base = PROVIDER === 'groq' ? 'https://api.groq.com/openai/v1' : 'https://openrouter.ai/api/v1';
    const key = PROVIDER === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY;
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }], temperature: 0.6, max_tokens: maxTokens }),
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j?.error?.message || res.status);
    return (j.choices?.[0]?.message?.content || '').trim();
  } catch (e) {
    console.warn('  ⚠ LLM call failed:', e.message);
    return null;
  }
}

// ---- gather + rank ---------------------------------------------------------
console.log('· fetching this week’s feed…');
let items = await buildRawNews({ perFeedTimeout: 7000, maxFeeds: 45 }).catch(() => []);
if (!items.length) { console.error('✗ no items fetched — try again.'); process.exit(1); }

// De-dupe, keep the last 7 days, score by cross-topic relevance + freshness.
const seen = new Set();
const weekAgo = Date.now() - 7 * 864e5;
items = items.filter((it) => {
  if (!it.link || !it.title || seen.has(it.link)) return false;
  seen.add(it.link);
  const t = it.pubDate ? new Date(it.pubDate).getTime() : NaN;
  return Number.isNaN(t) || t >= weekAgo;
});

const scored = items.map((it) => {
  const rel = TOPICS.reduce((s, t) => s + topicScore(it, t), 0); // entity-density = importance proxy
  const age = it.pubDate ? Date.now() - new Date(it.pubDate).getTime() : 3 * 864e5;
  return { it, score: rel * 3 - age / 864e5 };
}).sort((a, b) => b.score - a.score);

// Keep source diversity: at most 2 per publisher among the picks.
const picks = [];
const perSource = {};
for (const { it } of scored) {
  const src = it._source || 'unknown';
  if ((perSource[src] || 0) >= 2) continue;
  perSource[src] = (perSource[src] || 0) + 1;
  picks.push(it);
  if (picks.length >= TOP) break;
}

// ---- draft prose -----------------------------------------------------------
const now = new Date();
const weekLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const dateIso = now.toISOString().slice(0, 10);

console.log(`· drafting synthesis over ${picks.length} stories${PROVIDER ? ` via ${PROVIDER}` : ' (no LLM key → excerpt skeleton)'}…`);

const sections = [];
for (const a of picks) {
  const why = (await ask(
    `Headline: ${a.title}\nSource: ${a._source}\nSnippet: ${plain(a.description, 400)}\n\n` +
    'In 60–90 words of original prose, explain why this matters for developers and technical teams this week. ' +
    'Add perspective, do not restate the snippet. Plain prose, no preamble, no markdown.',
  )) || plain(a.description, 260);
  sections.push({ a, why });
}

const intro = (await ask(
  `Write a 2–3 sentence intro for a weekly AI news roundup dated ${weekLabel}. The theme threads these stories: ` +
  picks.map((p) => p.title).join('; ') +
  '. Voice: sharp, signal-over-noise. Plain prose, no markdown, no preamble.',
  180,
)) || `Here are the ${picks.length} AI stories that actually mattered this week — curated and cut to the signal.`;

// ---- assemble body HTML ----------------------------------------------------
const esc = (s) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const takeawaysHtml = picks.map((p) => `    <li><strong>${esc(p.title)}</strong> — ${esc(p._source)}</li>`).join('\n');
const bodyHtml = `
<div class="key-takeaways">
  <h3>🔑 This Week’s Signal</h3>
  <ul>
${takeawaysHtml}
  </ul>
</div>

<p>${esc(intro)}</p>
${sections.map(({ a, why }, i) => `
<h2>${i + 1}. ${esc(a.title)}</h2>
<p>${esc(why)}</p>
<p><a href="${esc(a.link)}" target="_blank" rel="noopener noreferrer">Read the original on ${esc(a._source)} →</a></p>`).join('\n')}

<p><em>Want this in your inbox every week? <a href="/topics">Browse the topic hubs</a> or subscribe on the homepage — get the signal, skip the fluff.</em></p>
`.trim();

const slug = `weekly-ai-roundup-${dateIso}`;
const post = {
  id: slug,
  bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
  title: `The Signal: Top ${picks.length} AI Stories of the Week (${weekLabel})`,
  subtitle: plain(intro, 180),
  category: 'Weekly Roundup',
  icon: '📡',
  bgGradient: 'linear-gradient(135deg, #0a0f2e 0%, #0e7490 55%, #22d3ee 100%)',
  author: 'Glancer AI',
  avatar: '📡',
  date: dateIso,
  readTime: Math.max(4, Math.round(picks.length * 1.5)),
  tags: ['AI news', 'weekly roundup', 'the signal', ...Array.from(new Set(picks.map((p) => p._source))).slice(0, 3)],
  featured: true,
  body: bodyHtml,
};

// ---- write draft -----------------------------------------------------------
mkdirSync(DRAFTS, { recursive: true });
const jsPath = resolve(DRAFTS, `${slug}.js`);
writeFileSync(jsPath,
  `/* DRAFT weekly roundup — review, then paste this object into src/data/allBlogs.js\n` +
  `   (it already matches the BLOG_POSTS shape; prerender-blogs.mjs adds NewsArticle schema). */\n` +
  `export const post = ${JSON.stringify(post, null, 2)};\n`,
  'utf8');

console.log(`\n✓ draft written → seo/drafts/${slug}.js`);
console.log('  Review it, adjust the framing/banner, then add it to src/data/allBlogs.js and rebuild.');
