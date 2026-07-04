import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { FAQS, AI_FAQS, CLAUDE_PUBLISHED_LINKS, faqAnswerText } from '../data/faqContent';

/*
 * FAQPage — SEO FAQ with full Q&A in the DOM via native <details> (always
 * crawlable, no hidden= toggles). FAQPage JSON-LD mirrors visible answers.
 */

export default function FAQPage() {
  useDocumentMeta({
    title: 'FAQ — AIOps, Observability, AI, LLMs & AI Agents',
    description: 'Frequently asked questions about AIOps, observability, APM, vendor comparisons, generative AI, AI agents, LLMs and AGI — plus how Glancer AI, its free tools and the AIOps glossary work.',
    path: '/faq',
  });

  // Inject FAQPage structured data for Google rich results. Answers mirror the
  // visible text exactly (bullet lists flattened), as Google requires.
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [...FAQS, ...AI_FAQS].map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: faqAnswerText(f) },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById('faq-jsonld');
      if (el) el.remove();
    };
  }, []);

  const renderList = (list) => (
    <div className="faq-details-group" style={{ marginBottom: 40 }}>
      {list.map((item) => (
        <details key={item.q} className="faq-item">
          <summary>{item.q}</summary>
          <div className="faq-answer">
            <p>{item.a}</p>
            {item.items && (
              <ul className="faq-answer-list">
                {item.items.map((li) => <li key={li}>{li}</li>)}
              </ul>
            )}
          </div>
        </details>
      ))}
    </div>
  );

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Hero */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 36, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Help Center</p>
          <h1 className="page-hero-title">Frequently Asked Questions</h1>
          <p className="hero-sub" style={{ margin: '0 auto' }}>
            Clear answers to the most-searched questions about AIOps, observability, generative AI, AI agents and LLMs — plus how Glancer AI, its free tools and glossary work.
          </p>
        </div>

        {/* Broad AIOps / AI questions (search intent) */}
        <p className="section-label" style={{ marginBottom: 14 }}>AIOps, Observability &amp; Artificial Intelligence</p>
        {renderList(AI_FAQS)}

        {/* Site / product questions */}
        <p className="section-label" style={{ marginBottom: 14 }}>About Glancer AI</p>
        {renderList(FAQS)}

        {/* Guides published as public Claude artifacts */}
        <p className="section-label" style={{ marginBottom: 14 }}>Published on Claude</p>
        <div className="chart-card" style={{ marginBottom: 40, padding: '28px 32px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 18 }}>
            Longer guides from the Glancer AI desk, published as public Claude artifacts:
          </p>
          <ul className="faq-answer-list" style={{ display: 'grid', gap: 10 }}>
            {CLAUDE_PUBLISHED_LINKS.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Still have questions CTA */}
        <div className="chart-card" style={{ marginBottom: 80, textAlign: 'center', padding: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
            Still have a question?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 22, fontSize: '0.92rem' }}>
            Explore the glossary and free tools, or reach out directly — we are happy to help.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/glossary" className="write-cta-btn" style={{ textDecoration: 'none' }}>Browse the Glossary</Link>
            <Link to="/ai-tools" className="filter-chip" style={{ textDecoration: 'none', padding: '10px 20px' }}>Free AI Tools</Link>
            <a href="mailto:karan.igniite@gmail.com" className="filter-chip" style={{ textDecoration: 'none', padding: '10px 20px' }}>Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
