import { BLOG_POSTS } from '../data/allBlogs';
import { supabase, isSupabaseConfigured } from './supabase';

/*
 * blogStore — single source of truth for user-authored blogs, backed by the
 * shared Supabase `blogs` table.
 *
 * All access control is enforced by Row Level Security in the database
 * (see supabase/schema.sql), so these helpers can stay simple:
 *   • getApprovedUserBlogs() returns only approved posts (public).
 *   • getMyBlogs() returns the signed-in user's own posts (any status) —
 *     RLS guarantees you can never read someone else's drafts.
 *   • updateBlogStatus()/deleteBlog() only succeed for an admin.
 *
 * Every function is async. The curated BLOG_POSTS are merged in by the
 * components that build the public feed.
 *
 * Status lifecycle:  'pending' -> 'approved' | 'rejected'
 */

// Map a DB row (snake_case) to the post shape the UI components expect.
function fromRow(r) {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    category: r.category,
    icon: r.icon,
    emoji: r.icon,
    gradient: r.gradient,
    bgGradient: r.gradient,
    bannerImage: r.banner_image || undefined,
    author: r.author_name || 'Community',
    authorEmail: r.author_email,
    avatar: '✍️',
    date: r.date,
    readTime: r.read_time,
    tags: r.tags || [],
    body: r.body,
    status: r.status,
    submittedAt: r.submitted_at,
  };
}

function notifyChange() {
  window.dispatchEvent(new Event('glancer:blogs-changed'));
}

/* Approved, public posts (most recent first). */
export async function getApprovedUserBlogs() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'approved')
    .order('submitted_at', { ascending: false });
  if (error) { console.error('[blogStore] getApprovedUserBlogs', error); return []; }
  return data.map(fromRow);
}

/* The signed-in user's own posts (any status). RLS limits this to them. */
export async function getMyBlogs() {
  if (!isSupabaseConfigured) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('author_id', user.id)
    .order('submitted_at', { ascending: false });
  if (error) { console.error('[blogStore] getMyBlogs', error); return []; }
  return data.map(fromRow);
}

/* Admin view: every post (RLS allows this only for admins). */
export async function getAllBlogs() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) { console.error('[blogStore] getAllBlogs', error); return []; }
  return data.map(fromRow);
}

/* Create a new post — always inserted as `pending` (the DB enforces this). */
export async function addBlog(input) {
  if (!isSupabaseConfigured) throw new Error('Sign-in is not configured.');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to publish.');

  const row = {
    author_id: user.id,
    author_name: input.author || user.user_metadata?.name || user.email.split('@')[0],
    author_email: user.email,
    title: input.title,
    subtitle: input.subtitle || '',
    category: input.category,
    icon: input.icon || input.emoji,
    gradient: input.gradient,
    banner_image: input.bannerImage || null,
    read_time: Number(input.readTime) || 5,
    tags: input.tags || [],
    body: input.body,
    status: 'pending',
  };

  const { data, error } = await supabase.from('blogs').insert(row).select().single();
  if (error) throw error;
  notifyChange();
  return fromRow(data);
}

/* Admin: approve / reject. RLS rejects this for non-admins. */
export async function updateBlogStatus(id, status) {
  const { error } = await supabase.from('blogs').update({ status }).eq('id', id);
  if (error) throw error;
  notifyChange();
}

/* Admin (or the author): delete a post. */
export async function deleteBlog(id) {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
  notifyChange();
}

/* Look up a single post by id across curated + DB blogs. */
export async function getBlogById(id) {
  const sid = String(id);
  const curated = BLOG_POSTS.find((b) => String(b.id) === sid);
  if (curated) return curated;
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from('blogs').select('*').eq('id', sid).maybeSingle();
  if (error || !data) return null;
  return fromRow(data);
}

/* Combined public feed: approved DB blogs first, then curated posts. */
export async function getPublishedBlogs() {
  const approved = await getApprovedUserBlogs();
  return [...approved, ...BLOG_POSTS];
}
