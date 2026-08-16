// Fetches admin-published content (lessons, vocabulary, readings,
// listenings, stories) that students see. Only PUBLISHED items are ever
// returned by these endpoints — drafts are never exposed here.
//
// These calls degrade gracefully (return an empty list) on any failure —
// auth still strictly requires the backend, but a transient hiccup loading
// a content list shouldn't crash the page; it just shows an empty state.

import { apiFetch } from "./apiClient";

export async function fetchPublicLessons(level) {
  try {
    const q = level ? `?level=${encodeURIComponent(level)}` : "";
    const data = await apiFetch(`/api/lessons${q}`, { auth: false });
    return data.lessons || [];
  } catch {
    return [];
  }
}

export async function fetchPublicVocabulary(level) {
  try {
    const q = level ? `?level=${encodeURIComponent(level)}` : "";
    const data = await apiFetch(`/api/vocabulary${q}`, { auth: false });
    return data.vocabulary || [];
  } catch {
    return [];
  }
}

function publicListFetcher(basePath) {
  return async (level) => {
    try {
      const q = level ? `?level=${encodeURIComponent(level)}` : "";
      const data = await apiFetch(`${basePath}${q}`, { auth: false });
      return data.items || [];
    } catch {
      return [];
    }
  };
}

export const fetchPublicReadings = publicListFetcher("/api/readings");
export const fetchPublicListenings = publicListFetcher("/api/listenings");
export const fetchPublicStories = publicListFetcher("/api/stories");
