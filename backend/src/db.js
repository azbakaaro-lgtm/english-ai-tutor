// Minimal file-based persistence layer. Keeps the backend dependency-free
// of any database server — everything is stored in a single JSON file on
// disk, which is enough for a self-hosted / small-classroom deployment of
// English AI Tutor. Swap this module out for Postgres/Mongo later if you
// outgrow it; the route files only talk to the functions exported here.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const DB_FILE = join(DATA_DIR, "db.json");

const EMPTY_DB = { users: [], progress: {}, lessons: [], vocabulary: [], readings: [], listenings: [], stories: [] };

function ensureDb() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DB_FILE)) {
    writeFileSync(DB_FILE, JSON.stringify(EMPTY_DB, null, 2));
  }
}

function read() {
  ensureDb();
  try {
    const data = JSON.parse(readFileSync(DB_FILE, "utf-8"));
    // fill in any collections missing from an older db.json
    return { ...EMPTY_DB, ...data };
  } catch {
    return { ...EMPTY_DB };
  }
}

function write(data) {
  ensureDb();
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- users ---
export function getUsers() {
  return read().users;
}

export function findUserByEmail(email) {
  return read().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  return read().users.find((u) => u.id === id);
}

export function insertUser(user) {
  const db = read();
  db.users.push(user);
  write(db);
  return user;
}

export function updateUser(id, patch) {
  const db = read();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...patch, updatedAt: new Date().toISOString() };
  write(db);
  return db.users[idx];
}

export function getAllUsersSanitized() {
  const db = read();
  return db.users.map(({ passwordHash, ...rest }) => rest); // eslint-disable-line no-unused-vars
}

// --- progress ---
export function getProgress(userId) {
  const db = read();
  return db.progress[userId] || null;
}

export function saveProgress(userId, progress) {
  const db = read();
  db.progress[userId] = progress;
  write(db);
  return progress;
}

// --- lessons (admin-authored, shared with all students) ---
// status: "draft" | "published"
export function getLessons({ level = null, status = null } = {}) {
  const db = read();
  return db.lessons.filter((l) => (level ? l.level === level : true) && (status ? l.status === status : true));
}

export function findLessonById(id) {
  return read().lessons.find((l) => l.id === id);
}

export function insertLesson(lesson) {
  const db = read();
  db.lessons.push(lesson);
  write(db);
  return lesson;
}

export function updateLesson(id, patch) {
  const db = read();
  const idx = db.lessons.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  db.lessons[idx] = { ...db.lessons[idx], ...patch };
  write(db);
  return db.lessons[idx];
}

export function deleteLesson(id) {
  const db = read();
  const before = db.lessons.length;
  db.lessons = db.lessons.filter((l) => l.id !== id);
  write(db);
  return db.lessons.length < before;
}

export function countLessonsByLevel() {
  const db = read();
  return {
    beginner: db.lessons.filter((l) => l.level === "beginner").length,
    intermediate: db.lessons.filter((l) => l.level === "intermediate").length,
    advanced: db.lessons.filter((l) => l.level === "advanced").length,
  };
}

// --- vocabulary (admin-authored, shared with all students) ---
export function getVocabulary(level = null) {
  const db = read();
  return level ? db.vocabulary.filter((v) => v.level === level) : db.vocabulary;
}

export function insertVocabulary(words) {
  const db = read();
  const list = Array.isArray(words) ? words : [words];
  db.vocabulary.push(...list);
  write(db);
  return list;
}

export function updateVocabularyWord(id, patch) {
  const db = read();
  const idx = db.vocabulary.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  db.vocabulary[idx] = { ...db.vocabulary[idx], ...patch };
  write(db);
  return db.vocabulary[idx];
}

export function deleteVocabularyWord(id) {
  const db = read();
  const before = db.vocabulary.length;
  db.vocabulary = db.vocabulary.filter((v) => v.id !== id);
  write(db);
  return db.vocabulary.length < before;
}

// --- generic content collections (readings, listenings, stories) ---
// Same shape/lifecycle as lessons (draft -> published, createdBy, timestamps)
// but simpler schema. One factory avoids writing three near-identical CRUD
// modules by hand.
function makeContentCollection(key) {
  return {
    getAll({ level = null, status = null } = {}) {
      const db = read();
      return db[key].filter((item) => (level ? item.level === level : true) && (status ? item.status === status : true));
    },
    findById(id) {
      return read()[key].find((item) => item.id === id);
    },
    insert(item) {
      const db = read();
      db[key].push(item);
      write(db);
      return item;
    },
    update(id, patch) {
      const db = read();
      const idx = db[key].findIndex((item) => item.id === id);
      if (idx === -1) return null;
      db[key][idx] = { ...db[key][idx], ...patch };
      write(db);
      return db[key][idx];
    },
    remove(id) {
      const db = read();
      const before = db[key].length;
      db[key] = db[key].filter((item) => item.id !== id);
      write(db);
      return db[key].length < before;
    },
    count() {
      return read()[key].length;
    },
  };
}

export const readingsApi = makeContentCollection("readings");
export const listeningsApi = makeContentCollection("listenings");
export const storiesApi = makeContentCollection("stories");
