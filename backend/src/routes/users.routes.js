import { Router } from "express";
import bcrypt from "bcryptjs";
import { findUserById, updateUser, getAllUsersSanitized } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

function sanitize(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

// --- self-service profile ---
router.get("/me", requireAuth, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: sanitize(user) });
});

router.put("/me", requireAuth, (req, res) => {
  const { name, level } = req.body || {};
  const patch = {};
  if (typeof name === "string" && name.trim()) patch.name = name.trim();
  if (["beginner", "intermediate", "advanced"].includes(level)) patch.level = level;

  const updated = updateUser(req.userId, patch);
  if (!updated) return res.status(404).json({ error: "User not found" });
  res.json({ user: sanitize(updated) });
});

// --- admin: manage all users, roles & permissions ---
router.get("/", requireAuth, requireAdmin, (req, res) => {
  res.json({ users: getAllUsersSanitized() });
});

router.put("/:id/permissions", requireAuth, requireAdmin, (req, res) => {
  const { permissions } = req.body || {};
  if (!permissions || typeof permissions !== "object") {
    return res.status(400).json({ error: "permissions object is required" });
  }
  const allowedKeys = ["viewContent", "createContent", "editContent", "deleteContent", "publishContent"];
  const target = findUserById(req.params.id);
  if (!target) return res.status(404).json({ error: "User not found" });

  const merged = { ...(target.permissions || {}) };
  for (const key of allowedKeys) {
    if (typeof permissions[key] === "boolean") merged[key] = permissions[key];
  }
  const updated = updateUser(req.params.id, { permissions: merged });
  res.json({ user: sanitize(updated) });
});

router.put("/:id/role", requireAuth, requireAdmin, (req, res) => {
  const { role } = req.body || {};
  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "role must be 'admin' or 'user'" });
  }
  if (req.params.id === req.userId && role !== "admin") {
    return res.status(400).json({ error: "You cannot remove your own admin role" });
  }
  const updated = updateUser(req.params.id, { role });
  if (!updated) return res.status(404).json({ error: "User not found" });
  res.json({ user: sanitize(updated) });
});

// Admin can reset any user's password (no email service required for this
// free/self-hosted setup). The admin shares the temporary password with the
// user directly; the user should change it via /api/auth/change-password.
router.post("/:id/reset-password", requireAuth, requireAdmin, async (req, res) => {
  const { newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "newPassword must be at least 8 characters" });
  }
  const target = findUserById(req.params.id);
  if (!target) return res.status(404).json({ error: "User not found" });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  updateUser(req.params.id, { passwordHash });
  res.json({ ok: true });
});

export default router;
