import { useState, useMemo, useRef, useEffect } from 'react';
import { AI_TOOLS } from '../data/aiTools';
import AdSlot from '../components/AdSlot';
import { AD_SLOTS } from '../lib/adsense';
import { useDocumentMeta } from '../lib/useDocumentMeta';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// Brand logo from the tool's domain (Google favicon service — always resolves);
// falls back to the emoji badge if the image fails to load.
function logoFor(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?sz=128&domain=${host}`;
  } catch {
    return null;
  }
}

function ToolLogo({ tool, size = 56 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [tool.id]);
  const src = logoFor(tool.url);
  if (src && !failed) {
    return (
      <span className="tool-logo" style={{ width: size, height: size, '--brand': tool.color }}>
        <img src={src} alt={`${tool.name} logo`} width={size * 0.6} height={size * 0.6} onError={() => setFailed(true)} />
      </span>
    );
  }
  return (
    <span className="tool-logo tool-logo-emoji" style={{ width: size, height: size, background: tool.color }} aria-hidden="true">
      {tool.badge}
    </span>
  );
}

export default function AIToolsPage() {
  useDocumentMeta({
    title: 'Free AI Tools — The Most-Searched AI Apps',
    description: 'Discover the most-searched AI tools on the internet — ChatGPT, Gemini, Claude, Perplexity, Midjourney, Runway, ElevenLabs and more. Search any tool, see what it can be used for, and open it in one click.',
    path: '/ai-tools',
  });

  const [query, setQuery] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [spotlight, setSpotlight] = useState(0); // index into AI_TOOLS for the rotating infographic
  const [paused, setPaused] = useState(false);
  const searchRef = useRef(null);

  const q = query.trim().toLowerCase();

  // Autocomplete: name / provider / category / tag matches, name-prefix first.
  const suggestions = useMemo(() => {
    if (!q) return [];
    const starts = [], contains = [];
    for (const t of AI_TOOLS) {
      const name = t.name.toLowerCase();
      if (name.startsWith(q)) starts.push(t);
      else if (
        name.includes(q) ||
        t.by.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q))
      ) contains.push(t);
    }
    return [...starts, ...contains].slice(0, 8);
  }, [q]);

  // Auto-advance the spotlight every 5s (pauses on hover / focus).
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSpotlight((i) => (i + 1) % AI_TOOLS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  // Close the suggestions dropdown on outside click.
  useEffect(() => {
    const onClick = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggest(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function pickTool(tool) {
    const idx = AI_TOOLS.findIndex((t) => t.id === tool.id);
    if (idx >= 0) setSpotlight(idx);
    setShowSuggest(false);
    setQuery(tool.name);
    setPaused(true);
  }

  const tool = AI_TOOLS[spotlight];

  return (
    <div className="page-section">
      <div className="container">
        {/* Header + search */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 28, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Discover</p>
          <h1 className="page-hero-title">Free <span className="grad-text">AI Tools</span></h1>
          <p className="hero-sub" style={{ margin: '0 auto 26px' }}>
            The {AI_TOOLS.length} most-searched AI apps on the internet. Search any tool to see what it
            can be used for, then open it in one click.
          </p>

          <div className="blog-search-wrap" ref={searchRef} style={{ marginBottom: 0 }}>
            <span className="blog-search-icon" aria-hidden="true"><SearchIcon /></span>
            <input
              className="blog-search-input"
              type="text"
              placeholder="Search a tool… e.g. ChatGPT, image, voice, coding"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggest(true); }}
              onFocus={() => setShowSuggest(true)}
              aria-label="Search AI tools"
              autoComplete="off"
            />
            {query && <button className="blog-search-clear" onClick={() => { setQuery(''); setShowSuggest(false); }} aria-label="Clear">✕</button>}
            {showSuggest && q && (
              <div className="search-suggest" role="listbox">
                {suggestions.length === 0 ? (
                  <div className="search-suggest-empty">No tools match "{query}"</div>
                ) : (
                  suggestions.map((t) => (
                    <button key={t.id} className="search-suggest-item" role="option" onClick={() => pickTool(t)}>
                      <ToolLogo tool={t} size={34} />
                      <span className="search-suggest-text">
                        <span className="search-suggest-title">{t.name}</span>
                        <span className="search-suggest-cat">{t.by} · {t.category}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <AdSlot slot={AD_SLOTS.toolsTop} className="ad-leaderboard" />

        {/* ===== Tool infographic ===== */}
        <section
          className="tool-infographic"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Logo strip — every tool, click to spotlight it */}
          <div className="tool-logo-strip" role="tablist" aria-label="AI tools">
            {AI_TOOLS.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={i === spotlight}
                className={`tool-logo-chip${i === spotlight ? ' active' : ''}`}
                onClick={() => { setSpotlight(i); setPaused(true); }}
                title={t.name}
              >
                <ToolLogo tool={t} size={44} />
                <span className="tool-logo-chip-name">{t.name}</span>
              </button>
            ))}
          </div>

          {/* Spotlight — rotates every 5s */}
          <div className="tool-spotlight glass" key={tool.id}>
            <div className="tool-spotlight-head">
              <ToolLogo tool={tool} size={72} />
              <div>
                <h2 className="tool-spotlight-name">{tool.name}</h2>
                <span className="tool-spotlight-by">{tool.by} · {tool.category}</span>
              </div>
            </div>
            <p className="tool-spotlight-blurb">{tool.blurb}</p>
            <div className="tool-spotlight-uses">
              <span className="tool-spotlight-uses-label">Use it for</span>
              <div className="tool-tags">
                {tool.tags.map((tag) => <span key={tag} className="tool-tag">{tag}</span>)}
              </div>
            </div>
            <a
              className="tool-spotlight-cta"
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--tool-color': tool.color }}
            >
              <ExternalIcon /> Open {tool.name}
            </a>
            <div className="tool-spotlight-progress" aria-hidden="true">
              {AI_TOOLS.map((_, i) => (
                <span key={i} className={`tool-spotlight-dot${i === spotlight ? ' active' : ''}`} />
              ))}
            </div>
          </div>
        </section>

        <AdSlot slot={AD_SLOTS.toolsInline} className="ad-inline" />

        <div className="section-site-link" style={{ marginBottom: 60 }}>
          More AI news, tools &amp; insights at{' '}
          <a href="https://glancerai.com" target="_blank" rel="noopener noreferrer">glancerai.com</a>
        </div>
      </div>
    </div>
  );
}
