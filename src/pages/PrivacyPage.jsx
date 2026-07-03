import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';

/*
 * PrivacyPage — AdSense-mandatory privacy policy. Covers data collection, cookies,
 * Google AdSense (ca-pub-9454848033838064), third-party processors, and GDPR/CCPA
 * rights. Keep "last updated" current when you change practices.
 */

const LAST_UPDATED = 'July 3, 2026';
const CONTACT = 'karan.igniite@gmail.com';
const ADSENSE_PUBLISHER = 'ca-pub-9454848033838064';

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
    description:
      'How Glancer AI collects, uses, and protects your data — including Google AdSense cookies, analytics, newsletter signup, and your GDPR/CCPA rights.',
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

        <Section title="Introduction">
          <p>
            Glancer AI ("Glancer AI", "we", "us", or "our") operates the website at{' '}
            <a href="https://glancerai.com">glancerai.com</a> and companion mobile experiences.
            This Privacy Policy describes what personal information we collect, why we collect it,
            how we use cookies and similar technologies (including for advertising), which third
            parties process data on our behalf, and the rights and choices available to you.
          </p>
          <p>
            If you have questions about this policy or wish to exercise your privacy rights, contact
            us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. This document is provided in good
            faith as a clear explanation of our practices; it is not legal advice.
          </p>
        </Section>

        <Section title="Information we collect">
          <p>We collect information in the following categories:</p>
          <ul>
            <li>
              <strong>Account data.</strong> When you register, we store your email address and a
              securely hashed password through our authentication provider, Supabase. We do not store
              plain-text passwords.
            </li>
            <li>
              <strong>Content you submit.</strong> Blog articles, comments, likes, profile details,
              and images you upload. Submitted articles are reviewed before public publication.
            </li>
            <li>
              <strong>Newsletter.</strong> If you subscribe to our email list, we store the address
              you provide and your subscription status.
            </li>
            <li>
              <strong>Usage analytics.</strong> We use Google Analytics to understand aggregate
              traffic — which pages are visited and coarse visitor counts. We do not use analytics to
              build individual profiles for sale.
            </li>
            <li>
              <strong>Advertising data.</strong> When ads are shown, Google AdSense and its partners
              may collect or receive device identifiers, cookie data, and interaction signals to
              serve, personalize (where permitted), cap frequency, and measure ads.
            </li>
            <li>
              <strong>On-device preferences.</strong> Theme, read-later lists, dismissed banners,
              and cookie-consent choices are stored in your browser (localStorage) and are not
              transmitted to us unless you take an action that requires an account.
            </li>
            <li>
              <strong>Server logs.</strong> Our hosting provider (Cloudflare) may process IP
              addresses, request paths, and timestamps in server logs for security and performance.
            </li>
          </ul>
        </Section>

        <Section title="How we use your information">
          <ul>
            <li>To provide, operate, and secure the website and your account.</li>
            <li>To review, publish, and moderate user-submitted content.</li>
            <li>To send newsletters you have opted into (unsubscribe any time).</li>
            <li>To measure aggregate usage and improve editorial coverage and product quality.</li>
            <li>To display advertising that helps keep Glancer AI free to read.</li>
            <li>To comply with law, enforce our <Link to="/terms">Terms of Use</Link>, and respond to lawful requests.</li>
          </ul>
        </Section>

        <Section title="Cookies & similar technologies">
          <p>
            Cookies are small text files stored on your device. We and our partners use cookies and
            similar storage for the purposes below.
          </p>
          <table className="legal-cookie-table">
            <thead>
              <tr><th>Type</th><th>Purpose</th><th>Examples</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Essential</td>
                <td>Sign-in sessions, security, consent storage</td>
                <td>Supabase auth tokens, cookie-consent flag</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>Aggregate traffic measurement</td>
                <td>Google Analytics (_ga, _gid)</td>
              </tr>
              <tr>
                <td>Advertising</td>
                <td>Ad delivery, frequency capping, reporting</td>
                <td>Google AdSense / DoubleClick cookies</td>
              </tr>
              <tr>
                <td>Preferences</td>
                <td>Theme and read-later on your device</td>
                <td>localStorage keys (not shared with us)</td>
              </tr>
            </tbody>
          </table>
          <p>
            Where required by law (including the EEA, UK, and California), we ask for your consent
            before loading non-essential cookies through the banner on your first visit. You can
            withdraw consent by clearing this site's storage in your browser settings.
          </p>
        </Section>

        <Section title="Google AdSense & advertising partners">
          <p>
            We use <strong>Google AdSense</strong> to display advertisements. Our AdSense publisher
            identifier is <code>{ADSENSE_PUBLISHER}</code>. Google and its advertising partners may
            use cookies and similar technologies to:
          </p>
          <ul>
            <li>Serve ads on glancerai.com based on your prior visits to this site and other websites.</li>
            <li>Measure ad performance and prevent invalid traffic.</li>
            <li>Limit how often you see a given ad (frequency capping).</li>
          </ul>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on a user's prior
            visits to your website or other websites. Google's use of advertising cookies enables it
            and its partners to serve ads to your users based on their visit to your sites and/or
            other sites on the Internet.
          </p>
          <p>You can learn more and manage preferences at:</p>
          <ul>
            <li>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </a>
            </li>
            <li>
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                How Google uses information from sites that use its services
              </a>
            </li>
            <li>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                Google Ads Settings (opt out of personalized ads)
              </a>
            </li>
            <li>
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                aboutads.info/choices
              </a>{' '}
              and{' '}
              <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer">
                youradchoices.com
              </a>
            </li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal information. Ad partners may process data
            under their own policies when they serve ads on our pages.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>We rely on the following categories of service providers:</p>
          <ul>
            <li><strong>Supabase</strong> — authentication, database, and file storage for accounts and user content.</li>
            <li><strong>Google</strong> — AdSense (advertising), Analytics (aggregate measurement), and Fonts (typography delivery).</li>
            <li><strong>Cloudflare</strong> — hosting, CDN, DDoS protection, and edge caching.</li>
            <li><strong>News publishers</strong> — we display headlines and short excerpts from third-party RSS feeds and link to original articles; those publishers operate under their own privacy policies.</li>
          </ul>
          <p>
            We choose providers with reasonable security practices, but no online transmission is
            100% secure. We encourage strong passwords and prompt us if you suspect unauthorized
            account access.
          </p>
        </Section>

        <Section title="Legal bases (EEA & UK)">
          <p>If you are in the European Economic Area or United Kingdom, we process personal data on these bases:</p>
          <ul>
            <li><strong>Contract</strong> — to provide the account and services you request.</li>
            <li><strong>Legitimate interests</strong> — to secure the site, understand aggregate usage, and display advertising that funds free content (balanced against your rights).</li>
            <li><strong>Consent</strong> — for non-essential cookies, newsletters, and where required for personalized advertising.</li>
            <li><strong>Legal obligation</strong> — when we must retain or disclose data to comply with law.</li>
          </ul>
        </Section>

        <Section title="California privacy rights (CCPA/CPRA)">
          <p>
            California residents may have the right to know what personal information we collect,
            request deletion or correction, opt out of the "sale" or "sharing" of personal
            information, and not be discriminated against for exercising these rights. We do not sell
            personal information. To submit a request, email{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a> with "California Privacy Request" in the
            subject line. We will verify your request as required by law.
          </p>
        </Section>

        <Section title="Your rights & choices">
          <p>Depending on where you live, you may have the right to:</p>
          <ul>
            <li>Access, correct, or delete personal data we hold about you.</li>
            <li>Export your data in a portable format.</li>
            <li>Object to or restrict certain processing.</li>
            <li>Withdraw consent for newsletters or non-essential cookies.</li>
            <li>Delete your account at any time from your <Link to="/profile">profile</Link>.</li>
          </ul>
          <p>
            To exercise any right, email <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. We respond
            within the timeframe required by applicable law (typically 30–45 days).
          </p>
        </Section>

        <Section title="Data retention & security">
          <p>
            We retain personal data only as long as needed to provide the Service, comply with legal
            obligations, resolve disputes, and enforce agreements. Account data is deleted when you
            delete your account, subject to backup retention windows. Aggregated analytics may be
            kept longer in de-identified form.
          </p>
          <p>
            We use HTTPS everywhere, hashed passwords, access controls, and reputable infrastructure
            providers. No method of storage or transmission is completely secure; we cannot
            guarantee absolute security.
          </p>
        </Section>

        <Section title="International transfers">
          <p>
            Glancer AI is operated from India. Our service providers may process data in the United
            States, European Union, and other countries. Where required, we rely on appropriate
            safeguards such as standard contractual clauses offered by our processors.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Glancer AI is not directed to children under 13 (or the minimum age in your country), and
            we do not knowingly collect personal data from children. If you believe a child has
            provided us data, contact us and we will delete it promptly.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected
            by updating the "last updated" date at the top of this page. Continued use of the site
            after changes take effect means you accept the revised policy. For significant changes we
            may also post a notice on the homepage.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            Data controller: Glancer AI<br />
            Email: <a href={`mailto:${CONTACT}`}>{CONTACT}</a><br />
            Website: <a href="https://glancerai.com">https://glancerai.com</a>
          </p>
        </Section>

        <div style={{ textAlign: 'center', margin: '8px 0 80px' }}>
          <Link to="/terms" className="reader-source-link">Read our Terms of Use →</Link>
        </div>
      </div>
    </div>
  );
}