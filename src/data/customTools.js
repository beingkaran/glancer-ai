/*
 * customTools — registry for the in-browser "Custom AI Tools" suite.
 *
 * Unlike AI_TOOLS (which deep-link out to third-party apps), every tool here
 * RUNS in the page: the ToolRunner reads the `inputs` schema, collects values,
 * and calls `run(values)` from toolEngines. This makes them ideal SEO/utility
 * pages — real value, time-on-page, and AdSense-friendly intent.
 *
 * input field shape:
 *   { id, label, type: 'text'|'textarea'|'url'|'number'|'select', placeholder?,
 *     options?: [{value,label}], default?, rows? }
 */

import * as E from '../lib/toolEngines';
import * as AI from '../lib/aiEngines';

export const CUSTOM_TOOL_CATEGORIES = [
  'Sitemap & SEO',
  'Convert to Markdown',
  'Generators',
  'Calculators',
  'AI Prompts',
  'Writing',
];

const urlField = (id = 'url', label = 'Website / sitemap URL', ph = 'https://example.com') =>
  ({ id, label, type: 'url', placeholder: ph });

export const CUSTOM_TOOLS = [
  /* ---------------------------------------------------- Sitemap & SEO */
  {
    id: 'sitemap-finder', name: 'Sitemap Finder & Checker', category: 'Sitemap & SEO',
    badge: '🔎', color: '#06B6D4',
    blurb: 'Find and validate every sitemap on any website — checks common paths and robots.txt.',
    tags: ['sitemap', 'seo', 'crawl'],
    inputs: [urlField('url', 'Website URL', 'https://stripe.com')],
    cta: 'Find sitemaps', run: E.sitemapFinder, async: true,
  },
  {
    id: 'sitemap-validator', name: 'Sitemap Validator', category: 'Sitemap & SEO',
    badge: '✅', color: '#10B981',
    blurb: 'Validate an XML sitemap for spec compliance, size limits and SEO errors.',
    tags: ['sitemap', 'validate', 'seo'],
    inputs: [urlField('url', 'Sitemap URL', 'https://example.com/sitemap.xml')],
    cta: 'Validate', run: E.sitemapValidator, async: true,
  },
  {
    id: 'sitemap-url-extractor', name: 'Sitemap URL Extractor', category: 'Sitemap & SEO',
    badge: '🔗', color: '#3B82F6',
    blurb: 'Extract every URL from a sitemap.xml (follows index sitemaps too).',
    tags: ['sitemap', 'urls', 'extract'],
    inputs: [urlField('url', 'Sitemap URL', 'https://example.com/sitemap.xml')],
    cta: 'Extract URLs', run: E.sitemapUrlExtractor, async: true,
  },
  {
    id: 'sitemap-comparison', name: 'Sitemap Comparison', category: 'Sitemap & SEO',
    badge: '⚖️', color: '#8B5CF6',
    blurb: 'Diff two sitemaps to see which URLs were added, removed or shared.',
    tags: ['sitemap', 'diff', 'compare'],
    inputs: [urlField('urlA', 'Sitemap A', 'https://example.com/sitemap.xml'), urlField('urlB', 'Sitemap B', 'https://example.com/sitemap-new.xml')],
    cta: 'Compare', run: E.sitemapComparison, async: true,
  },
  {
    id: 'sitemap-frequency', name: 'Sitemap Frequency Analyzer', category: 'Sitemap & SEO',
    badge: '📊', color: '#F59E0B',
    blurb: 'Analyze changefreq, priority and lastmod coverage across a sitemap.',
    tags: ['sitemap', 'analytics', 'seo'],
    inputs: [urlField('url', 'Sitemap URL', 'https://example.com/sitemap.xml')],
    cta: 'Analyze', run: E.sitemapFrequency, async: true,
  },
  {
    id: 'sitemap-generator', name: 'XML Sitemap Generator', category: 'Sitemap & SEO',
    badge: '🗺️', color: '#06B6D4',
    blurb: 'Generate a valid sitemap.xml from a list of URLs, with changefreq & priority.',
    tags: ['sitemap', 'generate', 'xml'],
    inputs: [
      { id: 'urls', label: 'URLs (one per line)', type: 'textarea', rows: 6, placeholder: 'https://example.com/\nhttps://example.com/about\nhttps://example.com/pricing' },
      { id: 'changefreq', label: 'Change frequency', type: 'select', default: 'weekly', options: ['none', 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map((v) => ({ value: v, label: v })) },
      { id: 'priority', label: 'Priority', type: 'select', default: '0.8', options: ['none', '1.0', '0.8', '0.6', '0.5', '0.3'].map((v) => ({ value: v, label: v })) },
    ],
    cta: 'Generate sitemap', run: E.sitemapGenerator,
  },
  {
    id: 'sitemap-index-generator', name: 'Sitemap Index Generator', category: 'Sitemap & SEO',
    badge: '🧭', color: '#3B82F6',
    blurb: 'Build a sitemap index file that references multiple child sitemaps.',
    tags: ['sitemap', 'index', 'xml'],
    inputs: [{ id: 'urls', label: 'Child sitemap URLs (one per line)', type: 'textarea', rows: 6, placeholder: 'https://example.com/sitemap-posts.xml\nhttps://example.com/sitemap-pages.xml' }],
    cta: 'Generate index', run: E.sitemapIndexGenerator,
  },
  {
    id: 'robots-generator', name: 'Robots.txt Generator', category: 'Sitemap & SEO',
    badge: '🤖', color: '#64748B',
    blurb: 'Generate a robots.txt with crawl rules and a sitemap reference.',
    tags: ['robots', 'seo', 'crawl'],
    inputs: [
      urlField('sitemapUrl', 'Sitemap URL', 'https://example.com/sitemap.xml'),
      { id: 'allowAll', label: 'Crawling', type: 'select', default: 'allow', options: [{ value: 'allow', label: 'Allow crawling' }, { value: 'block', label: 'Block all crawlers' }] },
      { id: 'disallow', label: 'Disallowed paths (one per line)', type: 'textarea', rows: 3, placeholder: '/admin\n/cart\n/checkout' },
    ],
    cta: 'Generate robots.txt', run: E.robotsGenerator,
  },
  {
    id: 'url-extractor', name: 'Website URL Extractor', category: 'Sitemap & SEO',
    badge: '🕸️', color: '#EC4899',
    blurb: 'Crawl a page and extract all links, split into internal and external.',
    tags: ['crawl', 'links', 'seo'],
    inputs: [urlField('url', 'Page URL', 'https://example.com')],
    cta: 'Extract links', run: E.urlExtractor, async: true,
  },

  /* ---------------------------------------------------- Convert to Markdown */
  {
    id: 'csv-to-md', name: 'CSV to Markdown', category: 'Convert to Markdown',
    badge: '📑', color: '#10B981',
    blurb: 'Turn CSV data into a clean GitHub-flavoured Markdown table.',
    tags: ['csv', 'markdown', 'table'],
    inputs: [
      { id: 'csv', label: 'CSV data', type: 'textarea', rows: 7, placeholder: 'name,role,city\nAda,Engineer,London\nGrace,Scientist,NYC' },
      { id: 'delimiter', label: 'Delimiter', type: 'select', default: 'comma', options: [{ value: 'comma', label: 'Comma ,' }, { value: 'semicolon', label: 'Semicolon ;' }, { value: 'tab', label: 'Tab' }] },
    ],
    cta: 'Convert', run: E.csvToMarkdown,
  },
  {
    id: 'json-to-md', name: 'JSON to Markdown', category: 'Convert to Markdown',
    badge: '{ }', color: '#F59E0B',
    blurb: 'Convert JSON into readable Markdown — arrays of objects become tables.',
    tags: ['json', 'markdown'],
    inputs: [{ id: 'json', label: 'JSON', type: 'textarea', rows: 8, placeholder: '[{"name":"Ada","role":"Engineer"},{"name":"Grace","role":"Scientist"}]' }],
    cta: 'Convert', run: E.jsonToMarkdown,
  },
  {
    id: 'html-to-md', name: 'HTML to Markdown', category: 'Convert to Markdown',
    badge: '</>', color: '#EF4444',
    blurb: 'Convert an HTML snippet into clean Markdown (headings, links, lists, code).',
    tags: ['html', 'markdown'],
    inputs: [{ id: 'html', label: 'HTML', type: 'textarea', rows: 8, placeholder: '<h1>Title</h1><p>Hello <a href="/x">world</a></p>' }],
    cta: 'Convert', run: E.htmlToMarkdown,
  },
  {
    id: 'xml-to-md', name: 'XML to Markdown', category: 'Convert to Markdown',
    badge: '🧩', color: '#8B5CF6',
    blurb: 'Convert an XML document into a nested Markdown outline.',
    tags: ['xml', 'markdown'],
    inputs: [{ id: 'xml', label: 'XML', type: 'textarea', rows: 8, placeholder: '<book><title>Dune</title><author>Herbert</author></book>' }],
    cta: 'Convert', run: E.xmlToMarkdown,
  },
  {
    id: 'text-to-md', name: 'Paste to Markdown', category: 'Convert to Markdown',
    badge: '✍️', color: '#06B6D4',
    blurb: 'Clean up pasted text into tidy Markdown — bullets, numbering, spacing.',
    tags: ['text', 'markdown', 'cleanup'],
    inputs: [{ id: 'text', label: 'Text', type: 'textarea', rows: 8, placeholder: 'Paste any messy text here…' }],
    cta: 'Convert', run: E.textToMarkdown,
  },
  {
    id: 'webpage-to-md', name: 'Webpage to Markdown', category: 'Convert to Markdown',
    badge: '🌐', color: '#3B82F6',
    blurb: 'Enter any URL and convert the page’s main content to Markdown.',
    tags: ['webpage', 'markdown', 'scrape'],
    inputs: [urlField('url', 'Webpage URL', 'https://en.wikipedia.org/wiki/Artificial_intelligence')],
    cta: 'Convert', run: E.webpageToMarkdown, async: true,
  },

  /* ---------------------------------------------------- Generators */
  {
    id: 'chatbot-name', name: 'AI Chatbot Name Generator', category: 'Generators',
    badge: '💬', color: '#A855F7',
    blurb: 'Generate catchy, on-brand names for your AI assistant or chatbot.',
    tags: ['naming', 'chatbot', 'branding'],
    inputs: [
      { id: 'topic', label: 'What does your bot do?', type: 'text', placeholder: 'e.g. customer support, fitness coaching' },
      { id: 'tone', label: 'Tone', type: 'select', default: 'friendly', options: [{ value: 'friendly', label: 'Friendly' }, { value: 'professional', label: 'Professional' }, { value: 'playful', label: 'Playful' }] },
    ],
    cta: 'Generate names', run: AI.chatbotNameGeneratorAI, ai: true, async: true,
  },
  {
    id: 'brand-name', name: 'SaaS Brand Name Generator', category: 'Generators',
    badge: '🏷️', color: '#EC4899',
    blurb: 'Discover brandable SaaS / startup names with available-looking domains.',
    tags: ['naming', 'saas', 'startup'],
    inputs: [{ id: 'keywords', label: 'Keywords (one or two)', type: 'text', placeholder: 'e.g. invoice, automation' }],
    cta: 'Generate names', run: AI.brandNameGeneratorAI, ai: true, async: true,
  },
  {
    id: 'blog-title', name: 'Blog Title Generator', category: 'Generators',
    badge: '📝', color: '#F59E0B',
    blurb: 'Craft compelling, click-worthy blog titles from a topic or keyword.',
    tags: ['blog', 'titles', 'seo'],
    inputs: [
      { id: 'topic', label: 'Topic / keyword', type: 'text', placeholder: 'e.g. remote team productivity' },
      { id: 'tone', label: 'Style', type: 'select', default: 'mixed', options: [{ value: 'mixed', label: 'Mixed' }, { value: 'listicle', label: 'Listicle' }, { value: 'howto', label: 'How-to' }, { value: 'question', label: 'Question' }] },
    ],
    cta: 'Generate titles', run: AI.blogTitleGeneratorAI, ai: true, async: true,
  },
  {
    id: 'email-signature', name: 'Email Signature Generator', category: 'Generators',
    badge: '✉️', color: '#7C3AED',
    blurb: 'Design a professional email signature and copy ready-to-paste HTML.',
    tags: ['email', 'signature', 'html'],
    inputs: [
      { id: 'name', label: 'Full name', type: 'text', placeholder: 'Karan Shah' },
      { id: 'title', label: 'Job title', type: 'text', placeholder: 'Founder' },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Glancer AI' },
      { id: 'phone', label: 'Phone', type: 'text', placeholder: '+1 555 123 4567' },
      { id: 'email', label: 'Email', type: 'text', placeholder: 'karan@glancerai.com' },
      { id: 'website', label: 'Website', type: 'text', placeholder: 'glancerai.com' },
    ],
    cta: 'Generate signature', run: E.emailSignature,
  },

  /* ---------------------------------------------------- Calculators */
  {
    id: 'chatbot-roi', name: 'Chatbot ROI Calculator', category: 'Calculators',
    badge: '💰', color: '#10B981',
    blurb: 'Estimate the monthly and annual savings from deploying an AI chatbot.',
    tags: ['roi', 'chatbot', 'calculator'],
    inputs: [
      { id: 'tickets', label: 'Support tickets / month', type: 'number', default: '3000', placeholder: '3000' },
      { id: 'costPerTicket', label: 'Cost per ticket ($)', type: 'number', default: '6', placeholder: '6' },
      { id: 'deflection', label: 'Expected deflection rate (%)', type: 'number', default: '45', placeholder: '45' },
      { id: 'botCost', label: 'Chatbot cost / month ($)', type: 'number', default: '500', placeholder: '500' },
    ],
    cta: 'Calculate ROI', run: E.chatbotRoi,
  },

  /* ---------------------------------------------------- AI Prompts */
  {
    id: 'prompt-generator', name: 'AI Prompt Generator', category: 'AI Prompts',
    badge: '✨', color: '#A855F7',
    blurb: 'Build a high-quality prompt using proven frameworks (APE, RACE, CREATE, SPARK).',
    tags: ['prompt', 'framework', 'ai'],
    inputs: [
      { id: 'task', label: 'What should the AI do?', type: 'textarea', rows: 3, placeholder: 'Write a launch announcement for our new pricing plan' },
      { id: 'role', label: 'Role for the AI', type: 'text', placeholder: 'a senior product marketer' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'existing SaaS customers' },
      { id: 'format', label: 'Desired output', type: 'text', placeholder: 'a 150-word email with a subject line' },
      { id: 'framework', label: 'Framework', type: 'select', default: 'RACE', options: ['APE', 'RACE', 'CREATE', 'SPARK'].map((v) => ({ value: v, label: v })) },
    ],
    cta: 'Generate prompt', run: E.promptGenerator,
  },
  {
    id: 'prompt-optimizer', name: 'AI Prompt Optimizer', category: 'AI Prompts',
    badge: '🛠️', color: '#06B6D4',
    blurb: 'Analyze an existing prompt and rewrite it into a stronger, structured one.',
    tags: ['prompt', 'optimize', 'ai'],
    inputs: [{ id: 'prompt', label: 'Your current prompt', type: 'textarea', rows: 5, placeholder: 'write me a blog post about dogs' }],
    cta: 'Optimize', run: AI.promptOptimizerAI, ai: true, async: true,
  },

  /* ---------------------------------------------------- Writing */
  {
    id: 'faq-generator', name: 'FAQ Generator', category: 'Writing',
    badge: '❓', color: '#3B82F6',
    blurb: 'Turn any block of content into a structured Markdown FAQ.',
    tags: ['faq', 'content', 'markdown'],
    inputs: [
      { id: 'text', label: 'Content', type: 'textarea', rows: 7, placeholder: 'Paste a product description, doc or article…' },
      { id: 'count', label: 'Number of questions', type: 'number', default: '6', placeholder: '6' },
    ],
    cta: 'Generate FAQ', run: AI.faqGeneratorAI, ai: true, async: true,
  },
  {
    id: 'email-response', name: 'Email Response Generator', category: 'Writing',
    badge: '📨', color: '#7C3AED',
    blurb: 'Draft a polished reply to any email in the tone and intent you choose.',
    tags: ['email', 'reply', 'writing'],
    inputs: [
      { id: 'incoming', label: 'Email you received', type: 'textarea', rows: 5, placeholder: 'Paste the message you need to reply to…' },
      { id: 'tone', label: 'Tone', type: 'select', default: 'professional', options: [{ value: 'professional', label: 'Professional' }, { value: 'friendly', label: 'Friendly' }, { value: 'formal', label: 'Formal' }] },
      { id: 'intent', label: 'Your intent', type: 'select', default: 'info', options: [{ value: 'info', label: 'Provide info' }, { value: 'accept', label: 'Accept' }, { value: 'decline', label: 'Decline' }, { value: 'followup', label: 'Follow up' }] },
    ],
    cta: 'Draft reply', run: AI.emailResponseAI, ai: true, async: true,
  },
  {
    id: 'letter-generator', name: 'AI Letter Generator', category: 'Writing',
    badge: '📄', color: '#EC4899',
    blurb: 'Generate professional letters — cover, resignation, complaint, thank-you and more.',
    tags: ['letter', 'writing'],
    inputs: [
      { id: 'type', label: 'Letter type', type: 'select', default: 'cover', options: [{ value: 'cover', label: 'Cover letter' }, { value: 'resignation', label: 'Resignation' }, { value: 'complaint', label: 'Complaint' }, { value: 'recommendation', label: 'Recommendation' }, { value: 'thankyou', label: 'Thank you' }] },
      { id: 'recipient', label: 'Recipient', type: 'text', placeholder: 'Hiring Manager' },
      { id: 'sender', label: 'Your name', type: 'text', placeholder: 'Karan Shah' },
      { id: 'details', label: 'Key details', type: 'textarea', rows: 3, placeholder: 'One or two sentences about the specifics…' },
    ],
    cta: 'Generate letter', run: AI.letterGeneratorAI, ai: true, async: true,
  },
  {
    id: 'cs-script', name: 'Customer Service Script Generator', category: 'Writing',
    badge: '🎧', color: '#10B981',
    blurb: 'Generate a professional, step-by-step support script for any scenario.',
    tags: ['support', 'script', 'cx'],
    inputs: [
      { id: 'scenario', label: 'Scenario', type: 'text', placeholder: 'refund request, late delivery, billing question' },
      { id: 'product', label: 'Product / company', type: 'text', placeholder: 'Glancer AI' },
      { id: 'tone', label: 'Tone', type: 'select', default: 'friendly', options: [{ value: 'friendly', label: 'Friendly' }, { value: 'formal', label: 'Formal' }] },
    ],
    cta: 'Generate script', run: AI.customerServiceScriptAI, ai: true, async: true,
  },
];
