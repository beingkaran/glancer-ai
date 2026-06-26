/*
 * aiEngines — live-LLM versions of the generative tools. Each builds a focused
 * prompt, calls the free LLM via askLLM, and FALLS BACK to the deterministic
 * offline template (toolEngines) if AI is unavailable or not configured. So the
 * tools always return something useful, and light up with real AI once a key is
 * set in the server environment (see AI_SETUP.md).
 */

import { askLLM } from './llm';
import * as T from './toolEngines';

// Run an AI prompt with graceful template fallback.
const PROVIDER_NAMES = { gemini: 'Google Gemini', groq: 'Groq (Llama 3.3)', openrouter: 'OpenRouter' };

async function aiRun({ system, prompt, temperature, lang = 'text', preview, fallback }) {
  try {
    const { text, provider } = await askLLM(prompt, { system, temperature });
    if (!text) throw new Error('Empty AI response');
    return { output: text, lang, preview, note: `✨ Generated with ${PROVIDER_NAMES[provider] || 'live AI'}` };
  } catch (e) {
    const fb = fallback?.();
    if (fb && !fb.error) {
      return { ...fb, note: e.notConfigured
        ? '⚠️ Live AI isn’t configured yet — used the offline template. Add a free API key (see AI_SETUP.md).'
        : `⚠️ AI unavailable (${e.message}) — used the offline template.` };
    }
    return { error: e.notConfigured
      ? 'Live AI isn’t configured. Add a free API key (see AI_SETUP.md) to enable this tool.'
      : (e.message || 'AI request failed.') };
  }
}

export function faqGeneratorAI(v) {
  const count = Math.min(12, Math.max(3, +v.count || 6));
  return aiRun({
    system: 'You are an expert content writer. Write a concise, accurate FAQ in GitHub-flavoured Markdown. Start with "## Frequently Asked Questions", then for each entry output a bold question line like "**Q: …?**" followed by a 1–3 sentence answer. No preamble.',
    prompt: `Generate ${count} frequently asked questions and answers based strictly on this content:\n\n"""${(v.text || '').slice(0, 6000)}"""`,
    temperature: 0.5, lang: 'markdown', preview: 'md',
    fallback: () => T.faqGenerator(v),
  });
}

export function emailResponseAI(v) {
  return aiRun({
    system: `You are a helpful assistant that writes email replies. Tone: ${v.tone || 'professional'}. Intent: ${v.intent || 'provide information'}. Output only the email body (greeting, body, sign-off as "[Your Name]"). No explanations.`,
    prompt: `Write a reply to this email:\n\n"""${(v.incoming || '').slice(0, 4000)}"""`,
    temperature: 0.7,
    fallback: () => T.emailResponseGenerator(v),
  });
}

export function letterGeneratorAI(v) {
  const types = { cover: 'cover letter', resignation: 'resignation letter', complaint: 'complaint letter', recommendation: 'recommendation letter', thankyou: 'thank-you letter' };
  return aiRun({
    system: 'You write polished, professional letters. Output only the finished letter (date, salutation, body, closing). Use placeholders in [brackets] for anything unknown.',
    prompt: `Write a ${types[v.type] || 'cover letter'}.\nRecipient: ${v.recipient || '[Recipient]'}\nFrom: ${v.sender || '[Your Name]'}\nKey details: ${v.details || '(none provided)'}`,
    temperature: 0.7,
    fallback: () => T.letterGenerator(v),
  });
}

export function customerServiceScriptAI(v) {
  return aiRun({
    system: `You are a CX expert. Produce a clear, step-by-step customer-service script with numbered stages (Greeting, Acknowledge, Clarify, Resolve, Confirm, Close). Tone: ${v.tone || 'friendly'}.`,
    prompt: `Write a support script for the scenario: "${v.scenario || 'a general inquiry'}" for the product/company "${v.product || 'our product'}".`,
    temperature: 0.6,
    fallback: () => T.customerServiceScript(v),
  });
}

export function promptOptimizerAI(v) {
  return aiRun({
    system: 'You are a world-class prompt engineer. Given a user prompt, return: (1) a short bulleted list of concrete improvements, then a divider, then (2) a rewritten, production-ready prompt that adds role, context, audience, output format and constraints. Keep it practical.',
    prompt: `Improve this prompt:\n\n"""${(v.prompt || '').slice(0, 3000)}"""`,
    temperature: 0.5,
    fallback: () => T.promptOptimizer(v),
  });
}

export function blogTitleGeneratorAI(v) {
  return aiRun({
    system: 'You are a viral content strategist. Output a numbered list of 10 compelling, varied, click-worthy blog titles. Mix listicles, how-tos and questions. Titles only.',
    prompt: `Topic: "${v.topic || ''}". Preferred style: ${v.tone || 'mixed'}.`,
    temperature: 0.9,
    fallback: () => T.blogTitleGenerator(v),
  });
}

export function chatbotNameGeneratorAI(v) {
  return aiRun({
    system: `You name AI chatbots. Output a numbered list of 12 short, brandable, memorable names. Tone: ${v.tone || 'friendly'}. Names only — no explanations.`,
    prompt: `The chatbot does: "${v.topic || 'customer support'}".`,
    temperature: 1.0,
    fallback: () => T.chatbotNameGenerator(v),
  });
}

export function brandNameGeneratorAI(v) {
  return aiRun({
    system: 'You are a startup naming expert. Output a numbered list of 14 brandable SaaS names. For each, append "  → name.com / .ai". Short, pronounceable, available-looking names only.',
    prompt: `Keywords describing the product: "${v.keywords || ''}".`,
    temperature: 1.0,
    fallback: () => T.brandNameGenerator(v),
  });
}
