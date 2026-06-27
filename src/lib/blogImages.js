/*
 * blogImages.js — adds relevant in-body pictures to the curated blog posts.
 *
 * Rather than hand-editing every post body in data/allBlogs.js, we keep a
 * per-post map of figures and inject them into the article HTML at render time
 * (see BlogPostPage). Each curated post gets a mix of:
 *   • an on-brand SVG diagram (public/blog-figures/*.svg) that illustrates the
 *     core concept — always loads, matches the dark theme, never 404s; and
 *   • a topical photo (Unsplash) for visual texture.
 *
 * Only posts whose id appears in POST_FIGURES are touched, so user-submitted
 * blogs (which authors illustrate themselves) are never altered.
 */

// Stable Unsplash CDN URLs (verified to return images). auto=format keeps them
// light; w=1280 is plenty for the ~720px content column.
const photoUrl = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1280&q=80`;

const PHOTOS = {
  datacenter: { src: photoUrl('1558494949-ef010cbdcc31'), caption: 'Modern observability spans sprawling, distributed infrastructure.' },
  serverroom: { src: photoUrl('1504384308090-c894fdcc538d'), caption: 'Telemetry flows from every server, container and service.' },
  dashboard:  { src: photoUrl('1551288049-bebda4e38f71'),  caption: 'Dashboards turn raw telemetry into operational insight.' },
  analytics:  { src: photoUrl('1460925895917-afdab827c52f'), caption: 'Metrics, trends and SLOs at a glance on a monitoring dashboard.' },
  code:       { src: photoUrl('1526374965328-7f61d4dc18c5'), caption: 'Logs and traces are the raw signal behind every insight.' },
  team:       { src: photoUrl('1483058712412-4245e9b90334'), caption: 'Platform teams rely on shared telemetry to ship with confidence.' },
  ai:         { src: photoUrl('1620712943543-bcc4688e7485'), caption: 'Machine-learning models surface patterns humans would miss.' },
  circuit:    { src: photoUrl('1518770660439-4636190af475'), caption: 'eBPF taps signals deep in the kernel — no code changes needed.' },
};

const diagram = (name, caption) => ({ kind: 'diagram', src: `/blog-figures/${name}.svg`, caption });
const photo = (key, captionOverride) => ({ kind: 'photo', src: PHOTOS[key].src, caption: captionOverride || PHOTOS[key].caption });

/* Per-post figure sets: [diagram, photo]. */
export const POST_FIGURES = {
  'observability-vs-monitoring': [
    diagram('monitoring-vs-observability', 'Monitoring confirms known failures; observability lets you explore the unknown ones.'),
    photo('datacenter'),
  ],
  'four-golden-signals': [
    diagram('golden-signals-quadrant', 'Latency, traffic, errors and saturation — the four signals that summarise service health.'),
    photo('analytics'),
  ],
  'distributed-tracing-explained': [
    diagram('distributed-trace', 'A trace waterfalls one request across services, exposing the critical-path bottleneck.'),
    photo('code'),
  ],
  'aiops-machine-learning-it-operations': [
    diagram('aiops-pipeline', 'The AIOps pipeline: ingest telemetry, correlate it, score it with ML, then act.'),
    photo('ai'),
  ],
  'slo-sla-sli-practical-guide': [
    diagram('slo-error-budget', 'An SLO sets the target; the error budget is the unreliability you are allowed to spend.'),
    photo('analytics'),
  ],
  'datadog-full-stack-observability-2026': [
    diagram('three-pillars', 'Full-stack observability unifies metrics, logs and traces in one place.'),
    photo('dashboard'),
  ],
  'new-relic-opentelemetry-first-strategy': [
    diagram('three-pillars', 'An OpenTelemetry-first strategy standardises metrics, logs and traces across vendors.'),
    photo('team'),
  ],
  'appdynamics-business-iq-apm-revenue': [
    diagram('apm-comparison-radar', 'Business-IQ-style APM ties technical signals to revenue and user outcomes.'),
    photo('dashboard'),
  ],
  'datadog-vs-newrelic-vs-splunk-2026': [
    diagram('apm-comparison-radar', 'Each platform leads on different axes — weigh them against your own priorities.'),
    photo('dashboard'),
  ],
  'broadcom-dx-apm-ca-apm-legacy-cloud': [
    diagram('apm-comparison-radar', 'Legacy enterprise APM trades cloud-native agility for depth and on-prem control.'),
    photo('serverroom'),
  ],
  'datadog-vs-newrelic-deep-comparison-2026': [
    diagram('apm-comparison-radar', 'A head-to-head across breadth, tracing, pricing, scale and built-in AIOps.'),
    photo('analytics'),
  ],
  'datadog-vs-appdynamics-cloudnative-vs-enterprise': [
    diagram('apm-comparison-radar', 'Cloud-native SaaS vs. enterprise APM — different shapes for different teams.'),
    photo('datacenter'),
  ],
  'newrelic-vs-splunk-observability-comparison-2026': [
    diagram('apm-comparison-radar', 'Telemetry breadth vs. data-platform power: where each tool pulls ahead.'),
    photo('dashboard'),
  ],
  'appdynamics-vs-broadcom-dxapm-enterprise-showdown': [
    diagram('apm-comparison-radar', 'Two enterprise heavyweights compared across the axes that matter at scale.'),
    photo('serverroom'),
  ],
  'ultimate-apm-comparison-datadog-newrelic-splunk-appdynamics-broadcom-2026': [
    diagram('apm-comparison-radar', 'Five platforms, one framework — score each on the axes your team cares about.'),
    photo('dashboard'),
  ],
  'ai-observability-beginner-intro': [
    diagram('three-pillars', 'AI observability starts with the same three pillars: metrics, logs and traces.'),
    photo('ai'),
  ],
  'ai-observability-anomaly-detection-explained': [
    diagram('anomaly-detection', 'A learned baseline flags subtle anomalies that a static threshold would miss.'),
    photo('ai'),
  ],
  'aiops-alert-correlation-noise-reduction-intermediate': [
    diagram('alert-correlation', 'Correlation collapses an alert storm into a single, root-caused incident.'),
    photo('dashboard'),
  ],
  'predictive-monitoring-ml-capacity-forecasting-advanced': [
    diagram('capacity-forecast', 'Forecasting projects usage forward so you scale before hitting the ceiling.'),
    photo('analytics'),
  ],
  'ebpf-llms-next-frontier-intelligent-observability-expert': [
    diagram('ebpf-architecture', 'eBPF probes run safely in the kernel, capturing signals with zero instrumentation.'),
    photo('circuit'),
  ],
};

/* Figures for a given post (empty for anything not in the curated map). */
export function figuresForPost(post) {
  if (!post) return [];
  return POST_FIGURES[String(post.id)] || [];
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function figureHtml(f) {
  const cls = f.kind === 'diagram' ? 'blog-figure blog-figure-diagram' : 'blog-figure blog-figure-photo';
  const cap = f.caption ? `<figcaption>${esc(f.caption)}</figcaption>` : '';
  return `\n<figure class="${cls}"><img src="${esc(f.src)}" alt="${esc(f.caption || '')}" loading="lazy" />${cap}</figure>\n`;
}

/* Insert figures into article HTML at sensible breakpoints (before section
 * headings), so a picture lands near the content it illustrates. */
export function injectFiguresIntoHtml(html, figures) {
  if (!html || !figures || !figures.length) return html;

  // Opening-tag positions of each <h2> section.
  const idxs = [];
  const re = /<h2[\s>]/gi;
  let m;
  while ((m = re.exec(html)) !== null) idxs.push(m.index);

  // Not enough headings to place between — just append.
  if (idxs.length < 2) {
    return html + figures.map(figureHtml).join('');
  }

  const targets = [idxs[1]]; // diagram: before the 2nd heading
  if (figures.length > 1) {
    // photo: roughly two-thirds through, else append at the end
    const mid = idxs.length >= 4 ? idxs[Math.round(idxs.length * 0.6)] : html.length;
    targets.push(mid > targets[0] ? mid : html.length);
  }

  // Insert from last position to first so earlier indices stay valid.
  const ordered = figures
    .slice(0, targets.length)
    .map((f, i) => ({ pos: targets[i], html: figureHtml(f) }))
    .sort((a, b) => b.pos - a.pos);

  let out = html;
  for (const { pos, html: frag } of ordered) {
    out = out.slice(0, pos) + frag + out.slice(pos);
  }
  return out;
}
