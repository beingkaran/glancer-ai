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

// Broad "AI news" FAQ — targets high-volume informational searches (what is AI
// news, generative AI, AGI, AI agents, LLMs, AI trends…) for topical authority.
// `items` render as a bulleted list and are flattened into the JSON-LD answer.
const AI_NEWS_FAQS = [
  { q: 'What is AI news?', a: 'AI news covers the latest developments in artificial intelligence, including new models, research breakthroughs, company announcements, regulations, startups, and AI-powered products.' },
  { q: 'Where can I find the latest AI news?', a: 'You can follow dedicated AI news websites, technology publications, research labs, and official announcements from companies like OpenAI, Google, Microsoft, Meta, Anthropic, and NVIDIA. Glancer AI brings the latest AI news from 100+ of these sources into one live feed.' },
  { q: 'Why is AI news important?', a: 'AI is transforming industries such as healthcare, finance, education, manufacturing, and software development. Keeping up with AI news helps individuals and businesses stay competitive.' },
  { q: 'Which companies are leading AI development?', a: 'Some of the leading AI companies include OpenAI, Google DeepMind, Microsoft, Anthropic, Meta, NVIDIA, Amazon, IBM, and xAI.' },
  { q: 'How often is AI news updated?', a: 'Major AI news is published daily. Significant product launches, research papers, and funding announcements happen throughout the week. Glancer AI refreshes its feed on every visit.' },
  { q: 'What are the biggest AI trends in 2025?', a: 'Current trends include:', items: ['Agentic AI', 'Multimodal AI models', 'AI coding assistants', 'Enterprise AI adoption', 'AI-powered search', 'Robotics and autonomous systems', 'AI regulation and governance'] },
  { q: 'Is AI replacing jobs?', a: 'AI is automating certain repetitive tasks while also creating new roles in AI engineering, prompt engineering, data science, AI governance, and machine learning operations.' },
  { q: 'What is generative AI?', a: 'Generative AI is a type of artificial intelligence that creates new content such as text, images, videos, music, and computer code from user prompts.' },
  { q: 'What is the difference between AI and machine learning?', a: 'Artificial intelligence is the broader field focused on making machines perform intelligent tasks, while machine learning is a subset of AI that enables systems to learn from data without explicit programming.' },
  { q: 'Which industries are adopting AI the fastest?', a: 'Industries rapidly adopting AI include:', items: ['Healthcare', 'Banking and Finance', 'Retail', 'Manufacturing', 'Customer Service', 'Marketing', 'Education', 'Cybersecurity', 'Logistics', 'Software Development'] },
  { q: 'What are AI agents?', a: 'AI agents are systems capable of planning, reasoning, using tools, and completing multi-step tasks with minimal human intervention.' },
  { q: 'What is AGI?', a: 'Artificial General Intelligence (AGI) refers to AI that can perform intellectual tasks across multiple domains at a level comparable to humans.' },
  { q: 'Is AI regulated?', a: 'Many countries are introducing AI regulations focused on transparency, safety, privacy, copyright, and responsible AI development.' },
  { q: 'How can businesses use AI?', a: 'Businesses use AI for:', items: ['Customer support', 'Content creation', 'Sales automation', 'Data analysis', 'Fraud detection', 'Predictive analytics', 'Process automation', 'Personalized marketing'] },
  { q: 'What skills are needed for a career in AI?', a: 'Popular AI skills include:', items: ['Python programming', 'Machine learning', 'Deep learning', 'Prompt engineering', 'Data analysis', 'SQL', 'Cloud computing', 'MLOps', 'Large Language Models (LLMs)'] },
  { q: 'What are Large Language Models (LLMs)?', a: 'LLMs are AI models trained on massive datasets to understand and generate human-like text. They power modern AI assistants, chatbots, and coding tools.' },
  { q: 'What is multimodal AI?', a: 'Multimodal AI can process and generate multiple forms of content, including text, images, audio, and video within a single model.' },
  { q: 'Can AI create images and videos?', a: 'Yes. Modern generative AI models can create realistic images, videos, animations, and digital artwork from natural language prompts.' },
  { q: 'How can I stay updated with AI news?', a: 'You can subscribe to AI newsletters, follow AI researchers and companies on social media, monitor GitHub projects, read research publications, and bookmark trusted AI news websites like Glancer AI.' },
  { q: 'What is the future of artificial intelligence?', a: 'AI is expected to become increasingly integrated into everyday applications, driving advances in automation, healthcare, education, scientific research, robotics, and personalized digital experiences.' },
];

// Flatten an answer (+ optional bullet list) to the plain text used in JSON-LD.
function faqAnswerText({ a, items }) {
  return items && items.length ? `${a} ${items.join(', ')}.` : a;
}

function ChevronIcon() {
  return (
    <svg className="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function FAQPage() {
  useDocumentMeta({
    title: 'AI News FAQ — AI, LLMs, AI Agents, AGI & 2025 Trends',
    description: 'AI news FAQ: what is AI news, where to find the latest AI news, generative AI, AI agents, LLMs, AGI, AI regulation and the biggest AI trends of 2025 — plus questions about Glancer AI, free AI tools and the AIOps glossary.',
    path: '/faq',
  });

  // One open item at a time, keyed by "group-index" so the two lists don't clash.
  const [openKey, setOpenKey] = useState('site-0');

  // Inject FAQPage structured data for Google rich results. Answers mirror the
  // visible text exactly (bullet lists flattened), as Google requires.
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [...FAQS, ...AI_NEWS_FAQS].map((f) => ({
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

  const renderList = (list, group) => (
    <div style={{ marginBottom: 40 }}>
      {list.map((item, i) => {
        const key = `${group}-${i}`;
        const isOpen = openKey === key;
        return (
          <div key={item.q} className={`faq-item${isOpen ? ' faq-item-open' : ''}`}>
            <h2 style={{ margin: 0 }}>
              <button
                type="button"
                className="faq-question"
                aria-expanded={isOpen}
                onClick={() => setOpenKey(isOpen ? '' : key)}
              >
                <span>{item.q}</span>
                <ChevronIcon />
              </button>
            </h2>
            <div className="faq-answer" hidden={!isOpen}>
              <p>{item.a}</p>
              {item.items && (
                <ul className="faq-answer-list">
                  {item.items.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Hero */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 36, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Help Center</p>
          <h1 className="page-hero-title">AI News — Frequently Asked Questions</h1>
          <p className="hero-sub" style={{ margin: '0 auto' }}>
            Clear answers to the most-searched questions about AI news, generative AI, AI agents, LLMs and 2025 AI trends — plus how Glancer AI, its free tools and glossary work.
          </p>
        </div>

        {/* AI news questions (broad search intent) */}
        <p className="section-label" style={{ marginBottom: 14 }}>AI News &amp; Artificial Intelligence</p>
        {renderList(AI_NEWS_FAQS, 'ai')}

        {/* Site / product questions */}
        <p className="section-label" style={{ marginBottom: 14 }}>About Glancer AI</p>
        {renderList(FAQS, 'site')}

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
