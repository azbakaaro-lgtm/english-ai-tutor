import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth.js";

// Produces a full admin CRUD + draft/publish router for a simple content
// collection (readings, listenings, stories). Every item follows the same
// lifecycle as lessons: created as "draft", never visible to students via
// the public routes until explicitly published, permission-checked
// server-side on every write.
export function createContentTypeRouter(api, { prefix, requiredFields = ["level", "title"] }) {
  const router = Router();
  router.use(requireAuth);

  router.get("/", requirePermission("viewContent"), (req, res) => {
    const { level, status } = req.query;
    res.json({ items: api.getAll({ level: level || null, status: status || null }) });
  });

  router.post("/", requirePermission("createContent"), (req, res) => {
    const { item } = req.body || {};
    if (!item || requiredFields.some((f) => !item[f])) {
      return res.status(400).json({ error: `${requiredFields.join(", ")} are required` });
    }
    const now = new Date().toISOString();
    const saved = api.insert({
      id: `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...item,
      status: "draft",
      createdBy: req.userId,
      createdAt: now,
      updatedAt: now,
    });
    res.status(201).json({ item: saved });
  });

  router.put("/:id", requirePermission("editContent"), (req, res) => {
    const patch = { ...(req.body?.item || {}), updatedAt: new Date().toISOString() };
    delete patch.status; // status only changes via publish/unpublish (separate permission)
    const updated = api.update(req.params.id, patch);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ item: updated });
  });

  router.post("/:id/publish", requirePermission("publishContent"), (req, res) => {
    const updated = api.update(req.params.id, { status: "published", publishedAt: new Date().toISOString() });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ item: updated });
  });

  router.post("/:id/unpublish", requirePermission("publishContent"), (req, res) => {
    const updated = api.update(req.params.id, { status: "draft" });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ item: updated });
  });

  router.delete("/:id", requirePermission("deleteContent"), (req, res) => {
    const ok = api.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  });

  return router;
}
