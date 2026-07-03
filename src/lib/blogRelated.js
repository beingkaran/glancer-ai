import { BLOG_POSTS } from '../data/allBlogs.js';

/** Curated cross-links for comparison series, learning paths, and topic clusters. */
const EXPLICIT_RELATED = {
  'datadog-vs-newrelic-vs-splunk-2026': [
    'newrelic-vs-splunk-observability-comparison-2026',
    'ultimate-apm-comparison-datadog-newrelic-splunk-appdynamics-broadcom-2026',
    'datadog-full-stack-observability-2026',
  ],
  'datadog-full-stack-observability-2026': [
    'datadog-vs-newrelic-vs-splunk-2026',
    'datadog-vs-newrelic-deep-comparison-2026',
    'new-relic-opentelemetry-first-strategy',
  ],
  'new-relic-opentelemetry-first-strategy': [
    'distributed-tracing-explained',
    'datadog-vs-newrelic-vs-splunk-2026',
    'observability-vs-monitoring',
  ],
  'distributed-tracing-explained': [
    'observability-vs-monitoring',
    'new-relic-opentelemetry-first-strategy',
    'four-golden-signals',
  ],
  'observability-vs-monitoring': [
    'four-golden-signals',
    'distributed-tracing-explained',
    'ai-observability-beginner-intro',
  ],
  'four-golden-signals': [
    'slo-sla-sli-practical-guide',
    'observability-vs-monitoring',
    'distributed-tracing-explained',
  ],
  'slo-sla-sli-practical-guide': [
    'four-golden-signals',
    'aiops-autonomous-remediation-self-healing-2026',
    'observability-vs-monitoring',
  ],
  'aiops-autonomous-remediation-self-healing-2026': [
    'four-percent-operationalized-aiops-adoption-gap',
    'aiops-alert-correlation-noise-reduction-intermediate',
    'aws-devops-agent-vs-azure-sre-agent-remediation-faceoff',
  ],
  'ai-observability-beginner-intro': [
    'ai-observability-anomaly-detection-explained',
    'observability-vs-monitoring',
    'aiops-alert-correlation-noise-reduction-intermediate',
  ],
  'ai-observability-anomaly-detection-explained': [
    'ai-observability-beginner-intro',
    'aiops-alert-correlation-noise-reduction-intermediate',
    'predictive-monitoring-ml-capacity-forecasting-advanced',
  ],
  'aiops-alert-correlation-noise-reduction-intermediate': [
    'ai-observability-anomaly-detection-explained',
    'predictive-monitoring-ml-capacity-forecasting-advanced',
    'aiops-autonomous-remediation-self-healing-2026',
  ],
  'predictive-monitoring-ml-capacity-forecasting-advanced': [
    'aiops-alert-correlation-noise-reduction-intermediate',
    'ebpf-llms-next-frontier-intelligent-observability-expert',
    'slo-sla-sli-practical-guide',
  ],
  'ebpf-llms-next-frontier-intelligent-observability-expert': [
    'predictive-monitoring-ml-capacity-forecasting-advanced',
    'ai-agents-observability-blind-spot',
    'distributed-tracing-explained',
  ],
  'ai-agents-observability-blind-spot': [
    'gemini-35-flash-speed-real-time-ai-observability',
    'distributed-tracing-explained',
    'aiops-autonomous-remediation-self-healing-2026',
  ],
  'gemini-35-flash-speed-real-time-ai-observability': [
    'ai-agents-observability-blind-spot',
    'gpt-56-coding-leap-telemetry-problem',
    'observability-vs-monitoring',
  ],
  'four-percent-operationalized-aiops-adoption-gap': [
    'aiops-autonomous-remediation-self-healing-2026',
    'aws-devops-agent-vs-azure-sre-agent-remediation-faceoff',
    'aiops-machine-learning-it-operations',
  ],
  'aws-devops-agent-vs-azure-sre-agent-remediation-faceoff': [
    'aiops-autonomous-remediation-self-healing-2026',
    'four-percent-operationalized-aiops-adoption-gap',
    'slo-sla-sli-practical-guide',
  ],
  'ultimate-apm-comparison-datadog-newrelic-splunk-appdynamics-broadcom-2026': [
    'datadog-vs-newrelic-vs-splunk-2026',
    'datadog-vs-appdynamics-cloudnative-vs-enterprise',
    'appdynamics-vs-broadcom-dxapm-enterprise-showdown',
  ],
};

function tagOverlap(a, b) {
  const tagsA = new Set((a.tags || []).map((t) => t.toLowerCase()));
  let score = 0;
  for (const t of b.tags || []) {
    if (tagsA.has(t.toLowerCase())) score += 3;
  }
  if (a.category && b.category === a.category) score += 2;
  return score;
}

function byId(posts) {
  return Object.fromEntries(posts.map((p) => [String(p.id), p]));
}

/**
 * Return related posts for interlinking: explicit curated links first, then
 * tag/category scoring. Used in BlogPostPage and prerendered article HTML.
 */
export function getRelatedPosts(post, pool = BLOG_POSTS, limit = 4) {
  if (!post) return [];
  const id = String(post.id);
  const lookup = byId(pool);

  const explicit = (EXPLICIT_RELATED[id] || post.relatedIds || [])
    .map((rid) => lookup[String(rid)])
    .filter((p) => p && String(p.id) !== id);

  const seen = new Set(explicit.map((p) => String(p.id)));
  const scored = pool
    .filter((p) => String(p.id) !== id && !seen.has(String(p.id)))
    .map((p) => ({ post: p, score: tagOverlap(post, p) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (b.post.featured ? 1 : 0) - (a.post.featured ? 1 : 0));

  return [...explicit, ...scored.map((x) => x.post)].slice(0, limit);
}

/** HTML block of related article links for prerendered blog snapshots. */
export function relatedLinksHtml(post, pool = BLOG_POSTS, limit = 4) {
  const related = getRelatedPosts(post, pool, limit);
  if (!related.length) return '';
  const items = related
    .map(
      (p) =>
        `<li><a href="/blog/${p.id}">${p.title}</a>${p.subtitle ? ` — <span>${p.subtitle.replace(/<[^>]+>/g, '').slice(0, 120)}</span>` : ''}</li>`
    )
    .join('');
  return `<nav aria-label="Related articles" class="blog-related-prerender"><h2>Related reading</h2><ul>${items}</ul></nav>`;
}