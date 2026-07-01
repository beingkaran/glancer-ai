import { useState, useMemo, useRef, useEffect } from 'react';
import { GLOSSARY_TERMS as BASE_GLOSSARY_TERMS } from '../data/allGlossary';
import { EXTRA_GLOSSARY_TERMS } from '../data/extraGlossary';
import { EXTRA_GLOSSARY_BATCH4 } from '../data/extraGlossaryBatch4';
import {
  CAT_ICONS, CAT_TINTS, TINT_BORDERS, FEATURED_TERMS,
  CAT_GROUPS, CAT_DESCRIPTIONS,
} from '../data/glossaryMeta';
import GlossaryInfographic, { INFOGRAPHIC_OG_IMAGE } from '../components/GlossaryInfographic';
import { useDocumentMeta } from '../lib/useDocumentMeta';

// Merge the curated supplement into the base set, de-duplicated by lowercased
// term name (and abbreviation) so no term is ever shown twice. New, distinct
// terms are appended; anything already present is dropped.
const GLOSSARY_TERMS = (() => {
  const seen = new Set();
  const keyOf = (t) => (t.term || '').trim().toLowerCase();
  const out = [];
  for (const t of BASE_GLOSSARY_TERMS) {
    const k = keyOf(t);
    if (k && !seen.has(k)) { seen.add(k); out.push(t); }
  }
  for (const t of EXTRA_GLOSSARY_TERMS) {
    const k = keyOf(t);
    if (k && !seen.has(k)) { seen.add(k); out.push(t); }
  }
  for (const t of EXTRA_GLOSSARY_BATCH4) {
    const k = keyOf(t);
    if (k && !seen.has(k)) { seen.add(k); out.push(t); }
  }
  return out;
})();

const PAGE_SIZE = 60;

export default function GlossaryPage() {
  useDocumentMeta({
    title: `AI, AIOps & Observability Glossary — ${GLOSSARY_TERMS.length.toLocaleString()} Terms`,
    description:
      `Free visual glossary map and searchable definitions for AI, AIOps, observability, Kubernetes, DevOps and the GenAI stack. ${GLOSSARY_TERMS.length.toLocaleString()} terms across 28 categories with an interactive infographic.`,
    path: '/glossary',
    image: INFOGRAPHIC_OG_IMAGE,
  });
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [letterFilter, setLetterFilter] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showSuggest, setShowSuggest] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggest(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // DefinedTermSet + ImageObject JSON-LD for Discover / rich results.
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'DefinedTermSet',
          '@id': 'https://glancerai.com/glossary#termset',
          name: 'AI, AIOps & Observability Glossary',
          description: 'Comprehensive glossary of AI, AIOps, observability, DevOps and platform engineering terms.',
          url: 'https://glancerai.com/glossary',
          inDefinedTermSet: GLOSSARY_TERMS.slice(0, 50).map((t) => ({
            '@type': 'DefinedTerm',
            name: t.term,
            description: t.definition,
            inDefinedTermSet: 'https://glancerai.com/glossary#termset',
          })),
        },
        {
          '@type': 'ImageObject',
          '@id': 'https://glancerai.com/glossary#infographic',
          contentUrl: INFOGRAPHIC_OG_IMAGE,
          url: INFOGRAPHIC_OG_IMAGE,
          width: 1200,
          height: 675,
          caption: 'Glancer AI glossary map — all 28 categories from observability to GenAI',
          representativeOfPage: true,
        },
        {
          '@type': 'WebPage',
          '@id': 'https://glancerai.com/glossary',
          name: 'AI, AIOps & Observability Glossary',
          description: 'Searchable glossary with visual infographic covering observability, AIOps, Kubernetes and AI/ML.',
          primaryImageOfPage: { '@id': 'https://glancerai.com/glossary#infographic' },
        },
      ],
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'glossary-jsonld';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  const categories = useMemo(() => {
    const counts = {};
    GLOSSARY_TERMS.forEach((t) => { counts[t.category] = (counts[t.category] || 0) + 1; });
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
      .map((name, i) => ({
        name, count: counts[name],
        icon: CAT_ICONS[name] || '📘',
        tint: CAT_TINTS[i % CAT_TINTS.length],
        border: TINT_BORDERS[i % TINT_BORDERS.length],
      }));
  }, []);

  const catByName = useMemo(() => {
    const m = {};
    categories.forEach((c) => { m[c.name] = c; });
    return m;
  }, [categories]);

  // Reset pagination when search or category changes; reset letter filter on those too.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setLetterFilter(null);
  }, [query, activeCat]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [letterFilter]);

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
    if (activeCat) {
      let items = GLOSSARY_TERMS.filter((t) => t.category === activeCat);
      if (letterFilter) {
        const lf = letterFilter.toLowerCase();
        items = items.filter((t) => t.term.toLowerCase().startsWith(lf));
      }
      return items.sort((a, b) => a.term.localeCompare(b.term));
    }
    return [];
  }, [q, activeCat, letterFilter]);

  // Available first letters for the active category A–Z bar.
  const categoryLetters = useMemo(() => {
    if (!activeCat || q) return [];
    const letters = new Set();
    GLOSSARY_TERMS.filter((t) => t.category === activeCat).forEach((t) => {
      const ch = (t.term[0] || '').toUpperCase();
      if (/[A-Z]/.test(ch)) letters.add(ch);
      else letters.add('#');
    });
    return [...letters].sort();
  }, [activeCat, q]);

  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  const topCategories = useMemo(() => categories.slice(0, 8), [categories]);

  const filteredBrowseGroups = useMemo(() => {
    const cf = catFilter.trim().toLowerCase();
    if (!cf) return CAT_GROUPS;
    return CAT_GROUPS.map((g) => ({
      ...g,
      cats: g.cats.filter((n) => n.toLowerCase().includes(cf) || (CAT_DESCRIPTIONS[n] || '').toLowerCase().includes(cf)),
    })).filter((g) => g.cats.length > 0);
  }, [catFilter]);

  const maxCatCount = useMemo(() => Math.max(...categories.map((c) => c.count), 1), [categories]);

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
    setLetterFilter(null);
    setVisibleCount(PAGE_SIZE);
  }

  function searchTerm(term) {
    setQuery(term);
    setActiveCat(null);
    setLetterFilter(null);
    setShowSuggest(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
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
              placeholder={`Search ${GLOSSARY_TERMS.length.toLocaleString()} terms… e.g. eBPF, SLO, Kubernetes, RAG`}
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

          {/* Quick-search featured terms */}
          {!showResults && (
            <div className="glossary-featured" style={{ marginTop: 18 }}>
              <span className="glossary-featured-label">Popular:</span>
              {FEATURED_TERMS.map((term) => (
                <button key={term} className="glossary-featured-chip" onClick={() => searchTerm(term)}>{term}</button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {!showResults && (
          <div className="stats-bar glossary-stats" style={{ marginBottom: 40 }}>
            <div className="stat-item"><div className="stat-value">{GLOSSARY_TERMS.length.toLocaleString()}</div><div className="stat-label">Terms</div></div>
            <div className="stat-divider" />
            <div className="stat-item"><div className="stat-value">{categories.length}</div><div className="stat-label">Categories</div></div>
            <div className="stat-divider" />
            <div className="stat-item"><div className="stat-value">{topCategories[0]?.count || 0}</div><div className="stat-label">Largest ({topCategories[0]?.name || '—'})</div></div>
            <div className="stat-divider" />
            <div className="stat-item"><div className="stat-value">100%</div><div className="stat-label">Free</div></div>
          </div>
        )}

        {/* Discover-friendly infographic + category cards */}
        {!showResults && (
          <GlossaryInfographic
            categories={categories}
            termCount={GLOSSARY_TERMS.length}
            categoryCount={categories.length}
            onCategoryClick={pickCategory}
            onTermClick={searchTerm}
          />
        )}
        {!showResults && (
          <div style={{ marginBottom: 60 }}>
            <div className="glossary-browse-head">
              <div>
                <p className="section-label" style={{ marginBottom: 8 }}>Browse by Category</p>
                <p className="glossary-browse-sub">Jump into a domain — each card shows how many terms are defined.</p>
              </div>
              <input
                className="glossary-cat-filter"
                type="text"
                placeholder="Filter categories…"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                aria-label="Filter categories"
              />
            </div>

            <div className="glossary-top-cats">
              <span className="glossary-featured-label">Top:</span>
              {topCategories.map((cat) => (
                <button
                  key={cat.name}
                  className="glossary-top-cat-chip"
                  style={{ '--chip-tint': cat.tint }}
                  onClick={() => pickCategory(cat.name)}
                >
                  <span>{cat.icon}</span> {cat.name} <span className="glossary-top-cat-count">{cat.count}</span>
                </button>
              ))}
            </div>

            {filteredBrowseGroups.map((group) => {
              const groupCats = group.cats.map((n) => catByName[n]).filter(Boolean);
              if (!groupCats.length) return null;
              return (
                <div key={group.label} className="glossary-cat-group">
                  <div className="glossary-cat-group-head">
                    <h3 className="glossary-cat-group-label">{group.label}</h3>
                    <p className="glossary-cat-group-desc">{group.desc}</p>
                  </div>
                  <div className="cat-grid">
                    {groupCats.map((cat) => (
                      <button
                        key={cat.name}
                        className="cat-card glass cat-card-btn glossary-cat-card"
                        style={{ '--cat-color': cat.tint, '--cat-border': cat.border, '--cat-pct': `${Math.round((cat.count / maxCatCount) * 100)}%` }}
                        onClick={() => pickCategory(cat.name)}
                      >
                        <div className="cat-icon">{cat.icon}</div>
                        <div className="cat-name">{cat.name}</div>
                        <div className="cat-count">{cat.count.toLocaleString()} terms</div>
                        <div className="glossary-cat-bar" aria-hidden="true"><span /></div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {filteredBrowseGroups.every((g) => !g.cats.length) && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>No categories match &ldquo;{catFilter}&rdquo;</p>
            )}
          </div>
        )}

        {/* Results: glossary items with definitions */}
        {showResults && (
          <div ref={resultsRef} style={{ scrollMarginTop: 90 }}>
            <div className="glossary-results-toolbar">
              <div className="glossary-results-head">
                <h2 className="section-title-lg">
                  {q ? <>Results for &ldquo;{query}&rdquo;</> : <><span style={{ marginRight: 8 }}>{CAT_ICONS[activeCat] || '📘'}</span>{activeCat}</>}
                </h2>
                {!q && activeCat && CAT_DESCRIPTIONS[activeCat] && (
                  <p className="glossary-cat-desc">{CAT_DESCRIPTIONS[activeCat]}</p>
                )}
              </div>
              <button className="filter-chip" onClick={reset} style={{ cursor: 'pointer' }}>← All categories</button>
            </div>
            {/* A–Z letter filter when browsing a category */}
            {activeCat && !q && categoryLetters.length > 1 && (
              <div className="glossary-az-bar" style={{ marginBottom: 16 }}>
                <button
                  className={`filter-chip${!letterFilter ? ' active' : ''}`}
                  onClick={() => setLetterFilter(null)}
                >All</button>
                {categoryLetters.map((ch) => (
                  <button
                    key={ch}
                    className={`filter-chip${letterFilter === ch ? ' active' : ''}`}
                    onClick={() => setLetterFilter(letterFilter === ch ? null : ch)}
                  >{ch}</button>
                ))}
              </div>
            )}

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              {results.length.toLocaleString()} term{results.length !== 1 ? 's' : ''}
              {hasMore ? ` · showing ${visibleCount.toLocaleString()} of ${results.length.toLocaleString()}` : ''}
            </p>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                No glossary items found. Try another term or category.
              </div>
            ) : (
              <div className="glossary-results" style={{ marginBottom: hasMore ? 24 : 80 }}>
                {visibleResults.map((t) => (
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
                          <button key={r} className="glossary-related-chip" onClick={() => searchTerm(r)}>
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {hasMore && (
              <div style={{ textAlign: 'center', marginBottom: 80 }}>
                <button
                  className="glossary-load-more"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                >
                  Load {Math.min(PAGE_SIZE, results.length - visibleCount).toLocaleString()} more terms
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
