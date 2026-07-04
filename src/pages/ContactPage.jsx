import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * ContactPage — how to reach the site. Email + LinkedIn, plus a short guide
 * on what to contact us about so the inbox stays useful.
 */

const EMAIL = 'karan.igniite@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/beingkaran/';

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

function Section({ title, children }) {
  return (
    <div className="chart-card legal-section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default function ContactPage() {
  useDocumentMeta({
    title: 'Contact Us',
    description:
      'Get in touch with Glancer AI — story tips, corrections, partnerships, or feedback. Reach Karan Shah by email or LinkedIn.',
    path: '/contact',
  });

  return (
    <div className="page-section">
      <div className="container legal-page" style={{ maxWidth: 820 }}>
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 56px)', paddingBottom: 28, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Get in touch</p>
          <h1 className="page-hero-title">Contact Us</h1>
          <p className="hero-sub" style={{ margin: '0 auto' }}>
            Glancer AI is written and run by one engineer, so every message lands with a human.
          </p>
        </div>

        <Section title="Reach Karan directly">
          <p style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <MailIcon />
            <strong>Email:</strong>{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <LinkedInIcon />
            <strong>LinkedIn:</strong>{' '}
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer me">linkedin.com/in/beingkaran</a>
          </p>
          <p>
            Email gets checked daily and most messages get a reply within two working days.
            LinkedIn is the faster route for professional introductions and quick questions.
          </p>
        </Section>

        <Section title="What to write in about">
          <ul>
            <li><strong>Corrections.</strong> Spotted something wrong in an article or a glossary entry? Send the link and what needs fixing. Corrections are prioritised over everything else.</li>
            <li><strong>Story tips.</strong> AI, AIOps and observability news the feed should be covering, or a practitioner story worth a deep dive.</li>
            <li><strong>Guest writing.</strong> You can publish directly through the <a href="/blog/write">Write a Blog</a> flow (posts are reviewed before going live), or pitch an idea by email first.</li>
            <li><strong>Partnerships and press.</strong> Vendor briefings, product news, and collaboration ideas. Plain-spoken pitches do better than press releases.</li>
            <li><strong>Privacy requests.</strong> Data access or deletion requests under GDPR/CCPA, as described in our <a href="/privacy">Privacy Policy</a>.</li>
          </ul>
        </Section>

        <Section title="A note on response times">
          <p>
            This site is independent and run alongside a full-time job. If your message needs a
            longer answer it may take a few days, but it will not disappear into a ticket queue.
            If something is time sensitive, say so in the subject line.
          </p>
        </Section>
      </div>
    </div>
  );
}
