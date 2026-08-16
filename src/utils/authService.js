// Data-access layer for authentication. This is a real, backend-backed
// auth system: accounts, passwords (hashed server-side with bcrypt), and
// sessions (JWT) all live on the server in backend/, not in the browser.
// The app requires VITE_API_URL to be configured — see .env.example.

import { apiFetch, isBackendConfigured, setToken, clearToken } from "./apiClient";

export { isBackendConfigured };

export async function registerUser({ name, email, password, level }) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: { name, email, password, level },
    auth: false,
  });
  setToken(data.token);
  return data.user;
}

export async function loginUser({ email, password }) {
  const data = await apiFetch("/api/auth/login", { method: "POST", body: { email, password }, auth: false });
  setToken(data.token);
  return data.user;
}

export async function fetchCurrentUser() {
  if (!isBackendConfigured()) return null;
  try {
    const data = await apiFetch("/api/auth/me");
    return data.user;
  } catch {
    // token missing/expired/invalid, or backend unreachable — require a fresh login
    clearToken();
    return null;
  }
}

export async function updateCurrentUser(patch) {
  const data = await apiFetch("/api/users/me", { method: "PUT", body: patch });
  return data.user;
}

export async function changePassword({ currentPassword, newPassword }) {
  await apiFetch("/api/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });
}

export function logoutUser() {
  clearToken();
}
