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

/* Author (or admin): edit an existing post. RLS forces an author's edit back to
 * `pending`, so an edited post is re-reviewed before it can go public again. */
export async function updateBlog(id, input) {
  if (!isSupabaseConfigured) throw new Error('Sign-in is not configured.');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to edit.');

  const patch = {
    title: input.title,
    subtitle: input.subtitle || '',
    category: input.category,
    icon: input.icon || input.emoji,
    gradient: input.gradient,
    banner_image: input.bannerImage || null,
    read_time: Number(input.readTime) || 5,
    tags: input.tags || [],
    body: input.body,
    status: 'pending', // edits re-enter the review queue
  };

  const { data, error } = await supabase.from('blogs').update(patch).eq('id', id).select().single();
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

/* ---------------------------------------------------------------------------
 * Comments + likes — server-enforced by RLS (see supabase/schema.sql).
 *   • Anyone can read.  • Signed-in users can comment as themselves.
 *   • Only the author or an admin can delete a comment.
 *   • A like is a row in comment_likes; a user can only (un)like as themselves.
 * ------------------------------------------------------------------------- */

/* All comments for a post (newest first), each annotated with like count, and
 * whether the current user liked / authored it. postId may be a curated post's
 * numeric id or a user blog's uuid — it's matched as text. */
export async function getComments(postId) {
  if (!isSupabaseConfigured) return [];
  const pid = String(postId);
  const { data: { user } } = await supabase.auth.getUser();

  const { data: rows, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', pid)
    .order('created_at', { ascending: false });
  if (error) { console.error('[blogStore] getComments', error); return []; }

  const ids = rows.map((r) => r.id);
  let likes = [];
  if (ids.length) {
    const { data: likeRows } = await supabase
      .from('comment_likes')
      .select('comment_id, user_id')
      .in('comment_id', ids);
    likes = likeRows || [];
  }

  return rows.map((r) => {
    const mine = !!user && r.author_id === user.id;
    const myLike = !!user && likes.some((l) => l.comment_id === r.id && l.user_id === user.id);
    return {
      id: r.id,
      postId: r.post_id,
      authorId: r.author_id,
      author: r.author_name || 'User',
      authorEmail: r.author_email,
      body: r.body,
      createdAt: r.created_at,
      likeCount: likes.filter((l) => l.comment_id === r.id).length,
      likedByMe: myLike,
      mine,
    };
  });
}

/* Add a comment to a post. Caller is responsible for the profanity check; the
 * DB still enforces that you can only post as yourself. */
export async function addComment(postId, body) {
  if (!isSupabaseConfigured) throw new Error('Sign-in is not configured.');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to comment.');
  const clean = (body || '').trim();
  if (!clean) throw new Error('Comment cannot be empty.');

  const row = {
    post_id: String(postId),
    author_id: user.id,
    author_name: user.user_metadata?.name || user.email.split('@')[0],
    author_email: user.email,
    body: clean.slice(0, 2000),
  };
  const { data, error } = await supabase.from('comments').insert(row).select().single();
  if (error) throw error;
  return data;
}

/* Delete a comment. RLS rejects this unless you're the author or an admin. */
export async function deleteComment(id) {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) throw error;
}

/* Like or unlike a comment. Pass the CURRENT liked state; this flips it. */
export async function toggleCommentLike(commentId, currentlyLiked) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to like a comment.');
  if (currentlyLiked) {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('comment_likes')
      .insert({ comment_id: commentId, user_id: user.id });
    if (error && error.code !== '23505') throw error; // ignore duplicate like
  }
}

/* ---------------------------------------------------------------------------
 * Writer access (email allowlist) — server-enforced by RLS + can_write().
 * ------------------------------------------------------------------------- */

/* Can the signed-in user publish? (Asks the DB function can_write().) */
export async function canCurrentUserWrite() {
  if (!isSupabaseConfigured) return false;
  const { data, error } = await supabase.rpc('can_write');
  if (error) { console.error('[blogStore] can_write', error); return false; }
  return !!data;
}

/* Admin: read the restrict flag + the allowlist (admin-only via RLS). */
export async function getWriterAccess() {
  if (!isSupabaseConfigured) return { restrict: false, emails: [] };
  const [{ data: cfg }, { data: list }] = await Promise.all([
    supabase.from('app_config').select('restrict_writers').eq('id', 1).maybeSingle(),
    supabase.from('writer_allowlist').select('email').order('added_at', { ascending: true }),
  ]);
  return { restrict: !!cfg?.restrict_writers, emails: (list || []).map((r) => r.email) };
}

/* Admin: toggle whether publishing is restricted to the allowlist. */
export async function setRestrictWriters(restrict) {
  const { error } = await supabase.from('app_config').update({ restrict_writers: restrict }).eq('id', 1);
  if (error) throw error;
}

/* Admin: add an email to the allowlist. */
export async function addWriter(email) {
  const e = email.trim().toLowerCase();
  const { error } = await supabase.from('writer_allowlist').insert({ email: e });
  if (error && error.code !== '23505') throw error; // ignore duplicate
}

/* Admin: remove an email from the allowlist. */
export async function removeWriter(email) {
  const { error } = await supabase.from('writer_allowlist').delete().eq('email', email.trim().toLowerCase());
  if (error) throw error;
}
