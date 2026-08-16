import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import contentRoutes from "./routes/content.routes.js";
import { createContentTypeRouter } from "./routes/contentType.routes.js";
import { readingsApi, listeningsApi, storiesApi } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5050;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: "free-local-backend", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/readings", createContentTypeRouter(readingsApi, { prefix: "reading" }));
app.use("/api/admin/listenings", createContentTypeRouter(listeningsApi, { prefix: "listening" }));
app.use("/api/admin/stories", createContentTypeRouter(storiesApi, { prefix: "story" }));
app.use("/api", contentRoutes); // GET /api/lessons, /api/vocabulary, /api/readings, /api/listenings, /api/stories (public)

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`English AI Tutor backend (free, no paid APIs) running on http://localhost:${PORT}`);
});
