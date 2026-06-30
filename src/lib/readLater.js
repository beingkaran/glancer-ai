/*
 * readLater — a tiny "save for later" store backed by localStorage.
 *
 * Works for both news items and blog posts. We persist a light snapshot of each
 * saved entry (title, url, image, excerpt, …) so the Read Later list can render
 * even after the live news feed has rotated the original story out of cache.
 *
 * Every mutation fires `glancer:read-later-changed` so any open list/badge
 * re-reads immediately (mirrors the blogs/news event pattern elsewhere).
 */

const KEY = 'glancer_read_later_v1';
const EVT = 'glancer:read-later-changed';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* quota / private mode */ }
  try { window.dispatchEvent(new Event(EVT)); } catch { /* SSR */ }
}

/* Stable key so the same story/blog is only ever saved once. */
export function keyForNews(item) {
  return `news:${item.url || item.id || item.rid || item.title}`;
}
export function keyForBlog(blog) {
  return `blog:${blog.id || blog.slug || blog.title}`;
}

/* Build the stored snapshot from a news item or a blog post. */
export function entryForNews(item) {
  return {
    key: keyForNews(item),
    type: 'news',
    title: item.title,
    url: item.url,
    rid: item.rid,
    source: item.source,
    image: item.image || null,
    excerpt: item.excerpt || '',
    date: item.date || '',
  };
}
export function entryForBlog(blog) {
  return {
    key: keyForBlog(blog),
    type: 'blog',
    id: blog.id,
    title: blog.title,
    url: `/blog/${blog.id}`,
    source: blog.author || 'Glancer AI',
    image: blog.bannerImage || null,
    excerpt: blog.subtitle || '',
    date: blog.date || '',
  };
}

/* The carousel renders news + blog slides in one shape; pick the right entry. */
export function entryForSlide(item) {
  if (item.internal && item.id) {
    return {
      key: keyForBlog(item),
      type: 'blog',
      id: item.id,
      title: item.title,
      url: item.url || `/blog/${item.id}`,
      source: item.source || 'Glancer Blog',
      image: item.image || null,
      excerpt: item.excerpt || '',
      date: item.date || '',
    };
  }
  return entryForNews(item);
}

export function getSaved() {
  return read().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
}
export function getSavedCount() {
  return read().length;
}
export function isSaved(key) {
  return read().some((e) => e.key === key);
}

/* Add if absent, remove if present. Returns the new saved state (boolean). */
export function toggleSave(entry) {
  const list = read();
  const i = list.findIndex((e) => e.key === entry.key);
  if (i >= 0) {
    list.splice(i, 1);
    write(list);
    return false;
  }
  list.push({ ...entry, savedAt: Date.now() });
  write(list);
  return true;
}

export function removeSaved(key) {
  write(read().filter((e) => e.key !== key));
}

export function clearSaved() {
  write([]);
}
