#!/usr/bin/env node
/*
 * generate-sitemap.mjs — build a complete sitemap that includes every curated
 * blog post, not just the 7 top-level routes. Runs BEFORE `vite build` so the
 * fresh sitemap.xml in public/ gets copied into dist/.
 *
 * Why: Google can only put pages in Discover/Search that it has discovered and
 * indexed. The old static sitemap listed section pages only, so individual
 * articles (the pages that actually rank) were invisible to crawlers.
 *
 * Note: user-submitted Supabase blogs and live RSS news are not known at build
 * time. The Cloudflare Worker / a scheduled agent should append those (see the
 * SEO playbook). This script guarantees the evergreen content is always listed.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://glancerai.com';
const OUT = resolve(__dirname, '../public/sitemap.xml');

const { BLOG_POSTS } = await import('../src/data/allBlogs.js');

const today = new Date().toISOString().slice(0, 10);

// Top-level routes with sensible crawl priorities.
const staticRoutes = [
  { loc: '/', changefreq: 'daily', priority: '1.0', lastmod: today },
  { loc: '/blogs', changefreq: 'daily', priority: '0.9', lastmod: today },
  { loc: '/ai-tools', changefreq: 'weekly', priority: '0.9', lastmod: today },
  { loc: '/metrics', changefreq: 'daily', priority: '0.7', lastmod: today },
  {
    loc: '/glossary',
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: today,
    image: `${ORIGIN}/glossary-infographic.jpg`,
    title: 'AI, AIOps & Observability Glossary Map — 2,200+ Terms',
  },
  { loc: '/faq', changefreq: 'monthly', priority: '0.5', lastmod: today },
  { loc: '/about', changefreq: 'monthly', priority: '0.4', lastmod: today },
];

// One <url> per curated blog post, with its publish date as lastmod and the
// banner exposed via image sitemap extension (helps Discover image selection).
const blogRoutes = BLOG_POSTS.map((p) => ({
  loc: `/blog/${p.id}`,
  changefreq: 'monthly',
  priority: p.featured ? '0.8' : '0.7',
  lastmod: (p.date || today).slice(0, 10),
  // bannerImage may be an absolute URL (e.g. Unsplash) or a site-relative path;
  // only prefix the origin for relative paths so we don't double it up.
  image: p.bannerImage ? (/^https?:\/\//.test(p.bannerImage) ? p.bannerImage : ORIGIN + p.bannerImage) : null,
  title: p.title,
}));

function urlNode(r) {
  const img = r.image
    ? `\n    <image:image><image:loc>${escapeXml(r.image)}</image:loc><image:title>${escapeXml(r.title || '')}</image:title></image:image>`
    : '';
  return `  <url>
    <loc>${ORIGIN}${r.loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>${img}
  </url>`;
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

const all = [...staticRoutes, ...blogRoutes];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${all.map(urlNode).join('\n')}
</urlset>
`;

writeFileSync(OUT, xml, 'utf8');
console.log(`✓ sitemap.xml written with ${all.length} URLs (${blogRoutes.length} blog posts) → ${OUT}`);
