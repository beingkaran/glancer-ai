import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * PrivacyPage — plain-language privacy policy. Covers what Glancer AI collects
 * (account email, newsletter, submitted content, anonymous analytics, local
 * preferences), cookies & advertising (Google AdSense), third-party services,
 * and the rights available under the GDPR and CCPA/CPRA.
 *
 * This is a good-faith template, not legal advice — have a lawyer review it
 * before relying on it, and keep the "last updated" date current.
 */

const LAST_UPDATED = 'July 1, 2026';
const CONTACT = 'karan.igniite@gmail.com';

function Section({ title, children }) {
  return (
    <div className="chart-card legal-section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default function PrivacyPage() {
  useDocumentMeta({
    title: 'Privacy Policy',
    description: 'How Glancer AI collects, uses, and protects your data, including cookies, advertising, and your GDPR/CCPA rights.',
    path: '/privacy',
  });

  return (
    <div className="page-section">
      <div className="container legal-page" style={{ maxWidth: 820 }}>
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 56px)', paddingBottom: 28, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Legal</p>
          <h1 className="page-hero-title">Privacy Policy</h1>
          <p className="hero-sub" style={{ margin: '0 auto' }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="Who we are">
          <p>
            Glancer AI ("Glancer AI", "we", "us") operates the website at glancerai.com and its
            companion mobile apps. This policy explains what personal information we collect, why, and
            what choices you have. If you have questions, email us at{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </Section>

        <Section title="Information we collect">
          <ul>
            <li><strong>Account data.</strong> If you create an account, we store your email address and a securely hashed password through our authentication provider, Supabase.</li>
            <li><strong>Content you submit.</strong> Blog articles, comments, likes, and any images you upload. Submitted articles are held for review before they appear publicly.</li>
            <li><strong>Newsletter.</strong> If you subscribe, we store the email address you provide.</li>
            <li><strong>Usage analytics.</strong> We record anonymous, aggregated page-view counts (which pages are visited, and coarse unique-visitor totals) to understand what content is useful. This is not tied to your identity.</li>
            <li><strong>On-device preferences.</strong> Settings such as your theme, saved/read-later articles, and dismissed banners are stored locally in your browser (localStorage) and are not sent to us.</li>
          </ul>
        </Section>

        <Section title="How we use it">
          <ul>
            <li>To provide and operate the site and your account.</li>
            <li>To review, publish, and moderate user-submitted content.</li>
            <li>To send the newsletter you asked for (you can unsubscribe at any time).</li>
            <li>To measure aggregate usage and improve the product.</li>
            <li>To display advertising that helps keep the site free (see below).</li>
          </ul>
        </Section>

        <Section title="Cookies & advertising">
          <p>
            We use cookies and similar local storage to keep you signed in and remember your
            preferences. We also work with <strong>Google AdSense</strong> to show ads. Google and its
            partners may use cookies and device identifiers to serve and measure ads.
          </p>
          <ul>
            <li>Third-party vendors, including Google, use cookies to serve ads based on prior visits to this and other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads based on your visits. You can opt out of personalized advertising at{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
            <li>You can also review controls at{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a> and{' '}
              <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer">youradchoices.com</a>.</li>
          </ul>
          <p>
            Where required (for example in the EEA, UK, and California), we request consent for
            non-essential cookies through the banner shown on your first visit. You can change or
            withdraw that choice at any time by clearing the site's storage in your browser.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>We rely on a small number of processors to run the site:</p>
          <ul>
            <li><strong>Supabase</strong> — authentication and database hosting.</li>
            <li><strong>Google AdSense</strong> — advertising.</li>
            <li><strong>Hosting/CDN and news sources</strong> — we display headlines and short summaries from third-party RSS feeds and link out to the original publishers; those sites have their own privacy policies.</li>
          </ul>
        </Section>

        <Section title="Your rights">
          <p>
            Depending on where you live, you may have the right to access, correct, delete, or export
            your personal data, to object to or restrict certain processing, and to opt out of the
            "sale" or "sharing" of personal information (we do not sell your personal information). To
            exercise any of these rights, email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we will
            respond within the timeframe required by law. You can delete your account at any time from
            your <Link to="/profile">profile</Link>.
          </p>
        </Section>

        <Section title="Data retention & security">
          <p>
            We keep personal data only as long as needed to provide the service or as required by law,
            and we use reasonable technical and organizational measures to protect it. No method of
            transmission or storage is completely secure, so we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Glancer AI is not directed to children under 13 (or the minimum age in your country), and
            we do not knowingly collect their personal data. If you believe a child has provided us
            data, contact us and we will delete it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. Material changes will be reflected by updating
            the "last updated" date above. Continued use of the site after a change means you accept
            the revised policy.
          </p>
        </Section>

        <div style={{ textAlign: 'center', margin: '8px 0 80px' }}>
          <Link to="/terms" className="reader-source-link">Read our Terms of Use →</Link>
        </div>
      </div>
    </div>
  );
}
