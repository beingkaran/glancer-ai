import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/*
 * AuthContext — lightweight, local-first auth.
 *
 * Today it persists a Google-style profile to localStorage so it works
 * everywhere (localhost + deployed) with zero backend. The surface
 * (`login`, `logout`, `user`) is intentionally provider-agnostic so a real
 * Google Identity Services / OAuth flow can be dropped into `login()` later
 * without touching any consumer component.
 */

const AuthContext = createContext(null);
const STORAGE_KEY = 'glancer_auth_user';

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // Accepts a raw profile { name, email, picture?, provider? } from whatever
  // sign-in flow produced it (mock Google modal today, real OAuth tomorrow).
  const login = useCallback((profile) => {
    if (!profile?.email) throw new Error('login requires an email');
    const normalized = {
      id: profile.email.trim().toLowerCase(),
      name: profile.name?.trim() || profile.email.split('@')[0],
      email: profile.email.trim().toLowerCase(),
      picture: profile.picture || null,
      provider: profile.provider || 'google',
      createdAt: new Date().toISOString(),
    };
    setUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = { user, login, logout, isAuthed: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
