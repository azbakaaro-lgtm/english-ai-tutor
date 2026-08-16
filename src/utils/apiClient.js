// Thin fetch wrapper for the backend API (required — see .env.example).
// No paid API is ever involved — this only ever talks to the free
// Node/Express server in /backend.
//
// Note on free hosting tiers (e.g. Render's free plan): the server can
// "spin down" after inactivity and take 50+ seconds to wake back up on the
// next request. The default timeout below is generous enough to survive
// that cold start; see also warmUpBackend() below, called once on app load
// to start waking the server early so real user actions feel fast.

export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export function isBackendConfigured() {
  return Boolean(API_URL);
}

const TOKEN_KEY = "eat_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// 65s default — comfortably covers a cold-started free-tier backend (Render
// et al. document worst-case wake times around 50s) plus the actual request.
export async function apiFetch(path, { method = "GET", body, auth = true, timeout = 65000 } = {}) {
  if (!API_URL) throw new ApiError("Backend not configured", 0);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = { "Content-Type": "application/json" };
    if (auth) {
      const token = getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);

    let data = null;
    try {
      data = await res.json();
    } catch {
      // no JSON body
    }

    if (!res.ok) {
      throw new ApiError(data?.error || `Request failed (${res.status})`, res.status);
    }
    return data;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new ApiError("Backend request timed out", 0);
    throw err instanceof ApiError ? err : new ApiError(err.message || "Network error", 0);
  }
}

// Fire-and-forget ping to wake a sleeping free-tier backend as early as
// possible (e.g. call once when the app first loads), so that by the time
// the person actually submits a form the server is more likely awake
// already. Deliberately swallows all errors — this is best-effort only.
export function warmUpBackend() {
  if (!API_URL) return;
  fetch(`${API_URL}/api/health`).catch(() => {});
}

export { ApiError };
