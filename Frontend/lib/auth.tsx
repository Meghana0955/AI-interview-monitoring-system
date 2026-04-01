"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface AuthUser {
  email: string;
  role: "student" | "admin";
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

/* ─── Context ────────────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

const TOKEN_KEY = "aisms_token";
const USER_KEY  = "aisms_user";

/* ─── Provider ───────────────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const token    = localStorage.getItem(TOKEN_KEY);
      const rawUser  = localStorage.getItem(USER_KEY);
      if (token && rawUser) {
        setUser(JSON.parse(rawUser) as AuthUser);
      }
    } catch {
      // corrupted storage — ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((authUser: AuthUser, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */
export function useAuth() {
  return useContext(AuthContext);
}
