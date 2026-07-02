import { supabase, isSupabaseConfigured } from './supabase';

/*
 * newsletter — insert a { name, email } subscription into Supabase. The list is
 * insert-only for the public anon key (admins read it); see supabase/schema.sql.
 * Stored as plain text per product requirement.
 */
export async function subscribeNewsletter({ name, email, source = 'homepage-popup' }) {
  const clean = (email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!isSupabaseConfigured) {
    // Dev / unconfigured: still let the UI succeed so the flow can be tested.
    console.warn('[newsletter] Supabase not configured — subscription not persisted.');
    return { ok: true, persisted: false };
  }
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ name: (name || '').trim() || null, email: clean, source });
  // 23505 = unique violation → already subscribed; treat as success.
  if (error && error.code !== '23505') throw error;
  return { ok: true, persisted: true };
}
