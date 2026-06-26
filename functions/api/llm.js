/*
 * /api/llm — Cloudflare Pages Function (used when deploying to Cloudflare
 * Pages). Mirrors api/_llmCore.js but is self-contained so it bundles cleanly
 * in the Workers runtime. Set the API key as a Pages env var / secret:
 *   GEMINI_API_KEY (default) · or GROQ_API_KEY · or OPENROUTER_API_KEY
 */

const DEFAULT_MODELS = {
  gemini: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'meta-llama/llama-3.3-70b-instruct:free',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const PROVIDER_ORDER = ['gemini', 'groq', 'openrouter'];

function keyFor(provider, env, byokKey) {
  if (provider === 'gemini') return byokKey || env.GEMINI_API_KEY;
  if (provider === 'groq') return env.GROQ_API_KEY;
  if (provider === 'openrouter') return env.OPENROUTER_API_KEY;
}

function providerChain(env, byokKey) {
  if (env.LLM_PROVIDER) return [env.LLM_PROVIDER];
  return PROVIDER_ORDER.filter((p) => keyFor(p, env, byokKey));
}

async function callGemini(key, model, system, prompt, temperature, maxTokens) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature, maxOutputTokens: maxTokens } };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json();
  if (!res.ok) throw Object.assign(new Error(j?.error?.message || `Gemini error ${res.status}`), { status: res.status });
  return (j.candidates?.[0]?.content?.parts || []).map((p) => p.text).join('').trim();
}

async function callOpenAI(base, key, model, system, prompt, temperature, maxTokens) {
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
  });
  const j = await res.json();
  if (!res.ok) throw Object.assign(new Error(j?.error?.message || `LLM error ${res.status}`), { status: res.status });
  return (j.choices?.[0]?.message?.content || '').trim();
}

export async function onRequestPost({ request, env }) {
  try {
    const { system, prompt, temperature = 0.7 } = await request.json();
    if (!prompt || !String(prompt).trim()) return json({ error: 'Missing prompt' }, 400);
    const byokKey = request.headers.get('x-llm-key') || undefined;
    const t = Math.max(0, Math.min(1, Number(temperature)));
    const maxTokens = 1500;
    const chain = providerChain(env, byokKey);
    if (!chain.length) return json({ error: 'Live AI is not configured. Set GEMINI_API_KEY (or GROQ_API_KEY / OPENROUTER_API_KEY) in your Pages environment.' }, 503);

    // Try each provider in turn; fall through on quota/rate-limit/outage.
    let lastErr;
    for (const provider of chain) {
      const key = keyFor(provider, env, byokKey);
      if (!key) continue;
      const model = (env.LLM_PROVIDER && env.LLM_MODEL) ? env.LLM_MODEL : (DEFAULT_MODELS[provider] || DEFAULT_MODELS.gemini);
      try {
        let text;
        if (provider === 'groq') text = await callOpenAI('https://api.groq.com/openai/v1', key, model, system, prompt, t, maxTokens);
        else if (provider === 'openrouter') text = await callOpenAI('https://openrouter.ai/api/v1', key, model, system, prompt, t, maxTokens);
        else text = await callGemini(key, model, system, prompt, t, maxTokens);
        if (!text) throw new Error('Empty response');
        return json({ text, provider });
      } catch (e) { lastErr = e; }
    }
    return json({ error: (lastErr && lastErr.message) || 'AI request failed' }, (lastErr && lastErr.status) || 500);
  } catch (e) {
    return json({ error: e.message || 'AI request failed' }, e.status || 500);
  }
}
