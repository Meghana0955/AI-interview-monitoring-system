"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, apiMe, apiLogin, apiRegister, RegisterData } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: RegisterData) => Promise<UserProfile>;
  loginWithToken: (user: UserProfile, token: string) => void;
  updateUser: (updatedUser: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  login: async () => {
    throw new Error("Auth provider not mounted");
  },
  register: async () => {
    throw new Error("Auth provider not mounted");
  },
  loginWithToken: () => {},
  updateUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    async function restore() {
      try {
        const storedToken = localStorage.getItem("aisms_token");
        const storedUser = localStorage.getItem("aisms_user");

        if (storedToken && storedUser) {
          // Restore immediately from localStorage for fast UX
          const parsedUser = JSON.parse(storedUser) as UserProfile;
          setToken(storedToken);
          setUser(parsedUser);

          // Verify token with backend (non-blocking — update if valid)
          apiMe().then((freshUser) => {
            if (freshUser) {
              setUser(freshUser);
              localStorage.setItem("aisms_user", JSON.stringify(freshUser));
            } else {
              // Token invalid — clear session
              setUser(null);
              setToken(null);
              localStorage.removeItem("aisms_token");
              localStorage.removeItem("aisms_user");
            }
          });
        }
      } catch {
        localStorage.removeItem("aisms_token");
        localStorage.removeItem("aisms_user");
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  const loginWithToken = (newUser: UserProfile, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("aisms_token", newToken);
    localStorage.setItem("aisms_user", JSON.stringify(newUser));
  };

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const { user: loggedInUser, token: newToken } = await apiLogin(email, password);
    loginWithToken(loggedInUser, newToken);
    return loggedInUser;
  };

  const register = async (data: RegisterData): Promise<UserProfile> => {
    const { user: registeredUser, token: newToken } = await apiRegister(data);
    loginWithToken(registeredUser, newToken);
    return registeredUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("aisms_token");
    localStorage.removeItem("aisms_user");
    router.push("/");
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem("aisms_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, token, loading, login, register, loginWithToken, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
