import { useState, useMemo, useRef, useEffect } from 'react';
import { GLOSSARY_TERMS } from '../data/allGlossary';

const CAT_ICONS = {
  'AI/ML': '🧠', 'AIOps': '🤖', 'APM': '📊', 'Architecture': '🏛️',
  'Cloud Native': '☁️', 'Cloud Providers': '⛅', 'Compute & Runtime': '⚙️',
  'Containers': '📦', 'Data & Streaming': '🌊', 'Data Formats': '📄',
  'Databases': '🗃️', 'DevOps & CI/CD': '🔧', 'Digital Experience': '🖥️',
  'Distributed Systems': '🕸️', 'Fundamentals': '📚', 'IT Operations': '🛠️',
  'Incident': '🚨', 'Infrastructure': '🏗️', 'Kubernetes': '☸️', 'Logging': '📋',
  'Metrics': '📈', 'Networking': '🌐', 'Reliability': '🛡️', 'Security & SIEM': '🔒',
  'Service Mesh': '🔗', 'Standards & Tools': '🧰', 'Tracing': '🧵', 'Visualization': '📉',
};
const CAT_TINTS = ['rgba(168,85,247,0.13)', 'rgba(6,182,212,0.12)', 'rgba(59,130,246,0.12)', 'rgba(236,72,153,0.12)', 'rgba(249,115,22,0.12)', 'rgba(34,197,94,0.12)'];
const TINT_BORDERS = ['rgba(168,85,247,0.3)', 'rgba(6,182,212,0.3)', 'rgba(59,130,246,0.3)', 'rgba(236,72,153,0.3)', 'rgba(249,115,22,0.3)', 'rgba(34,197,94,0.3)'];

const RESULT_CAP = 120;

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [showSuggest, setShowSuggest] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggest(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const categories = useMemo(() => {
    const counts = {};
    GLOSSARY_TERMS.forEach((t) => { counts[t.category] = (counts[t.category] || 0) + 1; });
    return Object.keys(counts).sort().map((name, i) => ({
      name, count: counts[name],
      icon: CAT_ICONS[name] || '📘',
      tint: CAT_TINTS[i % CAT_TINTS.length],
      border: TINT_BORDERS[i % TINT_BORDERS.length],
    }));
  }, []);

  const q = query.trim().toLowerCase();

  // Autocomplete suggestions — term name / abbreviation matches first.
  const suggestions = useMemo(() => {
    if (!q) return [];
    const starts = [], contains = [];
    for (const t of GLOSSARY_TERMS) {
      const name = t.term.toLowerCase();
      const abbr = (t.abbr || '').toLowerCase();
      if (name.startsWith(q) || abbr === q) starts.push(t);
      else if (name.includes(q) || abbr.includes(q)) contains.push(t);
      if (starts.length >= 8) break;
    }
    return [...starts, ...contains].slice(0, 8);
  }, [q]);

  // Results: search query takes priority, then selected category.
  const results = useMemo(() => {
    if (q) {
      const matches = GLOSSARY_TERMS.filter((t) =>
        t.term.toLowerCase().includes(q) ||
        (t.abbr || '').toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q));
      // term/abbr matches first, definition-only matches after
      matches.sort((a, b) => {
        const aName = a.term.toLowerCase().includes(q) || (a.abbr || '').toLowerCase().includes(q);
        const bName = b.term.toLowerCase().includes(q) || (b.abbr || '').toLowerCase().includes(q);
        return (bName ? 1 : 0) - (aName ? 1 : 0);
      });
      return matches;
    }
    if (activeCat) return GLOSSARY_TERMS.filter((t) => t.category === activeCat).sort((a, b) => a.term.localeCompare(b.term));
    return [];
  }, [q, activeCat]);

  const showResults = !!q || !!activeCat;

  function pickSuggestion(term) {
    setQuery(term.term);
    setActiveCat(null);
    setShowSuggest(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }
  function pickCategory(name) {
    setActiveCat(name);
    setQuery('');
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }
  function reset() {
    setQuery('');
    setActiveCat(null);
  }

  return (
    <div className="page-section">
      <div className="container">
        {/* Header + search */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 32, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Reference</p>
          <h1 className="page-hero-title">AI, AIOps &amp; Observability Glossary</h1>
          <p className="hero-sub" style={{ margin: '0 auto 26px' }}>
            {GLOSSARY_TERMS.length.toLocaleString()} terms across {categories.length} categories. Search a term or pick a category to browse.
          </p>

          <div className="blog-search-wrap" ref={searchRef} style={{ marginBottom: 0 }}>
            <span className="blog-search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              className="blog-search-input"
              type="text"
              placeholder="Search 1,599 terms… e.g. eBPF, SLO, Kubernetes, vector database"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggest(true); setActiveCat(null); }}
              onFocus={() => setShowSuggest(true)}
              aria-label="Search glossary"
              autoComplete="off"
            />
            {query && <button className="blog-search-clear" onClick={() => setQuery('')} aria-label="Clear">✕</button>}
            {showSuggest && q && (
              <div className="search-suggest" role="listbox">
                {suggestions.length === 0 ? (
                  <div className="search-suggest-empty">No terms match "{query}"</div>
                ) : (
                  suggestions.map((t) => (
                    <button key={t.term} className="search-suggest-item" role="option" onClick={() => pickSuggestion(t)}>
                      <span className="search-suggest-icon" style={{ background: CAT_TINTS[0] }}>{CAT_ICONS[t.category] || '📘'}</span>
                      <span className="search-suggest-text">
                        <span className="search-suggest-title">{t.term}{t.abbr && t.abbr !== t.term ? ` (${t.abbr})` : ''}</span>
                        <span className="search-suggest-cat">{t.category}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {!showResults && (
          <div className="stats-bar" style={{ marginBottom: 40 }}>
            <div className="stat-item"><div className="stat-value">{GLOSSARY_TERMS.length.toLocaleString()}</div><div className="stat-label">Terms</div></div>
            <div className="stat-divider" />
            <div className="stat-item"><div className="stat-value">{categories.length}</div><div className="stat-label">Categories</div></div>
            <div className="stat-divider" />
            <div className="stat-item"><div className="stat-value">100%</div><div className="stat-label">Free</div></div>
          </div>
        )}

        {/* Default: category cards */}
        {!showResults && (
          <div>
            <p className="section-label" style={{ marginBottom: 12 }}>Browse by Category</p>
            <div className="cat-grid" style={{ marginBottom: 60 }}>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className="cat-card glass cat-card-btn"
                  style={{ '--cat-color': cat.tint, '--cat-border': cat.border }}
                  onClick={() => pickCategory(cat.name)}
                >
                  <div className="cat-icon">{cat.icon}</div>
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-count">{cat.count} terms</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results: glossary items with definitions */}
        {showResults && (
          <div ref={resultsRef} style={{ scrollMarginTop: 90 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
              <h2 className="section-title-lg">
                {q ? <>Results for &ldquo;{query}&rdquo;</> : <><span style={{ marginRight: 8 }}>{CAT_ICONS[activeCat] || '📘'}</span>{activeCat}</>}
              </h2>
              <button className="filter-chip" onClick={reset} style={{ cursor: 'pointer' }}>← All categories</button>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              {results.length.toLocaleString()} term{results.length !== 1 ? 's' : ''}
              {results.length > RESULT_CAP ? ` · showing first ${RESULT_CAP}, refine your search to narrow down` : ''}
            </p>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                No glossary items found. Try another term or category.
              </div>
            ) : (
              <div className="glossary-results" style={{ marginBottom: 80 }}>
                {results.slice(0, RESULT_CAP).map((t) => (
                  <div key={t.term} className="glossary-item-card">
                    <div className="glossary-item-head">
                      <h3 className="glossary-item-term">
                        {t.term}{t.abbr && t.abbr !== t.term ? <span className="glossary-item-abbr"> ({t.abbr})</span> : null}
                      </h3>
                      <span className="news-category-tag tag-purple" style={{ margin: 0, fontSize: '0.6rem' }}>{t.category}</span>
                    </div>
                    <p className="glossary-item-def">{t.definition}</p>
                    {(t.related || []).length > 0 && (
                      <div className="glossary-item-related">
                        {t.related.slice(0, 5).map((r) => (
                          <button key={r} className="glossary-related-chip" onClick={() => { setQuery(r); setActiveCat(null); setShowSuggest(false); resultsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}>
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
