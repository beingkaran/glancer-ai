/*
 * _llmCore — provider-agnostic LLM call, shared by the Vercel serverless
 * function (api/llm.js) and the Vite dev middleware (vite.config.js). The
 * Cloudflare Pages function mirrors this logic inline.
 *
 * Pick a provider by which API key env var you set (all have a free tier):
 *   GEMINI_API_KEY      → Google Gemini      (default · best free · no card)
 *   GROQ_API_KEY        → Groq (Llama 3.3)   (free · extremely fast)
 *   OPENROUTER_API_KEY  → OpenRouter         (free `:free` models)
 * Optional overrides: LLM_PROVIDER, LLM_MODEL.
 *
 * The key NEVER reaches the browser — it lives only in the server env.
 */

const DEFAULT_MODELS = {
  gemini: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'meta-llama/llama-3.3-70b-instruct:free',
};

function notConfigured() {
  const e = new Error('Live AI is not configured. Set GEMINI_API_KEY (or GROQ_API_KEY / OPENROUTER_API_KEY) in your server environment.');
  e.status = 503;
  return e;
}

export function pickProvider(env = {}) {
  if (env.LLM_PROVIDER) return env.LLM_PROVIDER;
  if (env.GROQ_API_KEY) return 'groq';
  if (env.OPENROUTER_API_KEY) return 'openrouter';
  return 'gemini';
}

// Google Gemini (generativelanguage REST API).
async function callGemini({ key, model, system, prompt, temperature, maxTokens }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature, maxOutputTokens: maxTokens },
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) { const e = new Error(json?.error?.message || `Gemini error ${res.status}`); e.status = res.status; throw e; }
  return (json.candidates?.[0]?.content?.parts || []).map((p) => p.text).join('').trim();
}

// Any OpenAI-compatible chat endpoint (Groq, OpenRouter, …).
async function callOpenAICompatible({ base, key, model, system, prompt, temperature, maxTokens }) {
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
  });
  const json = await res.json();
  if (!res.ok) { const e = new Error(json?.error?.message || `LLM error ${res.status}`); e.status = res.status; throw e; }
  return (json.choices?.[0]?.message?.content || '').trim();
}

export async function runLLM({ system, prompt, temperature = 0.7, maxTokens = 1500, env = {}, byokKey } = {}) {
  if (!prompt || !String(prompt).trim()) { const e = new Error('Missing prompt'); e.status = 400; throw e; }
  const provider = pickProvider(env);
  const model = env.LLM_MODEL || DEFAULT_MODELS[provider] || DEFAULT_MODELS.gemini;
  const t = Math.max(0, Math.min(1, Number(temperature)));

  if (provider === 'groq') {
    const key = byokKey || env.GROQ_API_KEY;
    if (!key) throw notConfigured();
    return callOpenAICompatible({ base: 'https://api.groq.com/openai/v1', key, model, system, prompt, temperature: t, maxTokens });
  }
  if (provider === 'openrouter') {
    const key = byokKey || env.OPENROUTER_API_KEY;
    if (!key) throw notConfigured();
    return callOpenAICompatible({ base: 'https://openrouter.ai/api/v1', key, model, system, prompt, temperature: t, maxTokens });
  }
  const key = byokKey || env.GEMINI_API_KEY;
  if (!key) throw notConfigured();
  return callGemini({ key, model, system, prompt, temperature: t, maxTokens });
}
