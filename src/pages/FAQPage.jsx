import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * FAQPage — an SEO-optimized FAQ built to win Google rich results.
 *
 * Why this ranks:
 *  - FAQPage JSON-LD structured data → eligible for FAQ rich snippets &
 *    "People also ask" placement. The structured answers MUST match the
 *    visible text (Google's requirement), so both are generated from FAQS.
 *  - Real, keyword-targeted questions mapped to what people actually search
 *    ("what is AIOps", "free AI tools", "observability vs monitoring", etc.)
 *    pulling traffic toward the glossary, tools, news and metrics sections.
 *  - Semantic <h1>/<h2>/<details> markup so the full Q&A is crawlable in the
 *    DOM (not hidden behind JS interactions) and accessible.
 */

const FAQS = [
  {
    q: 'What is Glancer AI?',
    a: 'Glancer AI (glancerai.com) is a free AI intelligence hub for engineers, SREs, and researchers. It brings together breaking AI news, industry metrics and benchmarks, a searchable AIOps/observability glossary, expert blogs, and 25+ free in-browser AI tools — all in one place, with no paywalls or mandatory sign-up.',
  },
  {
    q: 'Is Glancer AI free to use?',
    a: 'Yes. Glancer AI is completely free. You can read the news, browse the glossary, view metrics, read blogs, and use every in-browser AI tool without paying or creating an account. Ads help keep the site running. An optional free account lets you write and publish your own blog posts.',
  },
  {
    q: 'What free AI tools does Glancer AI offer?',
    a: 'Glancer AI offers 25+ free in-browser AI tools, including a sitemap finder and validator, CSV/JSON/HTML to Markdown converters, ROI and cost calculators, prompt generators, FAQ and email writers, and a launchpad to every major AI app. The tools run entirely in your browser, require no sign-up, and never upload your data to a server.',
  },
  {
    q: 'What is AIOps?',
    a: 'AIOps (Artificial Intelligence for IT Operations) is the use of machine learning and data analytics to automate and improve IT operations. It ingests logs, metrics, traces, and events to detect anomalies, correlate alerts, find root causes, and reduce noise — helping engineering teams resolve incidents faster. You can explore detailed definitions in the Glancer AI glossary.',
  },
  {
    q: 'What is observability, and how is it different from monitoring?',
    a: 'Observability is the ability to understand the internal state of a system from its external outputs — typically the three pillars of logs, metrics, and traces. Monitoring tells you whether a known problem is happening (predefined dashboards and alerts), while observability lets you ask new questions and debug unknown problems you did not anticipate. In short: monitoring answers "is it broken?", observability answers "why is it broken?".',
  },
  {
    q: 'What is APM (Application Performance Monitoring)?',
    a: 'APM (Application Performance Monitoring) is the practice of tracking the performance, availability, and user experience of software applications. It measures things like response time, error rates, throughput, and resource usage, often using distributed tracing to follow a request across services. Glancer AI\'s glossary covers APM and related terms in depth.',
  },
  {
    q: 'How often is the AI news on Glancer AI updated?',
    a: 'The AI News feed on Glancer AI is updated continuously throughout the day, pulling the latest developments from AI labs, research, and the broader industry. You get a fast, scannable overview of what is happening in AI without having to check dozens of sources.',
  },
  {
    q: 'Can I write and publish my own blog on Glancer AI?',
    a: 'Yes. Create a free account, then use the "Write a Blog" editor to draft and submit a post. Submissions are reviewed and, once approved, published on the Glancer AI blogs page where they are indexed by search engines — a great way to share technical writing and reach the AI and observability community.',
  },
  {
    q: 'What kind of metrics and benchmarks does Glancer AI track?',
    a: 'Glancer AI tracks the numbers that matter in the AI ecosystem — model benchmarks, funding rounds, adoption trends, and other key industry metrics — presented as clean, interactive charts so you can quickly see how the landscape is changing over time.',
  },
  {
    q: 'Do the in-browser AI tools store or upload my data?',
    a: 'No. Glancer AI\'s in-browser tools process your input locally in your browser. Your files, text, and data are not uploaded to or stored on any server, which keeps them private and the tools fast.',
  },
  {
    q: 'Is Glancer AI suitable for beginners learning about AI and DevOps?',
    a: 'Absolutely. The glossary is written in plain language to explain complex AI, AIOps, observability, and DevOps concepts clearly, and the blogs range from beginner-friendly explainers to deep technical guides. Whether you are just starting out or are an experienced SRE, you will find useful, up-to-date content.',
  },
  {
    q: 'How can I contact Glancer AI or report an error?',
    a: 'You can reach out any time via the About page, or email karan.igniite@gmail.com directly. Suggestions, corrections, and contributions are always welcome.',
  },
];

function ChevronIcon() {
  return (
    <svg className="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function FAQPage() {
  useDocumentMeta({
    title: 'FAQ — AI News, Free AI Tools, AIOps & Observability',
    description: 'Frequently asked questions about Glancer AI: what AIOps, observability and APM mean, the 25+ free in-browser AI tools, how AI news and metrics are updated, and how to publish your own blog. Clear answers for engineers and learners.',
    path: '/faq',
  });

  const [open, setOpen] = useState(0);

  // Inject FAQPage structured data for Google rich results. Answers mirror the
  // visible text exactly, as required by Google's structured-data guidelines.
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
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

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Hero */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 36, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Help Center</p>
          <h1 className="page-hero-title">Frequently Asked Questions</h1>
          <p className="hero-sub" style={{ margin: '0 auto' }}>
            Everything you need to know about Glancer AI — our free AI tools, the AIOps &amp; observability glossary, AI news, metrics, and how to contribute.
          </p>
        </div>

        {/* FAQ accordion */}
        <div style={{ marginBottom: 40 }}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`faq-item${isOpen ? ' faq-item-open' : ''}`}>
                <h2 style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <ChevronIcon />
                  </button>
                </h2>
                <div className="faq-answer" hidden={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
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
