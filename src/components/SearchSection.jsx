import { useState, useRef } from 'react';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CHIPS = ['Observability', 'AIOps', 'OpenTelemetry', 'SLO', 'MTTR', 'Distributed Tracing', 'Anomaly Detection'];

const GLOSSARY_TERMS = {
  observability: { term: 'Observability', def: 'The ability to understand the internal state of a system by examining its external outputs — primarily metrics, logs, and traces. A system is observable if you can answer any question about its behavior, including ones you didn\'t anticipate.' },
  aiops: { term: 'AIOps', def: 'Artificial Intelligence for IT Operations. The application of ML, big data, and analytics to IT operations data — automating anomaly detection, event correlation, root cause analysis, and remediation at machine speed and scale.' },
  opentelemetry: { term: 'OpenTelemetry', def: 'A CNCF project providing a vendor-neutral, open-source framework for collecting and exporting telemetry data (metrics, logs, traces). It defines APIs, SDKs, and a wire protocol (OTLP) that works with any observability backend.' },
  slo: { term: 'SLO (Service Level Objective)', def: 'A target value or range for a reliability metric that a service must meet. SLOs are the internal commitments teams make, typically stricter than SLAs. They drive error budget calculations and release decisions.' },
  mttr: { term: 'MTTR (Mean Time to Recovery)', def: 'The average time it takes to restore a service after a failure. MTTR = total downtime / number of incidents. Reducing MTTR is a primary goal of observability investments.' },
  'distributed tracing': { term: 'Distributed Tracing', def: 'The practice of tracking a single request end-to-end as it flows through multiple services. Each unit of work is a span; spans are stitched together by a trace ID to form a complete picture of request latency and failures.' },
  'anomaly detection': { term: 'Anomaly Detection', def: 'Automated identification of data points or behaviors that deviate significantly from expected patterns. In AIOps, this replaces static thresholds with ML-driven baselines that adapt to normal seasonality and growth.' },
};

function lookup(query) {
  const q = query.trim().toLowerCase();
  return GLOSSARY_TERMS[q] || null;
}

export default function SearchSection() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  function handleSearch(term) {
    const q = term || value;
    if (!q.trim()) return;
    const r = lookup(q);
    setResult(r);
    setSearched(true);
  }

  function handleChip(term) {
    setValue(term);
    const r = lookup(term);
    setResult(r);
    setSearched(true);
  }

  return (
    <section id="glossary" className="search-section">
      <div className="container">
        <p className="section-label" style={{ marginBottom: 10 }}>Glossary</p>
        <h2 className="search-section-title">
          Search <span className="grad-text">1,700+</span> AI & Observability Terms
        </h2>
        <p className="search-section-sub">
          Instant definitions for AIOps, Observability, APM, and AI/ML terminology — curated from how the industry actually uses them.
        </p>

        <div className="search-box-wrap">
          <span className="search-icon" aria-hidden="true"><SearchIcon /></span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search a term… e.g. MTTR, span, anomaly detection"
            aria-label="Search glossary terms"
            autoComplete="off"
            spellCheck="false"
          />
          <button className="search-btn" onClick={() => handleSearch()}>
            Define
          </button>
        </div>

        <div className="search-chips" role="group" aria-label="Quick search suggestions">
          {CHIPS.map(chip => (
            <button key={chip} className="search-chip" onClick={() => handleChip(chip)}>
              {chip}
            </button>
          ))}
        </div>

        {searched && (
          <div className="search-result-panel" role="region" aria-live="polite" aria-label="Search result">
            {result ? (
              <>
                <div className="search-result-term">{result.term}</div>
                <p className="search-result-def">{result.def}</p>
              </>
            ) : (
              <>
                <div className="search-result-term" style={{ color: 'var(--text-secondary)' }}>
                  No result for &ldquo;{value}&rdquo;
                </div>
                <p className="search-result-def">
                  Try a different spelling or browse the full glossary on the{' '}
                  <a href="/glossary" style={{ color: 'var(--purple)' }}>
                    Glossary page
                  </a>
                </p>
              </>
            )}
          </div>
        )}

        <div className="stats-bar" aria-label="Site statistics">
          <div className="stat-item">
            <div className="stat-value">1,700+</div>
            <div className="stat-label">Terms</div>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <div className="stat-value">28</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <div className="stat-value">100%</div>
            <div className="stat-label">Free</div>
          </div>
        </div>
      </div>
    </section>
  );
}
