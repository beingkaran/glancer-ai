/** Shared FAQ copy — used by FAQPage and build-time prerender. */

export const FAQS = [
  {
    q: 'What is Glancer AI?',
    a: 'Glancer AI (glancerai.com) is a free AI intelligence hub for engineers, SREs, and researchers. It brings together in-depth deep dives and vendor comparisons, industry metrics and benchmarks, a searchable AIOps/observability glossary, expert blogs, and 25+ free in-browser AI tools — all in one place, with no paywalls or mandatory sign-up.',
  },
  {
    q: 'Is Glancer AI free to use?',
    a: 'Yes. Glancer AI is completely free. You can read the deep dives, browse the glossary, view metrics, read blogs, and use every in-browser AI tool without paying or creating an account. Ads help keep the site running. An optional free account lets you write and publish your own blog posts.',
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
    q: 'How often are the Deep Dives on Glancer AI updated?',
    a: 'New deep dives — practitioner guides, vendor comparisons and benchmarks — are published regularly, and existing ones are revised as the AIOps and observability landscape changes. The glossary and metrics are kept current alongside them.',
  },
  {
    q: 'Can I write and publish my own blog on Glancer AI?',
    a: 'Yes. Create a free account, then use the "Write a Blog" editor to draft and submit a post. Submissions are reviewed and, once approved, published on Glancer AI where they are indexed by search engines — a great way to share technical writing and reach the AI and observability community.',
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

export const AI_FAQS = [
  { q: 'What is AIOps and observability?', a: 'AIOps applies machine learning to IT operations data — logs, metrics, traces and events — to detect anomalies, correlate alerts and speed up incident resolution. Observability is the ability to understand a system\'s internal state from those outputs. Together they are how modern engineering teams keep complex systems reliable.' },
  { q: 'How do the major observability vendors compare?', a: 'Datadog, New Relic, Splunk, Dynatrace, Grafana and others differ on pricing model, data ingestion, tracing depth and how much AI-driven analysis they include. Glancer AI publishes vendor-neutral deep dives and side-by-side comparisons written by an engineer rather than a marketing team.' },
  { q: 'Why does practitioner-grade analysis matter?', a: 'Vendor blogs tend to explain observability in ways that favour their own product. Independent, practitioner-grade analysis focuses on trade-offs, real-world benchmarks and how tools behave in production, so you can make decisions on evidence rather than marketing.' },
  { q: 'Which companies are leading AI development?', a: 'Some of the leading AI companies include OpenAI, Google DeepMind, Microsoft, Anthropic, Meta, NVIDIA, Amazon, IBM, and xAI.' },
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
  { q: 'How can I stay updated with AI and observability?', a: 'You can subscribe to engineering newsletters, follow AI researchers and companies on social media, monitor GitHub projects, read research publications, and bookmark practitioner resources like Glancer AI\'s deep dives and glossary.' },
  { q: 'What is the future of artificial intelligence?', a: 'AI is expected to become increasingly integrated into everyday applications, driving advances in automation, healthcare, education, scientific research, robotics, and personalized digital experiences.' },
];

/** Guides and articles published as public Claude artifacts. */
export const CLAUDE_PUBLISHED_LINKS = [
  {
    title: 'What Is AIOps? A Practical Guide for Engineering Teams',
    url: 'https://claude.ai/public/artifacts/9d14afa9-d9e6-4a34-91a0-e5293e5623e2',
  },
  {
    title: "Observability vs Monitoring: What's the Real Difference?",
    url: 'https://claude.ai/public/artifacts/9fc4b649-9b59-4a29-975f-075877e92221',
  },
  {
    title: 'The Three Pillars of Observability: Metrics, Logs, and Traces',
    url: 'https://claude.ai/public/artifacts/2cf5e36f-dfba-408f-a2f9-c42893734587',
  },
  {
    title: 'OpenTelemetry Explained: The Standard Behind Modern Observability',
    url: 'https://claude.ai/public/artifacts/092eff39-3d1b-4de9-b3bf-cbb9e8ceef0a',
  },
  {
    title: 'SLIs, SLOs, and Error Budgets: Reliability in Plain English',
    url: 'https://claude.ai/public/artifacts/c4647c22-debd-44bc-9039-9ea79fe1a4cc',
  },
  {
    title: 'How to Reduce MTTR: A Practical Playbook for Faster Incident Resolution',
    url: 'https://claude.ai/public/artifacts/097682c0-6a79-4b58-9132-088eeec9b3a2',
  },
  {
    title: 'Fixing Alert Fatigue: How to Make On-Call Bearable Again',
    url: 'https://claude.ai/public/artifacts/12f8400c-b913-43e8-a6aa-280824c0ad52',
  },
];

export function faqAnswerText({ a, items }) {
  return items && items.length ? `${a} ${items.join(', ')}.` : a;
}