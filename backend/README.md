# English AI Tutor — Backend (optional, free)

A minimal, dependency-light Node/Express API that gives the frontend
persistent, multi-device accounts instead of browser-only Demo Mode.
Storage is a single JSON file on disk — no database server to install, no
paid service, no API key.

The frontend works perfectly well **without** this backend. Only set it up
if you want accounts that follow a user across devices/browsers.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# open .env and set a real JWT_SECRET before deploying anywhere public
npm start
```

The server starts on `http://localhost:5050` by default (configurable via
`PORT` in `.env`).

For local development with auto-restart on file changes:

```bash
npm run dev
```

## Connecting the frontend

In the project root (not `backend/`):

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_API_URL=http://localhost:5050
```

Restart `npm run dev` (or rebuild with `npm run build`). The frontend will
now register/login/save progress against this backend. If the backend is
ever unreachable, the frontend automatically and silently falls back to
local Demo Mode so the app never breaks for the user.

## Data storage

All data lives in `backend/data/db.json`, created automatically on first
run:

```json
{
  "users": [ { "id", "name", "email", "passwordHash", "level", "createdAt" } ],
  "progress": { "<userId>": { "streak", "lessonsCompleted", "quizzes", ... } }
}
```

Passwords are hashed with bcrypt before storage — plaintext passwords are
never written to disk. This file is a fine store for a personal project,
classroom, or small deployment. For larger deployments, swap `src/db.js`
for a real database — every route only talks to the functions exported
from that one file, so the rest of the app doesn't need to change.

## API reference

All endpoints are JSON in, JSON out. Authenticated endpoints expect
`Authorization: Bearer <token>`.

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| GET | `/api/health` | No | — | Health check |
| POST | `/api/auth/register` | No | `{ name, email, password, level? }` | Create account, returns `{ token, user }` |
| POST | `/api/auth/login` | No | `{ email, password }` | Returns `{ token, user }` |
| GET | `/api/auth/me` | Yes | — | Returns `{ user }` |
| GET | `/api/users/me` | Yes | — | Same as above |
| PUT | `/api/users/me` | Yes | `{ name?, level? }` | Update profile, returns `{ user }` |
| GET | `/api/progress` | Yes | — | Returns `{ progress }` |
| PUT | `/api/progress` | Yes | `{ progress }` | Replaces stored progress, returns `{ progress }` |
| GET | `/api/lessons` | No | — | Public: all admin-saved lessons (optional `?level=`) |
| GET | `/api/vocabulary` | No | — | Public: all admin-saved vocabulary (optional `?level=`) |
| GET | `/api/admin/stats` | Admin | — | Content targets + counts + AI status |
| GET | `/api/admin/lessons` | Admin | — | Admin's saved lessons (optional `?level=`) |
| POST | `/api/admin/lessons/generate` | Admin | `{ level, topic }` | Generates a lesson draft (not saved) via AI or template |
| POST | `/api/admin/lessons` | Admin | `{ lesson }` | Saves a lesson |
| PUT | `/api/admin/lessons/:id` | Admin | `{ lesson }` | Updates a saved lesson |
| DELETE | `/api/admin/lessons/:id` | Admin | — | Deletes a lesson |
| GET | `/api/admin/vocabulary` | Admin | — | Admin's saved vocabulary (optional `?level=`) |
| POST | `/api/admin/vocabulary/generate` | Admin | `{ level, count, topic }` | Generates vocabulary draft (not saved) |
| POST | `/api/admin/vocabulary` | Admin | `{ words: [...] }` | Saves a batch of words |
| DELETE | `/api/admin/vocabulary/:id` | Admin | — | Deletes a word |
| GET | `/api/readings` / `/api/listenings` / `/api/stories` | No | — | Public: published items (optional `?level=`) |
| GET | `/api/admin/readings` / `.../listenings` / `.../stories` | `viewContent` | — | All items incl. drafts (optional `?level=&status=`) |
| POST | `.../readings` etc. | `createContent` | `{ item }` | Creates a new draft |
| PUT | `.../readings/:id` etc. | `editContent` | `{ item }` | Updates an item |
| POST | `.../readings/:id/publish` etc. | `publishContent` | — | Publishes an item |
| POST | `.../readings/:id/unpublish` etc. | `publishContent` | — | Reverts to draft |
| DELETE | `.../readings/:id` etc. | `deleteContent` | — | Deletes an item |
| GET | `/api/users` | Admin | — | List all users |
| PUT | `/api/users/:id/permissions` | Admin | `{ permissions }` | Update a user's content permissions |
| PUT | `/api/users/:id/role` | Admin | `{ role }` | Set role to `admin` or `user` |
| POST | `/api/users/:id/reset-password` | Admin | `{ newPassword }` | Reset any user's password |
| POST | `/api/auth/change-password` | Yes | `{ currentPassword, newPassword }` | Change your own password |

Admin/permission-gated endpoints require the account's `role` to be
`"admin"`, **or** the specific permission flag (`viewContent`,
`createContent`, `editContent`, `deleteContent`, `publishContent`) to be
`true` on that user — see "Permissions model" in the main
[README](../README.md). This is enforced in `src/middleware/auth.js`,
server-side, on every request — not just hidden in the UI.

### Example: register + save progress

```bash
curl -X POST http://localhost:5050/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Amina","email":"amina@example.com","password":"secret123","level":"beginner"}'

# -> { "token": "...", "user": { "id": "...", "name": "Amina", ... } }

curl -X PUT http://localhost:5050/api/progress \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"progress":{"level":"beginner","streak":1,"lessonsCompleted":1}}'
```

## Environment variables

See `.env.example`:

- `PORT` — port to listen on (default `5050`)
- `JWT_SECRET` — signing secret for auth tokens (**change this before any
  real deployment**)
- `CORS_ORIGIN` — allowed frontend origin(s); `*` for local dev
- `ADMIN_EMAILS` — comma-separated emails that get admin access automatically
- `GROQ_API_KEY` / `GROQ_MODEL` — optional, free Groq key for AI-generated
  lessons/vocabulary in the Admin Dashboard (leave blank to use the free
  built-in template generator instead)

## Deploying for free

Any free Node hosting tier works (Render, Railway, Fly.io, a spare VPS,
etc.). Just make sure:

1. `npm install && npm start` runs as the start command.
2. `JWT_SECRET` is set to a real secret in that host's environment settings.
3. `CORS_ORIGIN` is set to your deployed frontend's URL.
4. The `backend/data/` directory is on persistent storage (some free hosts
   wipe the filesystem on redeploy — check your host's docs, or point
   `db.js` at a persistent volume/database if that's a concern for you).

No paid AI API is used anywhere in this backend.
