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
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user may read their OWN profile. (No update policy on purpose: that means
-- `is_admin` can never be changed by the user via the API — only by you, the
-- project owner, running SQL below. This prevents privilege escalation.)
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
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

-- INSERT — you may only create rows you author, and only as `pending`.
drop policy if exists blogs_insert_own on public.blogs;
create policy blogs_insert_own on public.blogs
  for insert with check (auth.uid() = author_id and status = 'pending');

-- UPDATE — only admins (this is how approve / reject is locked down).
drop policy if exists blogs_update_admin on public.blogs;
create policy blogs_update_admin on public.blogs
  for update using (public.is_admin()) with check (public.is_admin());

-- DELETE — admins, or an author removing their own post.
drop policy if exists blogs_delete on public.blogs;
create policy blogs_delete on public.blogs
  for delete using (public.is_admin() or auth.uid() = author_id);

-- ============================================================================
-- MAKE YOURSELF AN ADMIN
-- ============================================================================
-- 1. First sign up through the website with the email you want to be admin.
-- 2. Then run this (replace the email), which flips your is_admin flag:
--
--   update public.profiles set is_admin = true
--   where email = 'karan.igniite@gmail.com';
--
-- 3. Reload /_glancer/admin — you now have the approve/reject dashboard.
-- ============================================================================
