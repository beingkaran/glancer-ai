#!/usr/bin/env node
/*
 * prerender-static-pages.mjs — bake crawlable HTML for key non-blog routes.
 *
 * AdSense and structural SEO reviewers expect a visible H1 and substantive body
 * text in the initial HTML, not an empty #root. This runs after vite build and
 * writes dist/<path>.html (and injects home content into dist/index.html).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://glancerai.com';
const DIST = resolve(__dirname, '../dist');

let shell;
try {
  shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');
} catch {
  console.error('✗ dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

const esc = (s) =>
  String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

const PAGES = [
  {
    path: '/',
    out: 'index.html',
    title: 'AI News Today — Latest AI News & Breakthroughs | Glancer AI',
    description:
      'Practitioner-grade AIOps and observability intelligence — vendor comparisons, a 2,200-term glossary, and live AI industry news without the marketing spin.',
    h1: 'Observability intelligence, without the vendor spin',
    body: `
      <p>Glancer AI is an editorial intelligence desk for engineers and SREs. We publish in-depth APM vendor comparisons, OpenTelemetry guides, AIOps analysis, and a searchable glossary of more than 2,200 observability terms — alongside a continuously updated feed of AI and infrastructure news from 100+ sources.</p>
      <p>Every comparison and deep dive is written by a practitioner, not a vendor marketing team. Use the feed to scan today's headlines, browse <a href="/topics">topic hubs</a> for OpenAI, Anthropic, AIOps, and observability coverage, or start with our <a href="/glossary">glossary</a> and <a href="/blog/datadog-vs-newrelic-vs-splunk-2026">APM shootouts</a>.</p>
      <p>Legal: <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> · <a href="/about">About</a></p>
    `,
  },
  {
    path: '/privacy',
    out: 'privacy.html',
    title: 'Privacy Policy | Glancer AI',
    description:
      'How Glancer AI collects, uses, and protects your data — including Google AdSense cookies, analytics, newsletter signup, and your GDPR/CCPA rights.',
    h1: 'Privacy Policy',
    body: `
      <p><strong>Last updated: July 3, 2026.</strong> Glancer AI ("we", "us") operates glancerai.com. This policy explains what personal information we collect, how we use cookies and advertising technologies (including <strong>Google AdSense</strong>, publisher id <code>ca-pub-9454848033838064</code>), which third parties process data on our behalf, and the choices available to you under GDPR, UK GDPR, and the California CCPA/CPRA.</p>
      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account data</strong> — email and hashed password when you register (via Supabase).</li>
        <li><strong>Content you submit</strong> — blog drafts, comments, and uploads you choose to publish.</li>
        <li><strong>Newsletter</strong> — email address if you subscribe.</li>
        <li><strong>Usage analytics</strong> — aggregated page views via Google Analytics (anonymous counts, not sold).</li>
        <li><strong>Advertising data</strong> — Google AdSense and its partners may use cookies or device identifiers to serve and measure ads. See <a href="https://policies.google.com/technologies/ads" rel="noopener noreferrer">Google's advertising technologies</a>.</li>
        <li><strong>Local preferences</strong> — theme, read-later list, and cookie-consent choice stored in your browser.</li>
      </ul>
      <h2>Cookies &amp; Google AdSense</h2>
      <p>We use essential cookies for sign-in and consent storage. With your consent where required, we load Google AdSense (<code>ca-pub-9454848033838064</code>) and Google Analytics. Third-party vendors, including Google, use cookies to serve ads based on your visits to this and other websites. You may opt out of personalized advertising at <a href="https://www.google.com/settings/ads" rel="noopener noreferrer">Google Ads Settings</a>, <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer">aboutads.info</a>, or <a href="https://youradchoices.com/" rel="noopener noreferrer">youradchoices.com</a>.</p>
      <h2>Your rights</h2>
      <p>Depending on your location you may access, correct, delete, or export personal data, object to processing, and opt out of sale/sharing (we do not sell personal information). Contact <a href="mailto:karan.igniite@gmail.com">karan.igniite@gmail.com</a> or delete your account from your profile.</p>
      <h2>Third-party services</h2>
      <p>Supabase (auth/database), Google AdSense &amp; Analytics, Cloudflare (hosting/CDN), and RSS news publishers (we link out; their sites have separate policies).</p>
      <p><a href="/terms">Terms of Use</a> · <a href="/">Home</a></p>
    `,
  },
  {
    path: '/terms',
    out: 'terms.html',
    title: 'Terms of Use | Glancer AI',
    description: 'Terms governing use of Glancer AI — acceptable use, user content, copyright, and disclaimers.',
    h1: 'Terms of Use',
    body: `
      <p><strong>Last updated: July 3, 2026.</strong> By using Glancer AI you agree to these terms and our <a href="/privacy">Privacy Policy</a>. The Service aggregates AI and observability news, publishes original analysis, and provides free tools and a glossary for engineers.</p>
      <p>You may not scrape the site abusively, post unlawful content, or attempt to disrupt the Service. User-submitted articles remain your responsibility; you grant us a licence to display approved content. News headlines link to original publishers.</p>
      <p>Contact: <a href="mailto:karan.igniite@gmail.com">karan.igniite@gmail.com</a>. <a href="/privacy">Privacy Policy</a></p>
    `,
  },
  {
    path: '/about',
    out: 'about.html',
    title: 'About Glancer AI',
    description: 'Why Glancer AI exists — practitioner-grade observability intelligence, comparisons, and news without vendor spin.',
    h1: 'Built to Make Sense of AI',
    body: `
      <p>Glancer AI started as a searchable glossary for AIOps, observability, and APM — a place to look up what distributed tracing, error budgets, and AIOps actually mean in production. It grew into an intelligence desk: vendor comparisons, OpenTelemetry guides, live news from 100+ feeds, and topic hubs for the labs and platforms shaping the stack.</p>
      <p>Written and maintained by <strong>Karan Shah</strong>, an engineer — not a marketing team. <a href="/glossary">Browse the glossary</a>, read our <a href="/blog/datadog-vs-newrelic-vs-splunk-2026">APM comparisons</a>, or explore <a href="/topics">topic hubs</a>.</p>
    `,
  },
  {
    path: '/faq',
    out: 'faq.html',
    title: 'AI News FAQ | Glancer AI',
    description: 'Frequently asked questions about AI news, observability, APM, and how Glancer AI curates its feed.',
    h1: 'AI News — Frequently Asked Questions',
    body: `
      <p>Answers to common questions about how we source AI news, what observability and APM mean, and how Glancer AI differs from a generic headline aggregator.</p>
      <p>We pull from 100+ RSS feeds, deduplicate and categorize stories, and add original analysis on our <a href="/">home feed</a> and <a href="/blog/datadog-vs-newrelic-vs-splunk-2026">Deep Dives</a>. See also our <a href="/glossary">glossary</a> and <a href="/privacy">Privacy Policy</a>.</p>
    `,
  },
];

function bakePage({ path, out, title, description, h1, body }) {
  const url = ORIGIN + (path === '/' ? '/' : path);
  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);

  const prerendered = `<main style="max-width:820px;margin:0 auto;padding:calc(var(--navbar-h,56px) + 48px) 20px 80px">
      <h1 style="font-family:Georgia,serif;font-size:2.2rem;line-height:1.2;font-weight:700;margin-bottom:20px">${esc(h1)}</h1>
      <div style="font-size:1rem;line-height:1.7;color:#475569">${body}</div>
    </main>`;

  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${prerendered}</div>`);
  writeFileSync(resolve(DIST, out), html, 'utf8');
}

for (const page of PAGES) bakePage(page);
console.log(`✓ prerendered ${PAGES.length} static pages (home + legal) with H1 → dist/*.html`);