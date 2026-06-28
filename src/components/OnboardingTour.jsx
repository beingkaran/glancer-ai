import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';

const SEEN_KEY = 'glancer:tour-seen';

/* Guided first-visit tour. Highlights three navbar affordances one at a time
 * with a spotlight + coach mark, and stays on the home page throughout. Runs
 * automatically on a visitor's first landing; a small "Show me" button replays
 * it at any time. */
const STEPS = [
  {
    sel: '[data-tour="theme"]',
    label: 'Appearance',
    title: 'Dark & light mode',
    body: 'Tap here any time to switch the whole site between dark and light mode.',
    demo: 'theme',
  },
  {
    sel: '[data-tour="glossary"]',
    label: 'Glossary',
    title: 'AI, AIOps & Observability Glossary',
    body: 'The dictionary for AI, AIOps & Observability — look up any term in plain English.',
  },
  {
    sel: '[data-tour="write"]',
    label: 'Community',
    title: 'Write your own blogs',
    body: 'Share what you know — publish your own articles for the Glancer AI community.',
  },
  {
    sel: '[data-tour="tools"]',
    label: 'Toolbox',
    title: 'Free AI Tools',
    body: 'Your one stop shop for free AI tools — 25+ utilities that run right in your browser.',
  },
];

const TIP_W = 300;

export default function OnboardingTour({ onToggleTheme }) {
  const [running, setRunning] = useState(false);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);
  const demoToggled = useRef(false);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const start = useCallback(() => {
    setI(0);
    setRunning(true);
  }, []);

  const finish = useCallback(() => {
    setRunning(false);
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
  }, []);

  // Auto-start once, shortly after first paint so the navbar has mounted.
  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch { /* ignore */ }
    if (seen) return;
    const t = setTimeout(start, 900);
    return () => clearTimeout(t);
  }, [start]);

  // Measure the current target and keep the spotlight glued to it.
  useLayoutEffect(() => {
    if (!running) return;
    const measure = () => {
      const el = document.querySelector(STEPS[i].sel);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [running, i]);

  // On the theme step, briefly flip the theme to demonstrate the toggle, then
  // restore it when the user moves on. Skipped under reduced-motion.
  useEffect(() => {
    if (!running || reduceMotion) return;
    if (STEPS[i].demo !== 'theme') return;
    const t = setTimeout(() => { onToggleTheme(); demoToggled.current = true; }, 650);
    return () => {
      clearTimeout(t);
      if (demoToggled.current) { onToggleTheme(); demoToggled.current = false; }
    };
  }, [running, i, reduceMotion, onToggleTheme]);

  // Keyboard: Esc closes, arrows / Enter navigate.
  useEffect(() => {
    if (!running) return;
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      else if (e.key === 'ArrowLeft') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const next = () => (i >= STEPS.length - 1 ? finish() : setI((n) => n + 1));
  const back = () => setI((n) => Math.max(0, n - 1));

  // The "Show me" replay button is always available on the home page.
  if (!running) {
    return (
      <button className="tour-replay" onClick={start} aria-label="Show me around">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Show me
      </button>
    );
  }

  const step = STEPS[i];
  const pad = 8;

  // Coach-mark placement: below the target by default, clamped to the viewport.
  // When no target is found (e.g. nav hidden on mobile) we center the card.
  let tipStyle;
  if (rect) {
    const left = Math.min(
      Math.max(12, rect.left + rect.width / 2 - TIP_W / 2),
      window.innerWidth - TIP_W - 12,
    );
    tipStyle = { top: rect.bottom + 16, left, width: TIP_W };
  } else {
    tipStyle = { top: '50%', left: '50%', width: TIP_W, transform: 'translate(-50%, -50%)' };
  }

  return (
    <div className="tour-root" role="dialog" aria-modal="true" aria-label="Site tour">
      {/* Dim everything except the highlighted target (box-shadow cutout). */}
      <div className="tour-overlay" onClick={finish} />
      {rect && (
        <div
          className={`tour-spot${reduceMotion ? '' : ' pulse'}`}
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          }}
        />
      )}

      <div className="tour-tip glass" style={tipStyle} onClick={(e) => e.stopPropagation()}>
        <div className="tour-tip-head">
          <span className="tour-label">{step.label}</span>
          <span className="tour-count">{i + 1} / {STEPS.length}</span>
        </div>
        <h3 className="tour-title">{step.title}</h3>
        <p className="tour-body">{step.body}</p>
        <div className="tour-dots" aria-hidden="true">
          {STEPS.map((_, n) => <span key={n} className={`tour-dot${n === i ? ' on' : ''}`} />)}
        </div>
        <div className="tour-actions">
          <button className="tour-skip" onClick={finish}>Skip</button>
          <div className="tour-nav">
            {i > 0 && <button className="tour-btn ghost" onClick={back}>Back</button>}
            <button className="tour-btn" onClick={next}>
              {i >= STEPS.length - 1 ? 'Got it' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
