#!/usr/bin/env node
/*
 * prerender-blogs.mjs — bake static HTML snapshots of every curated blog post.
 *
 * The site is a client-rendered React SPA: the HTML Cloudflare serves for
 * /blog/:id is an empty <div id="root">. Googlebot can render JS, but Google
 * Discover strongly favours pages whose content + Article schema are present in
 * the initial HTML, and many crawlers (and social/AI scrapers) never run JS at
 * all. So article pages were effectively invisible.
 *
 * This runs AFTER `vite build`. For each curated post it writes
 * dist/blog/<id>.html — a copy of the built shell with:
 *   • correct <title>, meta description, canonical, Open Graph + Twitter tags
 *   • NewsArticle/Article + BreadcrumbList JSON-LD in <head>
 *   • the full article (headline, byline, banner image, body) inside #root
 *
 * Cloudflare's static-asset handler serves /blog/<id> from /blog/<id>.html, so
 * crawlers get a complete document. When the React bundle boots, createRoot()
 * replaces #root with the live app — users get the normal SPA. Best of both.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://glancerai.com';
const DIST = resolve(__dirname, '../dist');

const { BLOG_POSTS } = await import('../src/data/allBlogs.js');
const { buildArticleSchema, buildBreadcrumb, schemaToJson } = await import('../src/lib/structuredData.js');

let shell;
try {
  shell = readFileSync(resolve(DIST, 'index.html'), 'utf8');
} catch {
  console.error('✗ dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

const esc = (s) =>
  String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

function abs(u) {
  if (!u) return `${ORIGIN}/icon-1024.png`;
  return /^https?:\/\//.test(u) ? u : ORIGIN + (u.startsWith('/') ? u : `/${u}`);
}

function plain(html, max = 160) {
  const t = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

let count = 0;
for (const post of BLOG_POSTS) {
  const path = `/blog/${post.id}`;
  const url = ORIGIN + path;
  const title = `${post.title} · Glancer AI`;
  const desc = post.subtitle || plain(post.body);
  const image = abs(post.bannerImage);

  const articleSchema = schemaToJson(buildArticleSchema(post, { type: 'Article', path }));
  const crumbSchema = schemaToJson(
    buildBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Blogs', path: '/blogs' },
      { name: post.title, path },
    ])
  );

  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(post.title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="article" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${image}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${image}" />`);

  // Inject per-article JSON-LD just before </head>.
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${articleSchema}</script>\n` +
      `    <script type="application/ld+json">${crumbSchema}</script>\n  </head>`
  );

  // Prerendered article markup inside #root. React replaces this on mount.
  const tags = (post.tags || []).map((t) => `#${esc(t)}`).join(' ');
  const prerendered = `<article style="max-width:760px;margin:0 auto;padding:96px 20px 80px">
        <p style="font-size:.8rem;letter-spacing:.04em;text-transform:uppercase;color:#7C3AED">${esc(post.category || 'Article')}</p>
        <h1 style="font-size:2.4rem;line-height:1.18;font-weight:700">${esc(post.title)}</h1>
        ${post.subtitle ? `<p style="font-size:1.1rem;color:#475569">${esc(post.subtitle)}</p>` : ''}
        <p style="font-size:.85rem;color:#64748b">By ${esc(post.author || 'Glancer AI Team')} · ${esc((post.date || '').slice(0, 10))} · ${esc(post.readTime || 6)} min read ${tags ? '· ' + tags : ''}</p>
        <img src="${esc(post.bannerImage || '/icon-1024.png')}" alt="${esc(post.title)}" width="1200" height="675" style="width:100%;height:auto;border-radius:12px" />
        <div>${post.body || ''}</div>
      </article>`;
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${prerendered}</div>`);

  const outDir = resolve(DIST, 'blog');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, `${post.id}.html`), html, 'utf8');
  count++;
}

console.log(`✓ prerendered ${count} blog posts → dist/blog/*.html`);
