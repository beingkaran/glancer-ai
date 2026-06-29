/*
 * Free AI Tools registry.
 *
 * These are not links to other people's apps — they are real, working tools
 * that run entirely in the visitor's browser (logic in ../lib/aiToolkit.js).
 * Each entry is chosen for high, durable search demand where the truly free /
 * no-signup experience is underserved, so the page can earn organic traffic
 * and the visitor gets a result instantly with zero friction.
 */

export const AI_TOOLS = [
  {
    id: 'humanizer',
    name: 'AI Text Humanizer',
    tagline: 'Make AI text sound human',
    badge: '🪄',
    color: '#8B5CF6',
    category: 'Writing',
    blurb:
      'Paste AI-generated text and rewrite it to read like a person wrote it — strips robotic phrases, adds contractions, and removes the tell-tale em-dashes that detectors flag.',
    keywords: ['ai humanizer', 'humanize ai text', 'bypass ai detector', 'make ai sound human', 'free ai humanizer no signup'],
  },
  {
    id: 'detector',
    name: 'AI Content Detector',
    tagline: 'Is this written by AI?',
    badge: '🔍',
    color: '#06B6D4',
    category: 'Analysis',
    blurb:
      'Check whether text is likely AI-generated. Get a likelihood score plus a transparent breakdown of the signals — cliché phrases, sentence variation, vocabulary and more.',
    keywords: ['ai detector', 'ai content detector', 'chatgpt detector', 'is this written by ai', 'free ai checker'],
  },
  {
    id: 'tokens',
    name: 'AI Token & Cost Counter',
    tagline: 'Count tokens, estimate cost',
    badge: '🧮',
    color: '#F59E0B',
    category: 'Developers',
    blurb:
      'Estimate how many tokens your prompt uses and what it costs across GPT, Claude and Gemini models. Perfect for budgeting API calls and staying inside context limits.',
    keywords: ['token counter', 'gpt token counter', 'claude token counter', 'llm cost calculator', 'openai pricing calculator'],
  },
  {
    id: 'prompt',
    name: 'AI Prompt Generator',
    tagline: 'Build the perfect prompt',
    badge: '✨',
    color: '#EC4899',
    category: 'Writing',
    blurb:
      'Turn a rough idea into a structured, high-quality prompt with role, task, audience, format and tone — then copy it straight into ChatGPT, Claude or Gemini.',
    keywords: ['ai prompt generator', 'chatgpt prompt generator', 'prompt builder', 'free prompt generator', 'prompt engineering tool'],
  },
  {
    id: 'summarizer',
    name: 'AI Text Summarizer',
    tagline: 'Long text → key points',
    badge: '📝',
    color: '#10B981',
    category: 'Writing',
    blurb:
      'Paste an article, essay or report and pull out the most important sentences. Adjust the length from a tight TL;DR to a fuller recap — no word limit, no signup.',
    keywords: ['text summarizer', 'ai summarizer', 'summarize article', 'tldr generator', 'free summary tool no signup'],
  },
];

export const TOOL_CATEGORIES = [...new Set(AI_TOOLS.map((t) => t.category))];
