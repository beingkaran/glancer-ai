import { supabase, isSupabaseConfigured } from './supabase';

/*
 * analytics — anonymous page-hit tracking, backed by the Supabase `page_hits`
 * table (see supabase/schema.sql).
 *
 *   • recordHit(path)        fire-and-forget; logs one page view. Never throws.
 *   • getPageAnalytics()     admin-only aggregate snapshot (totals, unique
 *                            visitors, and daily / weekly / yearly trends),
 *                            computed server-side by the page_analytics() RPC.
 *
 * Visitors are identified by an anonymous, per-browser id kept in localStorage
 * — no personal data, just enough to count *unique* users. Inserts are allowed
 * for anyone (RLS), but only admins can read the stats (enforced in the RPC).
 */

const VISITOR_KEY = 'glancer:visitor-id';

// A stable, anonymous id for this browser. Used only to count unique visitors.
function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : `v_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

/* Record a single page view. Analytics must never break the page, so every
 * failure (no Supabase, network error, blocked storage) is swallowed. */
export async function recordHit(path) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase
      .from('page_hits')
      .insert({ visitor_id: visitorId(), path: (path || '/').slice(0, 300) });
  } catch {
    /* ignore — never surface analytics failures to the visitor */
  }
}

/* Admin-only: full analytics snapshot. The page_analytics() RPC raises if the
 * caller isn't an admin, so this only resolves for a signed-in admin. */
export async function getPageAnalytics() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.rpc('page_analytics');
  if (error) throw error;
  return data;
}
