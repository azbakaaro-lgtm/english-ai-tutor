import { Router } from "express";
import { getLessons, getVocabulary, readingsApi, listeningsApi, storiesApi } from "../db.js";

const router = Router();

// Public, read-only — students (even logged out) see only PUBLISHED
// content. Drafts are never exposed here, no matter how the request is
// made — this is enforced server-side, not by hiding a button in the UI.
router.get("/lessons", (req, res) => {
  const { level } = req.query;
  res.json({ lessons: getLessons({ level: level || null, status: "published" }) });
});

router.get("/vocabulary", (req, res) => {
  const { level } = req.query;
  const words = getVocabulary(level || null).filter((v) => (v.status || "published") === "published");
  res.json({ vocabulary: words });
});

router.get("/readings", (req, res) => {
  const { level } = req.query;
  res.json({ items: readingsApi.getAll({ level: level || null, status: "published" }) });
});

router.get("/listenings", (req, res) => {
  const { level } = req.query;
  res.json({ items: listeningsApi.getAll({ level: level || null, status: "published" }) });
});

router.get("/stories", (req, res) => {
  const { level } = req.query;
  res.json({ items: storiesApi.getAll({ level: level || null, status: "published" }) });
});

export default router;
