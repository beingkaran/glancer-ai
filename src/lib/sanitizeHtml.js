/*
 * sanitizeHtml — the single trusted gate between untrusted HTML and the DOM.
 *
 * Community blog bodies are authored in a rich-text editor (TipTap) and stored
 * as raw HTML. Anything rendered with dangerouslySetInnerHTML MUST pass through
 * here first, or a malicious post can run script in a reader's/editor's browser
 * (stored XSS). DOMPurify strips <script>, event handlers (onerror, onload…),
 * javascript: URLs, <iframe>/<object>/<embed>, and other active content while
 * keeping the formatting a blog post legitimately needs.
 *
 * Runs client-side only (DOMPurify needs a DOM). Curated posts baked at build
 * time come from trusted repo data, so the prerender path does not use this.
 */
import DOMPurify from 'dompurify';

// TipTap emits target="_blank" links; DOMPurify keeps target when we allow it,
// so force rel="noopener noreferrer" to block reverse-tabnabbing.
let hookInstalled = false;
function installHook() {
  if (hookInstalled || typeof DOMPurify.addHook !== 'function') return;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target')) {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  hookInstalled = true;
}

// Allowlist tuned to what the editor can produce. Anything not listed is dropped.
const CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'hr', 'span', 'div',
    'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark', 'sub', 'sup', 'small',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'src', 'srcset', 'alt', 'width', 'height', 'loading',
    'class', 'colspan', 'rowspan',
  ],
  ALLOW_DATA_ATTR: false,
  // Only http(s)/mailto/tel and relative URLs survive on href/src — this is the
  // DOMPurify default, pinned explicitly so it can't silently loosen.
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Sanitize untrusted blog/article HTML into a safe fragment for
 * dangerouslySetInnerHTML. Returns '' for nullish input.
 */
export function sanitizeBlogHtml(dirty) {
  if (dirty == null || dirty === '') return '';
  installHook();
  return DOMPurify.sanitize(String(dirty), CONFIG);
}
