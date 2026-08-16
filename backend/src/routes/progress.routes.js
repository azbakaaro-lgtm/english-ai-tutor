import { Router } from "express";
import { getProgress, saveProgress } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function defaultProgress() {
  return {
    level: "beginner",
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    lessonsCompleted: 0,
    lessonsThisWeek: 0,
    weekStart: new Date().toISOString(),
    quizzes: [],
    vocabLearned: [],
    favoriteWords: [],
    speakingSessions: 0,
    activityLog: [],
  };
}

router.get("/", requireAuth, (req, res) => {
  const progress = getProgress(req.userId) || defaultProgress();
  res.json({ progress });
});

router.put("/", requireAuth, (req, res) => {
  const { progress } = req.body || {};
  if (!progress || typeof progress !== "object") {
    return res.status(400).json({ error: "progress object is required" });
  }
  const saved = saveProgress(req.userId, progress);
  res.json({ progress: saved });
});

export default router;
