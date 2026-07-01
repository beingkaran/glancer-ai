import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * TermsPage — terms of use. Covers acceptable use, the aggregator/link-out
 * nature of the news feed, user-generated content and the licence users grant,
 * a DMCA / notice-and-takedown process, and disclaimers for the AI tools and
 * the metrics dashboard.
 *
 * This is a good-faith template, not legal advice — have a lawyer review it
 * before relying on it.
 */

const LAST_UPDATED = 'July 1, 2026';
const CONTACT = 'karan.igniite@gmail.com';

function Section({ title, id, children }) {
  return (
    <div className="chart-card legal-section" id={id}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default function TermsPage() {
  useDocumentMeta({
    title: 'Terms of Use',
    description: 'The terms that govern your use of Glancer AI, including acceptable use, user content, copyright/DMCA takedowns, and disclaimers.',
    path: '/terms',
  });

  return (
    <div className="page-section">
      <div className="container legal-page" style={{ maxWidth: 820 }}>
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 56px)', paddingBottom: 28, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Legal</p>
          <h1 className="page-hero-title">Terms of Use</h1>
          <p className="hero-sub" style={{ margin: '0 auto' }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="1. Acceptance">
          <p>
            By accessing or using Glancer AI (the "Service"), you agree to these Terms of Use and to our{' '}
            <Link to="/privacy">Privacy Policy</Link>. If you do not agree, please do not use the
            Service.
          </p>
        </Section>

        <Section title="2. The Service & news aggregation">
          <p>
            Glancer AI is a news aggregator and knowledge hub. In the news sections we display
            publisher-provided headlines, short summaries, and link-preview images sourced from public
            RSS feeds, and we link out to the original articles on the publishers' own websites. We do
            not claim ownership of that third-party content, and the full articles remain the property
            of their respective publishers. Trademarks and logos belong to their respective owners.
          </p>
        </Section>

        <Section title="3. Acceptable use">
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in violation of any applicable law.</li>
            <li>Post content that is infringing, defamatory, harassing, hateful, or otherwise objectionable.</li>
            <li>Attempt to disrupt, overload, scrape at scale, or gain unauthorized access to the Service.</li>
            <li>Misrepresent your identity or impersonate others.</li>
          </ul>
        </Section>

        <Section title="4. Accounts">
          <p>
            You are responsible for keeping your account credentials secure and for activity under your
            account. We may suspend or terminate accounts that violate these Terms.
          </p>
        </Section>

        <Section title="5. User-generated content">
          <p>
            You retain ownership of the articles, comments, and images you submit ("User Content"). By
            submitting User Content you represent that you own it or have the rights to share it, and
            that it does not infringe anyone's rights or violate any law. You grant Glancer AI a
            non-exclusive, worldwide, royalty-free licence to host, display, reproduce, and distribute
            your User Content on the Service and in related promotion. You can request removal of your
            User Content at any time by contacting us. We may review, moderate, edit, or remove User
            Content at our discretion, but we are not obligated to monitor it.
          </p>
        </Section>

        <Section title="6. Copyright & DMCA / takedown" id="dmca">
          <p>
            We respect intellectual property rights. If you believe content on the Service infringes
            your copyright, send a notice to <a href={`mailto:${CONTACT}`}>{CONTACT}</a> including: (a)
            your contact information; (b) identification of the copyrighted work; (c) the URL of the
            allegedly infringing material; (d) a statement that you have a good-faith belief the use is
            not authorized; (e) a statement, under penalty of perjury, that your notice is accurate and
            that you are the owner or authorized to act on the owner's behalf; and (f) your physical or
            electronic signature.
          </p>
          <p>
            We will remove or disable access to infringing material promptly and, where appropriate,
            terminate repeat infringers. If you are a publisher and would like your feed excluded, email
            us and we will remove it.
          </p>
        </Section>

        <Section title="7. AI tools — no warranty">
          <p>
            The free AI tools (including the AI detector, humanizer, token counter, prompt generator,
            and summarizer) run heuristics and estimates in your browser. Their output may be inaccurate
            and is provided for general guidance and entertainment only. In particular, the AI-detector
            score is a probabilistic estimate, not proof, and must not be used to make consequential
            decisions about a person (such as academic or employment penalties). You use the tools at
            your own risk.
          </p>
        </Section>

        <Section title="8. Metrics & information — not advice">
          <p>
            Figures on the metrics dashboard and elsewhere are indicative estimates compiled from public
            sources and are not real-time telemetry. All content on the Service is for general
            informational purposes only and does not constitute financial, investment, legal, or
            professional advice. Do not rely on it for decisions without independent verification.
          </p>
        </Section>

        <Section title="9. Third-party links & ads">
          <p>
            The Service links to third-party websites and displays third-party advertising (via Google
            AdSense). We do not control and are not responsible for third-party content, products, or
            privacy practices.
          </p>
        </Section>

        <Section title="10. Disclaimers & limitation of liability">
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind, express
            or implied. To the fullest extent permitted by law, Glancer AI and its creator will not be
            liable for any indirect, incidental, special, consequential, or punitive damages, or any
            loss arising from your use of the Service.
          </p>
        </Section>

        <Section title="11. Changes & contact">
          <p>
            We may update these Terms from time to time; the "last updated" date reflects the latest
            version, and continued use means acceptance. Questions? Email{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </Section>

        <div style={{ textAlign: 'center', margin: '8px 0 80px' }}>
          <Link to="/privacy" className="reader-source-link">Read our Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}
