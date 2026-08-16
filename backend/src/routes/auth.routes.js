import { Router } from "express";
import bcrypt from "bcryptjs";
import { findUserByEmail, findUserById, insertUser, updateUser } from "../db.js";
import { signToken, requireAuth, isAdminEmail, DEFAULT_PERMISSIONS, ADMIN_PERMISSIONS } from "../middleware/auth.js";

const router = Router();

const LEVELS = ["beginner", "intermediate", "advanced"];

function sanitize(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

router.post("/register", async (req, res) => {
  const { name, email, password, level } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const isAdmin = isAdminEmail(email);
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  const user = {
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    passwordHash,
    level: LEVELS.includes(level) ? level : "beginner",
    role: isAdmin ? "admin" : "user",
    permissions: isAdmin ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS,
    createdAt: now,
    updatedAt: now,
  };
  insertUser(user);

  const token = signToken(user.id);
  res.status(201).json({ token, user: sanitize(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });

  const user = findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Incorrect email or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Incorrect email or password" });

  // Promote to admin on login too, in case ADMIN_EMAILS was set/changed after this account was created.
  let effectiveUser = user;
  if (isAdminEmail(user.email) && user.role !== "admin") {
    effectiveUser = updateUser(user.id, { role: "admin", permissions: ADMIN_PERMISSIONS }) || user;
  }
  // Backfill permissions for accounts created before this field existed.
  if (!effectiveUser.permissions) {
    effectiveUser = updateUser(effectiveUser.id, {
      permissions: effectiveUser.role === "admin" ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS,
    }) || effectiveUser;
  }

  const token = signToken(effectiveUser.id);
  res.json({ token, user: sanitize(effectiveUser) });
});

router.get("/me", requireAuth, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: sanitize(user) });
});

// Basic password change while logged in (requires the current password).
// Note: a full "forgot password via email" flow needs an email-sending
// service, which is out of scope for this free/self-hosted setup — an
// admin can reset any user's password from the Admin > Users panel instead.
router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Current password is incorrect" });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  updateUser(user.id, { passwordHash });
  res.json({ ok: true });
});

export default router;
