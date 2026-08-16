import jwt from "jsonwebtoken";
import { findUserById } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Must run after requireAuth. Only allows users whose stored role is "admin".
export function requireAdmin(req, res, next) {
  const user = findUserById(req.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// Must run after requireAuth. Admins always pass. Non-admins pass only if
// their stored permissions object has the given flag set to true. This is
// enforced here, server-side — a user can never gain access simply by
// changing anything in the browser/frontend.
export function requirePermission(permission) {
  return (req, res, next) => {
    const user = findUserById(req.userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    if (user.role === "admin") return next();
    if (user.permissions && user.permissions[permission] === true) return next();
    return res.status(403).json({ error: `Missing permission: ${permission}` });
  };
}

// Any email listed (comma-separated) in ADMIN_EMAILS becomes an admin the
// moment they register or log in. Configure this in backend/.env.
export function isAdminEmail(email) {
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes((email || "").toLowerCase());
}

// Default permission set for a newly registered, non-admin user. All false —
// an admin must explicitly grant content permissions to a user before they
// can create/edit/delete/publish anything. Admins bypass this check entirely.
export const DEFAULT_PERMISSIONS = {
  viewContent: true,
  createContent: false,
  editContent: false,
  deleteContent: false,
  publishContent: false,
};

export const ADMIN_PERMISSIONS = {
  viewContent: true,
  createContent: true,
  editContent: true,
  deleteContent: true,
  publishContent: true,
};
