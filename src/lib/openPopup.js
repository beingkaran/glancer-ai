// Opens url in a centered browser popup window, keeping the user on the current
// page. The popup is a real top-level browsing context, so the publisher's page
// loads normally (no X-Frame-Options / CSP issue) while glancerai.com stays put
// in the main window — no react-router navigation, no tab change.
//
// Returns the window handle (or null if the browser blocked the popup) so the
// caller can fall back to a normal new tab when a popup blocker intervenes.
//
// Note: we deliberately do NOT pass `noopener`/`noreferrer` in the features
// string — doing so makes window.open() always return null, which would defeat
// the popup-blocked detection above. Instead we sever `opener` on the handle to
// get the same anti-tabnabbing protection while still returning a usable handle.
export function openSourcePopup(url) {
  if (!url) return null;
  const sw = window.screen?.availWidth || 1280;
  const sh = window.screen?.availHeight || 800;
  const w = Math.min(1100, Math.max(640, sw - 120));
  const h = Math.min(900, Math.max(520, sh - 120));
  const left = Math.max(0, Math.round((sw - w) / 2));
  const top = Math.max(0, Math.round((sh - h) / 2));
  const features = `popup=yes,width=${w},height=${h},left=${left},top=${top}`;
  const win = window.open(url, '_blank', features);
  if (win) { try { win.opener = null; } catch { /* cross-origin — ignore */ } }
  return win;
}
