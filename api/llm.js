/*
 * /api/llm — Vercel serverless function. Proxies the browser's request to the
 * configured LLM provider using a server-only API key (see api/_llmCore.js).
 * Deployed automatically by Vercel for any file under /api.
 */
import { runLLM } from './_llmCore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }
  try {
    const { system, prompt, temperature } = req.body || {};
    const byokKey = req.headers['x-llm-key']; // optional visitor-supplied key
    const { text, provider } = await runLLM({ system, prompt, temperature, env: process.env, byokKey });
    res.status(200).json({ text, provider });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'AI request failed' });
  }
}
