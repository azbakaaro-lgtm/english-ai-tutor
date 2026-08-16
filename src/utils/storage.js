// Browser-local storage is used ONLY for UI preferences (theme, language)
// and the JWT auth token (see apiClient.js) — never for accounts or
// learning progress, which live on the backend. See authService.js and
// progressService.js for the real, server-backed data layer.

const KEYS = {
  theme: "eat_theme",
  lang: "eat_lang",
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (e.g. private mode quota) — fail silently, UI prefs just won't persist
  }
}

export function getTheme() {
  return readJSON(KEYS.theme, "light");
}
export function setTheme(theme) {
  writeJSON(KEYS.theme, theme);
}
export function getLang() {
  return readJSON(KEYS.lang, "en");
}
export function setLang(lang) {
  writeJSON(KEYS.lang, lang);
}

// --- progress shape helpers (data itself is stored server-side) ---
export function defaultProgress(level = "beginner") {
  return {
    level,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    lessonsCompleted: 0,
    lessonsThisWeek: 0,
    weekStart: startOfWeek(new Date()).toISOString(),
    quizzes: [],
    vocabLearned: [],
    favoriteWords: [],
    speakingSessions: 0,
    activityLog: [],
  };
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Call whenever the user does something lesson/quiz/speaking related.
// Handles streak increments and weekly counters.
export function touchActivity(progress) {
  const now = new Date();
  const last = progress.lastActiveDate ? new Date(progress.lastActiveDate) : null;

  if (!last || !isSameDay(last, now)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (last && isSameDay(last, yesterday)) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }
    progress.longestStreak = Math.max(progress.longestStreak || 0, progress.streak);
  }
  progress.lastActiveDate = now.toISOString();

  const weekStart = startOfWeek(now);
  if (!progress.weekStart || new Date(progress.weekStart).getTime() !== weekStart.getTime()) {
    progress.weekStart = weekStart.toISOString();
    progress.lessonsThisWeek = 0;
  }
  return progress;
}

export function logActivity(progress, type, label, meta = {}) {
  progress.activityLog = [{ type, label, date: new Date().toISOString(), meta }, ...(progress.activityLog || [])].slice(0, 30);
  return progress;
}
