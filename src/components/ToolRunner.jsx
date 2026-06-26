import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { renderMarkdown } from '../lib/miniMarkdown';
import { getUserKey, setUserKey } from '../lib/llm';

/*
 * ToolRunner — a generic modal that runs any Custom AI Tool defined in
 * data/customTools.js. It reads the tool's `inputs` schema, collects values,
 * calls `tool.run(values)` (await-ing async/network tools), and renders the
 * result with copy + download. Output that is Markdown gets a live preview.
 */

const seedValues = (tool) =>
  Object.fromEntries(tool.inputs.map((f) => [f.id, f.default ?? '']));

export default function ToolRunner({ tool, onClose }) {
  const [values, setValues] = useState(() => seedValues(tool));
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState('output'); // 'output' | 'preview'
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [keyVal, setKeyVal] = useState(() => getUserKey());
  const firstField = useRef(null);

  // Reset when the open tool changes; focus the first field; lock body scroll.
  useEffect(() => {
    setValues(seedValues(tool));
    setResult(null);
    setView('output');
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => firstField.current?.focus(), 80);
    return () => { document.body.style.overflow = ''; clearTimeout(t); };
  }, [tool]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (id, v) => setValues((s) => ({ ...s, [id]: v }));

  const run = useCallback(async () => {
    setBusy(true);
    setResult(null);
    try {
      const r = await tool.run(values);
      setResult(r || { error: 'No output.' });
      setView(r?.preview === 'md' ? 'preview' : 'output');
    } catch (e) {
      setResult({ error: e?.message || 'Something went wrong running this tool.' });
    } finally {
      setBusy(false);
    }
  }, [tool, values]);

  const copy = async () => {
    if (!result?.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  };

  const download = () => {
    if (!result?.output) return;
    const ext = result.lang === 'xml' ? 'xml' : result.lang === 'markdown' ? 'md' : result.lang === 'json' ? 'json' : 'txt';
    const blob = new Blob([result.output], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${tool.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const previewHtml = useMemo(
    () => (result?.output && result.preview === 'md' ? renderMarkdown(result.output) : ''),
    [result]
  );

  return (
    <div className="tr-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="tr-modal glass" role="dialog" aria-modal="true" aria-label={tool.name}>
        <div className="tr-head">
          <span className="tool-badge" style={{ background: tool.color }}>{tool.badge}</span>
          <div className="tr-titles">
            <h3>{tool.name}</h3>
            <p>{tool.blurb}</p>
          </div>
          <button className="tr-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="tr-body">
          {/* Inputs */}
          <div className="tr-inputs">
            {tool.inputs.map((f, i) => (
              <label key={f.id} className="tr-field">
                <span className="tr-label">{f.label}</span>
                {f.type === 'textarea' ? (
                  <textarea
                    ref={i === 0 ? firstField : null}
                    rows={f.rows || 5}
                    placeholder={f.placeholder}
                    value={values[f.id]}
                    onChange={(e) => set(f.id, e.target.value)}
                  />
                ) : f.type === 'select' ? (
                  <select
                    ref={i === 0 ? firstField : null}
                    value={values[f.id]}
                    onChange={(e) => set(f.id, e.target.value)}
                  >
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input
                    ref={i === 0 ? firstField : null}
                    type={f.type === 'number' ? 'number' : 'text'}
                    inputMode={f.type === 'number' ? 'decimal' : undefined}
                    placeholder={f.placeholder}
                    value={values[f.id]}
                    onChange={(e) => set(f.id, e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && f.type !== 'textarea') run(); }}
                  />
                )}
              </label>
            ))}
            <button className="tr-run" onClick={run} disabled={busy} style={{ '--tool-color': tool.color }}>
              {busy ? <><span className="tr-spin" /> Working…</> : (tool.cta || 'Run')}
            </button>

            {tool.ai && (
              <>
                <p className="tr-note">✨ Powered by live AI — free, no sign-up. Falls back to an offline template if AI is unavailable.</p>
                <button className="tr-key-toggle" type="button" onClick={() => setShowKey((s) => !s)}>
                  {getUserKey() ? 'Using your own API key ✓' : 'Use your own API key (optional)'}
                </button>
                {showKey && (
                  <div className="tr-key-row">
                    <input
                      type="password"
                      placeholder="Paste a Gemini / Groq / OpenRouter key"
                      value={keyVal}
                      onChange={(e) => setKeyVal(e.target.value)}
                    />
                    <button type="button" onClick={() => { setUserKey(keyVal.trim()); setShowKey(false); }}>Save</button>
                    {getUserKey() && <button type="button" onClick={() => { setUserKey(''); setKeyVal(''); }}>Clear</button>}
                  </div>
                )}
              </>
            )}
            {!tool.ai && tool.async && <p className="tr-note">Fetched live via a public proxy — some sites block cross-origin requests.</p>}
          </div>

          {/* Output */}
          <div className="tr-output">
            {!result && !busy && (
              <div className="tr-empty">Fill in the fields and hit <b>{tool.cta || 'Run'}</b>. Your result appears here.</div>
            )}
            {busy && <div className="tr-empty"><span className="tr-spin" /> Running…</div>}

            {result?.error && <div className="tr-error">⚠️ {result.error}</div>}

            {result?.note && <div className="tr-result-note">{result.note}</div>}

            {result?.output && (
              <>
                {result.stats?.length > 0 && (
                  <div className="tr-stats">
                    {result.stats.map((s) => (
                      <div key={s.label} className="tr-stat"><b>{s.value}</b><span>{s.label}</span></div>
                    ))}
                  </div>
                )}

                <div className="tr-output-bar">
                  {result.preview === 'md' && (
                    <div className="tr-tabs">
                      <button className={view === 'preview' ? 'active' : ''} onClick={() => setView('preview')}>Preview</button>
                      <button className={view === 'output' ? 'active' : ''} onClick={() => setView('output')}>Source</button>
                    </div>
                  )}
                  <div className="tr-actions">
                    <button onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
                    <button onClick={download}>Download</button>
                  </div>
                </div>

                {view === 'preview' && result.preview === 'md' ? (
                  <div className="tr-md" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : (
                  <pre className="tr-pre"><code>{result.output}</code></pre>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
