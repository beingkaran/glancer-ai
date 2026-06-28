-- ============================================================================
-- Glancer AI — database schema + security policies
-- ============================================================================
-- Run this ONCE in your Supabase project:
--   Supabase Dashboard → SQL Editor → New query → paste all of this → Run.
--
-- It creates:
--   • profiles : one row per signed-up user, with an `is_admin` flag
--   • blogs    : every article, with a pending → approved/rejected lifecycle
--   • Row Level Security (RLS) policies that enforce, AT THE DATABASE LEVEL:
--       - anyone can read only APPROVED blogs
--       - a logged-in user can read ONLY their own drafts/pending posts
--       - only an ADMIN can approve / reject
--       - new posts are forced to `pending` (nobody can self-publish)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text,
  is_admin   boolean not null default false,
  is_writer  boolean not null default false,   -- may publish when writer-restrict mode is ON
  created_at timestamptz not null default now()
);
-- Make this re-runnable on an earlier install that lacked is_writer.
alter table public.profiles add column if not exists is_writer boolean not null default false;

alter table public.profiles enable row level security;

-- A user may read their OWN profile. (No update policy on purpose: that means
-- `is_admin` can never be changed by the user via the API — only by you, the
-- project owner, running SQL below. This prevents privilege escalation.)
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
--   • The VERY FIRST account to sign up becomes the admin automatically
--     (so you can skip the manual SQL step — just sign up first).
--   • If the email is on the writer allowlist, they're flagged as a writer.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_first   boolean;
  v_allowlisted boolean;
begin
  select not exists (select 1 from public.profiles) into v_is_first;
  select exists (
    select 1 from public.writer_allowlist w where lower(w.email) = lower(new.email)
  ) into v_allowlisted;

  insert into public.profiles (id, name, email, is_admin, is_writer)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    v_is_first,                         -- first signup = admin
    v_is_first or v_allowlisted         -- admin or allowlisted = writer
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is the *current* user an admin? SECURITY DEFINER so it can read the
-- profiles table regardless of the caller's own RLS visibility.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------------------
-- writer access control (email allowlist, opt-in)
-- ---------------------------------------------------------------------------
-- Single-row settings table. When restrict_writers = false (default), ANY
-- signed-in user may submit posts. Flip it to true to require allowlisting.
create table if not exists public.app_config (
  id               int primary key default 1,
  restrict_writers boolean not null default false,
  check (id = 1)
);
insert into public.app_config (id) values (1) on conflict (id) do nothing;

alter table public.app_config enable row level security;
-- Anyone may read the flag; only admins may change it.
drop policy if exists app_config_select on public.app_config;
create policy app_config_select on public.app_config for select using (true);
drop policy if exists app_config_admin on public.app_config;
create policy app_config_admin on public.app_config
  for update using (public.is_admin()) with check (public.is_admin());

-- The allowlist of emails permitted to write (used only in restrict mode).
create table if not exists public.writer_allowlist (
  email    text primary key,
  added_at timestamptz not null default now()
);
alter table public.writer_allowlist enable row level security;
-- Only admins can read/manage the allowlist. (can_write() reads it via a
-- SECURITY DEFINER function, so normal users never need direct access.)
drop policy if exists writer_allowlist_admin on public.writer_allowlist;
create policy writer_allowlist_admin on public.writer_allowlist
  for all using (public.is_admin()) with check (public.is_admin());

-- May the current user publish? Open mode → yes. Restrict mode → admins,
-- profiles flagged is_writer, or emails on the allowlist.
create or replace function public.can_write()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_restrict boolean;
  v_email    text;
begin
  select restrict_writers into v_restrict from public.app_config where id = 1;
  if not coalesce(v_restrict, false) then
    return auth.uid() is not null;       -- open mode: any signed-in user
  end if;
  if public.is_admin() then return true; end if;
  select email into v_email from public.profiles where id = auth.uid();
  if v_email is null then return false; end if;
  return coalesce((select is_writer from public.profiles where id = auth.uid()), false)
      or exists (select 1 from public.writer_allowlist w where lower(w.email) = lower(v_email));
end;
$$;

-- ---------------------------------------------------------------------------
-- blogs
-- ---------------------------------------------------------------------------
create table if not exists public.blogs (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null references auth.users(id) on delete cascade,
  author_name  text,
  author_email text,
  title        text not null,
  subtitle     text,
  category     text,
  icon         text,
  gradient     text,
  banner_image text,                       -- compressed data URL (optional)
  read_time    int  default 5,
  tags         text[] default '{}',
  body         text,                        -- sanitized-on-display HTML
  status       text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  date         date default current_date,
  submitted_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists blogs_status_idx    on public.blogs (status, submitted_at desc);
create index if not exists blogs_author_id_idx on public.blogs (author_id);

alter table public.blogs enable row level security;

-- SELECT — Postgres OR's multiple permissive policies together, so a row is
-- visible if ANY of these is true:
--   1. it is approved (public)            2. you authored it (your drafts)
--   3. you are an admin (everything)
drop policy if exists blogs_select_approved on public.blogs;
create policy blogs_select_approved on public.blogs
  for select using (status = 'approved');

drop policy if exists blogs_select_own on public.blogs;
create policy blogs_select_own on public.blogs
  for select using (auth.uid() = author_id);

drop policy if exists blogs_select_admin on public.blogs;
create policy blogs_select_admin on public.blogs
  for select using (public.is_admin());

-- INSERT — you may only create rows you author, only as `pending`, and only if
-- you're allowed to write (open mode = anyone signed in; restrict mode = allowlist).
drop policy if exists blogs_insert_own on public.blogs;
create policy blogs_insert_own on public.blogs
  for insert with check (auth.uid() = author_id and status = 'pending' and public.can_write());

-- UPDATE — admins can change anything (this is how approve / reject is locked
-- down). Authors may edit their OWN posts, but their edit is forced back to
-- `pending` (the WITH CHECK below) so they can never self-publish — an edited
-- post always re-enters the review queue.
drop policy if exists blogs_update_admin on public.blogs;
create policy blogs_update_admin on public.blogs
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists blogs_update_own on public.blogs;
create policy blogs_update_own on public.blogs
  for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id and status = 'pending');

-- DELETE — admins, or an author removing their own post.
drop policy if exists blogs_delete on public.blogs;
create policy blogs_delete on public.blogs
  for delete using (public.is_admin() or auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- comments  (one row per comment on a post)
-- ---------------------------------------------------------------------------
-- post_id is plain text (not a FK) so it works for BOTH curated posts (numeric
-- ids baked into the app) and user blogs (uuid). Comments are immutable: there
-- is no UPDATE policy, so a comment can be created and deleted but never edited.
create table if not exists public.comments (
  id           uuid primary key default gen_random_uuid(),
  post_id      text not null,
  author_id    uuid not null references auth.users(id) on delete cascade,
  author_name  text,
  author_email text,
  body         text not null,
  created_at   timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id, created_at desc);

alter table public.comments enable row level security;

-- Anyone (even signed-out visitors) may READ comments.
drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments for select using (true);

-- A signed-in user may add a comment only AS THEMSELVES.
drop policy if exists comments_insert_own on public.comments;
create policy comments_insert_own on public.comments
  for insert with check (auth.uid() = author_id);

-- DELETE — the comment's own author, or an admin. NOBODY else (enforced here at
-- the database level, so it can't be bypassed from the client).
drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments
  for delete using (public.is_admin() or auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- comment_likes  (one row per (comment, user) — a like is just its existence)
-- ---------------------------------------------------------------------------
create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);
alter table public.comment_likes enable row level security;

-- Anyone may read likes (to show counts).
drop policy if exists comment_likes_select on public.comment_likes;
create policy comment_likes_select on public.comment_likes for select using (true);

-- A user may like / unlike only as themselves.
drop policy if exists comment_likes_insert_own on public.comment_likes;
create policy comment_likes_insert_own on public.comment_likes
  for insert with check (auth.uid() = user_id);
drop policy if exists comment_likes_delete_own on public.comment_likes;
create policy comment_likes_delete_own on public.comment_likes
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- page_hits  (anonymous page-view analytics)
-- ---------------------------------------------------------------------------
-- One row per page view. `visitor_id` is an anonymous, per-browser id generated
-- client-side (localStorage) — no personal data, just enough to count UNIQUE
-- visitors. Anyone may insert a hit; only admins can read the data, and the
-- aggregate stats are served by the page_analytics() function below.
create table if not exists public.page_hits (
  id         uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  path       text,
  created_at timestamptz not null default now()
);
create index if not exists page_hits_created_idx on public.page_hits (created_at desc);
create index if not exists page_hits_visitor_idx on public.page_hits (visitor_id);

alter table public.page_hits enable row level security;

-- Anyone (even signed-out visitors) may RECORD a hit...
drop policy if exists page_hits_insert on public.page_hits;
create policy page_hits_insert on public.page_hits
  for insert with check (true);

-- ...but only admins may read the raw rows.
drop policy if exists page_hits_select_admin on public.page_hits;
create policy page_hits_select_admin on public.page_hits
  for select using (public.is_admin());

-- Admin-only aggregate snapshot: totals + unique visitors for today / 7d / 12mo,
-- plus daily (30d), weekly (12w) and yearly trend series. SECURITY DEFINER so it
-- can scan the table, but it refuses any caller who isn't an admin.
create or replace function public.page_analytics()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result json;
begin
  if not public.is_admin() then
    raise exception 'Only admins may view analytics.';
  end if;

  select json_build_object(
    'total',        (select count(*) from page_hits),
    'unique_total', (select count(distinct visitor_id) from page_hits),
    'today',        (select count(*) from page_hits where created_at >= date_trunc('day', now())),
    'unique_today', (select count(distinct visitor_id) from page_hits where created_at >= date_trunc('day', now())),
    'week',         (select count(*) from page_hits where created_at >= now() - interval '7 days'),
    'unique_week',  (select count(distinct visitor_id) from page_hits where created_at >= now() - interval '7 days'),
    'year',         (select count(*) from page_hits where created_at >= now() - interval '12 months'),
    'unique_year',  (select count(distinct visitor_id) from page_hits where created_at >= now() - interval '12 months'),
    'daily',  (select coalesce(json_agg(json_build_object('label', label, 'hits', hits, 'uniques', uniques) order by bucket), '[]'::json) from (
        select date_trunc('day', created_at) as bucket,
               to_char(date_trunc('day', created_at), 'Mon DD') as label,
               count(*) as hits, count(distinct visitor_id) as uniques
        from page_hits where created_at >= now() - interval '30 days'
        group by date_trunc('day', created_at)
      ) d),
    'weekly', (select coalesce(json_agg(json_build_object('label', label, 'hits', hits, 'uniques', uniques) order by bucket), '[]'::json) from (
        select date_trunc('week', created_at) as bucket,
               to_char(date_trunc('week', created_at), 'Mon DD') as label,
               count(*) as hits, count(distinct visitor_id) as uniques
        from page_hits where created_at >= now() - interval '12 weeks'
        group by date_trunc('week', created_at)
      ) w),
    'yearly', (select coalesce(json_agg(json_build_object('label', label, 'hits', hits, 'uniques', uniques) order by bucket), '[]'::json) from (
        select date_trunc('year', created_at) as bucket,
               to_char(date_trunc('year', created_at), 'YYYY') as label,
               count(*) as hits, count(distinct visitor_id) as uniques
        from page_hits where created_at >= now() - interval '5 years'
        group by date_trunc('year', created_at)
      ) y)
  ) into result;

  return result;
end;
$$;

-- ============================================================================
-- BECOMING ADMIN
-- ============================================================================
-- The FIRST account to sign up is made admin automatically — so just sign up
-- first, then open /_glancer/admin.
--
-- To grant admin to someone else later (replace the email):
--   update public.profiles set is_admin = true where email = 'someone@example.com';
--
-- ============================================================================
-- WRITER ALLOWLIST (optional — restrict who can publish)
-- ============================================================================
-- By default ANY signed-in user can submit posts (they still need approval).
-- To restrict publishing to specific people, you can use the Admin dashboard's
-- "Writer Access" panel, or run SQL directly:
--
--   -- turn restriction on:
--   update public.app_config set restrict_writers = true where id = 1;
--   -- allow specific emails to write:
--   insert into public.writer_allowlist (email) values ('writer@example.com')
--     on conflict (email) do nothing;
--   -- turn it back off (open to all signed-in users):
--   update public.app_config set restrict_writers = false where id = 1;
-- ============================================================================
