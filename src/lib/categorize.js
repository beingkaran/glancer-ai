/*
 * categorize — content-based auto-categorisation for news headlines.
 *
 * Every RSS source carries a hand-assigned beat, but a single publisher posts
 * across many topics (TechCrunch runs hardware, policy AND product stories).
 * Rather than trust the source label blindly, `classify` reads an article's own
 * title + summary and scores it against keyword sets for the eight categories.
 * The best-scoring category wins; the source's beat acts as a gentle prior
 * (small bonus) and as the fallback when nothing matches — so a chip like
 * "Hardware" or "Policy" collects the right stories no matter who published them.
 *
 * Pure + dependency-free so it runs anywhere and is easy to unit-test.
 */

export const CATEGORY_KEYWORDS = {
  Models: ['gpt', 'claude', 'gemini', 'llama', 'mistral', 'grok', 'frontier model', 'foundation model', 'large language model', 'llm', 'llms', 'multimodal', 'fine-tune', 'fine tuning', 'context window', 'sora', 'dall-e', 'midjourney', 'diffusion model', 'new model', 'reasoning model', 'model release', 'releases a model', 'flagship model'],
  Research: ['research', 'study', 'paper', 'arxiv', 'benchmark', 'breakthrough', 'scientists', 'university', 'professor', 'experiment', 'findings', 'preprint', 'peer-review', 'neural network', 'state-of-the-art', 'sota', 'dataset', 'novel approach'],
  'Open Source': ['open source', 'open-source', 'open weights', 'open-weight', 'hugging face', 'pytorch', 'tensorflow', 'apache', 'mit license', 'open model', 'community model', 'released on github'],
  Tools: ['tutorial', 'how to', 'how-to', 'step-by-step', 'guide', 'langchain', 'agent framework', 'no-code', 'app builder', 'prompt engineering', 'rag', 'vector database', 'build an', 'build a', 'getting started', 'developers can', 'sdk', 'ai agent', 'agentic', 'copilot'],
  Hardware: ['gpu', 'nvidia', 'chip', 'silicon', 'tpu', 'data center', 'datacenter', 'h100', 'h200', 'blackwell', 'semiconductor', 'wafer', 'robot', 'robotics', 'humanoid', 'drone', 'tsmc', 'amd', 'accelerator'],
  // AIOps / observability / APM — the niche beat. Keep this list rich so
  // observability, monitoring and Gartner-style analyst posts land here.
  AIOps: ['observability', 'aiops', 'apm', 'application performance', 'monitoring', 'devops', 'sre ', 'site reliability', 'incident', 'telemetry', 'opentelemetry', 'otel', 'datadog', 'grafana', 'prometheus', 'kubernetes', 'k8s', 'distributed tracing', 'tracing', 'log management', 'uptime', 'on-call', 'reliability', 'mlops', 'llmops', 'observ', 'dynatrace', 'new relic', 'splunk', 'opsramp', 'instrumentation', 'service mesh', 'root cause', 'anomaly detection'],
  Policy: ['regulation', 'regulatory', 'policy', 'lawsuit', 'eu ai act', 'government', 'congress', 'senate', 'ethics', 'safety', 'copyright', 'privacy', 'executive order', 'white house', 'regulators', 'compliance', 'misinformation', 'deepfake', 'governance', 'antitrust'],
  Industry: ['startup', 'funding', 'raises', 'valuation', 'acquisition', 'acquires', 'ipo', 'partnership', 'enterprise', 'revenue', 'ceo', 'layoffs', 'investment', 'venture', 'billion', 'deal', 'customers', 'rollout', 'market'],
};

// Short tokens that would false-match as substrings (api → therapist, arm →
// alarm, sota → mascota). Matched only on whole-word boundaries.
const BOUNDARY_TOKENS = new Set(['gpt', 'llm', 'llms', 'rag', 'sdk', 'tpu', 'gpu', 'amd', 'apm', 'otel', 'k8s', 'sota', 'ipo', 'ceo', 'otel', 'sre ']);

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Count a keyword in `hay`: word-boundary match for short/ambiguous tokens,
// plain substring for distinctive phrases. Returns 1 if present, else 0.
function hit(hay, word) {
  if (BOUNDARY_TOKENS.has(word)) {
    return new RegExp(`\\b${escapeRe(word.trim())}\\b`).test(hay) ? 1 : 0;
  }
  return hay.includes(word) ? 1 : 0;
}

// Ties break toward more specific categories before the broad "Industry"
// catch-all, so a funded chip startup lands in Hardware, not Industry.
export const CATEGORY_PRIORITY = ['AIOps', 'Policy', 'Hardware', 'Open Source', 'Models', 'Research', 'Tools', 'Industry'];

/**
 * Classify an article into one news category from its title + summary.
 *
 * The title is the strongest signal, so a keyword in the title counts double a
 * keyword in the body. The source's own beat is a prior (a small bonus + the
 * fallback) — strengthened for niche beats like AIOps so an observability
 * publisher's post stays in AIOps unless another category clearly wins.
 */
export function classify(title = '', summary = '', sourceCategory = 'Industry') {
  const titleHay = ` ${title} `.toLowerCase();
  const bodyHay = ` ${summary} `.toLowerCase();
  const scores = {};
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const w of words) {
      if (hit(titleHay, w)) score += 2;       // title match — strong signal
      else if (hit(bodyHay, w)) score += 1;   // body-only match — weaker
    }
    scores[cat] = score;
  }
  // Source prior: counts as ~2 keyword hits so a toss-up defers to the
  // publisher's focus. Niche beats (AIOps) get a touch more so observability
  // sources don't bleed into Industry on a single stray "enterprise"/"revenue".
  if (scores[sourceCategory] !== undefined) {
    scores[sourceCategory] += sourceCategory === 'AIOps' ? 3 : 2;
  }

  let best = sourceCategory;
  let bestScore = -1;
  for (const cat of CATEGORY_PRIORITY) {
    if (scores[cat] > bestScore) { bestScore = scores[cat]; best = cat; }
  }
  // Nothing matched at all → keep the source's category.
  return bestScore <= 0 ? sourceCategory : best;
}
