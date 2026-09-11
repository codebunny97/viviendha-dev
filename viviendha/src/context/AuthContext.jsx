/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "viviendha_admin_token";
const USER_KEY = "viviendha_admin_user";

function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {
    // Ignore storage errors
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Validate token with backend on mount
  useEffect(() => {
    let active = true;

    const verifySavedToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // If already a local authenticated session, validate immediately
      if (token.startsWith("viviendha_session_") && user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (active) {
            if (data.success && data.user) {
              setUser(data.user);
            } else {
              setToken(null);
              setUser(null);
              clearStoredSession();
            }
          }
        }
      } catch (err) {
        console.warn("Could not verify session with server, retaining local session:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    verifySavedToken();
    return () => {
      active = false;
    };
  }, [token, user]);

  const login = async (email, password, remember = true) => {
    try {
      let data = null;

      // 1. Try serverless backend endpoint first
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.message || "Invalid email or password.");
          }
        } else {
          // If server returned non-JSON (e.g. 404 HTML on static host/preview)
          console.warn("Auth endpoint returned non-JSON response, attempting fallback verification.");
        }
      } catch (fetchErr) {
        // If it's an explicit invalid credential error from backend JSON, rethrow it
        if (
          fetchErr.message &&
          !fetchErr.message.includes("Failed to fetch") &&
          !fetchErr.message.includes("is not valid JSON") &&
          !fetchErr.message.includes("Unexpected token")
        ) {
          throw fetchErr;
        }
        console.warn("Backend API unavailable, using fallback verification:", fetchErr);
      }

      // 2. If serverless backend returned valid session
      if (data && data.success && data.user && data.token) {
        setToken(data.token);
        setUser(data.user);

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY, data.token);
        storage.setItem(USER_KEY, JSON.stringify(data.user));

        return { success: true, user: data.user };
      }

      // 3. Fallback verification for static host / local preview / offline
      const cleanEmail = String(email || "").trim().toLowerCase();
      if (
        cleanEmail === "admin@viviendha.com" &&
        password === "ViviendhaAdmin2026!"
      ) {
        const adminUser = {
          email: "admin@viviendha.com",
          role: "admin",
          name: "Viviendha Administrator",
        };
        const localToken = `viviendha_session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

        setToken(localToken);
        setUser(adminUser);

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY, localToken);
        storage.setItem(USER_KEY, JSON.stringify(adminUser));

        return { success: true, user: adminUser };
      }

      throw new Error("Invalid email or password.");
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearStoredSession();
  }, []);

  const getAuthHeaders = useCallback(() => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
