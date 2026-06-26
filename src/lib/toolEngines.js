/*
 * toolEngines — pure, dependency-free implementations of the in-browser
 * "Custom AI Tools" (inspired by the free utilities on sitegpt.ai/tools).
 *
 * Every engine is a function `(values) => result | Promise<result>` where
 * `values` is the map of input ids the ToolRunner collected, and `result` is:
 *   { output: string, lang?: 'markdown'|'xml'|'text'|'json', preview?: 'md',
 *     stats?: [{label, value}], error?: string }
 *
 * Engines that touch the network (sitemaps, webpage→markdown) reuse the shared
 * CORS proxy used elsewhere in the app, so they work from the static site with
 * no backend. Everything else is fully offline.
 */

import { proxiedText } from './proxy';

/* ------------------------------------------------------------------ helpers */

const clean = (s) => (s == null ? '' : String(s)).trim();

function normalizeUrl(u) {
  let s = clean(u);
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  return s;
}

function originOf(u) {
  try { return new URL(normalizeUrl(u)).origin; } catch { return ''; }
}

// Parse XML text into a Document, throwing a friendly error on malformed input.
function parseXml(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error('The XML could not be parsed — it looks malformed.');
  return doc;
}

const escapeCell = (s) => clean(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ');

/* ----------------------------------------------------- markdown converters */

// CSV (with quoted-field support) → GitHub-flavoured Markdown table.
export function csvToMarkdown({ csv, delimiter }) {
  const text = clean(csv);
  if (!text) return { error: 'Paste some CSV data first.' };
  const d = delimiter === 'tab' ? '\t' : delimiter === 'semicolon' ? ';' : ',';

  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === d) { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const data = rows.filter((r) => r.some((c) => clean(c) !== ''));
  if (!data.length) return { error: 'No rows found in the CSV.' };

  const cols = Math.max(...data.map((r) => r.length));
  const pad = (r) => Array.from({ length: cols }, (_, i) => escapeCell(r[i] || ''));
  const header = pad(data[0]);
  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...data.slice(1).map((r) => `| ${pad(r).join(' | ')} |`),
  ];
  return {
    output: lines.join('\n'),
    lang: 'markdown',
    preview: 'md',
    stats: [{ label: 'Rows', value: data.length - 1 }, { label: 'Columns', value: cols }],
  };
}

// JSON → readable Markdown (objects→sections, arrays-of-objects→tables).
export function jsonToMarkdown({ json }) {
  let data;
  try { data = JSON.parse(clean(json)); }
  catch (e) { return { error: 'Invalid JSON: ' + e.message }; }

  const render = (val, depth = 0) => {
    if (Array.isArray(val)) {
      const objs = val.filter((v) => v && typeof v === 'object' && !Array.isArray(v));
      if (objs.length === val.length && val.length) {
        const keys = [...new Set(val.flatMap((o) => Object.keys(o)))];
        const head = `| ${keys.join(' | ')} |\n| ${keys.map(() => '---').join(' | ')} |`;
        const body = val.map((o) => `| ${keys.map((k) => escapeCell(fmt(o[k]))).join(' | ')} |`).join('\n');
        return head + '\n' + body;
      }
      return val.map((v) => `- ${typeof v === 'object' ? '\n' + indent(render(v, depth + 1)) : fmt(v)}`).join('\n');
    }
    if (val && typeof val === 'object') {
      return Object.entries(val).map(([k, v]) => {
        if (v && typeof v === 'object') return `${'#'.repeat(Math.min(depth + 2, 6))} ${k}\n\n${render(v, depth + 1)}`;
        return `- **${k}:** ${fmt(v)}`;
      }).join('\n');
    }
    return fmt(val);
  };
  const fmt = (v) => (v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));
  const indent = (s) => s.split('\n').map((l) => '  ' + l).join('\n');

  return { output: render(data), lang: 'markdown', preview: 'md' };
}

// Convert a DOM node tree to Markdown. Shared by HTML and webpage converters.
function domToMarkdown(root) {
  const out = [];
  const walk = (node) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) { // text
        const t = n.textContent.replace(/\s+/g, ' ');
        if (t.trim()) out.push(t);
        return;
      }
      if (n.nodeType !== 1) return;
      const tag = n.tagName.toLowerCase();
      if (['script', 'style', 'noscript', 'svg', 'nav', 'footer', 'header', 'form'].includes(tag)) return;
      const text = () => n.textContent.replace(/\s+/g, ' ').trim();
      switch (tag) {
        case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
          out.push(`\n\n${'#'.repeat(+tag[1])} ${text()}\n`); break;
        case 'p': out.push('\n\n'); walk(n); out.push('\n'); break;
        case 'br': out.push('  \n'); break;
        case 'strong': case 'b': out.push(`**${text()}**`); break;
        case 'em': case 'i': out.push(`*${text()}*`); break;
        case 'code': out.push(`\`${text()}\``); break;
        case 'pre': out.push(`\n\n\`\`\`\n${n.textContent.trim()}\n\`\`\`\n`); break;
        case 'a': {
          const href = n.getAttribute('href') || '';
          out.push(href ? `[${text()}](${href})` : text()); break;
        }
        case 'img': {
          const src = n.getAttribute('src') || '';
          if (src) out.push(`![${n.getAttribute('alt') || ''}](${src})`); break;
        }
        case 'li': out.push(`\n- `); walk(n); break;
        case 'ul': case 'ol': out.push('\n'); walk(n); out.push('\n'); break;
        case 'blockquote': out.push(`\n\n> ${text()}\n`); break;
        case 'hr': out.push('\n\n---\n'); break;
        default: walk(n);
      }
    });
  };
  walk(root);
  return out.join('').replace(/\n{3,}/g, '\n\n').trim();
}

export function htmlToMarkdown({ html }) {
  const text = clean(html);
  if (!text) return { error: 'Paste some HTML first.' };
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return { output: domToMarkdown(doc.body), lang: 'markdown', preview: 'md' };
}

// XML → Markdown outline (nested headings + bullet attributes/values).
export function xmlToMarkdown({ xml }) {
  let doc;
  try { doc = parseXml(clean(xml)); } catch (e) { return { error: e.message }; }
  const lines = [];
  const walk = (el, depth) => {
    const attrs = [...el.attributes].map((a) => `\`${a.name}="${a.value}"\``).join(' ');
    lines.push(`${'#'.repeat(Math.min(depth + 1, 6))} ${el.tagName}${attrs ? ' ' + attrs : ''}`);
    const kids = [...el.children];
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
    if (text) lines.push('\n' + text + '\n');
    kids.forEach((k) => walk(k, depth + 1));
  };
  if (doc.documentElement) walk(doc.documentElement, 1);
  return { output: lines.join('\n'), lang: 'markdown', preview: 'md' };
}

// Plain text → tidy Markdown (collapse blank lines, turn bullets into list items).
export function textToMarkdown({ text }) {
  const t = clean(text);
  if (!t) return { error: 'Paste some text first.' };
  const out = t
    .replace(/\r\n/g, '\n')
    .replace(/^[•·▪]\s*/gm, '- ')
    .replace(/^(\d+)[).]\s+/gm, '$1. ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { output: out, lang: 'markdown', preview: 'md' };
}

export async function webpageToMarkdown({ url }) {
  const target = normalizeUrl(url);
  if (!originOf(target)) return { error: 'Enter a valid webpage URL.' };
  let html;
  try { html = await proxiedText(target); }
  catch { return { error: 'Could not fetch that page (it may block cross-origin requests).' }; }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const main = doc.querySelector('article, main') || doc.body;
  const title = clean(doc.querySelector('title')?.textContent);
  const md = domToMarkdown(main);
  return {
    output: (title ? `# ${title}\n\n` : '') + md,
    lang: 'markdown',
    preview: 'md',
    stats: [{ label: 'Words', value: md.split(/\s+/).filter(Boolean).length }],
  };
}

/* ------------------------------------------------------------- sitemap kit */

// Pull <loc> values (and changefreq/priority/lastmod) out of a sitemap doc.
function parseSitemap(doc) {
  const urls = [...doc.querySelectorAll('url')].map((u) => ({
    loc: clean(u.querySelector('loc')?.textContent),
    lastmod: clean(u.querySelector('lastmod')?.textContent),
    changefreq: clean(u.querySelector('changefreq')?.textContent),
    priority: clean(u.querySelector('priority')?.textContent),
  })).filter((u) => u.loc);
  const indexes = [...doc.querySelectorAll('sitemap > loc')].map((l) => clean(l.textContent)).filter(Boolean);
  return { urls, indexes };
}

async function fetchSitemap(url) {
  const text = await proxiedText(url);
  return { text, doc: parseXml(text) };
}

export async function sitemapFinder({ url }) {
  const origin = originOf(url);
  if (!origin) return { error: 'Enter a valid website URL.' };

  // Candidate locations + whatever robots.txt advertises.
  const candidates = new Set([
    `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`,
    `${origin}/sitemap-index.xml`, `${origin}/sitemap1.xml`, `${origin}/wp-sitemap.xml`,
  ]);
  try {
    const robots = await proxiedText(`${origin}/robots.txt`).catch(() => '');
    robots.split('\n').forEach((l) => {
      const m = l.match(/sitemap:\s*(\S+)/i);
      if (m) candidates.add(m[1].trim());
    });
  } catch { /* robots optional */ }

  const found = [];
  for (const c of candidates) {
    try {
      const { doc } = await fetchSitemap(c);
      const { urls, indexes } = parseSitemap(doc);
      if (urls.length || indexes.length) {
        found.push(`✅ ${c}  —  ${indexes.length ? indexes.length + ' child sitemaps' : urls.length + ' URLs'}`);
      }
    } catch { /* not present */ }
  }
  if (!found.length) return { error: `No sitemap found for ${origin}. Checked ${candidates.size} common locations + robots.txt.` };
  return {
    output: `Sitemaps discovered for ${origin}:\n\n` + found.join('\n'),
    lang: 'text',
    stats: [{ label: 'Sitemaps found', value: found.length }],
  };
}

export async function sitemapValidator({ url }) {
  const target = normalizeUrl(url);
  if (!originOf(target)) return { error: 'Enter a valid sitemap URL.' };
  let res;
  try { res = await fetchSitemap(target); }
  catch (e) { return { error: 'Fetch/parse failed: ' + e.message }; }

  const { urls, indexes } = parseSitemap(res.doc);
  const issues = [];
  if (!urls.length && !indexes.length) issues.push('• No <url> or <sitemap> entries found.');
  if (urls.length > 50000) issues.push(`• ${urls.length} URLs exceeds the 50,000-per-sitemap limit.`);
  if (res.text.length > 50 * 1024 * 1024) issues.push('• File exceeds the 50 MB uncompressed limit.');
  urls.forEach((u, i) => {
    if (!/^https?:\/\//i.test(u.loc)) issues.push(`• Row ${i + 1}: <loc> is not an absolute http(s) URL.`);
    if (u.priority && (isNaN(+u.priority) || +u.priority < 0 || +u.priority > 1)) issues.push(`• Row ${i + 1}: priority "${u.priority}" must be 0.0–1.0.`);
    if (u.changefreq && !/^(always|hourly|daily|weekly|monthly|yearly|never)$/i.test(u.changefreq)) issues.push(`• Row ${i + 1}: invalid changefreq "${u.changefreq}".`);
  });
  const ok = issues.length === 0;
  return {
    output: (ok ? '✅ Valid sitemap — no errors found.\n\n' : `⚠️ ${issues.length} issue(s) found:\n\n${issues.slice(0, 50).join('\n')}\n\n`)
      + `Type: ${indexes.length ? 'Sitemap index' : 'URL set'}\nEntries: ${indexes.length || urls.length}`,
    lang: 'text',
    stats: [{ label: 'Entries', value: indexes.length || urls.length }, { label: 'Issues', value: issues.length }],
  };
}

export async function sitemapUrlExtractor({ url }) {
  const target = normalizeUrl(url);
  if (!originOf(target)) return { error: 'Enter a valid sitemap URL.' };
  let res;
  try { res = await fetchSitemap(target); }
  catch (e) { return { error: 'Fetch/parse failed: ' + e.message }; }
  const { urls, indexes } = parseSitemap(res.doc);
  const list = urls.map((u) => u.loc);
  if (!list.length && indexes.length) {
    return {
      output: indexes.join('\n'),
      lang: 'text',
      stats: [{ label: 'Child sitemaps', value: indexes.length }],
    };
  }
  if (!list.length) return { error: 'No URLs found in that sitemap.' };
  return { output: list.join('\n'), lang: 'text', stats: [{ label: 'URLs', value: list.length }] };
}

export async function sitemapComparison({ urlA, urlB }) {
  const a = normalizeUrl(urlA), b = normalizeUrl(urlB);
  if (!originOf(a) || !originOf(b)) return { error: 'Enter two valid sitemap URLs.' };
  let da, db;
  try {
    da = parseSitemap((await fetchSitemap(a)).doc).urls.map((u) => u.loc);
    db = parseSitemap((await fetchSitemap(b)).doc).urls.map((u) => u.loc);
  } catch (e) { return { error: 'Fetch/parse failed: ' + e.message }; }
  const setA = new Set(da), setB = new Set(db);
  const onlyA = da.filter((u) => !setB.has(u));
  const onlyB = db.filter((u) => !setA.has(u));
  const common = da.filter((u) => setB.has(u));
  return {
    output:
      `Only in A (${onlyA.length}):\n${onlyA.join('\n') || '— none —'}\n\n` +
      `Only in B (${onlyB.length}):\n${onlyB.join('\n') || '— none —'}\n\n` +
      `In both (${common.length})`,
    lang: 'text',
    stats: [{ label: 'Added', value: onlyB.length }, { label: 'Removed', value: onlyA.length }, { label: 'Shared', value: common.length }],
  };
}

export async function sitemapFrequency({ url }) {
  const target = normalizeUrl(url);
  if (!originOf(target)) return { error: 'Enter a valid sitemap URL.' };
  let urls;
  try { urls = parseSitemap((await fetchSitemap(target)).doc).urls; }
  catch (e) { return { error: 'Fetch/parse failed: ' + e.message }; }
  if (!urls.length) return { error: 'No URLs found in that sitemap.' };

  const tally = (key) => urls.reduce((m, u) => { const k = u[key] || '(not set)'; m[k] = (m[k] || 0) + 1; return m; }, {});
  const fmt = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `  ${k.padEnd(12)} ${v}  (${Math.round(v / urls.length * 100)}%)`).join('\n');
  const withLastmod = urls.filter((u) => u.lastmod).length;
  return {
    output:
      `changefreq distribution:\n${fmt(tally('changefreq'))}\n\n` +
      `priority distribution:\n${fmt(tally('priority'))}\n\n` +
      `lastmod present on ${withLastmod}/${urls.length} URLs (${Math.round(withLastmod / urls.length * 100)}%)`,
    lang: 'text',
    stats: [{ label: 'URLs', value: urls.length }, { label: 'With lastmod', value: withLastmod }],
  };
}

// Build a sitemap.xml from a pasted list of URLs.
export function sitemapGenerator({ urls, changefreq, priority }) {
  const list = clean(urls).split(/[\n\s,]+/).map((u) => u.trim()).filter(Boolean).map(normalizeUrl);
  const uniq = [...new Set(list)];
  if (!uniq.length) return { error: 'Paste at least one URL (one per line).' };
  const today = '2026-06-26';
  const body = uniq.map((u) =>
    `  <url>\n    <loc>${u.replace(/&/g, '&amp;')}</loc>\n    <lastmod>${today}</lastmod>` +
    (changefreq && changefreq !== 'none' ? `\n    <changefreq>${changefreq}</changefreq>` : '') +
    (priority && priority !== 'none' ? `\n    <priority>${priority}</priority>` : '') +
    `\n  </url>`).join('\n');
  return {
    output: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
    lang: 'xml',
    stats: [{ label: 'URLs', value: uniq.length }],
  };
}

// Build a sitemap index from a list of child-sitemap URLs.
export function sitemapIndexGenerator({ urls }) {
  const list = [...new Set(clean(urls).split(/[\n\s,]+/).map((u) => u.trim()).filter(Boolean).map(normalizeUrl))];
  if (!list.length) return { error: 'Paste at least one sitemap URL.' };
  const today = '2026-06-26';
  const body = list.map((u) => `  <sitemap>\n    <loc>${u.replace(/&/g, '&amp;')}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`).join('\n');
  return {
    output: `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`,
    lang: 'xml',
    stats: [{ label: 'Sitemaps', value: list.length }],
  };
}

export function robotsGenerator({ sitemapUrl, allowAll, disallow }) {
  const sm = normalizeUrl(sitemapUrl);
  const lines = ['User-agent: *'];
  if (allowAll === 'block') lines.push('Disallow: /');
  else {
    clean(disallow).split('\n').map((p) => p.trim()).filter(Boolean).forEach((p) => lines.push(`Disallow: ${p.startsWith('/') ? p : '/' + p}`));
    if (!clean(disallow)) lines.push('Disallow:');
  }
  lines.push('');
  if (sm) lines.push(`Sitemap: ${sm}`);
  return { output: lines.join('\n'), lang: 'text' };
}

// Crawl one page and extract every link (internal/external split).
export async function urlExtractor({ url }) {
  const target = normalizeUrl(url);
  const origin = originOf(target);
  if (!origin) return { error: 'Enter a valid website URL.' };
  let html;
  try { html = await proxiedText(target); }
  catch { return { error: 'Could not fetch that page (CORS or unreachable).' }; }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const links = [...doc.querySelectorAll('a[href]')]
    .map((a) => { try { return new URL(a.getAttribute('href'), target).href.split('#')[0]; } catch { return ''; } })
    .filter(Boolean);
  const uniq = [...new Set(links)];
  const internal = uniq.filter((u) => u.startsWith(origin));
  const external = uniq.filter((u) => !u.startsWith(origin));
  return {
    output: `Internal links (${internal.length}):\n${internal.join('\n')}\n\nExternal links (${external.length}):\n${external.join('\n')}`,
    lang: 'text',
    stats: [{ label: 'Total', value: uniq.length }, { label: 'Internal', value: internal.length }, { label: 'External', value: external.length }],
  };
}

/* ----------------------------------------------------- calculators */

export function chatbotRoi({ tickets, costPerTicket, deflection, botCost }) {
  const t = Math.max(0, +tickets || 0);
  const c = Math.max(0, +costPerTicket || 0);
  const d = Math.min(100, Math.max(0, +deflection || 0)) / 100;
  const bot = Math.max(0, +botCost || 0);
  const deflected = Math.round(t * d);
  const grossSaving = deflected * c;
  const netMonthly = grossSaving - bot;
  const annual = netMonthly * 12;
  const roi = bot > 0 ? Math.round((netMonthly / bot) * 100) : 0;
  return {
    output:
      `Tickets / month:            ${t.toLocaleString()}\n` +
      `Deflected by chatbot:       ${deflected.toLocaleString()} (${Math.round(d * 100)}%)\n` +
      `Gross monthly saving:       $${grossSaving.toLocaleString()}\n` +
      `Chatbot monthly cost:       $${bot.toLocaleString()}\n` +
      `────────────────────────────\n` +
      `Net monthly saving:         $${netMonthly.toLocaleString()}\n` +
      `Net annual saving:          $${annual.toLocaleString()}\n` +
      `Return on investment:       ${roi}%`,
    lang: 'text',
    stats: [{ label: 'Net / mo', value: '$' + netMonthly.toLocaleString() }, { label: 'Annual', value: '$' + annual.toLocaleString() }, { label: 'ROI', value: roi + '%' }],
  };
}

/* ----------------------------------------------------- generators (offline) */

const pick = (arr, seed) => arr[Math.abs(seed) % arr.length];
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };
const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export function chatbotNameGenerator({ topic, tone }) {
  const base = clean(topic) || 'support';
  const word = base.split(/\s+/)[0];
  const w = titleCase(word);
  const friendly = ['Buddy', 'Pal', 'Helper', 'Genie', 'Sidekick', 'Companion', 'Guide', 'Wiz'];
  const pro = ['Assist', 'Desk', 'Pilot', 'Sense', 'Mind', 'Sync', 'Flow', 'Core'];
  const playful = ['Bot', 'Boo', 'Spark', 'Zap', 'Pop', 'Bubble', 'Chip', 'Bit'];
  const prefixes = ['Ask', 'Hey', 'Meet', 'Chat', 'Go', 'My'];
  const pools = tone === 'professional' ? pro : tone === 'playful' ? playful : friendly;
  const out = [];
  for (let i = 0; i < 12; i++) {
    const h = hash(base + tone + i);
    const styles = [
      `${w}${pick(pools, h)}`,
      `${pick(prefixes, h >> 2)}${w}`,
      `${w}${pick(['ly', 'o', 'ia', 'ix', 'a'], h >> 3)}`,
      `${pick(pools, h)}${pick(['AI', 'GPT', 'Bot'], h >> 4)}`,
    ];
    out.push(pick(styles, h >> 5));
  }
  return { output: [...new Set(out)].map((n, i) => `${i + 1}. ${n}`).join('\n'), lang: 'text' };
}

export function brandNameGenerator({ keywords }) {
  const words = clean(keywords).split(/[\s,]+/).filter(Boolean);
  if (!words.length) return { error: 'Enter one or two keywords describing your product.' };
  const root = titleCase(words[0]).replace(/[^A-Za-z]/g, '');
  const stem = root.slice(0, Math.max(3, Math.min(6, root.length)));
  const suffixes = ['ly', 'ify', 'io', 'ora', 'hub', 'flow', 'base', 'labs', 'wave', 'mind', 'genix', 'sphere', 'pilot', 'forge'];
  const prefixes = ['Get', 'Use', 'Go', 'Try', 'Neo', 'Meta', 'Hyper', 'Sona'];
  const out = new Set();
  suffixes.forEach((s) => out.add(stem + s));
  prefixes.forEach((p) => out.add(p + root));
  if (words[1]) out.add(root + titleCase(words[1]));
  return {
    output: [...out].slice(0, 16).map((n, i) => `${i + 1}. ${n}  →  ${n.toLowerCase()}.com / .ai`).join('\n'),
    lang: 'text',
  };
}

export function blogTitleGenerator({ topic, tone }) {
  const t = clean(topic);
  if (!t) return { error: 'Enter your blog topic or keyword.' };
  const T = titleCase(t);
  const year = 2026;
  const templates = {
    listicle: [`10 Proven Ways to ${T}`, `7 ${T} Mistakes You're Probably Making`, `${year}'s 12 Best Tools for ${T}`, `5 ${T} Hacks That Actually Work`],
    howto: [`How to ${T}: A Complete Step-by-Step Guide`, `How to ${T} (Even If You're a Beginner)`, `The Ultimate Guide to ${T} in ${year}`, `How to Master ${T} in 30 Days`],
    question: [`Is ${T} Worth It in ${year}?`, `What Is ${T} and Why Does It Matter?`, `Should You ${T}? Here's the Honest Answer`, `Why Is ${T} So Hard — And How to Fix It`],
  };
  const set = templates[tone] || [...templates.listicle, ...templates.howto, ...templates.question];
  return { output: set.map((s, i) => `${i + 1}. ${s}`).join('\n'), lang: 'text' };
}

export function emailSignature({ name, title, company, phone, email, website }) {
  const n = clean(name) || 'Your Name';
  const parts = [
    `**${n}**`,
    [clean(title), clean(company)].filter(Boolean).join(' · '),
    clean(phone) ? `📞 ${clean(phone)}` : '',
    clean(email) ? `✉️ ${clean(email)}` : '',
    clean(website) ? `🌐 ${normalizeUrl(website)}` : '',
  ].filter(Boolean);
  const html =
    `<table style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;border-collapse:collapse">\n` +
    `  <tr><td style="padding:2px 0;font-weight:bold;font-size:15px">${n}</td></tr>\n` +
    (clean(title) || clean(company) ? `  <tr><td style="padding:2px 0;color:#555">${[clean(title), clean(company)].filter(Boolean).join(' &middot; ')}</td></tr>\n` : '') +
    (clean(phone) ? `  <tr><td style="padding:2px 0">📞 ${clean(phone)}</td></tr>\n` : '') +
    (clean(email) ? `  <tr><td style="padding:2px 0">✉️ <a href="mailto:${clean(email)}" style="color:#7C3AED;text-decoration:none">${clean(email)}</a></td></tr>\n` : '') +
    (clean(website) ? `  <tr><td style="padding:2px 0">🌐 <a href="${normalizeUrl(website)}" style="color:#7C3AED;text-decoration:none">${clean(website)}</a></td></tr>\n` : '') +
    `</table>`;
  return {
    output: `Preview\n-------\n${parts.join('\n')}\n\nHTML (paste into your email client's signature settings)\n--------------------------------------------------------\n${html}`,
    lang: 'text',
  };
}

/* ----------------------------------------------------- prompt frameworks */

const FRAMEWORKS = {
  APE: { name: 'APE (Action · Purpose · Expectation)', parts: ['Action', 'Purpose', 'Expectation'] },
  RACE: { name: 'RACE (Role · Action · Context · Expectation)', parts: ['Role', 'Action', 'Context', 'Expectation'] },
  CREATE: { name: 'CREATE (Character · Request · Examples · Adjustments · Type · Extras)', parts: ['Character', 'Request', 'Examples', 'Adjustments', 'Type of output', 'Extras'] },
  SPARK: { name: 'SPARK (Situation · Purpose · Audience · Result · Knobs)', parts: ['Situation', 'Purpose', 'Audience', 'Result', 'Knobs / constraints'] },
};

export function promptGenerator({ task, role, audience, format, framework }) {
  const t = clean(task);
  if (!t) return { error: 'Describe the task you want the AI to do.' };
  const fw = FRAMEWORKS[framework] || FRAMEWORKS.RACE;
  const r = clean(role) || 'an expert assistant';
  const a = clean(audience) || 'a general audience';
  const f = clean(format) || 'a clear, well-structured response';

  const blocks = {
    Role: `You are ${r}.`,
    Character: `Act as ${r}.`,
    Situation: `Context: I need help with the following task.`,
    Action: `Your task: ${t}.`,
    Request: `Please ${t}.`,
    Purpose: `Goal: ${t}. The output will be used to achieve this purpose.`,
    Context: `Audience: ${a}. Tailor depth and tone accordingly.`,
    Audience: `Write for ${a}.`,
    Examples: `If helpful, include 1–2 concrete examples.`,
    Adjustments: `Ask clarifying questions if the request is ambiguous before answering.`,
    Expectation: `Deliver ${f}. Be accurate, concise, and actionable.`,
    Result: `Deliver ${f}.`,
    'Type of output': `Format: ${f}.`,
    Knobs: `Constraints: keep it focused, avoid filler, cite assumptions.`,
    'Knobs / constraints': `Constraints: keep it focused, avoid filler, cite assumptions.`,
    Extras: `Finish with a short checklist of next steps.`,
  };
  const prompt = fw.parts.map((p) => blocks[p]).filter(Boolean).join('\n\n');
  return {
    output: `Framework: ${fw.name}\n${'─'.repeat(40)}\n\n${prompt}`,
    lang: 'text',
    preview: undefined,
  };
}

export function promptOptimizer({ prompt }) {
  const p = clean(prompt);
  if (!p) return { error: 'Paste the prompt you want to improve.' };
  const lower = p.toLowerCase();
  const suggestions = [];
  if (!/you are|act as|role/i.test(p)) suggestions.push('Add a ROLE: tell the AI who to be ("You are a senior copywriter…").');
  if (p.length < 60) suggestions.push('Add CONTEXT: a one-line prompt under-specifies the task — describe the situation and goal.');
  if (!/format|bullet|list|table|json|markdown|step/i.test(lower)) suggestions.push('Specify the OUTPUT FORMAT (bullets, table, JSON, word count…).');
  if (!/audience|reader|customer|beginner|expert/i.test(lower)) suggestions.push('Name the AUDIENCE so tone and depth are right.');
  if (!/example|e\.g\.|for instance/i.test(lower)) suggestions.push('Give an EXAMPLE of the style or output you want.');
  if (!/tone|formal|casual|friendly|professional/i.test(lower)) suggestions.push('Set the TONE explicitly.');

  const rewritten =
    `You are an expert assistant. Your task:\n${p}\n\n` +
    `Requirements:\n` +
    `- Audience: [who will read this]\n` +
    `- Tone: [formal / friendly / persuasive]\n` +
    `- Format: [bullets / table / step-by-step / JSON]\n` +
    `- Length: [e.g. ~300 words]\n` +
    `If anything is ambiguous, ask before answering.`;
  return {
    output:
      `Improvements (${suggestions.length}):\n` +
      (suggestions.length ? suggestions.map((s) => '• ' + s).join('\n') : '• Looks solid — this prompt already covers the key dimensions.') +
      `\n\n${'─'.repeat(40)}\nOptimized template\n${'─'.repeat(40)}\n${rewritten}`,
    lang: 'text',
  };
}

/* ----------------------------------------------------- text generators */

export function faqGenerator({ text, count }) {
  const body = clean(text);
  if (!body) return { error: 'Paste the content to turn into an FAQ.' };
  const n = Math.min(12, Math.max(3, +count || 6));
  // Heuristic: use headings / strong sentences as the basis for questions.
  const sentences = body.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter((s) => s.split(' ').length > 5);
  const topic = (body.split(/\s+/).slice(0, 3).join(' ')) || 'this topic';
  const starters = ['What is', 'How does', 'Why is', 'When should you use', 'What are the benefits of', 'How do I get started with', 'Is it safe to use', 'How much does it cost to use'];
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = sentences[i % Math.max(1, sentences.length)] || topic;
    const subject = s.split(' ').slice(0, 6).join(' ').replace(/[.,!?]$/, '');
    out.push(`**Q${i + 1}: ${starters[i % starters.length]} ${subject.toLowerCase()}?**\n${s}`);
  }
  return { output: '## Frequently Asked Questions\n\n' + out.join('\n\n'), lang: 'markdown', preview: 'md' };
}

export function emailResponseGenerator({ incoming, tone, intent }) {
  const msg = clean(incoming);
  if (!msg) return { error: 'Paste the email you need to reply to.' };
  const greetings = { professional: 'Dear Sender,', friendly: 'Hi there,', formal: 'To whom it may concern,' };
  const closings = { professional: 'Best regards,', friendly: 'Cheers,', formal: 'Sincerely,' };
  const g = greetings[tone] || greetings.professional;
  const c = closings[tone] || closings.professional;
  const intents = {
    accept: 'Thank you for your message. I am happy to confirm and proceed as you suggested.',
    decline: 'Thank you for reaching out. After consideration, I won’t be able to move forward on this, but I appreciate you thinking of me.',
    followup: 'Thank you for your note. I wanted to follow up and make sure we’re aligned on the next steps.',
    info: 'Thank you for your email. Here is the information you requested, and please let me know if anything needs clarification.',
  };
  const lead = intents[intent] || intents.info;
  const firstLine = msg.split(/[.!?\n]/)[0].slice(0, 80);
  return {
    output: `${g}\n\n${lead}\n\nRegarding your message ("${firstLine}…"), I’ve reviewed the details and will make sure everything is handled promptly. Please don’t hesitate to reach out if you have any further questions.\n\n${c}\n[Your Name]`,
    lang: 'text',
  };
}

export function letterGenerator({ type, recipient, sender, details }) {
  const r = clean(recipient) || '[Recipient]';
  const s = clean(sender) || '[Your Name]';
  const d = clean(details) || '[purpose of this letter]';
  const date = 'June 26, 2026';
  const bodies = {
    cover: `I am writing to express my strong interest in the position. ${d} I am confident that my background and skills make me a strong fit, and I would welcome the opportunity to contribute.`,
    resignation: `Please accept this letter as formal notice of my resignation. ${d} I am grateful for the opportunities I have had and will do everything I can to ensure a smooth transition.`,
    complaint: `I am writing to formally raise a concern. ${d} I would appreciate your prompt attention to this matter and a resolution at your earliest convenience.`,
    recommendation: `It is my pleasure to recommend ${r}. ${d} I am confident they would be a valuable addition to any team.`,
    thankyou: `I wanted to take a moment to sincerely thank you. ${d} Your support has meant a great deal to me.`,
  };
  const body = bodies[type] || bodies.cover;
  return {
    output: `${date}\n\nDear ${r},\n\n${body}\n\nSincerely,\n${s}`,
    lang: 'text',
  };
}

export function customerServiceScript({ scenario, product, tone }) {
  const sc = clean(scenario) || 'a general inquiry';
  const p = clean(product) || 'our product';
  const warm = tone === 'formal' ? 'Thank you for contacting us.' : 'Thanks so much for reaching out!';
  return {
    output:
      `Customer Service Script — ${titleCase(sc)}\n${'─'.repeat(40)}\n\n` +
      `1. Greeting\n   "${warm} My name is [Agent], how can I help you with ${p} today?"\n\n` +
      `2. Acknowledge\n   "I completely understand, and I’m sorry for any trouble this ${sc} has caused. Let’s get it sorted."\n\n` +
      `3. Clarify\n   "To make sure I help you correctly, could you tell me a little more about what happened?"\n\n` +
      `4. Resolve\n   "Here’s what I can do for you: [solution steps]. I’ll take care of this right now."\n\n` +
      `5. Confirm\n   "Does that fully resolve your ${sc}? Is there anything else I can help you with?"\n\n` +
      `6. Close\n   "Thank you for choosing ${p}. Have a wonderful day!"`,
    lang: 'text',
  };
}
