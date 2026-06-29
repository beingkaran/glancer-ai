/*
 * aiToolkit.js — the brains behind the Free AI Tools page.
 *
 * Every function here runs 100% in the browser: no API key, no backend, no
 * cost, no rate limit. That's deliberate — these tools are built to rank for
 * high-demand "free / no-signup" searches (AI humanizer, AI detector, token
 * counter, prompt generator, summarizer) and to work for every visitor the
 * instant the page loads. The heuristics are transparent and explained in the
 * UI so the output is honest about being a fast local estimate, not a paid API.
 */

/* ------------------------------------------------------------------ */
/* Shared text helpers                                                 */
/* ------------------------------------------------------------------ */

export function splitSentences(text) {
  const parts = (text || '')
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+[.!?]+|\S[^.!?]*$/g);
  return (parts || []).map((s) => s.trim()).filter(Boolean);
}

export function words(text) {
  return (text || '').trim().match(/[A-Za-z0-9'’-]+/g) || [];
}

const STOPWORDS = new Set(
  ('a about above after again against all am an and any are aren as at be because been ' +
   'before being below between both but by can cannot could did do does doing down during ' +
   'each few for from further had has have having he her here hers herself him himself his ' +
   'how i if in into is it its itself just me more most my myself no nor not of off on once ' +
   'only or other our ours ourselves out over own same she should so some such than that the ' +
   'their theirs them themselves then there these they this those through to too under until ' +
   'up very was we were what when where which while who whom why will with you your yours ' +
   'yourself yourselves').split(' '),
);

/* ------------------------------------------------------------------ */
/* 1. AI Text Humanizer                                                */
/* ------------------------------------------------------------------ */

// Wordy / "AI-tell" phrases → plainer human equivalents. Order matters:
// longer phrases first so they win before their sub-parts.
const HUMANIZE_PHRASES = [
  [/\bit(?:'|’| i)s important to note that\b/gi, ''],
  [/\bit(?:'|’| i)s worth noting that\b/gi, ''],
  [/\bit should be noted that\b/gi, ''],
  [/\bin today(?:'|’)s (?:fast-paced |digital |modern )?world\b/gi, 'these days'],
  [/\bin the realm of\b/gi, 'in'],
  [/\bin the world of\b/gi, 'in'],
  [/\bwhen it comes to\b/gi, 'with'],
  [/\bneedless to say,?\b/gi, ''],
  [/\bat the end of the day,?\b/gi, ''],
  [/\bfirst and foremost,?\b/gi, 'first,'],
  [/\bin order to\b/gi, 'to'],
  [/\ba wide range of\b/gi, 'many'],
  [/\ba variety of\b/gi, 'several'],
  [/\ba plethora of\b/gi, 'plenty of'],
  [/\bdelve into\b/gi, 'look at'],
  [/\bdelving into\b/gi, 'looking at'],
  [/\bdive into\b/gi, 'look at'],
  [/\bnavigate the\b/gi, 'handle the'],
  [/\bnavigating the\b/gi, 'handling the'],
  [/\bleverage\b/gi, 'use'],
  [/\bleveraging\b/gi, 'using'],
  [/\butilize\b/gi, 'use'],
  [/\butilizing\b/gi, 'using'],
  [/\bfacilitate\b/gi, 'help'],
  [/\bendeavor\b/gi, 'try'],
  [/\bcommence\b/gi, 'start'],
  [/\bsubsequently\b/gi, 'then'],
  [/\bnevertheless\b/gi, 'still'],
  [/\bnotwithstanding\b/gi, 'despite that'],
  [/\bfurthermore,?\b/gi, 'also,'],
  [/\bmoreover,?\b/gi, 'also,'],
  [/\badditionally,?\b/gi, 'also,'],
  [/\bconsequently,?\b/gi, 'so,'],
  [/\bin conclusion,?\b/gi, 'to wrap up,'],
  [/\bto summarize,?\b/gi, 'in short,'],
  [/\ba testament to\b/gi, 'a sign of'],
  [/\bunderscore\b/gi, 'show'],
  [/\bunderscores\b/gi, 'shows'],
  [/\bplay(?:s)? a (?:crucial|vital|pivotal|key) role\b/gi, 'matters a lot'],
  [/\bseamless\b/gi, 'smooth'],
  [/\bseamlessly\b/gi, 'smoothly'],
  [/\brobust\b/gi, 'solid'],
  [/\bmyriad of\b/gi, 'many'],
  [/\bmyriad\b/gi, 'many'],
  [/\bvast\b/gi, 'big'],
  [/\bcutting-edge\b/gi, 'modern'],
  [/\bstate-of-the-art\b/gi, 'top'],
  [/\bgame-?changer\b/gi, 'big deal'],
  [/\bunlock the potential\b/gi, 'get the most out'],
  [/\bharness the power of\b/gi, 'use'],
  [/\bembark on (?:a )?journey\b/gi, 'start'],
  [/\bin the ever-evolving\b/gi, 'in the changing'],
  [/\btapestry\b/gi, 'mix'],
  [/\blandscape\b/gi, 'space'],
  [/\bparamount\b/gi, 'key'],
  [/\bdaunting\b/gi, 'hard'],
];

// Contractions make text read as written by a person, not a model.
const CONTRACTIONS = [
  [/\bit is\b/g, "it's"], [/\bIt is\b/g, "It's"],
  [/\bthat is\b/g, "that's"], [/\bThat is\b/g, "That's"],
  [/\bthere is\b/g, "there's"], [/\bThere is\b/g, "There's"],
  [/\bwho is\b/g, "who's"], [/\bwhat is\b/g, "what's"],
  [/\byou are\b/g, "you're"], [/\bYou are\b/g, "You're"],
  [/\bwe are\b/g, "we're"], [/\bWe are\b/g, "We're"],
  [/\bthey are\b/g, "they're"], [/\bThey are\b/g, "They're"],
  [/\bdo not\b/g, "don't"], [/\bDo not\b/g, "Don't"],
  [/\bdoes not\b/g, "doesn't"], [/\bdid not\b/g, "didn't"],
  [/\bcan not\b/g, "can't"], [/\bcannot\b/g, "can't"],
  [/\bwill not\b/g, "won't"], [/\bWill not\b/g, "Won't"],
  [/\bis not\b/g, "isn't"], [/\bare not\b/g, "aren't"],
  [/\bwould not\b/g, "wouldn't"], [/\bshould not\b/g, "shouldn't"],
  [/\bcould not\b/g, "couldn't"], [/\bhave not\b/g, "haven't"],
  [/\bhas not\b/g, "hasn't"], [/\byou will\b/g, "you'll"],
  [/\bwe will\b/g, "we'll"], [/\bthey will\b/g, "they'll"],
  [/\byou have\b/g, "you've"], [/\bwe have\b/g, "we've"],
];

export function humanize(text, opts = {}) {
  const { contractions = true } = opts;
  if (!text || !text.trim()) return { text: '', changes: 0 };
  let out = text;
  let changes = 0;

  for (const [re, rep] of HUMANIZE_PHRASES) {
    out = out.replace(re, (m) => { changes++; return rep; });
  }
  if (contractions) {
    for (const [re, rep] of CONTRACTIONS) {
      out = out.replace(re, () => { changes++; return rep; });
    }
  }

  // Em / en dashes are an AI fingerprint — swap most for commas.
  out = out.replace(/\s*[—–]\s*/g, () => { changes++; return ', '; });

  // Tidy up the double spaces / dangling punctuation our deletions can leave.
  out = out
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/,(\s*,)+/g, ',')        // collapse "also,, it" → "also, it"
    .replace(/([,;:])\s*([.!?])/g, '$2')
    .replace(/\.\s*,/g, '.')
    .replace(/(^|[.!?]\s+)([a-z])/g, (m, p, c) => p + c.toUpperCase())
    .trim();

  return { text: out, changes };
}

/* ------------------------------------------------------------------ */
/* 2. AI Content Detector                                              */
/* ------------------------------------------------------------------ */

// Phrases that show up far more often in LLM output than human writing.
const AI_MARKERS = [
  'delve', 'delving', 'tapestry', 'testament to', 'underscore', 'underscores',
  'seamless', 'seamlessly', 'robust', 'leverage', 'leveraging', 'utilize',
  'utilizing', 'realm', 'landscape', 'navigating', 'navigate the', 'embark',
  'paramount', 'pivotal', 'crucial role', 'vital role', 'in conclusion',
  'furthermore', 'moreover', 'additionally', 'it is important to note',
  "it's important to note", 'it is worth noting', 'in today', 'fast-paced',
  'ever-evolving', 'cutting-edge', 'state-of-the-art', 'game-changer',
  'unlock the', 'harness the', 'a myriad', 'plethora', 'foster', 'fostering',
  'holistic', 'synergy', 'streamline', 'elevate', 'empower', 'unparalleled',
  'meticulous', 'meticulously', 'comprehensive', 'multifaceted', 'nuanced',
];

function stdev(nums) {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const v = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
  return Math.sqrt(v);
}

export function detectAI(text) {
  const w = words(text);
  const sents = splitSentences(text);
  if (w.length < 25) {
    return { score: null, verdict: 'Need more text', factors: [], wordCount: w.length };
  }

  const lower = text.toLowerCase();
  const factors = [];

  // 1. AI marker-phrase density.
  let markerHits = 0;
  const found = [];
  for (const m of AI_MARKERS) {
    const c = (lower.match(new RegExp('\\b' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (c) { markerHits += c; found.push(m); }
  }
  const markerRate = markerHits / (w.length / 100); // per 100 words
  const markerScore = Math.min(100, markerRate * 28);
  factors.push({
    label: 'AI cliché phrases',
    detail: found.length ? `${markerHits} hit${markerHits > 1 ? 's' : ''}: ${found.slice(0, 6).join(', ')}` : 'none found',
    score: Math.round(markerScore),
  });

  // 2. Burstiness — humans vary sentence length a lot; LLMs less so.
  const lens = sents.map((s) => words(s).length).filter((n) => n > 0);
  const sd = stdev(lens);
  const burstScore = Math.max(0, Math.min(100, (9 - sd) * 12)); // low sd ⇒ high AI
  factors.push({
    label: 'Sentence-length variation',
    detail: `variation ${sd.toFixed(1)} (low = more uniform = more AI-like)`,
    score: Math.round(burstScore),
  });

  // 3. Vocabulary diversity (type–token ratio). LLMs repeat structure.
  const uniq = new Set(w.map((x) => x.toLowerCase())).size;
  const ttr = uniq / w.length;
  const diversityScore = Math.max(0, Math.min(100, (0.55 - ttr) * 240));
  factors.push({
    label: 'Vocabulary repetition',
    detail: `${Math.round(ttr * 100)}% unique words`,
    score: Math.round(diversityScore),
  });

  // 4. Contraction scarcity — formal LLM prose rarely contracts.
  const contractionCount = (text.match(/[A-Za-z]+['’](t|s|re|ve|ll|d|m)\b/g) || []).length;
  const contractionRate = contractionCount / (w.length / 100);
  const contractionScore = Math.max(0, Math.min(100, (1.2 - contractionRate) * 60));
  factors.push({
    label: 'Contraction use',
    detail: `${contractionCount} contraction${contractionCount === 1 ? '' : 's'} (humans use more)`,
    score: Math.round(contractionScore),
  });

  // 5. Repeated sentence openers (LLMs love parallel structure).
  const openers = sents.map((s) => (words(s)[0] || '').toLowerCase()).filter(Boolean);
  const openerCounts = {};
  openers.forEach((o) => { openerCounts[o] = (openerCounts[o] || 0) + 1; });
  const repeats = Object.values(openerCounts).reduce((a, b) => a + (b > 1 ? b - 1 : 0), 0);
  const openerScore = Math.min(100, (repeats / Math.max(1, sents.length)) * 220);
  factors.push({
    label: 'Repeated sentence openers',
    detail: `${repeats} repeated opening word${repeats === 1 ? '' : 's'}`,
    score: Math.round(openerScore),
  });

  // Weighted blend.
  const score = Math.round(
    markerScore * 0.34 +
    burstScore * 0.24 +
    diversityScore * 0.16 +
    contractionScore * 0.14 +
    openerScore * 0.12,
  );

  let verdict;
  if (score >= 70) verdict = 'Very likely AI-generated';
  else if (score >= 50) verdict = 'Likely AI-generated';
  else if (score >= 32) verdict = 'Possibly AI-assisted';
  else verdict = 'Likely human-written';

  return { score: Math.max(0, Math.min(100, score)), verdict, factors, wordCount: w.length };
}

/* ------------------------------------------------------------------ */
/* 3. AI Token & Cost Counter                                          */
/* ------------------------------------------------------------------ */

// Illustrative public list prices (USD per 1M tokens) for a quick cost
// estimate. Prices change — shown as an estimate, not a billing source.
export const TOKEN_MODELS = [
  { id: 'gpt-4o',         name: 'GPT-4o',          inPrice: 2.5,  outPrice: 10,   ctx: '128K' },
  { id: 'gpt-4o-mini',    name: 'GPT-4o mini',     inPrice: 0.15, outPrice: 0.6,  ctx: '128K' },
  { id: 'claude-opus',    name: 'Claude Opus',     inPrice: 15,   outPrice: 75,   ctx: '200K' },
  { id: 'claude-sonnet',  name: 'Claude Sonnet',   inPrice: 3,    outPrice: 15,   ctx: '200K' },
  { id: 'claude-haiku',   name: 'Claude Haiku',    inPrice: 0.8,  outPrice: 4,    ctx: '200K' },
  { id: 'gemini-pro',     name: 'Gemini 1.5 Pro',  inPrice: 1.25, outPrice: 5,    ctx: '1M' },
  { id: 'gemini-flash',   name: 'Gemini 1.5 Flash',inPrice: 0.075,outPrice: 0.3,  ctx: '1M' },
];

// Approximate the BPE token count without shipping a tokenizer. Two cheap
// estimators (chars/4 and words×1.33) are averaged — within ~10–15% of real
// tokenizers for typical English prose.
export function estimateTokens(text) {
  const chars = (text || '').length;
  const w = words(text).length;
  if (!chars) return 0;
  const byChars = chars / 4;
  const byWords = w * 1.33;
  return Math.max(1, Math.round((byChars + byWords) / 2));
}

export function tokenStats(text) {
  const tokens = estimateTokens(text);
  const costs = TOKEN_MODELS.map((m) => ({
    ...m,
    inCost: (tokens / 1_000_000) * m.inPrice,
    // Most chats reply with a similar order of magnitude — assume equal output
    // for a "round-trip" estimate so the number is useful, not just input.
    roundTrip: (tokens / 1_000_000) * m.inPrice + (tokens / 1_000_000) * m.outPrice,
  }));
  return {
    tokens,
    chars: (text || '').length,
    words: words(text).length,
    sentences: splitSentences(text).length,
    costs,
  };
}

/* ------------------------------------------------------------------ */
/* 4. AI Prompt Generator                                              */
/* ------------------------------------------------------------------ */

export const PROMPT_FORMATS = [
  'Auto (let the AI choose)', 'Bullet points', 'Numbered steps', 'Short paragraph',
  'Detailed essay', 'Table', 'Markdown', 'JSON', 'Email', 'Tweet / X post',
  'Code', 'Pros and cons list',
];

export const PROMPT_TONES = [
  'Neutral', 'Professional', 'Friendly', 'Persuasive', 'Casual',
  'Confident', 'Empathetic', 'Witty', 'Academic', 'Concise',
];

export const PROMPT_PRESETS = [
  { label: 'Blog post', role: 'an expert content writer', task: 'Write a 1,200-word blog post about [TOPIC]', audience: 'people new to the subject', format: 'Markdown', tone: 'Friendly' },
  { label: 'Cold email', role: 'a senior B2B sales copywriter', task: 'Write a short cold outreach email selling [PRODUCT] to [PROSPECT]', audience: 'a busy decision-maker', format: 'Email', tone: 'Persuasive' },
  { label: 'Code helper', role: 'a senior software engineer', task: 'Write and explain code that [GOAL]', audience: 'an intermediate developer', format: 'Code', tone: 'Concise' },
  { label: 'Study notes', role: 'a patient tutor', task: 'Explain [TOPIC] and create study notes with key points', audience: 'a high-school student', format: 'Bullet points', tone: 'Friendly' },
  { label: 'Social post', role: 'a social media strategist', task: 'Write 5 scroll-stopping posts about [TOPIC]', audience: 'followers on X / LinkedIn', format: 'Tweet / X post', tone: 'Witty' },
];

export function buildPrompt({ role, task, audience, context, format, tone, constraints }) {
  const lines = [];
  if (role && role.trim()) lines.push(`You are ${role.trim()}.`);
  if (task && task.trim()) lines.push(`\nYour task: ${task.trim()}.`);
  if (audience && audience.trim()) lines.push(`\nTarget audience: ${audience.trim()}.`);
  if (context && context.trim()) lines.push(`\nContext / details to use:\n${context.trim()}`);

  const reqs = [];
  if (tone && tone !== 'Neutral') reqs.push(`Use a ${tone.toLowerCase()} tone.`);
  if (format && !format.startsWith('Auto')) reqs.push(`Format the answer as: ${format}.`);
  if (constraints && constraints.trim()) reqs.push(constraints.trim());
  reqs.push('Be specific and avoid filler or generic statements.');
  reqs.push('If anything is unclear, state your assumptions before answering.');

  lines.push('\nRequirements:');
  reqs.forEach((r, i) => lines.push(`${i + 1}. ${r}`));

  return lines.join('\n').trim();
}

/* ------------------------------------------------------------------ */
/* 5. AI Text Summarizer (extractive)                                  */
/* ------------------------------------------------------------------ */

// Frequency-weighted extractive summary (a lightweight TextRank cousin):
// score each sentence by the summed frequency of its meaningful words, then
// keep the top N in their original order so the summary still reads in flow.
export function summarize(text, ratio = 0.3) {
  const sents = splitSentences(text);
  if (sents.length <= 2) return { summary: text.trim(), kept: sents.length, total: sents.length };

  const freq = {};
  for (const wd of words(text)) {
    const lw = wd.toLowerCase();
    if (STOPWORDS.has(lw) || lw.length < 3) continue;
    freq[lw] = (freq[lw] || 0) + 1;
  }
  const maxFreq = Math.max(1, ...Object.values(freq));

  const scored = sents.map((s, i) => {
    const ws = words(s);
    let score = 0;
    for (const wd of ws) {
      const lw = wd.toLowerCase();
      if (freq[lw]) score += freq[lw] / maxFreq;
    }
    // Normalize by length so long sentences don't always win; nudge the very
    // first sentence (often a thesis) up a touch.
    score = score / Math.sqrt(Math.max(1, ws.length));
    if (i === 0) score *= 1.15;
    return { i, s, score };
  });

  const keep = Math.max(1, Math.round(sents.length * ratio));
  const chosen = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, keep)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s);

  return { summary: chosen.join(' '), kept: chosen.length, total: sents.length };
}
