import { useEffect } from 'react';

/*
 * structuredData — build and inject JSON-LD for individual articles.
 *
 * Why this matters for Google Discover (2026): structured data does not
 * directly rank a page, but Article/NewsArticle markup tells Google the
 * content type, author, publish date and the large image to feature on the
 * Discover card. Combined with `max-image-preview:large` (set globally in
 * index.html) and a 1200px+ banner, it's what lets a page surface with a big
 * visual instead of a tiny thumbnail.
 *
 * The build-time prerender (scripts/prerender-blogs.mjs) bakes the same JSON-LD
 * into the static HTML so crawlers see it without running JS; this hook keeps
 * it correct during client-side navigation and for Supabase-backed posts.
 */

import { PRIMARY_AUTHOR } from '../data/authorMeta.js';

const ORIGIN = 'https://glancerai.com';
const ORG_ID = `${ORIGIN}/#organization`;

function buildAuthorSchema(post) {
  const name = post?.author || PRIMARY_AUTHOR.name;
  if (/team|glancer/i.test(name) && !/karan/i.test(name)) {
    return { '@type': 'Organization', name: name || 'Glancer AI' };
  }
  // A distinct, named guest author (not Karan) gets a minimal Person schema so
  // we never attach Karan's photo, LinkedIn or email to someone else's byline.
  if (!/karan/i.test(name)) {
    const guest = { '@type': 'Person', name };
    if (post?.authorRole) guest.jobTitle = post.authorRole;
    if (post?.authorImage) guest.image = post.authorImage;
    if (post?.authorBio) guest.description = post.authorBio;
    return guest;
  }
  return {
    '@type': 'Person',
    name: PRIMARY_AUTHOR.name,
    url: `${ORIGIN}/about`,
    image: post?.authorImage || PRIMARY_AUTHOR.image,
    jobTitle: post?.authorRole || PRIMARY_AUTHOR.role,
    description: post?.authorBio || PRIMARY_AUTHOR.bioShort,
    sameAs: [PRIMARY_AUTHOR.linkedin],
    email: PRIMARY_AUTHOR.email,
  };
}

function absUrl(u) {
  if (!u) return `${ORIGIN}/icon-1024.png`;
  if (/^https?:\/\//.test(u)) return u;
  return ORIGIN + (u.startsWith('/') ? u : `/${u}`);
}

// Strip HTML to a plain-text description (first ~300 chars) for the schema.
function plainText(html, max = 300) {
  if (!html) return '';
  const text = String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/**
 * Build an Article (or NewsArticle) JSON-LD object for a post.
 * @param {object} post  blog/news item
 * @param {object} opts  { type: 'Article' | 'NewsArticle', path }
 */
export function buildArticleSchema(post, { type = 'Article', path } = {}) {
  if (!post) return null;
  const url = ORIGIN + (path || `/blog/${post.id}`);
  const image = absUrl(post.bannerImage || post.image || post.thumbnail);
  return {
    '@context': 'https://schema.org',
    '@type': type,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: (post.title || '').slice(0, 110),
    description: post.subtitle || plainText(post.body),
    image: [image],
    datePublished: post.date || post.publishedAt || undefined,
    dateModified: post.updatedAt || post.date || undefined,
    author: buildAuthorSchema(post),
    publisher: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Glancer AI',
      logo: { '@type': 'ImageObject', url: `${ORIGIN}/icon-512.png` },
    },
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined,
    url,
  };
}

/**
 * Build an ItemList JSON-LD object for a curated collection page (e.g. a topic
 * hub or a news roundup). Google reads ItemList to understand that the page is
 * a structured, ordered set of links — the correct signal for an aggregator's
 * category pages, and a prerequisite for carousel/rich-result eligibility.
 *
 * @param {Array} items  [{ url, name, image?, description? }]
 * @param {object} opts  { name, path, description }
 */
export function buildItemListSchema(items = [], { name, path = '', description } = {}) {
  const url = ORIGIN + path;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    name,
    description: description || undefined,
    url,
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absUrl(it.url),
      name: (it.name || '').slice(0, 110),
    })),
  };
}

/**
 * Convenience wrapper: NewsArticle schema for a timely roundup/synthesis post.
 * Thin shim over buildArticleSchema so callers read intentfully.
 */
export function buildNewsArticleSchema(post, { path } = {}) {
  return buildArticleSchema(post, { type: 'NewsArticle', path });
}

/**
 * Build a FAQPage JSON-LD object from a post's `faq` array.
 *
 * Why this matters for SEO (2026): FAQPage markup makes a page eligible for the
 * expandable People-Also-Ask style rich result on comparison/"X vs Y" queries,
 * which lifts SERP real estate and CTR even when ranking position is unchanged.
 * `faq` entries are `{ q, a }` where `a` may contain light inline HTML — we
 * strip tags to a clean plain-text answer for the schema.
 *
 * @param {Array<{q: string, a: string}>} faq
 */
export function buildFaqSchema(faq) {
  if (!Array.isArray(faq) || faq.length === 0) return null;
  const entries = faq
    .filter((f) => f && f.q && f.a)
    .map((f) => ({
      '@type': 'Question',
      name: String(f.q).trim(),
      acceptedAnswer: { '@type': 'Answer', text: plainText(f.a, 1000) },
    }));
  if (!entries.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries,
  };
}

export function buildBreadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: ORIGIN + it.path,
    })),
  };
}

/** Render an object to a clean JSON-LD string (drops undefined keys). */
export function schemaToJson(obj) {
  return JSON.stringify(obj, (_k, v) => (v === undefined ? undefined : v));
}

/**
 * useArticleSchema — inject one or more JSON-LD blocks for the current article
 * and remove them on unmount / change, so SPA navigation never stacks stale
 * markup. Pass already-built schema objects.
 */
export function useArticleSchema(schemas) {
  useEffect(() => {
    const list = (Array.isArray(schemas) ? schemas : [schemas]).filter(Boolean);
    if (!list.length) return;
    const nodes = list.map((s) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-seo-jsonld', '1');
      el.textContent = schemaToJson(s);
      document.head.appendChild(el);
      return el;
    });
    return () => nodes.forEach((n) => n.remove());
  }, [JSON.stringify(schemas)]);
}
