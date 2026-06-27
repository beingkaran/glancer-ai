import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/*
 * AuthContext — real email/password auth backed by Supabase.
 *
 * Passwords are hashed and verified server-side by Supabase Auth; the browser
 * only ever holds a session token. Every consumer reads `user` (with an
 * `isAdmin` flag) and calls `signIn` / `signUp` / `logout`.
 */

const AuthContext = createContext(null);

function avatarFor(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || 'User',
  )}&background=7C3AED&color=fff&bold=true&size=128`;
}

// Build the app-facing user object from a Supabase session + profile row.
function mapUser(sessionUser, profile) {
  if (!sessionUser) return null;
  const name =
    profile?.name || sessionUser.user_metadata?.name || sessionUser.email.split('@')[0];
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    name,
    isAdmin: !!profile?.is_admin,
    picture: avatarFor(name),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the profile row (name + is_admin) for a given auth user.
  const loadProfile = useCallback(async (sessionUser) => {
    if (!sessionUser) return setUser(null);
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, is_admin')
      .eq('id', sessionUser.id)
      .maybeSingle();
    setUser(mapUser(sessionUser, profile));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let active = true;

    // 1. Restore any existing session on load.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      await loadProfile(session?.user ?? null);
      setLoading(false);
    });

    // 2. React to sign-in / sign-out / token refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = useCallback(async ({ name, email, password, captchaToken }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { name: name?.trim() || '' }, captchaToken },
    });
    if (error) throw error;
    // If email confirmation is ON, there is no session yet — caller shows a
    // "check your inbox" message. If it's OFF, the session arrives immediately.
    return { needsConfirmation: !data.session, user: data.user };
  }, []);

  const signIn = useCallback(async ({ email, password, captchaToken }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
      options: { captchaToken },
    });
    if (error) throw error;
  }, []);

  // Send a password-reset email. The link lands the user on /reset-password,
  // where Supabase fires a PASSWORD_RECOVERY session and they set a new one.
  const resetPassword = useCallback(async ({ email, captchaToken }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/reset-password`, captchaToken },
    );
    if (error) throw error;
  }, []);

  // Set a new password for the currently-recovered (or signed-in) user.
  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase?.auth.signOut();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthed: !!user,
    isAdmin: !!user?.isAdmin,
    configured: isSupabaseConfigured,
    signUp,
    signIn,
    resetPassword,
    updatePassword,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
