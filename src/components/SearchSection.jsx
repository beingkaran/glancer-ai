import { useState, useRef, useMemo, useEffect } from 'react';
import { GLOSSARY_TERMS } from '../data/allGlossary';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CHIPS = ['Observability', 'AIOps', 'OpenTelemetry', 'SLO', 'MTTR', 'Distributed Tracing', 'Anomaly Detection'];

// Find the single best exact-ish match for a query (term or abbreviation).
function lookup(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    GLOSSARY_TERMS.find((t) => t.term.toLowerCase() === q || (t.abbr || '').toLowerCase() === q) ||
    GLOSSARY_TERMS.find((t) => t.term.toLowerCase().startsWith(q)) ||
    GLOSSARY_TERMS.find((t) => t.term.toLowerCase().includes(q) || (t.abbr || '').toLowerCase().includes(q)) ||
    null
  );
}

export default function SearchSection() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  const q = value.trim().toLowerCase();

  // Live autocomplete: terms whose name/abbr match, prefix matches ranked first.
  const suggestions = useMemo(() => {
    if (q.length < 1) return [];
    const starts = [];
    const contains = [];
    for (const t of GLOSSARY_TERMS) {
      const name = t.term.toLowerCase();
      const abbr = (t.abbr || '').toLowerCase();
      if (name.startsWith(q) || abbr === q) starts.push(t);
      else if (name.includes(q) || abbr.includes(q)) contains.push(t);
      if (starts.length >= 8) break;
    }
    return [...starts, ...contains].slice(0, 8);
  }, [q]);

  // Close the dropdown when clicking outside the search box.
  useEffect(() => {
    const onClick = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setShowSuggest(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function showTerm(entry) {
    setResult(entry);
    setSearched(true);
    setShowSuggest(false);
  }

  function handleSelect(entry) {
    setValue(entry.term);
    showTerm(entry);
  }

  function handleSearch(term) {
    const r = lookup(term || value);
    setResult(r);
    setSearched(true);
    setShowSuggest(false);
  }

  function handleChip(term) {
    setValue(term);
    handleSearch(term);
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

        <div className="search-box-wrap" ref={boxRef}>
          <span className="search-icon" aria-hidden="true"><SearchIcon /></span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setShowSuggest(true); }}
            onFocus={() => setShowSuggest(true)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSearch();
              else if (e.key === 'Escape') setShowSuggest(false);
            }}
            placeholder="Search a term… e.g. MTTR, span, anomaly detection"
            aria-label="Search glossary terms"
            autoComplete="off"
            spellCheck="false"
          />
          <button className="search-btn" onClick={() => handleSearch()}>
            Define
          </button>

          {showSuggest && q && (
            <div className="search-suggest" role="listbox">
              {suggestions.length === 0 ? (
                <div className="search-suggest-empty">No terms match &ldquo;{value}&rdquo;</div>
              ) : (
                suggestions.map((t) => (
                  <button
                    key={t.term}
                    type="button"
                    className="search-suggest-item"
                    role="option"
                    onClick={() => handleSelect(t)}
                  >
                    <span className="search-suggest-icon" style={{ background: 'var(--grad-brand)', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
                      {(t.abbr || t.term).slice(0, 2).toUpperCase()}
                    </span>
                    <span className="search-suggest-text">
                      <span className="search-suggest-title">{t.term}{t.abbr ? ` · ${t.abbr}` : ''}</span>
                      <span className="search-suggest-cat">{t.category}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
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
                <div className="search-result-term">{result.term}{result.abbr ? ` (${result.abbr})` : ''}</div>
                <p className="search-result-def">{result.definition}</p>
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
