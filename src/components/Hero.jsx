import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'news',    label: 'AI News',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg> },
  { id: 'blogs',   label: 'Analysis', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { id: 'glossary',label: 'Glossary', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
];

// Lead-with-an-action quick links to the strongest evergreen content, so a cold
// visitor can *do* something in the first screen instead of reading a feature list.
const QUICK_LINKS = [
  { label: 'Datadog vs New Relic vs Splunk', to: '/blogs' },
  { label: 'What is AIOps?', to: '/glossary' },
  { label: 'OpenTelemetry in practice', to: '/blogs' },
];

export default function Hero({ activeTab, onTabChange }) {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  // After 5s the big intro banner (badge + headline + sub) collapses away so the
  // news feed comes into view; the tab switcher stays put. Skipped if the reader
  // has already scrolled down into the content themselves.
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      if (window.scrollY < 80) setCollapsed(true);
    }, 5000);
    return () => clearTimeout(t);
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

  const parallaxY = scrollY * 0.35;
  const opacity = Math.max(0, 1 - scrollY / 380);
  const scale = 1 - scrollY * 0.0003;

  function handleTabChange(id) {
    if (id === 'glossary') { navigate('/glossary'); return; }
    onTabChange(id);
  }

  return (
    <section className={`hero${collapsed ? ' hero-collapsed' : ''}`} ref={heroRef} id="hero">
      <div
        className="hero-parallax-layer"
        style={{ transform: `translateY(${parallaxY}px)`, opacity, scale }}
        ref={contentRef}
      >
        <div className="container">
          <div className="hero-intro" aria-hidden={collapsed}>
            <div className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              AIOps · Observability · SRE
            </div>

            <h1>
              Observability intelligence,<br />
              <span className="grad-text">without the vendor spin</span>
            </h1>

            <p className="hero-sub">
              Practitioner-grade comparisons, benchmarks and analysis of the AIOps &amp;
              observability stack — plus a 2,200-term glossary and live industry news.
              Written by an engineer, not a marketing team.
            </p>

            <div className="hero-quicklinks" aria-label="Popular reads">
              {QUICK_LINKS.map((q) => (
                <button
                  key={q.label}
                  className="hero-quicklink"
                  onClick={() => navigate(q.to)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div id="home-tabs" className="tab-switcher-wrap">
            <div className="tab-switcher" role="tablist" aria-label="Content sections">
              {TABS.map(({ id, label, icon }) => (
                <button
                  key={id}
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
        style={{ opacity: Math.max(0, 1 - scrollY / 120) }}
        aria-hidden="true"
      >
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}
