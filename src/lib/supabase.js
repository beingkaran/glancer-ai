import { createClient } from '@supabase/supabase-js';

/*
 * Supabase client — the single backend for real auth + the shared blog DB.
 *
 * Configure two env vars (see .env.example). They are PUBLIC by design — the
 * anon key only grants whatever Row Level Security policies allow, so all the
 * real access control lives in the database (see supabase/schema.sql), not here.
 */
// .trim() guards against stray spaces/newlines pasted into .env or a host's
// env-var UI (a leading space made Supabase reject the key with "Invalid API key").
const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // Loud, actionable warning instead of a cryptic null-deref at call sites.
  console.warn(
    '[Glancer] Supabase is not configured. Set VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY in .env, then restart the dev server.',
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/*
 * createAdminUser — create a new admin account (email + password) from inside
 * the admin dashboard. Only meaningful when called by a signed-in admin.
 *
 * The signup runs on a THROWAWAY client (persistSession:false) so it does not
 * replace the current admin's session (client-side signUp otherwise switches the
 * active user). The is_admin promotion then runs on the main (admin-session)
 * client, so it succeeds only if RLS lets admins update profiles.is_admin.
 */
export async function createAdminUser({ name, email, password }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  const em = (email || '').trim().toLowerCase();
  const tmp = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await tmp.auth.signUp({
    email: em,
    password,
    options: { data: { name: (name || '').trim() } },
  });
  if (error) throw error;
  const uid = data.user?.id;
  if (!uid) {
    throw new Error('Account created — the user must confirm their email before admin can be granted.');
  }
  const { error: pErr } = await supabase.from('profiles').update({ is_admin: true }).eq('id', uid);
  if (pErr) {
    throw new Error(`User "${em}" was created, but granting admin failed: ${pErr.message}. Set is_admin=true for them in the database.`);
  }
  return { email: em };
}
