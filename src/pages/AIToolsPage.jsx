import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AI_TOOLS, TOOL_CATEGORIES, resolveLaunch } from '../data/aiTools';
import { CUSTOM_TOOLS, CUSTOM_TOOL_CATEGORIES } from '../data/customTools';
import ToolRunner from '../components/ToolRunner';
import AdSlot from '../components/AdSlot';
import { AD_SLOTS } from '../lib/adsense';
import { useDocumentMeta } from '../lib/useDocumentMeta';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const LaunchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const LAUNCH_HINT = {
  deeplink: 'Pre-fills your prompt and opens the tool',
  clipboard: 'Copies your prompt, then opens the tool to paste',
  open: 'Opens the tool',
};

export default function AIToolsPage() {
  useDocumentMeta({
    title: 'Free AI Tools — 25+ In-Browser Utilities',
    description: 'A free suite of in-browser AI tools: sitemap finder & validator, CSV/JSON/HTML to Markdown converters, ROI & ROI calculators, prompt generators, FAQ and email writers, and a launchpad to every major AI app. No sign-up.',
    path: '/ai-tools',
  });

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [prompts, setPrompts] = useState({}); // per-tool prompt text, keyed by tool id
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Custom (in-browser) tools state.
  const [customQuery, setCustomQuery] = useState('');
  const [customCat, setCustomCat] = useState('All');
  const [activeTool, setActiveTool] = useState(null);

  const cq = customQuery.trim().toLowerCase();
  const customResults = useMemo(() => {
    let list = CUSTOM_TOOLS;
    if (cq) {
      list = list.filter((t) =>
        t.name.toLowerCase().includes(cq) ||
        t.category.toLowerCase().includes(cq) ||
        t.blurb.toLowerCase().includes(cq) ||
        t.tags.some((tag) => tag.includes(cq)));
    }
    if (customCat !== 'All') list = list.filter((t) => t.category === customCat);
    return list;
  }, [cq, customCat]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const flash = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const q = query.trim().toLowerCase();

  // Filter by search query (name / blurb / tags / provider) then by category.
  const results = useMemo(() => {
    let list = AI_TOOLS;
    if (q) {
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.by.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.blurb.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q)));
    }
    if (activeCat !== 'All') list = list.filter((t) => t.category === activeCat);
    return list;
  }, [q, activeCat]);

  const launch = useCallback(async (tool) => {
    const action = resolveLaunch(tool, prompts[tool.id]);
    if (action.mode === 'clipboard' && action.copied) {
      try {
        await navigator.clipboard.writeText(action.prompt);
        flash(`Prompt copied — paste it into ${tool.name}`);
      } catch {
        flash(`Opening ${tool.name} — paste your prompt there`);
      }
    } else if (action.mode === 'deeplink') {
      flash(`Launching ${tool.name} with your prompt…`);
    } else {
      flash(`Opening ${tool.name}…`);
    }
    window.open(action.url, '_blank', 'noopener,noreferrer');
  }, [prompts, flash]);

  const setPrompt = (id, val) => setPrompts((p) => ({ ...p, [id]: val }));

  return (
    <div className="page-section">
      <div className="container">
        {/* Header + search */}
        <div className="page-hero" style={{ paddingTop: 'calc(var(--navbar-h) + 60px)', paddingBottom: 28, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Launchpad</p>
          <h1 className="page-hero-title">Free <span className="grad-text">AI Tools</span></h1>
          <p className="hero-sub" style={{ margin: '0 auto 26px' }}>
            {CUSTOM_TOOLS.length} in-browser utilities you can run right here — plus a launchpad to the {AI_TOOLS.length}
            {' '}most-searched AI apps on the internet. No sign-up, nothing to install.
          </p>

          <div className="blog-search-wrap" style={{ marginBottom: 0 }}>
            <span className="blog-search-icon" aria-hidden="true"><SearchIcon /></span>
            <input
              className="blog-search-input"
              type="text"
              placeholder="Search the launchpad… e.g. image, voice, ChatGPT, coding"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search AI tools"
              autoComplete="off"
            />
            {query && <button className="blog-search-clear" onClick={() => setQuery('')} aria-label="Clear">✕</button>}
          </div>
        </div>

        <AdSlot slot={AD_SLOTS.toolsTop} className="ad-leaderboard" />

        {/* ================= Custom (in-browser) AI Tools ================= */}
        <section id="custom-tools" className="custom-tools-section">
          <div className="custom-tools-head">
            <p className="section-label">Run them right here</p>
            <h2 className="custom-tools-title">Custom <span className="grad-text">AI Tools</span></h2>
            <p className="hero-sub" style={{ margin: '0 auto 22px' }}>
              {CUSTOM_TOOLS.length} free utilities that work entirely in your browser — no sign-up, no
              data sent anywhere. Sitemap &amp; SEO tools, Markdown converters, generators, calculators
              and AI prompt builders.
            </p>

            <div className="blog-search-wrap" style={{ marginBottom: 16 }}>
              <span className="blog-search-icon" aria-hidden="true"><SearchIcon /></span>
              <input
                className="blog-search-input"
                type="text"
                placeholder="Search custom tools… e.g. sitemap, markdown, ROI, prompt"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                aria-label="Search custom tools"
                autoComplete="off"
              />
              {customQuery && <button className="blog-search-clear" onClick={() => setCustomQuery('')} aria-label="Clear">✕</button>}
            </div>

            <div className="tools-filter-row" role="group" aria-label="Filter custom tools by category">
              {['All', ...CUSTOM_TOOL_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip${customCat === cat ? ' active' : ''}`}
                  onClick={() => setCustomCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {customResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              No custom tools match your search.
            </div>
          ) : (
            <div className="tools-grid" style={{ marginBottom: 28 }}>
              {customResults.map((tool) => (
                <button key={tool.id} className="tool-card glass custom-tool-card" onClick={() => setActiveTool(tool)}>
                  <div className="tool-card-head">
                    <span className="tool-badge" style={{ background: tool.color }}>{tool.badge}</span>
                    <div className="tool-card-titles">
                      <h3 className="tool-card-name">{tool.name}</h3>
                      <span className="tool-card-by">In-browser · instant</span>
                    </div>
                    <span className="tool-cat-tag">{tool.category}</span>
                  </div>
                  <p className="tool-card-blurb">{tool.blurb}</p>
                  <div className="tool-tags">
                    {tool.tags.slice(0, 4).map((tag) => <span key={tag} className="tool-tag">{tag}</span>)}
                  </div>
                  <span className="custom-tool-open" style={{ '--tool-color': tool.color }}>
                    {tool.cta || 'Open tool'} <LaunchIcon />
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <AdSlot slot={AD_SLOTS.toolsInline} className="ad-inline" />

        {/* ================= External launchpad ================= */}
        <div className="launchpad-divider">
          <h2 className="custom-tools-title" style={{ fontSize: '1.6rem' }}>Launch any <span className="grad-text">AI app</span></h2>
          <p className="hero-sub" style={{ margin: '0 auto 8px' }}>
            The {AI_TOOLS.length} most-searched AI tools on the internet — search, then launch any of
            them with your prompt without leaving this page.
          </p>
        </div>

        {/* Category filters */}
        <div className="tools-filter-row" role="group" aria-label="Filter by category">
          {['All', ...TOOL_CATEGORIES].map((cat) => (
            <button
              key={cat}
              className={`filter-chip${activeCat === cat ? ' active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 20px' }}>
          {results.length} tool{results.length !== 1 ? 's' : ''}
          {q ? ` matching "${query}"` : ''}{activeCat !== 'All' ? ` in ${activeCat}` : ''}
        </p>

        {/* Tool grid */}
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            No AI tools match your search. Try “image”, “voice”, “search” or a tool name.
          </div>
        ) : (
          <div className="tools-grid" style={{ marginBottom: 70 }}>
            {results.map((tool) => {
              const canPrompt = tool.launch !== 'open';
              const val = prompts[tool.id] || '';
              return (
                <div key={tool.id} className="tool-card glass">
                  <div className="tool-card-head">
                    <span className="tool-badge" style={{ background: tool.color }}>{tool.badge}</span>
                    <div className="tool-card-titles">
                      <h3 className="tool-card-name">{tool.name}</h3>
                      <span className="tool-card-by">{tool.by}</span>
                    </div>
                    <span className="tool-cat-tag">{tool.category}</span>
                  </div>

                  <p className="tool-card-blurb">{tool.blurb}</p>

                  <div className="tool-tags">
                    {tool.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tool-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="tool-launch">
                    {canPrompt && (
                      <input
                        className="tool-prompt-input"
                        type="text"
                        placeholder={tool.promptLabel}
                        value={val}
                        onChange={(e) => setPrompt(tool.id, e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') launch(tool); }}
                        aria-label={`Prompt for ${tool.name}`}
                      />
                    )}
                    <button
                      className="tool-launch-btn"
                      onClick={() => launch(tool)}
                      style={{ '--tool-color': tool.color }}
                    >
                      {canPrompt ? <><LaunchIcon /> Launch</> : <><ExternalIcon /> Open</>}
                    </button>
                  </div>

                  <p className="tool-launch-hint">{LAUNCH_HINT[tool.launch]}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="tool-toast" role="status" aria-live="polite">{toast}</div>}

      {/* In-browser tool runner */}
      {activeTool && <ToolRunner tool={activeTool} onClose={() => setActiveTool(null)} />}
    </div>
  );
}
