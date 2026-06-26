/*
 * llm — browser-side client for the /api/llm serverless proxy.
 *
 * The proxy holds the API key server-side, so visitors use the AI tools for
 * free without their own key (the SiteGPT model). As an optional fallback, a
 * visitor can paste their OWN key (stored only in their browser) — handy if
 * you deploy the static site without a server function.
 */

const LS_KEY = 'glancer_llm_key';

export function getUserKey() {
  try { return localStorage.getItem(LS_KEY) || ''; } catch { return ''; }
}
export function setUserKey(k) {
  try {
    if (k) localStorage.setItem(LS_KEY, k);
    else localStorage.removeItem(LS_KEY);
  } catch { /* ignore */ }
}

/**
 * Ask the LLM. Resolves to `{ text, provider }`. Throws on failure; the error
 * may carry `.notConfigured = true` when no server key is set (HTTP 503), which
 * the AI tools use to gracefully fall back to their offline templates.
 */
export async function askLLM(prompt, { system, temperature = 0.7 } = {}) {
  const headers = { 'content-type': 'application/json' };
  const userKey = getUserKey();
  if (userKey) headers['x-llm-key'] = userKey;

  let res;
  try {
    res = await fetch('/api/llm', { method: 'POST', headers, body: JSON.stringify({ prompt, system, temperature }) });
  } catch {
    const e = new Error('Could not reach the AI endpoint.');
    e.notConfigured = true; // no /api/llm (pure static deploy) → treat like unconfigured
    throw e;
  }

  let data = {};
  try { data = await res.json(); } catch { /* non-JSON (e.g. 404 html) */ }

  if (!res.ok) {
    const e = new Error(data.error || `AI request failed (${res.status}).`);
    e.status = res.status;
    e.notConfigured = res.status === 503 || res.status === 404;
    throw e;
  }
  return { text: (data.text || '').trim(), provider: data.provider };
}
