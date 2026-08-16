# English AI Tutor 🌟

A modern, bilingual (English / Somali) English-learning platform — dashboard,
Lessons, Reading, Listening, Stories, Vocabulary, AI-free tutor chat,
speaking practice, and quizzes — with a full content-management system so
an admin/teacher can author every lesson, reading, listening and story
themselves, with granular per-user permissions and a Draft → Publish
workflow.

> No OpenAI, Anthropic, or any paid API is required anywhere in this
> project. Content is written by admins/editors through the Admin
> Dashboard's editor (a free, built-in rich text editor — no HTML
> knowledge needed). An optional free AI quick-fill (Groq) can speed up
> drafting, but is never required.

---

## Real accounts, real database — this is not a demo

This is a production app: accounts, passwords (bcrypt-hashed), sessions
(JWT), learning progress, and all educational content live on a real
backend server with persistent storage — not in browser localStorage. A
user can register on one device and log in from another and keep their
account and progress. **The backend is required** — see setup below.

---

## What's included

| Feature | Details |
|---|---|
| **Dashboard** | Streak, level, vocabulary count, lessons completed, weekly goal |
| **Lessons** | Grammar, vocabulary, examples, exercises, quiz, reading & listening — authored by admins/editors |
| **Reading** | Short passages with comprehension questions, per level |
| **Listening** | Scripts played with free browser text-to-speech, with comprehension questions |
| **Stories** | Short stories with vocabulary and comprehension questions |
| **AI Tutor Chat** | Rule-based conversation practice with a 13-pattern grammar checker, explained in Somali |
| **Speaking Practice** | Uses the browser's free built-in Web Speech API |
| **Vocabulary** | Curated + admin-authored words with Somali meanings, favorites, search |
| **Quiz** | Grammar, vocabulary, translation questions |
| **Progress** | Streaks, quiz averages, activity log — persisted server-side per account |
| **Auth** | Register / login / change password, backend-verified, JWT sessions |
| **Admin Dashboard** | Manage Lessons, Reading, Listening, Stories, Vocabulary, and Users |
| **Rich text editor** | Built-in WYSIWYG (bold/italic/underline/headings/lists/links) — no HTML required |
| **Draft → Publish workflow** | New content starts as a draft; students only ever see published content |
| **Preview as user** | Admin can preview any item exactly as a student would see it, using the same component |
| **Granular permissions** | Per-user: View / Create / Edit / Delete / Publish content, enforced server-side |
| **Design** | Light/dark mode, English/Somali switch, mobile + desktop responsive |

---

## Project structure

```
english-ai-tutor/
├── src/                     # React frontend (Vite)
│   ├── pages/               # Dashboard, Lessons, Reading, Listening, Stories, Chat, Admin, ...
│   ├── components/          # AppShell, RichTextEditor, ContentView (shared student/admin viewer), ...
│   ├── context/             # Auth, Progress, Language, Theme
│   ├── data/                # Lesson templates, vocabulary, grammar rules, translations
│   └── utils/                # authService, progressService, adminService, contentService, speech, aiEngine
├── backend/                 # Required Node/Express API — see backend/README.md
│   └── src/
├── .env.example             # Frontend env template (VITE_API_URL)
└── package.json
```

---

## Setup (backend required)

### 1. Start the backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set JWT_SECRET to a real secret, and ADMIN_EMAILS to your email
npm start                 # runs on http://localhost:5050 by default
```

### 2. Point the frontend at it

```bash
cd ..
cp .env.example .env.local
# edit .env.local:
#   VITE_API_URL=http://localhost:5050
```

### 3. Start the frontend

```bash
npm install
npm run dev
```

Open the printed local URL, register an account using the email you put in
`ADMIN_EMAILS`, and you'll automatically have admin access — including the
**Admin** link in the sidebar.

To build for production:

```bash
npm run build      # outputs to ./dist
npm run preview    # preview the production build locally
```

See [`backend/README.md`](./backend/README.md) for the full API reference,
and the **Admin Dashboard** section below for how content management works.

---

## Admin Dashboard — content management

Once logged in as an admin, `/app/admin` gives you:

- **Lessons / Reading / Listening / Stories tabs** — write content directly
  (rich text editor for English + Somali fields), save as a draft, preview
  it exactly as a student would see it, then publish. Unpublish or delete
  anytime.
- **Vocabulary tab** — add words individually or in a batch.
- **Users tab** — promote/demote admins, grant or revoke individual
  permissions (View / Create / Edit / Delete / Publish) per user, and reset
  any user's password.
- **Stats** — live progress toward your own content targets.

### Permissions model

Every account has a `permissions` object:

```
viewContent | createContent | editContent | deleteContent | publishContent
```

New accounts get `viewContent: true` and everything else `false`. An admin
grants additional permissions from the Users tab — for example, a teacher
could be given `createContent` + `editContent` but not `publishContent`, so
they can draft lessons that an admin reviews before publishing. **Admins
always have full access regardless of these toggles.** All of this is
enforced **server-side** in `backend/src/middleware/auth.js` — a user can
never gain access by modifying the frontend.

### Optional free AI quick-fill

The Lessons tab has an optional "Quick-fill" button that uses a built-in,
free template generator to scaffold a lesson (grammar + vocab + reading +
listening) that you then edit and save — no AI, no signup needed. If you
want a higher-quality AI-written starting point instead, you can optionally
connect a free Groq API key (see `backend/.env.example`) — this is entirely
optional and off by default.

---

## How "Demo AI Mode" works (and how to extend it)

Every "AI" feature is implemented with real logic, not a stub:

- **Lesson generation** (`src/utils/aiEngine.js` → `generateLesson`) picks a
  grammar topic template from `src/data/lessonBank.js`, attaches relevant
  vocabulary, shuffles exercise order/options, and builds a short quiz —
  producing a genuinely different lesson each time.
- **Grammar correction** (`src/data/grammarRules.js`) is a set of pattern
  rules tuned to common mistakes Somali-speaking English learners make
  (subject-verb agreement, articles, tense, double negatives, idioms, etc.),
  each with an English + Somali explanation.
- **Chat replies** (`generateTutorReply`) detect greetings/questions/statements
  and combine that with the grammar checker to give a natural-feeling,
  corrective conversation partner.
- **Quizzes** (`generateQuiz`) mix static grammar-question banks with
  vocabulary/translation questions generated on the fly from the vocabulary
  bank, so they don't run out of combinations.
- **Speech** (`src/utils/speech.js`) wraps the browser's native
  `SpeechRecognition` and `speechSynthesis` APIs — supported for free in
  Chrome, Edge, and most Android browsers.

If you later want to plug in a real LLM (including a free/local one, e.g. a
self-hosted Ollama model), the integration point is intentionally narrow:
replace the internals of `generateLesson`, `generateTutorReply`, and
`generateQuiz` in `src/utils/aiEngine.js` with calls to your model. Nothing
else in the app needs to change — **just don't use a paid API** if you want
to keep this project free to run.

---

## Building for production & deploying

```bash
npm run build
```

This produces a static site in `dist/`. Deploy `dist/` to any free static
host:

- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop `dist/`, or connect
  the repo and set build command `npm run build`, publish directory `dist`.
- **GitHub Pages** — push `dist/` to a `gh-pages` branch.
- **Any web server** (nginx, Apache, etc.) — copy `dist/` to your web root.
  Configure it to serve `index.html` for unknown paths (SPA fallback), since
  this is a client-side-routed React app.

If you're also running the optional backend, deploy `backend/` to any free
Node host (Render free tier, Railway free tier, Fly.io, your own VPS, etc.)
and set `VITE_API_URL` in the frontend's environment to that backend's URL
before building.

---

## Browser support notes

- **Speaking Practice** requires `SpeechRecognition`, which is currently
  best supported in **Chrome** and **Edge** (desktop and Android). Safari
  and Firefox have limited or no support — the app detects this and shows a
  friendly notice instead of breaking.
- **Text-to-speech** (`speechSynthesis`) has broader support and works in
  most modern browsers.
- Everything else (lessons, chat, vocabulary, quizzes, dashboard) works in
  any modern browser.

---

## Tech stack

- **React 19** + **Vite** — frontend build tooling
- **React Router 7** — client-side routing
- **Tailwind CSS 3** — styling, with a custom design system (see
  `tailwind.config.js`) — deep indigo + azure + gold palette, Space Grotesk /
  Inter typography, a five-pointed star motif used for streaks and levels
- **lucide-react** — icons
- **Web Speech API** — free, built into the browser
- **localStorage** — default persistence (Demo Mode)
- **Node.js + Express** (optional backend) — JWT auth (jsonwebtoken +
  bcryptjs), single JSON file storage, CORS-enabled REST API

No paid dependencies anywhere in either package.json.

---

## License / cost

Free to run, self-host, and modify. No API keys, no subscriptions, no
usage-based billing anywhere in this codebase.
