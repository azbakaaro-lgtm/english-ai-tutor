import { Router } from "express";
import { requireAuth, requireAdmin, requirePermission } from "../middleware/auth.js";
import {
  getLessons,
  insertLesson,
  updateLesson,
  deleteLesson,
  countLessonsByLevel,
  getVocabulary,
  insertVocabulary,
  updateVocabularyWord,
  deleteVocabularyWord,
  getUsers,
} from "../db.js";
import { generateLessonContent, generateVocabularyBatch, isAIConfigured } from "../services/aiGenerate.js";

const router = Router();

router.use(requireAuth);

// --- targets & stats (admin only) ---
const TARGETS = { beginner: 20, intermediate: 10, advanced: 10, vocabulary: 100 };

router.get("/stats", requireAdmin, (req, res) => {
  const lessonsByLevel = countLessonsByLevel();
  const vocabCount = getVocabulary().length;
  const published = getLessons({ status: "published" }).length;
  const drafts = getLessons({ status: "draft" }).length;
  res.json({
    targets: TARGETS,
    lessonsByLevel,
    vocabCount,
    published,
    drafts,
    totalUsers: getUsers().length,
    aiConfigured: isAIConfigured(),
  });
});

// --- lessons ---
// Anyone with viewContent can see all lessons (including drafts) in the
// admin area — needed so editors can find their own drafts to work on.
router.get("/lessons", requirePermission("viewContent"), (req, res) => {
  const { level, status } = req.query;
  res.json({ lessons: getLessons({ level: level || null, status: status || null }) });
});

// Generation is an OPTIONAL convenience only — it always works for free
// (falls back to a deterministic template with zero setup), and is never
// required: admins/editors can just as easily fill in the lesson fields
// by hand and save directly without calling this endpoint at all.
router.post("/lessons/generate", requirePermission("createContent"), async (req, res) => {
  const { level, topic } = req.body || {};
  if (!level || !topic) return res.status(400).json({ error: "level and topic are required" });
  try {
    const lesson = await generateLessonContent(level, topic);
    res.json({ lesson });
  } catch (err) {
    res.status(500).json({ error: "Generation failed: " + err.message });
  }
});

router.post("/lessons", requirePermission("createContent"), (req, res) => {
  const { lesson } = req.body || {};
  if (!lesson || !lesson.level || !lesson.topic) {
    return res.status(400).json({ error: "A lesson object with level and topic is required" });
  }
  const now = new Date().toISOString();
  const saved = insertLesson({
    id: `lesson_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...lesson,
    status: "draft", // every new lesson starts as a draft — must be explicitly published
    createdBy: req.userId,
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json({ lesson: saved });
});

router.put("/lessons/:id", requirePermission("editContent"), (req, res) => {
  const patch = { ...(req.body?.lesson || {}), updatedAt: new Date().toISOString() };
  delete patch.status; // status changes only via publish/unpublish, which check a separate permission
  const updated = updateLesson(req.params.id, patch);
  if (!updated) return res.status(404).json({ error: "Lesson not found" });
  res.json({ lesson: updated });
});

router.post("/lessons/:id/publish", requirePermission("publishContent"), (req, res) => {
  const updated = updateLesson(req.params.id, { status: "published", publishedAt: new Date().toISOString() });
  if (!updated) return res.status(404).json({ error: "Lesson not found" });
  res.json({ lesson: updated });
});

router.post("/lessons/:id/unpublish", requirePermission("publishContent"), (req, res) => {
  const updated = updateLesson(req.params.id, { status: "draft" });
  if (!updated) return res.status(404).json({ error: "Lesson not found" });
  res.json({ lesson: updated });
});

router.delete("/lessons/:id", requirePermission("deleteContent"), (req, res) => {
  const ok = deleteLesson(req.params.id);
  if (!ok) return res.status(404).json({ error: "Lesson not found" });
  res.json({ ok: true });
});

// --- vocabulary ---
router.get("/vocabulary", requirePermission("viewContent"), (req, res) => {
  const { level } = req.query;
  res.json({ vocabulary: getVocabulary(level || null) });
});

router.post("/vocabulary/generate", requirePermission("createContent"), async (req, res) => {
  const { level, count, topic } = req.body || {};
  if (!level) return res.status(400).json({ error: "level is required" });
  try {
    const words = await generateVocabularyBatch(level, Math.min(Number(count) || 10, 30), topic || "general");
    res.json({ words });
  } catch (err) {
    res.status(500).json({ error: "Generation failed: " + err.message });
  }
});

router.post("/vocabulary", requirePermission("createContent"), (req, res) => {
  const { words } = req.body || {};
  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: "words array is required" });
  }
  const now = new Date().toISOString();
  const withIds = words.map((w) => ({
    id: w.id || `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    word: w.word,
    somali: w.somali,
    example: w.example,
    pronunciation: w.pronunciation || "",
    level: w.level || "beginner",
    topic: w.topic || "general",
    status: "published",
    createdBy: req.userId,
    createdAt: now,
  }));
  const saved = insertVocabulary(withIds);
  res.status(201).json({ vocabulary: saved });
});

router.put("/vocabulary/:id", requirePermission("editContent"), (req, res) => {
  const updated = updateVocabularyWord(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: "Word not found" });
  res.json({ word: updated });
});

router.delete("/vocabulary/:id", requirePermission("deleteContent"), (req, res) => {
  const ok = deleteVocabularyWord(req.params.id);
  if (!ok) return res.status(404).json({ error: "Word not found" });
  res.json({ ok: true });
});

export default router;
