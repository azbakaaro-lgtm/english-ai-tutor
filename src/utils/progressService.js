// Data-access layer for learning progress. Progress is stored on the
// backend, tied to the user's account — not in browser localStorage —
// so it follows the user across devices and browsers.

import { apiFetch } from "./apiClient";
import { defaultProgress } from "./storage";

export async function fetchProgress() {
  try {
    const data = await apiFetch("/api/progress");
    return data.progress || defaultProgress();
  } catch (err) {
    console.error("Failed to load progress from server:", err.message);
    return defaultProgress();
  }
}

export async function persistProgress(progress) {
  try {
    await apiFetch("/api/progress", { method: "PUT", body: { progress } });
    return true;
  } catch (err) {
    console.error("Failed to save progress to server:", err.message);
    return false;
  }
}
