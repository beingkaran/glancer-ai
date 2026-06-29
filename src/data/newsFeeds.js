/*
 * newsFeeds — the canonical AI-news RSS source list, shared by BOTH the browser
 * feed (src/lib/newsFeed.js) and the edge aggregator (worker/newsCore.js). Pure
 * data, no browser or runtime dependencies, so it imports cleanly into the
 * Cloudflare Worker bundle. Each entry carries a hand-assigned `category` beat
 * (the per-article classifier refines it). Add/remove sources here only.
 */

export const NEWS_FEEDS = [
  // ── Major tech press (Industry) ──────────────────────────────────────────
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge', category: 'Industry' },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat', category: 'Industry' },
  { url: 'https://www.wired.com/feed/tag/ai/latest/rss', source: 'Wired', category: 'Industry' },
  { url: 'https://arstechnica.com/ai/feed/', source: 'Ars Technica', category: 'Industry' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch', category: 'Industry' },
  { url: 'https://www.artificialintelligence-news.com/feed/', source: 'AI News', category: 'Industry' },
  { url: 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', source: 'ZDNet', category: 'Industry' },
  { url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', source: 'MIT Tech Review', category: 'Industry' },
  { url: 'https://www.theregister.com/software/ai_ml/headlines.atom', source: 'The Register', category: 'Industry' },
  { url: 'https://the-decoder.com/feed/', source: 'The Decoder', category: 'Industry' },
  { url: 'https://www.unite.ai/feed/', source: 'Unite.AI', category: 'Industry' },
  { url: 'https://aibusiness.com/rss.xml', source: 'AI Business', category: 'Industry' },
  { url: 'https://siliconangle.com/category/ai/feed/', source: 'SiliconANGLE', category: 'Industry' },
  { url: 'https://analyticsindiamag.com/feed/', source: 'Analytics India', category: 'Industry' },
  { url: 'https://www.engadget.com/rss.xml', source: 'Engadget', category: 'Industry' },
  { url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', source: 'CNBC Tech', category: 'Industry' },
  { url: 'https://bdtechtalks.com/feed/', source: 'BD Tech Talks', category: 'Industry' },
  { url: 'https://dailyai.com/feed/', source: 'DailyAI', category: 'Industry' },

  // ── Frontier labs & model makers (Models) ────────────────────────────────
  { url: 'https://openai.com/blog/rss.xml', source: 'OpenAI', category: 'Models' },
  { url: 'https://deepmind.google/blog/rss.xml', source: 'Google DeepMind', category: 'Models' },
  { url: 'https://blog.google/technology/ai/rss/', source: 'Google AI', category: 'Models' },
  { url: 'https://www.interconnects.ai/feed', source: 'Interconnects', category: 'Models' },

  // ── Research labs & academia (Research) ──────────────────────────────────
  { url: 'https://bair.berkeley.edu/blog/feed.xml', source: 'Berkeley BAIR', category: 'Research' },
  { url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml', source: 'MIT News', category: 'Research' },
  { url: 'https://www.microsoft.com/en-us/research/feed/', source: 'Microsoft Research', category: 'Research' },
  { url: 'https://blog.research.google/feeds/posts/default', source: 'Google Research', category: 'Research' },
  { url: 'https://thegradient.pub/rss/', source: 'The Gradient', category: 'Research' },
  { url: 'https://syncedreview.com/feed/', source: 'Synced', category: 'Research' },
  { url: 'https://www.marktechpost.com/feed/', source: 'MarkTechPost', category: 'Research' },
  { url: 'https://www.amazon.science/index.rss', source: 'Amazon Science', category: 'Research' },
  { url: 'https://research.facebook.com/feed/', source: 'Meta Research', category: 'Research' },
  { url: 'https://magazine.sebastianraschka.com/feed', source: 'Sebastian Raschka', category: 'Research' },

  // ── Open source & ML engineering (Open Source) ───────────────────────────
  { url: 'https://huggingface.co/blog/feed.xml', source: 'Hugging Face', category: 'Open Source' },
  { url: 'https://pytorch.org/blog/feed.xml', source: 'PyTorch', category: 'Open Source' },
  { url: 'https://blog.tensorflow.org/feeds/posts/default', source: 'TensorFlow', category: 'Open Source' },
  { url: 'https://github.blog/ai-and-ml/feed/', source: 'GitHub', category: 'Open Source' },

  // ── Tooling, applied ML & how-to (Tools) ─────────────────────────────────
  { url: 'https://blog.langchain.dev/rss.xml', source: 'LangChain', category: 'Tools' },
  { url: 'https://www.kdnuggets.com/feed', source: 'KDnuggets', category: 'Tools' },
  { url: 'https://machinelearningmastery.com/feed/', source: 'ML Mastery', category: 'Tools' },
  { url: 'https://towardsdatascience.com/feed', source: 'Towards Data Science', category: 'Tools' },
  { url: 'https://blog.roboflow.com/rss/', source: 'Roboflow', category: 'Tools' },
  { url: 'https://www.latent.space/feed', source: 'Latent Space', category: 'Tools' },
  { url: 'https://simonwillison.net/atom/everything/', source: 'Simon Willison', category: 'Tools' },
  { url: 'https://www.oreilly.com/radar/topics/ai-ml/feed/index.xml', source: "O'Reilly Radar", category: 'Tools' },

  // ── Compute & hardware (Hardware) ────────────────────────────────────────
  { url: 'https://blogs.nvidia.com/feed/', source: 'NVIDIA', category: 'Hardware' },
  { url: 'https://developer.nvidia.com/blog/feed/', source: 'NVIDIA Developer', category: 'Hardware' },
  { url: 'https://aws.amazon.com/blogs/machine-learning/feed/', source: 'AWS ML', category: 'Hardware' },
  { url: 'https://www.therobotreport.com/feed/', source: 'The Robot Report', category: 'Hardware' },

  // ── Observability, APM & AIOps (AIOps) ───────────────────────────────────
  // All free, non-gated RSS. Covers OpenTelemetry, the major APM/observability
  // vendors, and analyst commentary. Unreachable feeds are skipped gracefully.
  { url: 'https://opentelemetry.io/blog/index.xml', source: 'OpenTelemetry', category: 'AIOps' },
  { url: 'https://www.datadoghq.com/blog/index.xml', source: 'Datadog', category: 'AIOps' },
  { url: 'https://grafana.com/blog/index.xml', source: 'Grafana', category: 'AIOps' },
  { url: 'https://newrelic.com/blog/feed', source: 'New Relic', category: 'AIOps' },
  { url: 'https://www.dynatrace.com/news/feed/', source: 'Dynatrace', category: 'AIOps' },
  { url: 'https://www.elastic.co/blog/feed', source: 'Elastic', category: 'AIOps' },
  { url: 'https://signoz.io/blog/rss.xml', source: 'SigNoz', category: 'AIOps' },
  { url: 'https://victoriametrics.com/blog/index.xml', source: 'VictoriaMetrics', category: 'AIOps' },
  { url: 'https://sysdig.com/feed/', source: 'Sysdig', category: 'AIOps' },
  { url: 'https://logz.io/blog/feed/', source: 'Logz.io', category: 'AIOps' },
  { url: 'https://coralogix.com/blog/feed/', source: 'Coralogix', category: 'AIOps' },
  { url: 'https://www.pagerduty.com/blog/feed/', source: 'PagerDuty', category: 'AIOps' },
  { url: 'https://chronosphere.io/feed/', source: 'Chronosphere', category: 'AIOps' },
  { url: 'https://blog.sentry.io/feed.xml', source: 'Sentry', category: 'AIOps' },
  { url: 'https://thenewstack.io/category/observability/feed/', source: 'The New Stack · Observability', category: 'AIOps' },
  { url: 'https://www.honeycomb.io/feed', source: 'Honeycomb', category: 'AIOps' },
  // ── Analyst commentary (Gartner blog network — free; the research reports
  //    themselves are gated, but the public blogs carry APM/observability takes)
  { url: 'https://blogs.gartner.com/feed/', source: 'Gartner Blog Network', category: 'AIOps' },

  // ── Policy, safety & society (Policy) ────────────────────────────────────
  { url: 'https://www.brookings.edu/topic/artificial-intelligence/feed/', source: 'Brookings', category: 'Policy' },
  { url: 'https://importai.substack.com/feed', source: 'Import AI', category: 'Policy' },
  { url: 'https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss', source: 'IEEE Spectrum', category: 'Policy' },
  { url: 'https://lastweekin.ai/feed', source: 'Last Week in AI', category: 'Policy' },
];
