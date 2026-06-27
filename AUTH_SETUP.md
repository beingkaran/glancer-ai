# Glancer AI — Auth & Blog Approval Setup

Real email/password login + a shared blog database, powered by **Supabase**
(free tier). Security is enforced by the database (Row Level Security), so:

- Nobody can log in without a password.
- A user only ever sees **their own** drafts/pending posts + everyone's approved posts.
- New posts are forced to `pending`; only an **admin** can approve/reject.
- The admin page is gated by real login + an `is_admin` flag (no password in the bundle).

---

## One-time setup (about 5 minutes)

### 1. Create a free Supabase project
1. Go to <https://supabase.com> → sign up (free, no card).
2. **New project** → pick a name + a database password (save it) → wait ~1 min.

### 2. Create the tables + security policies
1. In the project: **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this repo, copy **everything**, paste, click **Run**.
   You should see "Success". This creates the `profiles` and `blogs` tables and
   all the access rules.

### 3. Get your two keys
1. **Project Settings → API**.
2. Copy:
   - **Project URL**  → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Paste them into `.env` (already has the empty placeholders):
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
4. Restart the dev server (`npm run dev`). These are also **public/safe** — the
   anon key only does what the RLS policies allow.

> Production: add the same two `VITE_SUPABASE_*` variables in your host's
> dashboard (Cloudflare Pages/Workers env vars), then redeploy.

### 4. Make yourself the admin
1. Open the website → **Sign in** → **Create Account** with your email + a password.
2. Back in Supabase **SQL Editor**, run (use the same email):
   ```sql
   update public.profiles set is_admin = true
   where email = 'karan.igniite@gmail.com';
   ```
3. Visit `/_glancer/admin` → you now have the approve/reject dashboard.

### 5. (Recommended) Decide on email confirmation
Supabase **Authentication → Providers → Email**:
- Leave **"Confirm email" ON** → users must click a link in their inbox before
  they can sign in (more secure, default).
- Turn it **OFF** → instant sign-up, no email step (simpler for testing).

The app handles both: if confirmation is on, sign-up shows a "check your inbox" message.

---

## How it works (the flow)
1. A visitor signs up / signs in with email + password.
2. They write an article → it's saved as **pending** (hidden from the public).
3. It shows in their **Profile** as "Pending Review" — and **only** to them.
4. You (admin) open `/_glancer/admin`, preview it, and **Approve** or **Reject**.
5. Approved posts appear on `/blogs`, the homepage, and individual post pages.

## Files involved
- `src/lib/supabase.js` — the Supabase client.
- `src/context/AuthContext.jsx` — login/signup/session state.
- `src/components/AuthForm.jsx` — the email/password form.
- `src/lib/blogStore.js` — all blog reads/writes (async, RLS-guarded).
- `src/pages/AdminPage.jsx` — admin-only moderation dashboard.
- `supabase/schema.sql` — tables + security policies (the source of truth for access).
