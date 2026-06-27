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

-- UPDATE — only admins (this is how approve / reject is locked down).
drop policy if exists blogs_update_admin on public.blogs;
create policy blogs_update_admin on public.blogs
  for update using (public.is_admin()) with check (public.is_admin());

-- DELETE — admins, or an author removing their own post.
drop policy if exists blogs_delete on public.blogs;
create policy blogs_delete on public.blogs
  for delete using (public.is_admin() or auth.uid() = author_id);

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
