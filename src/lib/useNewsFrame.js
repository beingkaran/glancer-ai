import { useState, useEffect, useRef } from 'react';

/*
 * useNewsFrame — shared live-iframe reader logic for both the in-carousel reader
 * (NewsReaderFrame) and the route-based reader (NewsReaderPage).
 *
 * It loads a story's source page LIVE in an <iframe> — unmodified, exactly as
 * published — and decides whether that's even possible:
 *
 *   'checking' → asking /api/framecheck whether the article allows embedding;
 *   'frame'    → publisher allows it (or the check was unavailable) — live iframe;
 *   'blocked'  → publisher forbids framing (X-Frame-Options / CSP) — the caller
 *                shows its own summary + link-out instead of the browser's grey
 *                "content is blocked" error page.
 *
 * Two safety nets guard the live frame, since a publisher's block can slip past
 * the preflight (some sites send frame headers only to real browsers, not to our
 * server-side framecheck):
 *   • 3s → `showEscape` turns true, so the caller can surface a manual
 *     "Read on <source>" escape bar over the frame. This is the ONLY rescue for a
 *     page that renders the browser's grey "content is blocked" error — that
 *     error still fires the iframe's onLoad, so we can't detect it from JS.
 *   • 6s → if the frame never fired onLoad (a slow network or a page that refused
 *     silently) we fall back to 'blocked'.
 *
 * Keyed on `item.url` (a stable string), NOT the `item` object: the live news
 * feed revalidates in the background and hands down fresh item objects every few
 * seconds, which would otherwise restart the preflight on every tick.
 *
 * Returns { mode, iframeLoaded, showEscape, onIframeLoad } — wire onIframeLoad to
 * the iframe's onLoad and render from `mode`.
 */
export function useNewsFrame(item) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [mode, setMode] = useState('checking');
  const [showEscape, setShowEscape] = useState(false);
  // Ref mirror of "loaded" so the slow-load timer reads the latest value
  // without a stale closure.
  const loadedRef = useRef(false);

  const url = item?.url;
  const internal = item?.internal;

  // Preflight: ask our own edge (/api/framecheck) whether THIS article's headers
  // allow cross-origin framing. The static per-source `frameable` flag samples
  // the site root, but article pages can be stricter — and a blocked iframe still
  // fires onLoad on its error page, so the browser gives us no reliable signal
  // after the fact. If the check itself is unavailable, fall back to the
  // optimistic iframe path. Our own pages (/blog/:id) are same-origin — framing
  // is always allowed, so skip the preflight.
  useEffect(() => {
    if (!url) return undefined;
    let alive = true;
    setIframeLoaded(false);
    setShowEscape(false);
    loadedRef.current = false;
    if (internal || url.startsWith('/')) {
      setMode('frame');
      return undefined;
    }
    setMode('checking');
    (async () => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        const res = await fetch(`/api/framecheck?url=${encodeURIComponent(url)}`, {
          signal: ctrl.signal,
          headers: { accept: 'application/json' },
        });
        clearTimeout(t);
        const ct = res.headers.get('content-type') || '';
        if (!res.ok || !ct.includes('application/json')) throw new Error('framecheck unavailable');
        const verdict = await res.json();
        if (alive) setMode(verdict.frameable === false ? 'blocked' : 'frame');
      } catch {
        if (alive) setMode('frame');
      }
    })();
    return () => { alive = false; };
  }, [url, internal]);

  useEffect(() => {
    if (mode !== 'frame') return undefined;
    const escapeT = setTimeout(() => setShowEscape(true), 3000);
    const blankT = setTimeout(() => { if (!loadedRef.current) setMode('blocked'); }, 6000);
    return () => { clearTimeout(escapeT); clearTimeout(blankT); };
  }, [mode, url]);

  const onIframeLoad = () => { loadedRef.current = true; setIframeLoaded(true); };

  return { mode, iframeLoaded, showEscape, onIframeLoad };
}
