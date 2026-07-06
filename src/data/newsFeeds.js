/*
 * newsFeeds — the canonical AI-news RSS source list, shared by BOTH the browser
 * feed (src/lib/newsFeed.js) and the edge aggregator (worker/newsCore.js). Pure
 * data, no browser or runtime dependencies, so it imports cleanly into the
 * Cloudflare Worker bundle. Each entry carries a hand-assigned `category` beat
 * (the per-article classifier refines it). Add/remove sources here only.
 *
 * `frameable` — whether the publisher's own X-Frame-Options / CSP
 * frame-ancestors headers permit embedding their page in a THIRD-PARTY iframe
 * (i.e. they don't block framing at all, or explicitly allow it). This is
 * checked by scripts/check-frameable.mjs (`node scripts/check-frameable.mjs`)
 * against each source's site root — re-run it periodically, since publishers
 * change this policy without notice. We only ever open a *live, unmodified*
 * iframe of the source for `frameable: true` sources — never by working around
 * a publisher's technical block. Non-frameable sources still appear in the
 * feed; opening one shows a short summary + a link to read it on their site.
 */

export const NEWS_FEEDS = [
  // ── Major tech press (Industry) ──────────────────────────────────────────
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge', category: 'Industry', frameable: false },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat', category: 'Industry', frameable: true },
  { url: 'https://www.wired.com/feed/tag/ai/latest/rss', source: 'Wired', category: 'Industry', frameable: true },
  { url: 'https://arstechnica.com/ai/feed/', source: 'Ars Technica', category: 'Industry', frameable: false },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch', category: 'Industry', frameable: false },
  { url: 'https://www.artificialintelligence-news.com/feed/', source: 'AI News', category: 'Industry', frameable: true },
  { url: 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', source: 'ZDNet', category: 'Industry', frameable: false },
  { url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', source: 'MIT Tech Review', category: 'Industry', frameable: false },
  { url: 'https://www.theregister.com/software/ai_ml/headlines.atom', source: 'The Register', category: 'Industry', frameable: true },
  { url: 'https://the-decoder.com/feed/', source: 'The Decoder', category: 'Industry', frameable: true },
  { url: 'https://www.unite.ai/feed/', source: 'Unite.AI', category: 'Industry', frameable: true },
  { url: 'https://aibusiness.com/rss.xml', source: 'AI Business', category: 'Industry', frameable: false },
  { url: 'https://siliconangle.com/category/ai/feed/', source: 'SiliconANGLE', category: 'Industry', frameable: false },
  { url: 'https://analyticsindiamag.com/feed/', source: 'Analytics India', category: 'Industry', frameable: true },
  { url: 'https://www.engadget.com/rss.xml', source: 'Engadget', category: 'Industry', frameable: false },
  { url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', source: 'CNBC Tech', category: 'Industry', frameable: false },
  { url: 'https://bdtechtalks.com/feed/', source: 'BD Tech Talks', category: 'Industry', frameable: true },
  { url: 'https://dailyai.com/feed/', source: 'DailyAI', category: 'Industry', frameable: false },

  // ── Frontier labs & model makers (Models) ────────────────────────────────
  { url: 'https://openai.com/blog/rss.xml', source: 'OpenAI', category: 'Models', frameable: false },
  { url: 'https://deepmind.google/blog/rss.xml', source: 'Google DeepMind', category: 'Models', frameable: false },
  { url: 'https://blog.google/technology/ai/rss/', source: 'Google AI', category: 'Models', frameable: true },
  { url: 'https://www.interconnects.ai/feed', source: 'Interconnects', category: 'Models', frameable: false },

  // ── Research labs & academia (Research) ──────────────────────────────────
  { url: 'https://bair.berkeley.edu/blog/feed.xml', source: 'Berkeley BAIR', category: 'Research', frameable: true },
  { url: 'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml', source: 'MIT News', category: 'Research', frameable: false },
  { url: 'https://www.microsoft.com/en-us/research/feed/', source: 'Microsoft Research', category: 'Research', frameable: true },
  { url: 'https://blog.research.google/feeds/posts/default', source: 'Google Research', category: 'Research', frameable: false },
  { url: 'https://thegradient.pub/rss/', source: 'The Gradient', category: 'Research', frameable: false },
  { url: 'https://syncedreview.com/feed/', source: 'Synced', category: 'Research', frameable: true },
  { url: 'https://www.marktechpost.com/feed/', source: 'MarkTechPost', category: 'Research', frameable: true },
  { url: 'https://www.amazon.science/index.rss', source: 'Amazon Science', category: 'Research', frameable: true },
  { url: 'https://research.facebook.com/feed/', source: 'Meta Research', category: 'Research', frameable: false },
  { url: 'https://magazine.sebastianraschka.com/feed', source: 'Sebastian Raschka', category: 'Research', frameable: false },

  // ── Open source & ML engineering (Open Source) ───────────────────────────
  { url: 'https://huggingface.co/blog/feed.xml', source: 'Hugging Face', category: 'Open Source', frameable: false },
  { url: 'https://pytorch.org/blog/feed.xml', source: 'PyTorch', category: 'Open Source', frameable: true },
  { url: 'https://blog.tensorflow.org/feeds/posts/default', source: 'TensorFlow', category: 'Open Source', frameable: true },
  { url: 'https://github.blog/ai-and-ml/feed/', source: 'GitHub', category: 'Open Source', frameable: false },

  // ── Tooling, applied ML & how-to (Tools) ─────────────────────────────────
  { url: 'https://blog.langchain.dev/rss.xml', source: 'LangChain', category: 'Tools', frameable: false },
  { url: 'https://www.kdnuggets.com/feed', source: 'KDnuggets', category: 'Tools', frameable: true },
  { url: 'https://machinelearningmastery.com/feed/', source: 'ML Mastery', category: 'Tools', frameable: true },
  { url: 'https://towardsdatascience.com/feed', source: 'Towards Data Science', category: 'Tools', frameable: false },
  { url: 'https://blog.roboflow.com/rss/', source: 'Roboflow', category: 'Tools', frameable: true },
  { url: 'https://www.latent.space/feed', source: 'Latent Space', category: 'Tools', frameable: false },
  { url: 'https://simonwillison.net/atom/everything/', source: 'Simon Willison', category: 'Tools', frameable: true },
  { url: 'https://www.oreilly.com/radar/topics/ai-ml/feed/index.xml', source: "O'Reilly Radar", category: 'Tools', frameable: false },

  // ── Compute & hardware (Hardware) ────────────────────────────────────────
  { url: 'https://blogs.nvidia.com/feed/', source: 'NVIDIA', category: 'Hardware', frameable: true },
  { url: 'https://developer.nvidia.com/blog/feed/', source: 'NVIDIA Developer', category: 'Hardware', frameable: false },
  { url: 'https://aws.amazon.com/blogs/machine-learning/feed/', source: 'AWS ML', category: 'Hardware', frameable: false },
  { url: 'https://www.therobotreport.com/feed/', source: 'The Robot Report', category: 'Hardware', frameable: false },

  // ── Observability, APM & AIOps (AIOps) ───────────────────────────────────
  // All free, non-gated RSS. Covers OpenTelemetry, the major APM/observability
  // vendors, and analyst commentary. Unreachable feeds are skipped gracefully.
  { url: 'https://opentelemetry.io/blog/index.xml', source: 'OpenTelemetry', category: 'AIOps', frameable: false },
  { url: 'https://www.datadoghq.com/blog/index.xml', source: 'Datadog', category: 'AIOps', frameable: false },
  { url: 'https://grafana.com/blog/index.xml', source: 'Grafana', category: 'AIOps', frameable: false },
  { url: 'https://newrelic.com/blog/feed', source: 'New Relic', category: 'AIOps', frameable: false },
  { url: 'https://www.dynatrace.com/news/feed/', source: 'Dynatrace', category: 'AIOps', frameable: false },
  { url: 'https://www.elastic.co/blog/feed', source: 'Elastic', category: 'AIOps', frameable: false },
  { url: 'https://signoz.io/blog/rss.xml', source: 'SigNoz', category: 'AIOps', frameable: false },
  { url: 'https://victoriametrics.com/blog/index.xml', source: 'VictoriaMetrics', category: 'AIOps', frameable: true },
  { url: 'https://sysdig.com/feed/', source: 'Sysdig', category: 'AIOps', frameable: true },
  { url: 'https://logz.io/blog/feed/', source: 'Logz.io', category: 'AIOps', frameable: false },
  { url: 'https://coralogix.com/blog/feed/', source: 'Coralogix', category: 'AIOps', frameable: true },
  { url: 'https://www.pagerduty.com/blog/feed/', source: 'PagerDuty', category: 'AIOps', frameable: true },
  { url: 'https://chronosphere.io/feed/', source: 'Chronosphere', category: 'AIOps', frameable: true },
  { url: 'https://blog.sentry.io/feed.xml', source: 'Sentry', category: 'AIOps', frameable: false },
  { url: 'https://thenewstack.io/category/observability/feed/', source: 'The New Stack · Observability', category: 'AIOps', frameable: false },
  { url: 'https://www.honeycomb.io/feed', source: 'Honeycomb', category: 'AIOps', frameable: false },
  // ── Analyst commentary (Gartner blog network — free; the research reports
  //    themselves are gated, but the public blogs carry APM/observability takes)
  { url: 'https://blogs.gartner.com/feed/', source: 'Gartner Blog Network', category: 'AIOps', frameable: false },

  // ── Policy, safety & society (Policy) ────────────────────────────────────
  { url: 'https://www.brookings.edu/topic/artificial-intelligence/feed/', source: 'Brookings', category: 'Policy', frameable: true },
  { url: 'https://importai.substack.com/feed', source: 'Import AI', category: 'Policy', frameable: false },
  { url: 'https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss', source: 'IEEE Spectrum', category: 'Policy', frameable: false },
  { url: 'https://lastweekin.ai/feed', source: 'Last Week in AI', category: 'Policy', frameable: false },

  // --- Batch added 2026-07: 40 AI feeds verified frameable (valid RSS + no
  //     X-Frame-Options / restrictive CSP). Probed with scripts/find-frameable-feeds.mjs;
  //     re-run scripts/check-frameable.mjs periodically as policies change. ---
  // Research / practitioner blogs
  { url: 'https://lilianweng.github.io/index.xml', source: "Lil'Log", category: 'Research', frameable: true },
  { url: 'https://jalammar.github.io/feed.xml', source: 'Jay Alammar', category: 'Research', frameable: true },
  { url: 'https://huyenchip.com/feed.xml', source: 'Chip Huyen', category: 'Research', frameable: true },
  { url: 'https://eugeneyan.com/rss/', source: 'Eugene Yan', category: 'Research', frameable: true },
  { url: 'https://sebastianraschka.com/rss_feed.xml', source: 'Sebastian Raschka', category: 'Research', frameable: true },
  { url: 'https://www.ruder.io/rss/', source: 'Sebastian Ruder', category: 'Research', frameable: true },
  { url: 'https://karpathy.github.io/feed.xml', source: 'Andrej Karpathy', category: 'Research', frameable: true },
  { url: 'https://colah.github.io/rss.xml', source: 'Chris Olah', category: 'Research', frameable: true },
  { url: 'https://sander.ai/feed.xml', source: 'Sander Dieleman', category: 'Research', frameable: true },
  { url: 'https://www.philschmid.de/rss', source: 'Phil Schmid', category: 'Research', frameable: true },
  { url: 'https://ai.stanford.edu/blog/feed.xml', source: 'Stanford AI Lab', category: 'Research', frameable: true },
  { url: 'https://crfm.stanford.edu/feed.xml', source: 'Stanford CRFM', category: 'Research', frameable: true },
  { url: 'https://nlp.seas.harvard.edu/feed.xml', source: 'Harvard NLP', category: 'Research', frameable: true },
  { url: 'https://www.fast.ai/index.xml', source: 'fast.ai', category: 'Research', frameable: true },
  { url: 'https://www.answer.ai/index.xml', source: 'Answer.AI', category: 'Research', frameable: true },
  { url: 'https://research.atspotify.com/feed/', source: 'Spotify Research', category: 'Research', frameable: true },
  { url: 'https://victorzhou.com/rss.xml', source: 'Victor Zhou', category: 'Research', frameable: true },
  // Open source / model & infra labs
  { url: 'https://blog.eleuther.ai/index.xml', source: 'EleutherAI', category: 'Open Source', frameable: true },
  { url: 'https://www.together.ai/blog/rss.xml', source: 'Together AI', category: 'Open Source', frameable: true },
  { url: 'https://explosion.ai/feed', source: 'Explosion / spaCy', category: 'Open Source', frameable: true },
  { url: 'https://snorkel.ai/feed/', source: 'Snorkel AI', category: 'Open Source', frameable: true },
  { url: 'https://weaviate.io/blog/rss.xml', source: 'Weaviate', category: 'Open Source', frameable: true },
  // Tools / applied
  { url: 'https://blog.paperspace.com/rss/', source: 'Paperspace', category: 'Tools', frameable: true },
  { url: 'https://pyimagesearch.com/feed/', source: 'PyImageSearch', category: 'Tools', frameable: true },
  { url: 'https://www.louisbouchard.ai/rss/', source: 'Louis Bouchard', category: 'Tools', frameable: true },
  { url: 'https://hamel.dev/index.xml', source: 'Hamel Husain', category: 'Tools', frameable: true },
  // Industry / news
  { url: 'https://dataconomy.com/feed/', source: 'Dataconomy', category: 'Industry', frameable: true },
  // Root allows framing but article pages block it (seen live 2026-07); the
  // runtime /api/framecheck would catch it anyway — this just skips the detour.
  { url: 'https://readwrite.com/feed/', source: 'ReadWrite', category: 'Industry', frameable: false },
  { url: 'https://www.geeky-gadgets.com/feed/', source: 'Geeky Gadgets', category: 'Industry', frameable: true },
  { url: 'https://thenextweb.com/neural/feed', source: 'TNW Neural', category: 'Industry', frameable: true },
  { url: 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml', source: 'ScienceDaily AI', category: 'Industry', frameable: true },
  { url: 'https://hackernoon.com/tagged/ai/feed', source: 'HackerNoon AI', category: 'Industry', frameable: true },
  { url: 'https://gradientflow.com/feed/', source: 'Gradient Flow', category: 'Industry', frameable: true },
  { url: 'https://twimlai.com/feed/', source: 'TWIML', category: 'Industry', frameable: true },
  { url: 'https://blog.cloudflare.com/tag/ai/rss/', source: 'Cloudflare AI', category: 'Industry', frameable: true },
  { url: 'https://blog.gdeltproject.org/feed/', source: 'GDELT', category: 'Industry', frameable: true },
  // Hardware
  { url: 'https://semiengineering.com/feed/', source: 'Semiconductor Eng', category: 'Hardware', frameable: true },
  // Policy / ethics
  { url: 'https://montrealethics.ai/feed/', source: 'Montreal AI Ethics', category: 'Policy', frameable: true },
  { url: 'https://ainowinstitute.org/feed', source: 'AI Now', category: 'Policy', frameable: true },
  { url: 'https://thezvi.wordpress.com/feed/', source: 'Zvi Mowshowitz', category: 'Policy', frameable: true },
];
