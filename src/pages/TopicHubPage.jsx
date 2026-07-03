import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOPIC_BY_SLUG, articlesForTopic } from '../data/topics';
import { guideForTopic } from '../data/seoGuides';
import { getNews, getCachedNews, STATIC_NEWS, displayImage, sourceFavicon } from '../lib/newsFeed';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { buildItemListSchema, buildBreadcrumb, useArticleSchema } from '../lib/structuredData';
import NewsletterInline from '../components/NewsletterInline';
import NotFoundPage from './NotFoundPage';

const HUB_LIMIT = 24;

/*
 * TopicHubPage — the live, human-facing version of a programmatic topic hub
 * (/topic/<slug>). Crawlers get the prerendered static snapshot baked by
 * scripts/generate-topic-hubs.mjs (unique "Signal" takeaways + ItemList
 * schema); this component renders the same hub with the freshest headlines for
 * real visitors, and reads the build-time Signal lines from /topic-signals.json
 * when they're available so users see them too.
 */
export default function TopicHubPage() {
  const { slug } = useParams();
  const topic = TOPIC_BY_SLUG[slug];

  const [pool, setPool] = useState(() => getCachedNews()?.items || STATIC_NEWS);
  const [signals, setSignals] = useState({});

  // Live feed: reuse the shared stale-while-revalidate news cache.
  useEffect(() => {
    let alive = true;
    getNews().then((res) => { if (alive && res?.items?.length) setPool(res.items); }).catch(() => {});
    const onUpdate = () => { const c = getCachedNews(); if (c?.items?.length) setPool(c.items); };
    window.addEventListener('glancer:news-updated', onUpdate);
    return () => { alive = false; window.removeEventListener('glancer:news-updated', onUpdate); };
  }, []);

  // Best-effort: pick up the build-time "Signal" takeaways (static artifact;
  // absent in dev, which is fine — cards fall back to the article excerpt).
  useEffect(() => {
    let alive = true;
    fetch('/topic-signals.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => { if (alive && data && typeof data === 'object') setSignals(data); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const articles = useMemo(
    () => (topic ? articlesForTopic(pool, topic, HUB_LIMIT) : []),
    [pool, topic],
  );

  useDocumentMeta({
    title: topic ? `${topic.title} — Curated & Cut to the Signal` : 'Topic',
    description: topic
      ? `${topic.intro.slice(0, 150)} Updated continuously by Glancer AI.`
      : undefined,
    path: `/topic/${slug}`,
    type: 'website',
  });

  const schemas = useMemo(() => {
    if (!topic) return [];
    return [
      buildBreadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Topics', path: '/topics' },
        { name: topic.title, path: `/topic/${topic.slug}` },
      ]),
      buildItemListSchema(
        articles.map((a) => ({ url: a.url, name: a.title })),
        { name: topic.title, path: `/topic/${topic.slug}`, description: topic.tagline },
      ),
    ];
  }, [topic, articles]);
  useArticleSchema(schemas);

  if (!topic) return <NotFoundPage />;

  const guide = guideForTopic(topic.slug);

  return (
    <div className="page-section">
      <div className="container">
        {/* Header */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 28, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>
            <Link to="/topics" style={{ color: 'inherit', textDecoration: 'none' }}>Topics</Link> / {topic.title}
          </p>
          <h1 className="page-hero-title">{topic.title}</h1>
          <p className="hero-sub" style={{ margin: '0 auto 20px', maxWidth: 720 }}>{topic.intro}</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {articles.length} recent {articles.length === 1 ? 'story' : 'stories'} · refreshed continuously
          </p>
        </div>

        {guide && (
          <div className="topic-guide chart-card" style={{ maxWidth: 820, margin: '0 auto 32px', padding: '22px 24px' }}>
            <p className="section-label" style={{ marginBottom: 10 }}>Topic guide</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0, fontSize: '0.95rem' }}>{guide}</p>
          </div>
        )}

        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            No recent stories in this topic right now — check back soon, or browse{' '}
            <Link to="/" className="read-more-link">all AI news</Link>.
          </div>
        ) : (
          <div className="blogs-grid">
            {articles.map((a, i) => {
              const signal = signals[a.url];
              return (
                <a
                  key={a.id || a.url || i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-card news-link"
                  style={{ textDecoration: 'none' }}
                >
                  {a.image && (
                    <img className="blog-card-banner" src={displayImage(a.image, 800)} alt="" loading="lazy" />
                  )}
                  <div className="blog-card-body">
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center' }}>
                      <img src={sourceFavicon(a)} alt="" width="16" height="16" style={{ borderRadius: 4 }} loading="lazy" />
                      <span className="news-category-tag tag-cyan" style={{ fontSize: '0.68rem' }}>{a.source}</span>
                    </div>
                    <h3 className="blog-card-title">{a.title}</h3>
                    {signal && (
                      <p className="topic-signal">
                        <span className="topic-signal-label">The Signal</span>
                        {signal}
                      </p>
                    )}
                    <p className="blog-card-subtitle">{a.excerpt}</p>
                    <div className="blog-card-footer">
                      <span className="blog-meta">{a.date}</span>
                      <span className="read-more-link">Read →</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Retention loop: convert search traffic into subscribers. */}
        <NewsletterInline />

        {/* Internal links to sibling hubs help crawlers + users discover more. */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>More topics</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {Object.values(TOPIC_BY_SLUG)
              .filter((t) => t.slug !== topic.slug)
              .map((t) => (
                <Link key={t.slug} to={`/topic/${t.slug}`} className="filter-chip">{t.title.replace(/ News$/, '')}</Link>
              ))}
          </div>
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
