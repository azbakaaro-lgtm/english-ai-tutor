// Data-access layer for the Admin Dashboard. Unlike auth/progress, admin
// features require the backend (shared, multi-user content management
// only makes sense with a real server) — every function here throws if
// the backend isn't configured, and the UI shows a clear message for that.

import { apiFetch, isBackendConfigured } from "./apiClient";

export { isBackendConfigured };

export async function fetchStats() {
  const data = await apiFetch("/api/admin/stats");
  return data;
}

export async function fetchAdminLessons(level, status) {
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (status) params.set("status", status);
  const q = params.toString() ? `?${params.toString()}` : "";
  const data = await apiFetch(`/api/admin/lessons${q}`);
  return data.lessons;
}

export async function generateLessonDraft(level, topic) {
  const data = await apiFetch("/api/admin/lessons/generate", { method: "POST", body: { level, topic } });
  return data.lesson;
}

export async function saveLesson(lesson) {
  const data = await apiFetch("/api/admin/lessons", { method: "POST", body: { lesson } });
  return data.lesson;
}

export async function updateLessonById(id, lesson) {
  const data = await apiFetch(`/api/admin/lessons/${id}`, { method: "PUT", body: { lesson } });
  return data.lesson;
}

export async function deleteLessonById(id) {
  await apiFetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
}

export async function fetchAdminVocabulary(level) {
  const q = level ? `?level=${encodeURIComponent(level)}` : "";
  const data = await apiFetch(`/api/admin/vocabulary${q}`);
  return data.vocabulary;
}

export async function generateVocabularyDraft(level, count, topic) {
  const data = await apiFetch("/api/admin/vocabulary/generate", { method: "POST", body: { level, count, topic } });
  return data.words;
}

export async function saveVocabulary(words) {
  const data = await apiFetch("/api/admin/vocabulary", { method: "POST", body: { words } });
  return data.vocabulary;
}

export async function deleteVocabularyById(id) {
  await apiFetch(`/api/admin/vocabulary/${id}`, { method: "DELETE" });
}

// --- publish workflow ---
export async function publishLesson(id) {
  const data = await apiFetch(`/api/admin/lessons/${id}/publish`, { method: "POST" });
  return data.lesson;
}

export async function unpublishLesson(id) {
  const data = await apiFetch(`/api/admin/lessons/${id}/unpublish`, { method: "POST" });
  return data.lesson;
}

// --- users & permissions (admin only) ---
export async function fetchUsers() {
  const data = await apiFetch("/api/users");
  return data.users;
}

export async function updateUserPermissions(id, permissions) {
  const data = await apiFetch(`/api/users/${id}/permissions`, { method: "PUT", body: { permissions } });
  return data.user;
}

export async function updateUserRole(id, role) {
  const data = await apiFetch(`/api/users/${id}/role`, { method: "PUT", body: { role } });
  return data.user;
}

export async function resetUserPassword(id, newPassword) {
  await apiFetch(`/api/users/${id}/reset-password`, { method: "POST", body: { newPassword } });
}

// --- generic content types (readings, listenings, stories) ---
function contentTypeService(basePath) {
  return {
    fetchAll: async (level, status) => {
      const params = new URLSearchParams();
      if (level) params.set("level", level);
      if (status) params.set("status", status);
      const q = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`${basePath}${q}`);
      return data.items;
    },
    create: async (item) => (await apiFetch(basePath, { method: "POST", body: { item } })).item,
    update: async (id, item) => (await apiFetch(`${basePath}/${id}`, { method: "PUT", body: { item } })).item,
    publish: async (id) => (await apiFetch(`${basePath}/${id}/publish`, { method: "POST" })).item,
    unpublish: async (id) => (await apiFetch(`${basePath}/${id}/unpublish`, { method: "POST" })).item,
    remove: async (id) => {
      await apiFetch(`${basePath}/${id}`, { method: "DELETE" });
    },
  };
}

export const readingsAdmin = contentTypeService("/api/admin/readings");
export const listeningsAdmin = contentTypeService("/api/admin/listenings");
export const storiesAdmin = contentTypeService("/api/admin/stories");
