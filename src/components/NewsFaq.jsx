import { useArticleSchema } from '../lib/structuredData';

/*
 * NewsFaq — a short, keyword-targeted FAQ on the home page. Two jobs:
 *  1. Crawlable on-page content for the "AI news today / Google / NVIDIA / FTC
 *     AI news" query cluster.
 *  2. FAQPage JSON-LD (reuses the article-schema injector) so the answers are
 *     eligible for FAQ rich results. Answers here MUST match the visible copy.
 */
const FAQS = [
  {
    q: 'What is the latest AI news today?',
    a: "Glancer AI aggregates the latest AI news today from 100+ sources — model releases, research, tools and industry moves — and refreshes on every visit, so the day's top AI stories are always current. Open any story to read it in place.",
  },
  {
    q: 'Where can I read Google AI news today?',
    a: 'Glancer AI surfaces Google AI news from the Google, Google DeepMind and Google Research blogs alongside coverage from the wider press, so you can follow Google AI news today in one feed.',
  },
  {
    q: 'What is the latest NVIDIA AI news today?',
    a: 'We track NVIDIA AI news today from the NVIDIA blog and NVIDIA Developer — GPUs, CUDA, inference, and NVIDIA’s model and platform announcements — updated continuously.',
  },
  {
    q: 'Does Glancer AI cover FTC AI news and AI policy?',
    a: 'Yes. Glancer AI’s Policy category covers FTC AI news, regulation and AI governance from policy outlets and think tanks, so you can follow the rules shaping AI.',
  },
  {
    q: 'How often is the AI news updated?',
    a: 'The live feed pulls fresh headlines on every visit from 100+ AI sources, so you always see AI news today rather than a stale daily snapshot.',
  },
];

export default function NewsFaq() {
  useArticleSchema({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });

  return (
    <section className="content-section news-faq" aria-label="AI news FAQ">
      <div className="container">
        <div className="accent-bar" aria-hidden="true" />
        <p className="section-label">FAQ</p>
        <h2 className="section-title-lg" style={{ marginBottom: 18 }}>AI news, answered</h2>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <details key={f.q} className="faq-item" {...(i === 0 ? { open: true } : {})}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
