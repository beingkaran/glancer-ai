import { Link } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { buildItemListSchema, buildBreadcrumb, useArticleSchema } from '../lib/structuredData';

/*
 * TopicsIndexPage — the hub of hubs (/topics). Lists every programmatic topic
 * so both crawlers and readers can reach each /topic/<slug> page. Internal
 * linking like this is what lets Google discover and pass authority to the
 * long-tail entity pages.
 */
export default function TopicsIndexPage() {
  useDocumentMeta({
    title: 'AI Topics — News Hubs by Company & Technology',
    description:
      'Browse Glancer AI’s curated news hubs — OpenAI, Anthropic, Google Gemini, AI agents, ' +
      'observability, AIOps and more. Each hub is refreshed continuously and cut to the signal.',
    path: '/topics',
  });

  useArticleSchema([
    buildBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Topics', path: '/topics' },
    ]),
    buildItemListSchema(
      TOPICS.map((t) => ({ url: `/topic/${t.slug}`, name: t.title })),
      { name: 'AI News Topics', path: '/topics', description: 'Curated AI news hubs by company and technology.' },
    ),
  ]);

  return (
    <div className="page-section">
      <div className="container">
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 32, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Topic Hubs</p>
          <h1 className="page-hero-title">AI News by Topic</h1>
          <p className="hero-sub" style={{ margin: '0 auto 8px', maxWidth: 680 }}>
            Continuously-refreshed news hubs for the companies and technologies that matter —
            each one filtered down to the signal.
          </p>
        </div>

        <div className="blogs-grid">
          {TOPICS.map((t) => (
            <Link key={t.slug} to={`/topic/${t.slug}`} className="blog-card news-link" style={{ textDecoration: 'none' }}>
              <div className="blog-card-body">
                <h3 className="blog-card-title">{t.title}</h3>
                <p className="blog-card-subtitle">{t.tagline}</p>
                <div className="blog-card-footer">
                  <span className="blog-meta">/topic/{t.slug}</span>
                  <span className="read-more-link">View hub →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
