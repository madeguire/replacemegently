"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  AuthError,
  getMe,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  type User,
} from "@/lib/auth-api";

interface AuthContextValue {
  user: User | null;
  isHydrating: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthCall = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        const message =
          err instanceof AuthError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Something went wrong";
        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const me = await handleAuthCall(() => apiLogin(email, password));
      setUser(me);
    },
    [handleAuthCall],
  );

  const register = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const me = await handleAuthCall(() => apiRegister(email, password, fullName));
      setUser(me);
    },
    [handleAuthCall],
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await apiLogout();
    } catch {
      // best-effort: clear local state even if the network call fails
    }
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isHydrating,
        isSubmitting,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
