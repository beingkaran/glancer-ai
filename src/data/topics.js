/*
 * topics — the curated entity/topic hubs that power programmatic SEO (pSEO).
 *
 * Each entry becomes a real, indexable page at /topic/<slug>. The build step
 * (scripts/generate-topic-hubs.mjs) prerenders a static HTML snapshot of every
 * hub — a fresh, categorised list of recent articles with an original "Signal"
 * takeaway on each — so crawlers and Google Discover see unique text + ItemList
 * schema without running JS. The client route (TopicHubPage) shows the same
 * hub live for humans.
 *
 * Adding a hub = add ONE object here. Keep it pure + dependency-free so both the
 * Node build script and the browser bundle can import it.
 *
 * `match` keywords: an article's title + summary is scored against them (title
 * hits count double). Short/ambiguous tokens are matched on word boundaries via
 * BOUNDARY_TOKENS so "rag" doesn't match "storage" and "apm" doesn't match a
 * random substring. An article can belong to several hubs — that's intended;
 * broad entity coverage is the whole point of pSEO.
 */

export const TOPICS = [
  // ── AI labs / companies ────────────────────────────────────────────────
  {
    slug: 'openai',
    title: 'OpenAI News',
    tagline: 'ChatGPT, GPT models, Sora & the latest from OpenAI',
    intro:
      'Every meaningful OpenAI update — model launches, API and pricing changes, ' +
      'research, safety and product moves — curated and cut down to the signal. ' +
      'We skip the hype cycle and surface what actually changes for builders.',
    match: ['openai', "openai's", 'chatgpt', 'gpt-4', 'gpt-5', 'gpt4', 'gpt5', 'gpt', 'sora', 'dall-e', 'dall·e', 'sam altman', 'o1', 'o3', 'o4'],
  },
  {
    slug: 'anthropic',
    title: 'Anthropic & Claude News',
    tagline: 'Claude models, the API, and Anthropic research',
    intro:
      'The latest on Anthropic and the Claude family — new model releases, API ' +
      'and tool-use updates, pricing, enterprise moves and safety research — ' +
      'distilled to what matters for developers shipping on Claude.',
    match: ['anthropic', "anthropic's", 'claude', 'claude 3', 'claude 4', 'claude opus', 'claude sonnet', 'claude haiku', 'dario amodei', 'constitutional ai', 'model context protocol', 'mcp'],
  },
  {
    slug: 'google-gemini',
    title: 'Google & Gemini News',
    tagline: 'Gemini, DeepMind, Gemma and Google AI',
    intro:
      'Google DeepMind and the Gemini stack, tracked continuously — Gemini and ' +
      'Gemma releases, research breakthroughs, and how Google is wiring AI into ' +
      'Search, Workspace and Cloud — filtered down to the parts that matter.',
    match: ['gemini', 'google deepmind', 'deepmind', 'gemma', 'alphafold', 'sundar pichai', 'google ai', 'bard', 'vertex ai'],
  },
  {
    slug: 'meta-ai',
    title: 'Meta AI & Llama News',
    tagline: 'Llama models, open weights and Meta AI research',
    intro:
      "Meta's open-weight push, tracked in one place — Llama model releases, FAIR " +
      'research, licensing changes and product rollouts across Meta apps — with an ' +
      'original takeaway on why each move matters for the open-source ecosystem.',
    match: ['meta ai', "meta's", 'llama', 'llama 3', 'llama 4', 'fair', 'yann lecun', 'meta llama', 'ray-ban meta'],
  },
  {
    slug: 'microsoft-ai',
    title: 'Microsoft & Copilot News',
    tagline: 'Copilot, Azure AI and the Microsoft–OpenAI stack',
    intro:
      "Microsoft's AI moves across Copilot, Azure AI and GitHub — product launches, " +
      'enterprise pricing, and the evolving OpenAI partnership — curated to the ' +
      'updates that change how teams build and buy.',
    match: ['microsoft', "microsoft's", 'copilot', 'azure ai', 'azure openai', 'github copilot', 'satya nadella', 'bing ai', 'phi-3', 'phi-4'],
  },
  {
    slug: 'nvidia',
    title: 'NVIDIA & AI Hardware News',
    tagline: 'GPUs, Blackwell, CUDA and the compute layer',
    intro:
      'The compute layer under the AI boom — NVIDIA GPU launches, Blackwell and ' +
      'CUDA updates, data-center deals and supply news — plus the rival silicon ' +
      'worth watching, each with a one-line why-it-matters.',
    match: ['nvidia', "nvidia's", 'blackwell', 'h100', 'h200', 'gb200', 'cuda', 'jensen huang', 'tensor core', 'gpu cluster', 'ai chip', 'ai accelerator', 'tpu'],
  },
  {
    slug: 'mistral',
    title: 'Mistral AI News',
    tagline: 'Mistral, Mixtral and Le Chat',
    intro:
      "Europe's open-weight frontier lab — Mistral and Mixtral model releases, Le " +
      'Chat product news, funding and enterprise deals — condensed to the signal ' +
      'for teams evaluating open models.',
    match: ['mistral', "mistral's", 'mixtral', 'le chat', 'codestral', 'ministral'],
  },

  // ── Capabilities / topics ──────────────────────────────────────────────
  {
    slug: 'ai-agents',
    title: 'AI Agents News',
    tagline: 'Agentic systems, frameworks and autonomous workflows',
    intro:
      'The fast-moving world of AI agents — new agent frameworks, tool-use and ' +
      'multi-agent breakthroughs, and real production deployments — curated for ' +
      'developers building autonomous, agentic software.',
    match: ['ai agent', 'ai agents', 'agentic', 'autonomous agent', 'agent framework', 'multi-agent', 'multi agent', 'tool use', 'tool-use', 'langchain', 'langgraph', 'autogpt', 'crewai', 'computer use', 'browser agent'],
  },
  {
    slug: 'image-generation',
    title: 'AI Image Generation News',
    tagline: 'Text-to-image, diffusion models and creative AI',
    intro:
      'Generative imagery, tracked end to end — new text-to-image and diffusion ' +
      'models, creative-tool launches, and the licensing and IP fights shaping ' +
      'the space — each entry cut to why it matters.',
    match: ['image generation', 'text-to-image', 'text to image', 'midjourney', 'stable diffusion', 'dall-e', 'dall·e', 'flux', 'diffusion model', 'image model', 'generative image', 'ideogram', 'firefly'],
  },
  {
    slug: 'coding-assistants',
    title: 'AI Coding Assistants News',
    tagline: 'Copilot, Cursor, code-gen and dev tools',
    intro:
      'AI in the developer workflow — coding-assistant launches, IDE and ' +
      'code-generation updates, benchmarks, and how agentic coding tools are ' +
      'changing shipping velocity — filtered to the signal for engineers.',
    match: ['coding assistant', 'code generation', 'code completion', 'copilot', 'cursor', 'codeium', 'ai coding', 'ai coder', 'devin', 'code llm', 'pair programming', 'swe-bench', 'claude code'],
  },
  {
    slug: 'rag',
    title: 'RAG & Vector Search News',
    tagline: 'Retrieval-augmented generation and vector databases',
    intro:
      'Retrieval-augmented generation, tracked for practitioners — vector-database ' +
      'and embedding updates, retrieval research, and production RAG patterns — ' +
      'condensed to what changes how you ground models in your own data.',
    match: ['rag', 'retrieval-augmented', 'retrieval augmented', 'vector database', 'vector db', 'embeddings', 'embedding model', 'semantic search', 'pinecone', 'weaviate', 'chroma', 'pgvector', 'reranker', 'knowledge base'],
  },

  // ── Enterprise / the AIOps thesis ──────────────────────────────────────
  {
    slug: 'aiops',
    title: 'AIOps News',
    tagline: 'AI for IT operations, incidents and automation',
    intro:
      'AIOps in practice — AI-driven incident response, root-cause analysis, ' +
      'anomaly detection and ops automation — curated for SREs and platform teams ' +
      'who need the signal, not vendor noise.',
    match: ['aiops', 'incident response', 'root cause', 'anomaly detection', 'ops automation', 'devops', 'sre ', 'site reliability', 'on-call', 'mlops', 'llmops', 'opsramp', 'moogsoft'],
  },
  {
    slug: 'observability',
    title: 'Observability News',
    tagline: 'OpenTelemetry, tracing, metrics and logs',
    intro:
      'The observability stack, tracked continuously — OpenTelemetry and tracing ' +
      'updates, metrics and log-management moves, and the AI features landing in ' +
      'monitoring platforms — each with a why-it-matters for engineers.',
    match: ['observability', 'observ', 'opentelemetry', 'otel', 'telemetry', 'distributed tracing', 'tracing', 'grafana', 'prometheus', 'datadog', 'splunk', 'log management', 'instrumentation', 'service mesh'],
  },
  {
    slug: 'apm',
    title: 'APM News',
    tagline: 'Application performance monitoring',
    intro:
      'Application performance monitoring, distilled — APM platform launches and ' +
      'pricing, latency and reliability tooling, and the AI features reshaping ' +
      'how teams find and fix production issues.',
    match: ['apm', 'application performance', 'new relic', 'dynatrace', 'appdynamics', 'latency monitoring', 'performance monitoring', 'error tracking', 'sentry', 'honeycomb'],
  },
];

// Short/ambiguous tokens matched only on whole-word boundaries (mirrors
// categorize.js) so we don't false-match substrings: "rag" in "storage",
// "apm" / "otel" / "gpt" / "mcp" / "o1" inside longer words.
const BOUNDARY_TOKENS = new Set([
  'gpt', 'gpt4', 'gpt5', 'o1', 'o3', 'o4', 'rag', 'apm', 'otel', 'tpu', 'mcp',
  'fair', 'flux', 'sre ', 'phi-3', 'phi-4', 'sora', 'bard', 'gemma',
]);

export const TOPIC_BY_SLUG = Object.fromEntries(TOPICS.map((t) => [t.slug, t]));

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hit(hay, word) {
  if (BOUNDARY_TOKENS.has(word)) {
    return new RegExp(`\\b${escapeRe(word.trim())}\\b`).test(hay) ? 1 : 0;
  }
  return hay.includes(word) ? 1 : 0;
}

/**
 * Score how strongly an article belongs to a topic hub. Title matches count
 * double body matches (title is the strongest relevance signal). Returns 0 when
 * nothing matches — callers treat >0 as "belongs to this hub".
 *
 * @param {object} item   { title, summary?/description?/excerpt? }
 * @param {object} topic  a TOPICS entry
 */
export function topicScore(item = {}, topic) {
  const titleHay = ` ${(item.title || '').toLowerCase()} `;
  const bodyHay = ` ${(item.summary || item.description || item.excerpt || '').toLowerCase()} `;
  let score = 0;
  for (const w of topic.match) {
    if (hit(titleHay, w)) score += 2;
    else if (hit(bodyHay, w)) score += 1;
  }
  return score;
}

/**
 * From a pool of articles, return those belonging to a topic, best-match first.
 * @param {Array} items
 * @param {object} topic
 * @param {number} limit
 */
export function articlesForTopic(items = [], topic, limit = 24) {
  return items
    .map((it) => ({ it, s: topicScore(it, topic) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.it);
}
