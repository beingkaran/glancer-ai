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
  Models: ['gpt', 'claude', 'gemini', 'llama', 'mistral', 'grok', 'frontier model', 'foundation model', 'large language model', ' llm', 'multimodal', 'fine-tune', 'fine tuning', 'parameters', 'context window', 'sora', 'dall-e', 'midjourney', 'diffusion model', 'unveils', 'launches model', 'new model', 'reasoning model', 'token'],
  Research: ['research', 'study', 'paper', 'arxiv', 'benchmark', 'breakthrough', 'scientists', 'university', 'professor', 'experiment', 'findings', 'preprint', 'peer-review', 'neural network', 'state-of-the-art', 'sota', 'dataset', 'algorithm'],
  'Open Source': ['open source', 'open-source', 'open weights', 'hugging face', 'github', 'pytorch', 'tensorflow', 'apache', 'mit license', 'repository', 'sdk', 'library', 'weights', 'community model'],
  Tools: ['tutorial', 'how to', 'how-to', 'guide', 'framework', 'langchain', 'agent framework', 'workflow', 'no-code', 'plugin', 'extension', 'app builder', 'prompt', 'rag', 'vector database', 'api', 'integration', 'productivity', 'build with', 'developers can'],
  Hardware: ['gpu', 'nvidia', 'chip', 'silicon', 'tpu', 'data center', 'datacenter', 'h100', 'h200', 'blackwell', 'semiconductor', 'wafer', 'compute', 'cluster', 'robot', 'robotics', 'humanoid', 'drone', 'edge device', 'tsmc', 'amd', 'arm '],
  AIOps: ['observability', 'aiops', 'monitoring', 'devops', 'sre', 'incident', 'telemetry', 'opentelemetry', 'datadog', 'grafana', 'prometheus', 'kubernetes', 'tracing', 'uptime', 'on-call', 'reliability', 'mlops'],
  Policy: ['regulation', 'policy', 'lawsuit', 'eu ai act', 'government', 'congress', 'senate', 'ethics', 'safety', 'copyright', 'privacy', 'executive order', 'white house', 'regulators', 'compliance', 'misinformation', 'deepfake', 'governance', 'antitrust'],
  Industry: ['startup', 'funding', 'raises', 'valuation', 'acquisition', 'acquires', 'ipo', 'partnership', 'enterprise', 'revenue', 'ceo', 'layoffs', 'investment', 'venture', 'billion', 'million', 'deal', 'customers', 'rollout'],
};

// Ties break toward more specific categories before the broad "Industry"
// catch-all, so a funded chip startup lands in Hardware, not Industry.
export const CATEGORY_PRIORITY = ['AIOps', 'Policy', 'Hardware', 'Open Source', 'Models', 'Research', 'Tools', 'Industry'];

export function classify(title = '', summary = '', sourceCategory = 'Industry') {
  const hay = ` ${title} ${summary} `.toLowerCase();
  const scores = {};
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const w of words) if (hay.includes(w)) score += 1;
    scores[cat] = score;
  }
  // Gentle prior: the source's own beat counts as ~1.5 keyword hits, so a
  // toss-up defers to the publisher's focus without overriding clear signals.
  if (scores[sourceCategory] !== undefined) scores[sourceCategory] += 1.5;

  let best = sourceCategory;
  let bestScore = -1;
  for (const cat of CATEGORY_PRIORITY) {
    if (scores[cat] > bestScore) { bestScore = scores[cat]; best = cat; }
  }
  // Nothing matched at all → keep the source's category.
  return bestScore <= 0 ? sourceCategory : best;
}
