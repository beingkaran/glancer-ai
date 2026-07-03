import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'news',    label: 'AI News',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg> },
  { id: 'glossary',label: 'Glossary', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
];

const QUICK_LINK_SETS = [
  [
    { category: 'APM', tone: 'apm', label: 'Datadog vs New Relic vs Splunk', to: '/blog/datadog-vs-newrelic-vs-splunk-2026' },
    { category: 'Glossary', tone: 'glossary', label: 'What is AIOps?', to: '/glossary' },
    { category: 'Tracing', tone: 'tracing', label: 'Distributed tracing explained', to: '/blog/distributed-tracing-explained' },
  ],
  [
    { category: 'SRE', tone: 'sre', label: 'The four golden signals', to: '/blog/four-golden-signals' },
    { category: 'Compare', tone: 'compare', label: 'New Relic vs Splunk', to: '/blog/newrelic-vs-splunk-observability-comparison-2026' },
    { category: 'AIOps', tone: 'aiops', label: 'Self-healing in 2026', to: '/blog/aiops-autonomous-remediation-self-healing-2026' },
  ],
  [
    { category: 'Observability', tone: 'observability', label: 'Monitoring vs observability', to: '/blog/observability-vs-monitoring' },
    { category: 'SLOs', tone: 'sre', label: 'Error budgets & SLIs', to: '/blog/slo-sla-sli-practical-guide' },
    { category: 'Agents', tone: 'agents', label: 'AI agent blind spots', to: '/blog/ai-agents-observability-blind-spot' },
  ],
  [
    { category: 'Benchmark', tone: 'apm', label: 'Datadog full-stack in 2026', to: '/blog/datadog-full-stack-observability-2026' },
    { category: 'Define', tone: 'glossary', label: 'Anomaly detection explained', to: '/blog/ai-observability-anomaly-detection-explained' },
    { category: 'Cloud', tone: 'cloud', label: 'AWS vs Azure SRE agents', to: '/blog/aws-devops-agent-vs-azure-sre-agent-remediation-faceoff' },
  ],
  [
    { category: 'AIOps', tone: 'aiops', label: 'The 4% adoption gap', to: '/blog/four-percent-operationalized-aiops-adoption-gap' },
    { category: 'OpenTelemetry', tone: 'tracing', label: 'New Relic\'s OTel-first path', to: '/blog/new-relic-opentelemetry-first-strategy' },
    { category: 'Compare', tone: 'compare', label: 'Ultimate APM shootout', to: '/blog/ultimate-apm-comparison-datadog-newrelic-splunk-appdynamics-broadcom-2026' },
  ],
  [
    { category: 'Glossary', tone: 'glossary', label: 'What is observability?', to: '/glossary' },
    { category: 'Practice', tone: 'tracing', label: 'Alert correlation & noise', to: '/blog/aiops-alert-correlation-noise-reduction-intermediate' },
    { category: 'Deep dive', tone: 'observability', label: 'eBPF & intelligent observability', to: '/blog/ebpf-llms-next-frontier-intelligent-observability-expert' },
  ],
];

const ROTATE_MS = 8000;

const DESK_STATS = [
  { value: '2,200+', label: 'glossary terms' },
  { value: '100+', label: 'news sources' },
  { value: 'Live', label: 'industry feed' },
];

export default function Hero({ activeTab, onTabChange }) {
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [quickLinkSet, setQuickLinkSet] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      setQuickLinkSet(Math.floor(Math.random() * QUICK_LINK_SETS.length));
      return undefined;
    }

    const id = window.setInterval(() => {
      setQuickLinkSet((i) => (i + 1) % QUICK_LINK_SETS.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallaxY = scrollY * 0.22;
  const opacity = Math.max(0, 1 - scrollY / 420);
  const scale = 1 - scrollY * 0.0002;

  function handleTabChange(id) {
    if (id === 'glossary') { navigate('/glossary'); return; }
    onTabChange(id);
  }

  return (
    <section className="hero" ref={heroRef} id="hero">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-grid-lines" />
        <div className="hero-glow" />
      </div>

      <div
        className="hero-parallax-layer"
        style={{ transform: `translateY(${parallaxY}px)`, opacity, scale }}
      >
        <div className="container hero-shell">
          <header className="hero-masthead" aria-label="Site focus areas">
            <span className="hero-masthead-rule" aria-hidden="true" />
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              AIOps · Observability · SRE
            </p>
            <span className="hero-masthead-rule" aria-hidden="true" />
          </header>

          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="hero-title">
                <span className="hero-title-line">Observability intelligence,</span>
                <span className="hero-title-accent">without the vendor spin</span>
              </h1>

              <p className="hero-lead">
                Practitioner-grade comparisons, benchmarks and analysis of the AIOps &amp;
                observability stack — plus a 2,200-term glossary and live industry news.
              </p>
              <p className="hero-byline">Written by an engineer, not a marketing team.</p>

              <div
                key={quickLinkSet}
                className="hero-quicklinks hero-quicklinks--enter"
                aria-label="Popular starting points"
                aria-live="polite"
              >
                {QUICK_LINK_SETS[quickLinkSet].map((q) => (
                  <button
                    key={`${quickLinkSet}-${q.to}`}
                    type="button"
                    className={`hero-quicklink hero-quicklink--${q.tone}`}
                    onClick={() => navigate(q.to)}
                  >
                    <span className="hero-quicklink-hint">{q.category}</span>
                    <span className="hero-quicklink-label">{q.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <aside className="hero-desk" aria-label="What you get here">
              <div className="hero-desk-panel">
                <p className="hero-desk-kicker">The intelligence desk</p>
                <ul className="hero-desk-stats">
                  {DESK_STATS.map((s) => (
                    <li key={s.label}>
                      <span className="hero-desk-value">{s.value}</span>
                      <span className="hero-desk-stat-label">{s.label}</span>
                    </li>
                  ))}
                </ul>
                <div className="hero-pillars" aria-hidden="true">
                  <span>AIOps</span>
                  <span>Observability</span>
                  <span>SRE</span>
                </div>
              </div>
            </aside>
          </div>

          <div id="home-tabs" className="hero-tabs">
            <p className="hero-tabs-label">Explore</p>
            <div className="tab-switcher" role="tablist" aria-label="Content sections">
              {TABS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  className={`tab-btn${activeTab === id ? ' active' : ''}`}
                  onClick={() => handleTabChange(id)}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="hero-scroll-indicator"
        style={{ opacity: Math.max(0, 1 - scrollY / 140) }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}