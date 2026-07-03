import { useEffect } from 'react';

/*
 * useDocumentMeta — set per-route <title>, meta description, canonical and
 * Open Graph / Twitter tags without pulling in react-helmet. Better SEO per
 * page directly improves AdSense earnings (more indexed pages → more traffic).
 *
 * usage: useDocumentMeta({ title, description, path, type })
 */

const SITE = 'Glancer AI';
const ORIGIN = 'https://glancerai.com';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useDocumentMeta({ title, description, path = '', type = 'website', image, robots } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE}` : `${SITE} — AI News, Metrics & Intelligence Hub`;
    const url = ORIGIN + path;
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertLink('canonical', url);

    // Per-page robots override (e.g. 'noindex, follow' for thin/ephemeral
    // pages). Restored to the site default on unmount so SPA navigation
    // doesn't leak noindex onto a route that never sets its own meta.
    const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    upsertMeta('name', 'robots', robots || DEFAULT_ROBOTS);

    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:site_name', SITE);
    if (image) upsertMeta('property', 'og:image', image);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    if (image) upsertMeta('name', 'twitter:image', image);

    if (robots) {
      return () => upsertMeta('name', 'robots', DEFAULT_ROBOTS);
    }
    return undefined;
  }, [title, description, path, type, image, robots]);
}
