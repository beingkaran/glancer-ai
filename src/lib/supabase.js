import { createClient } from '@supabase/supabase-js';

/*
 * Supabase client — the single backend for real auth + the shared blog DB.
 *
 * Configure two env vars (see .env.example). They are PUBLIC by design — the
 * anon key only grants whatever Row Level Security policies allow, so all the
 * real access control lives in the database (see supabase/schema.sql), not here.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
