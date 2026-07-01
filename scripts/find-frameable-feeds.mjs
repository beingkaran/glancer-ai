// Probe a large candidate list of AI-news RSS feeds and report which ones are
// BOTH (a) a valid RSS/Atom feed and (b) embeddable in an <iframe> (no
// X-Frame-Options / restrictive CSP frame-ancestors on the site root).
// Usage: node scripts/find-frameable-feeds.mjs
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

const CANDIDATES = [
  // Research / ML blogs (GitHub Pages & self-hosted tend to allow framing)
  { url: 'https://lilianweng.github.io/index.xml', source: "Lil'Log", category: 'Research' },
  { url: 'https://jalammar.github.io/feed.xml', source: 'Jay Alammar', category: 'Research' },
  { url: 'https://huyenchip.com/feed.xml', source: 'Chip Huyen', category: 'Research' },
  { url: 'https://eugeneyan.com/rss/', source: 'Eugene Yan', category: 'Research' },
  { url: 'https://sebastianraschka.com/rss_feed.xml', source: 'Sebastian Raschka', category: 'Research' },
  { url: 'https://ruder.io/rss/index.rss', source: 'Sebastian Ruder', category: 'Research' },
  { url: 'https://ai.stanford.edu/blog/feed.xml', source: 'Stanford AI Lab', category: 'Research' },
  { url: 'https://blog.ml.cmu.edu/feed/', source: 'CMU ML', category: 'Research' },
  { url: 'https://distill.pub/rss.xml', source: 'Distill', category: 'Research' },
  { url: 'https://www.fast.ai/index.xml', source: 'fast.ai', category: 'Research' },
  { url: 'https://blog.eleuther.ai/index.xml', source: 'EleutherAI', category: 'Research' },
  { url: 'https://magazine.sebastianraschka.com/feed', source: 'Ahead of AI', category: 'Research' },
  { url: 'https://www.assemblyai.com/blog/rss/', source: 'AssemblyAI', category: 'Research' },
  { url: 'https://www.answer.ai/index.xml', source: 'Answer.AI', category: 'Research' },

  // Industry / news
  { url: 'https://www.analyticsvidhya.com/blog/feed/', source: 'Analytics Vidhya', category: 'Industry' },
  { url: 'https://dataconomy.com/feed/', source: 'Dataconomy', category: 'Industry' },
  { url: 'https://www.datanami.com/feed/', source: 'Datanami', category: 'Industry' },
  { url: 'https://emerj.com/feed/', source: 'Emerj', category: 'Industry' },
  { url: 'https://aimagazine.com/rss', source: 'AI Magazine', category: 'Industry' },
  { url: 'https://www.aitimejournal.com/feed/', source: 'AI Time Journal', category: 'Industry' },
  { url: 'https://opendatascience.com/feed/', source: 'Open Data Science', category: 'Industry' },
  { url: 'https://becominghuman.ai/feed', source: 'Becoming Human', category: 'Industry' },
  { url: 'https://www.aiwire.net/feed/', source: 'AIwire', category: 'Industry' },
  { url: 'https://insidebigdata.com/feed/', source: 'insideBIGDATA', category: 'Industry' },
  { url: 'https://www.marktechpost.com/feed/', source: 'MarkTechPost 2', category: 'Industry' },
  { url: 'https://aibusiness.com/rss.xml', source: 'AI Business 2', category: 'Industry' },
  { url: 'https://www.techradar.com/rss/news/computing', source: 'TechRadar', category: 'Industry' },
  { url: 'https://readwrite.com/feed/', source: 'ReadWrite', category: 'Industry' },
  { url: 'https://www.geeky-gadgets.com/feed/', source: 'Geeky Gadgets', category: 'Industry' },
  { url: 'https://indianexpress.com/section/technology/artificial-intelligence/feed/', source: 'Indian Express AI', category: 'Industry' },

  // Tools / dev platforms
  { url: 'https://www.pinecone.io/blog/rss.xml', source: 'Pinecone', category: 'Tools' },
  { url: 'https://www.deepgram.com/learn/rss.xml', source: 'Deepgram', category: 'Tools' },
  { url: 'https://neptune.ai/blog/feed', source: 'Neptune.ai', category: 'Tools' },
  { url: 'https://encord.com/blog/rss.xml', source: 'Encord', category: 'Tools' },
  { url: 'https://www.width.ai/rss/blog', source: 'Width.ai', category: 'Tools' },
  { url: 'https://blog.roboflow.com/rss/', source: 'Roboflow 2', category: 'Tools' },
  { url: 'https://wandb.ai/fully-connected/rss.xml', source: 'Weights & Biases', category: 'Tools' },
  { url: 'https://www.jasper.ai/blog/rss.xml', source: 'Jasper', category: 'Tools' },
  { url: 'https://zilliz.com/blog/rss.xml', source: 'Zilliz', category: 'Tools' },
  { url: 'https://blog.gopenai.com/feed', source: 'GoPenAI', category: 'Tools' },
  { url: 'https://www.datacamp.com/blog/rss.xml', source: 'DataCamp', category: 'Tools' },
  { url: 'https://deepchecks.com/feed/', source: 'Deepchecks', category: 'Tools' },

  // Open source / model labs
  { url: 'https://mistral.ai/news/rss.xml', source: 'Mistral AI', category: 'Open Source' },
  { url: 'https://www.together.ai/blog/rss.xml', source: 'Together AI', category: 'Open Source' },
  { url: 'https://allenai.org/newsletters/rss.xml', source: 'Allen AI', category: 'Open Source' },
  { url: 'https://laion.ai/blog/index.xml', source: 'LAION', category: 'Open Source' },
  { url: 'https://ollama.com/blog/rss.xml', source: 'Ollama', category: 'Open Source' },
  { url: 'https://qdrant.tech/blog/index.xml', source: 'Qdrant', category: 'Open Source' },
  { url: 'https://www.trychroma.com/blog/rss.xml', source: 'Chroma', category: 'Open Source' },
  { url: 'https://weaviate.io/feed.xml', source: 'Weaviate', category: 'Open Source' },
  { url: 'https://blog.vllm.ai/feed.xml', source: 'vLLM', category: 'Open Source' },

  // Hardware
  { url: 'https://www.cerebras.ai/blog/rss.xml', source: 'Cerebras', category: 'Hardware' },
  { url: 'https://groq.com/feed/', source: 'Groq', category: 'Hardware' },
  { url: 'https://www.graphcore.ai/rss.xml', source: 'Graphcore', category: 'Hardware' },
  { url: 'https://semiengineering.com/feed/', source: 'Semiconductor Eng', category: 'Hardware' },
  { url: 'https://www.hpcwire.com/feed/', source: 'HPCwire', category: 'Hardware' },
  { url: 'https://www.eetimes.com/feed/', source: 'EE Times', category: 'Hardware' },

  // AIOps / observability
  { url: 'https://www.splunk.com/en_us/blog/feed/artificial-intelligence.rss', source: 'Splunk AI', category: 'AIOps' },
  { url: 'https://last9.io/blog/rss.xml', source: 'Last9', category: 'AIOps' },
  { url: 'https://betterstack.com/community/rss.xml', source: 'Better Stack', category: 'AIOps' },
  { url: 'https://uptrace.dev/blog/index.xml', source: 'Uptrace', category: 'AIOps' },
  { url: 'https://middleware.io/blog/feed/', source: 'Middleware', category: 'AIOps' },
  { url: 'https://www.observeinc.com/feed/', source: 'Observe', category: 'AIOps' },
  { url: 'https://groundcover.com/blog/rss.xml', source: 'groundcover', category: 'AIOps' },

  // Policy / ethics
  { url: 'https://hai.stanford.edu/news/rss.xml', source: 'Stanford HAI', category: 'Policy' },
  { url: 'https://cset.georgetown.edu/feed/', source: 'CSET', category: 'Policy' },
  { url: 'https://montrealethics.ai/feed/', source: 'Montreal AI Ethics', category: 'Policy' },
  { url: 'https://www.adalovelaceinstitute.org/feed/', source: 'Ada Lovelace', category: 'Policy' },
  { url: 'https://epoch.ai/blog/rss.xml', source: 'Epoch AI', category: 'Policy' },
  { url: 'https://www.lawfaremedia.org/feed/', source: 'Lawfare', category: 'Policy' },
  { url: 'https://ainowinstitute.org/feed', source: 'AI Now', category: 'Policy' },

  // Models / product
  { url: 'https://news.ycombinator.com/rss', source: 'Hacker News', category: 'Models' },
  { url: 'https://www.reddit.com/r/MachineLearning/.rss', source: 'r/MachineLearning', category: 'Models' },
  { url: 'https://hnrss.org/newest?q=AI', source: 'HN: AI', category: 'Models' },
];

function frameAncestors(csp) {
  if (!csp) return null;
  const m = /frame-ancestors\s+([^;]+)/i.exec(csp);
  if (!m) return null;
  return m[1].trim().split(/\s+/).map((s) => s.toLowerCase());
}
function frameableFromHeaders(xfo, csp) {
  const fa = frameAncestors(csp);
  if (fa) return fa.includes('*'); // only '*' allows arbitrary embedding
  if (xfo) return false;           // any XFO (deny/sameorigin) blocks us
  return true;                     // no XFO and no frame-ancestors → embeddable
}

async function fetchWithTimeout(url, opts = {}, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal, redirect: 'follow', headers: { 'User-Agent': UA, ...(opts.headers || {}) } });
  } finally { clearTimeout(t); }
}

async function checkFeedValid(url) {
  try {
    const res = await fetchWithTimeout(url, { headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' } });
    if (!res.ok) return { ok: false, why: `feed http ${res.status}` };
    const body = (await res.text()).slice(0, 4000).toLowerCase();
    const looksFeed = body.includes('<rss') || body.includes('<feed') || body.includes('<rdf') || (body.includes('<?xml') && body.includes('<item'));
    return looksFeed ? { ok: true } : { ok: false, why: 'not a feed' };
  } catch (e) { return { ok: false, why: `feed err ${e.message}` }; }
}

async function checkFrameable(feedUrl) {
  try {
    const origin = new URL(feedUrl).origin;
    const res = await fetchWithTimeout(origin + '/', { headers: { Accept: 'text/html' } });
    const xfo = res.headers.get('x-frame-options');
    const csp = res.headers.get('content-security-policy');
    return { frameable: frameableFromHeaders(xfo, csp), detail: xfo ? `xfo:${xfo}` : csp && /frame-ancestors/i.test(csp) ? 'csp-fa' : 'open' };
  } catch (e) { return { frameable: false, detail: `origin err ${e.message}` }; }
}

async function pool(items, worker, concurrency = 6) {
  const out = []; let i = 0;
  async function lane() { while (i < items.length) { const idx = i++; out[idx] = await worker(items[idx]); } }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane));
  return out;
}

const results = await pool(CANDIDATES, async (c) => {
  const feed = await checkFeedValid(c.url);
  if (!feed.ok) return { ...c, pass: false, why: feed.why };
  const fr = await checkFrameable(c.url);
  return { ...c, pass: fr.frameable, why: fr.frameable ? 'PASS' : `blocked (${fr.detail})` };
});

const passed = results.filter((r) => r.pass);
console.log('\n=== PASS (valid feed + frameable) ===');
for (const r of passed) console.log(`  { url: '${r.url}', source: '${r.source}', category: '${r.category}', frameable: true },`);
console.log(`\nPASS: ${passed.length} / ${CANDIDATES.length}`);
console.log('\n=== FAILED ===');
for (const r of results.filter((r) => !r.pass)) console.log(`  no  ${r.source.padEnd(22)} ${r.why}`);
