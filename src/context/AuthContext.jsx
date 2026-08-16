import { createContext, useContext, useEffect, useState } from "react";
import {
  registerUser, loginUser, fetchCurrentUser, updateCurrentUser, logoutUser,
  changePassword as changePasswordService, isBackendConfigured,
} from "../utils/authService";

const AuthContext = createContext(null);

// Maps a thrown ApiError to one of our translation keys so error messages
// stay bilingual instead of showing raw server text.
function toErrorKey(err, fallback = "errorRequired") {
  const msg = (err?.message || "").toLowerCase();
  if (err?.status === 409 || msg.includes("already exists")) return "errorEmailExists";
  if (err?.status === 401 || msg.includes("incorrect")) return "errorInvalidLogin";
  if (msg.includes("8 characters")) return "errorPasswordLength";
  return fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const found = await fetchCurrentUser();
      if (found) setUser(found);
      setLoading(false);
    })();
  }, []);

  async function register(payload) {
    try {
      const user = await registerUser(payload);
      setUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: toErrorKey(err) };
    }
  }

  async function login(payload) {
    try {
      const user = await loginUser(payload);
      setUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: toErrorKey(err, "errorInvalidLogin") };
    }
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  async function updateUser(patch) {
    const updated = await updateCurrentUser(patch);
    if (updated) setUser(updated);
  }

  async function changePassword(payload) {
    try {
      await changePasswordService(payload);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateUser, changePassword, isAdmin, backendConfigured: isBackendConfigured() }}
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
