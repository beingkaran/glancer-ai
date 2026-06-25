import { BLOG_POSTS } from '../data/allBlogs';

/*
 * blogStore — single source of truth for user-authored blogs.
 *
 * All reads/writes funnel through here so the storage backend can later be
 * swapped from localStorage to a real API without touching components.
 *
 * Blog status lifecycle:  'pending' -> 'approved' | 'rejected'
 * Only 'approved' blogs are shown publicly (homepage + /blogs).
 */

const KEY = 'glancer_user_blogs';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  // Let other tabs / components react to changes.
  window.dispatchEvent(new Event('glancer:blogs-changed'));
  return list;
}

export function getUserBlogs() {
  return read();
}

export function getApprovedUserBlogs() {
  return read().filter((b) => b.status === 'approved');
}

export function getBlogsByAuthor(email) {
  if (!email) return [];
  const e = email.toLowerCase();
  return read().filter((b) => (b.authorEmail || '').toLowerCase() === e);
}

export function addBlog(blog) {
  const list = read();
  list.unshift(blog);
  write(list);
  return blog;
}

export function updateBlogStatus(id, status) {
  return write(read().map((b) => (b.id === id ? { ...b, status } : b)));
}

export function deleteBlog(id) {
  return write(read().filter((b) => b.id !== id));
}

/* Combined public feed: approved user blogs first, then curated posts. */
export function getPublishedBlogs() {
  return [...getApprovedUserBlogs(), ...BLOG_POSTS];
}

/* Look up a single post by id across curated + user blogs. */
export function getBlogById(id) {
  const sid = String(id);
  return (
    BLOG_POSTS.find((b) => String(b.id) === sid) ||
    read().find((b) => String(b.id) === sid) ||
    null
  );
}

export const BLOG_STORAGE_KEY = KEY;
