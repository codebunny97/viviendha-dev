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

      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get("content-type") || "";
        let data = null;
        if (contentType.includes("application/json")) {
          try {
            data = await res.json();
          } catch {
            data = null;
          }
        }

        if (active) {
          if (res.ok && data?.success && data?.user) {
            setUser(data.user);
          } else {
            // Token is expired, invalid, or server returned unauthorized
            setToken(null);
            setUser(null);
            clearStoredSession();
          }
        }
      } catch (err) {
        console.warn("Could not verify session with server:", err);
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
  }, [token]);

  const login = async (email, password, remember = true) => {
    try {
      const cleanEmail = String(email || "").trim().toLowerCase();
      if (!cleanEmail || !password) {
        throw new Error("Email and password are required.");
      }

      // Strictly authenticate through serverless backend endpoint
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      // Defensive JSON response handling to prevent Unexpected Token errors
      const contentType = res.headers.get("content-type") || "";
      let data = null;
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!res.ok || !data?.success) {
        const message =
          data?.message ||
          (res.status === 404
            ? "Authentication endpoint not found (404). Please ensure backend deployment and routes are configured."
            : res.status === 401
            ? "Invalid admin email or password."
            : res.status === 500
            ? "Authentication service error. Please verify server environment variables."
            : `Authentication failed (HTTP ${res.status}).`);
        throw new Error(message);
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid response format received from authentication server.");
      }

      setToken(data.token);
      setUser(data.user);

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY, data.token);
      storage.setItem(USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || "An unexpected error occurred during login." };
    }
  };

  const logout = useCallback(() => {
    if (token) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }
    setToken(null);
    setUser(null);
    clearStoredSession();
  }, [token]);

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
