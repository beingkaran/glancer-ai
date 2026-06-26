/*
 * Top 15 most-searched AI tools on the internet, with the launch logic that
 * lets a user "leverage the tool from the page itself".
 *
 * Each tool exposes how it accepts a prompt:
 *   - launch: 'deeplink'  → we open the tool with the prompt pre-filled in the
 *                            URL (the tool reads ?q=… and starts the task).
 *   - launch: 'clipboard' → the tool has no public prompt URL, so we copy the
 *                            prompt to the clipboard and open the tool, ready
 *                            to paste.
 *   - launch: 'open'      → no prompt concept; we just open the tool.
 *
 * `deeplink(prompt)` returns the final URL for deeplink tools. Keeping it as a
 * function per-tool isolates each provider's URL contract in one place.
 */

const enc = (s) => encodeURIComponent(s.trim());

export const AI_TOOLS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    by: 'OpenAI',
    category: 'Chat & Reasoning',
    badge: '🤖',
    color: '#10A37F',
    blurb: 'The most-searched AI assistant — writing, reasoning, coding and everyday Q&A.',
    url: 'https://chatgpt.com',
    launch: 'deeplink',
    deeplink: (p) => `https://chatgpt.com/?q=${enc(p)}`,
    promptLabel: 'Ask ChatGPT anything…',
    tags: ['writing', 'coding', 'research', 'assistant'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    by: 'Google',
    category: 'Chat & Reasoning',
    badge: '✦',
    color: '#4285F4',
    blurb: "Google's multimodal assistant with deep Search and Workspace integration.",
    url: 'https://gemini.google.com/app',
    launch: 'clipboard',
    promptLabel: 'Type a prompt for Gemini…',
    tags: ['multimodal', 'google', 'assistant', 'research'],
  },
  {
    id: 'claude',
    name: 'Claude',
    by: 'Anthropic',
    category: 'Chat & Reasoning',
    badge: '✳',
    color: '#D97757',
    blurb: 'Thoughtful long-context assistant, strong at writing, analysis and code.',
    url: 'https://claude.ai/new',
    launch: 'deeplink',
    deeplink: (p) => `https://claude.ai/new?q=${enc(p)}`,
    promptLabel: 'Start a chat with Claude…',
    tags: ['writing', 'coding', 'analysis', 'long-context'],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    by: 'Perplexity AI',
    category: 'AI Search',
    badge: '⌕',
    color: '#20808D',
    blurb: 'Answer engine that searches the live web and cites its sources.',
    url: 'https://www.perplexity.ai',
    launch: 'deeplink',
    deeplink: (p) => `https://www.perplexity.ai/search?q=${enc(p)}`,
    promptLabel: 'Ask the web a question…',
    tags: ['search', 'research', 'citations', 'web'],
  },
  {
    id: 'copilot',
    name: 'Copilot',
    by: 'Microsoft',
    category: 'Chat & Reasoning',
    badge: '◑',
    color: '#0078D4',
    blurb: "Microsoft's everyday AI companion, powered by GPT and web grounding.",
    url: 'https://copilot.microsoft.com',
    launch: 'deeplink',
    deeplink: (p) => `https://copilot.microsoft.com/?q=${enc(p)}`,
    promptLabel: 'Ask Copilot…',
    tags: ['assistant', 'microsoft', 'web', 'office'],
  },
  {
    id: 'grok',
    name: 'Grok',
    by: 'xAI',
    category: 'Chat & Reasoning',
    badge: '𝕏',
    color: '#111111',
    blurb: 'Real-time assistant from xAI with a live pulse on X conversations.',
    url: 'https://grok.com',
    launch: 'deeplink',
    deeplink: (p) => `https://grok.com/?q=${enc(p)}`,
    promptLabel: 'Ask Grok…',
    tags: ['realtime', 'x', 'assistant'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    by: 'DeepSeek',
    category: 'Chat & Reasoning',
    badge: '🐋',
    color: '#4D6BFE',
    blurb: 'Open reasoning models with strong math and coding at a low cost.',
    url: 'https://chat.deepseek.com',
    launch: 'clipboard',
    promptLabel: 'Type a prompt for DeepSeek…',
    tags: ['reasoning', 'coding', 'math', 'open'],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    by: 'Midjourney',
    category: 'Image Generation',
    badge: '🎨',
    color: '#8B5CF6',
    blurb: 'Best-in-class artistic image generation from text prompts.',
    url: 'https://www.midjourney.com/imagine',
    launch: 'clipboard',
    promptLabel: 'Describe an image to generate…',
    tags: ['image', 'art', 'design', 'generative'],
  },
  {
    id: 'dalle',
    name: 'DALL·E 3',
    by: 'OpenAI',
    category: 'Image Generation',
    badge: '🖌️',
    color: '#10A37F',
    blurb: 'Text-to-image generation built into ChatGPT for precise compositions.',
    url: 'https://chatgpt.com',
    launch: 'deeplink',
    deeplink: (p) => `https://chatgpt.com/?q=${enc('Generate an image: ' + p)}`,
    promptLabel: 'Describe an image to create…',
    tags: ['image', 'art', 'openai', 'generative'],
  },
  {
    id: 'runway',
    name: 'Runway',
    by: 'Runway',
    category: 'Video Generation',
    badge: '🎬',
    color: '#FF4D4D',
    blurb: 'Generative video — text-to-video, image-to-video and creative editing.',
    url: 'https://runwayml.com',
    launch: 'clipboard',
    promptLabel: 'Describe a video to generate…',
    tags: ['video', 'film', 'editing', 'generative'],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    by: 'ElevenLabs',
    category: 'Voice & Audio',
    badge: '🔊',
    color: '#5B5BD6',
    blurb: 'Lifelike text-to-speech and AI voice cloning in any language.',
    url: 'https://elevenlabs.io',
    launch: 'clipboard',
    promptLabel: 'Text to turn into speech…',
    tags: ['voice', 'audio', 'tts', 'dubbing'],
  },
  {
    id: 'suno',
    name: 'Suno',
    by: 'Suno',
    category: 'Voice & Audio',
    badge: '🎵',
    color: '#F59E0B',
    blurb: 'Generate full songs — vocals, lyrics and instruments — from a prompt.',
    url: 'https://suno.com/create',
    launch: 'clipboard',
    promptLabel: 'Describe a song to create…',
    tags: ['music', 'audio', 'songs', 'generative'],
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    by: 'Adobe',
    category: 'Image Generation',
    badge: '🔥',
    color: '#FF3366',
    blurb: 'Commercially-safe generative imaging built into the Adobe ecosystem.',
    url: 'https://firefly.adobe.com',
    launch: 'clipboard',
    promptLabel: 'Describe an image for Firefly…',
    tags: ['image', 'design', 'adobe', 'generative'],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    by: 'Hugging Face',
    category: 'Build & Models',
    badge: '🤗',
    color: '#FFD21E',
    blurb: 'The hub for open models, datasets and runnable AI demos (Spaces).',
    url: 'https://huggingface.co',
    launch: 'deeplink',
    deeplink: (p) => `https://huggingface.co/search/full-text?q=${enc(p)}`,
    promptLabel: 'Search models, datasets, spaces…',
    tags: ['models', 'open-source', 'datasets', 'developers'],
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    by: 'GitHub',
    category: 'Build & Models',
    badge: '⌨️',
    color: '#6E40C9',
    blurb: 'AI pair-programmer that autocompletes and explains code in your editor.',
    url: 'https://github.com/features/copilot',
    launch: 'open',
    promptLabel: '',
    tags: ['coding', 'developers', 'autocomplete', 'github'],
  },
];

export const TOOL_CATEGORIES = [...new Set(AI_TOOLS.map((t) => t.category))];

/**
 * Resolve what should happen when a user launches a tool with an optional
 * prompt. Returns a descriptor the UI acts on — this keeps the per-tool URL
 * contracts (above) separate from the React component.
 */
export function resolveLaunch(tool, prompt) {
  const p = (prompt || '').trim();

  // Deep-link tools: pre-fill the prompt straight into the tool's URL.
  if (tool.launch === 'deeplink' && p) {
    return { mode: 'deeplink', url: tool.deeplink(p), copied: false };
  }
  // Prompt-capable tool but no prompt typed → just open it.
  if (tool.launch === 'deeplink') {
    return { mode: 'open', url: tool.url, copied: false };
  }
  // Clipboard tools: copy the prompt so the user can paste on arrival.
  if (tool.launch === 'clipboard') {
    return { mode: 'clipboard', url: tool.url, copied: !!p, prompt: p };
  }
  // Open-only tools (e.g. IDE extensions).
  return { mode: 'open', url: tool.url, copied: false };
}
