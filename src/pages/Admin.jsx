import { useState, useEffect, useCallback } from "react";
import {
  Sparkles, BookOpen, ListChecks, Trash2, Save, RefreshCcw, CheckCircle2,
  AlertTriangle, Wand2, Target, Users, ShieldCheck, KeyRound, Upload, EyeOff, Eye, X,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  isBackendConfigured, fetchStats, fetchAdminLessons, generateLessonDraft, saveLesson,
  deleteLessonById, fetchAdminVocabulary, generateVocabularyDraft, saveVocabulary, deleteVocabularyById,
  publishLesson, unpublishLesson, fetchUsers, updateUserPermissions, updateUserRole, resetUserPassword,
  readingsAdmin, listeningsAdmin, storiesAdmin,
} from "../utils/adminService";
import ContentTypePanel from "../components/admin/ContentTypePanel";
import { ReadingView, ListeningView, StoryView } from "../components/ContentView";
import LessonView from "../components/LessonView";

const levels = ["beginner", "intermediate", "advanced"];

export default function Admin() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("lessons");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const refreshStats = useCallback(() => {
    fetchStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (isBackendConfigured() && isAdmin) refreshStats();
  }, [refreshStats, isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  if (!isBackendConfigured()) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("admin.title")}</h1>
        <div className="mt-6 card p-6 border-gold-300 bg-gold-50 dark:bg-gold-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gold-700 dark:text-gold-300">{t("admin.needsBackend")}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("admin.title")}</h1>
          <p className="mt-1 text-ink-500 dark:text-ink-300">{t("admin.subtitle")}</p>
        </div>
        {stats && (
          <span className={`pill ${stats.aiConfigured ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300"}`}>
            <Wand2 className="w-3.5 h-3.5" />
            {stats.aiConfigured ? t("admin.aiOn") : t("admin.aiOff")}
          </span>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-coral-500">{error}</p>}

      {stats && <StatsPanel stats={stats} t={t} />}

      <div className="mt-6 inline-flex rounded-full border border-ink-200 dark:border-ink-600 p-1">
        <button
          onClick={() => setTab("lessons")}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${tab === "lessons" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300"}`}
        >
          <BookOpen className="w-4 h-4" /> {t("admin.lessonsTab")}
        </button>
        <button
          onClick={() => setTab("vocab")}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${tab === "vocab" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300"}`}
        >
          <ListChecks className="w-4 h-4" /> {t("admin.vocabTab")}
        </button>
        <button
          onClick={() => setTab("reading")}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${tab === "reading" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300"}`}
        >
          {t("reading.title")}
        </button>
        <button
          onClick={() => setTab("listening")}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${tab === "listening" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300"}`}
        >
          {t("listening.title")}
        </button>
        <button
          onClick={() => setTab("stories")}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${tab === "stories" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300"}`}
        >
          {t("stories.title")}
        </button>
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${tab === "users" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300"}`}
        >
          <Users className="w-4 h-4" /> {t("admin.usersTab")}
        </button>
      </div>

      <div className="mt-5">
        {tab === "lessons" && <LessonsPanel t={t} onSaved={refreshStats} />}
        {tab === "vocab" && <VocabPanel t={t} onSaved={refreshStats} />}
        {tab === "reading" && (
          <ContentTypePanel
            t={t}
            service={readingsAdmin}
            Viewer={ReadingView}
            labels={{ savedLabel: t("reading.title") }}
            fields={[
              { key: "contentEn", labelKey: "admin.englishContent", richText: true },
              { key: "contentSo", labelKey: "admin.somaliContent", richText: true },
            ]}
            blankItem={(level) => ({ title: "", level, contentEn: "", contentSo: "", questions: [] })}
          />
        )}
        {tab === "listening" && (
          <ContentTypePanel
            t={t}
            service={listeningsAdmin}
            Viewer={ListeningView}
            labels={{ savedLabel: t("listening.title") }}
            fields={[
              { key: "transcriptEn", labelKey: "admin.transcript" },
              { key: "transcriptSo", labelKey: "admin.transcriptSomali" },
            ]}
            blankItem={(level) => ({ title: "", level, transcriptEn: "", transcriptSo: "", questions: [] })}
          />
        )}
        {tab === "stories" && (
          <ContentTypePanel
            t={t}
            service={storiesAdmin}
            Viewer={StoryView}
            labels={{ savedLabel: t("stories.title") }}
            fields={[
              { key: "storyEn", labelKey: "admin.storyContent", richText: true },
              { key: "storySo", labelKey: "admin.storyContentSomali", richText: true },
            ]}
            blankItem={(level) => ({ title: "", level, storyEn: "", storySo: "", vocabulary: [], questions: [] })}
          />
        )}
        {tab === "users" && <UsersPanel t={t} />}
      </div>
    </div>
  );
}

function StatsPanel({ stats, t }) {
  const rows = [
    { level: "beginner", have: stats.lessonsByLevel.beginner, target: stats.targets.beginner },
    { level: "intermediate", have: stats.lessonsByLevel.intermediate, target: stats.targets.intermediate },
    { level: "advanced", have: stats.lessonsByLevel.advanced, target: stats.targets.advanced },
  ];
  return (
    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {rows.map((r) => (
        <div key={r.level} className="card p-5">
          <Target className="w-5 h-5 text-azure-500" />
          <p className="mt-3 text-2xl font-display font-semibold text-ink-900 dark:text-white">
            {r.have} <span className="text-sm font-normal text-ink-400">/ {r.target}</span>
          </p>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 capitalize">{t(`common.${r.level}`)} {t("admin.lessonsTab").toLowerCase()}</p>
          <div className="mt-2 h-1.5 rounded-full bg-ink-100 dark:bg-ink-700 overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full" style={{ width: `${Math.min(100, (r.have / r.target) * 100)}%` }} />
          </div>
        </div>
      ))}
      <div className="card p-5">
        <ListChecks className="w-5 h-5 text-gold-500" />
        <p className="mt-3 text-2xl font-display font-semibold text-ink-900 dark:text-white">
          {stats.vocabCount} <span className="text-sm font-normal text-ink-400">/ {stats.targets.vocabulary}</span>
        </p>
        <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{t("admin.vocabTab")}</p>
        <div className="mt-2 h-1.5 rounded-full bg-ink-100 dark:bg-ink-700 overflow-hidden">
          <div className="h-full bg-gold-400 rounded-full" style={{ width: `${Math.min(100, (stats.vocabCount / stats.targets.vocabulary) * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

function LessonsPanel({ t, onSaved }) {
  const [level, setLevel] = useState("beginner");
  const [topic, setTopic] = useState("");
  const [draft, setDraft] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [savedLessons, setSavedLessons] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [previewLesson, setPreviewLesson] = useState(null);

  const loadLessons = useCallback(() => {
    setLoadingList(true);
    fetchAdminLessons(level)
      .then(setSavedLessons)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingList(false));
  }, [level]);

  useEffect(() => {
    loadLessons();
    setDraft(null);
    setSaved(false);
  }, [level, loadLessons]);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setGenerating(true);
    setError("");
    setSaved(false);
    try {
      const lesson = await generateLessonDraft(level, topic.trim());
      setDraft(lesson);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  function handleStartBlank() {
    setSaved(false);
    setError("");
    setDraft({
      topic: topic.trim() || "",
      level,
      grammarTitle: "",
      explanationEn: "",
      explanationSo: "",
      examples: [],
      vocabulary: [],
      exercises: [],
      quiz: [],
      reading: { title: "", passage: "", questions: [] },
      listening: { script: "", questions: [] },
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await saveLesson(draft);
      setSaved(true);
      setDraft(null);
      setTopic("");
      loadLessons();
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t("admin.confirmDeleteLesson"))) return;
    try {
      await deleteLessonById(id);
      loadLessons();
      onSaved();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleTogglePublish(lesson) {
    try {
      if (lesson.status === "published") await unpublishLesson(lesson.id);
      else await publishLesson(lesson.id);
      loadLessons();
      onSaved();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="card p-6">
        <div className="grid grid-cols-3 gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                level === lvl
                  ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                  : "border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
              }`}
            >
              {t(`common.${lvl}`)}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium text-ink-700 dark:text-ink-200 mt-4 block">{t("admin.topic")}</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t("admin.topicPlaceholder")}
          className="input mt-1.5"
        />
        <p className="mt-2 text-xs text-ink-400">{t("admin.manualEntry")}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={handleStartBlank} className="btn-primary">
            <Upload className="w-4 h-4" />
            {t("admin.generateLesson")}
          </button>
          <button onClick={handleGenerate} disabled={generating || !topic.trim()} className="btn-ghost">
            <Sparkles className="w-4 h-4" />
            {generating ? t("admin.generating") : t("admin.quickFill")}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-coral-500">{error}</p>}

        {draft && (
          <div className="mt-5 border-t border-ink-100 dark:border-ink-700 pt-4">
            <div className="flex items-center justify-between">
              <span className="eyebrow">{t("admin.preview")} — {t("common.save")}/{t("admin.delete") === "Delete" ? "Edit" : "Wax ka beddel"}</span>
              {draft.source && (
                <span className="pill bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300 !text-[10px]">
                  {draft.source === "ai" ? t("admin.sourceAi") : t("admin.sourceTemplate")}
                </span>
              )}
            </div>

            <label className="text-xs font-medium text-ink-500 mt-3 block">{t("lessons.title") || "Topic"}</label>
            <input className="input mt-1 !text-sm" value={draft.topic} onChange={(e) => setDraft({ ...draft, topic: e.target.value })} />

            <label className="text-xs font-medium text-ink-500 mt-3 block">{t("lessons.grammarFocus")}</label>
            <input className="input mt-1 !text-sm" value={draft.grammarTitle} onChange={(e) => setDraft({ ...draft, grammarTitle: e.target.value })} />

            <label className="text-xs font-medium text-ink-500 mt-3 block">{t("common.english")}</label>
            <textarea className="input mt-1 !text-sm min-h-20" value={draft.explanationEn} onChange={(e) => setDraft({ ...draft, explanationEn: e.target.value })} />

            <label className="text-xs font-medium text-ink-500 mt-3 block">{t("common.somali")}</label>
            <textarea className="input mt-1 !text-sm min-h-20" value={draft.explanationSo} onChange={(e) => setDraft({ ...draft, explanationSo: e.target.value })} />

            {draft.reading && (
              <>
                <label className="text-xs font-medium text-ink-500 mt-3 block">{t("lessons.reading")}</label>
                <textarea
                  className="input mt-1 !text-sm min-h-20"
                  value={draft.reading.passage}
                  onChange={(e) => setDraft({ ...draft, reading: { ...draft.reading, passage: e.target.value } })}
                />
              </>
            )}

            {draft.listening && (
              <>
                <label className="text-xs font-medium text-ink-500 mt-3 block">{t("lessons.listening")}</label>
                <textarea
                  className="input mt-1 !text-sm min-h-16"
                  value={draft.listening.script}
                  onChange={(e) => setDraft({ ...draft, listening: { ...draft.listening, script: e.target.value } })}
                />
              </>
            )}

            <p className="mt-3 text-xs text-ink-400">
              {draft.vocabulary?.length || 0} vocab · {draft.exercises?.length || 0} exercises · {draft.quiz?.length || 0} quiz
            </p>
            {saving && <p className="mt-2 text-xs text-ink-400">{t("admin.slowServerHint")}</p>}
            <button onClick={handleSave} disabled={saving || !draft.topic?.trim()} className="btn-gold mt-4">
              <Save className="w-4 h-4" />
              {t("admin.saveLesson")}
            </button>
          </div>
        )}
        {saved && (
          <p className="mt-3 text-sm text-teal-600 dark:text-teal-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {t("admin.saveLesson")} ✓
          </p>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <span className="eyebrow">{t("admin.savedLessons")}</span>
          <button onClick={loadLessons} className="text-ink-400 hover:text-azure-500">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
        {loadingList ? (
          <p className="mt-4 text-sm text-ink-400">{t("common.loading")}</p>
        ) : savedLessons.length === 0 ? (
          <p className="mt-4 text-sm text-ink-400">{t("admin.noLessonsYet")}</p>
        ) : (
          <div className="mt-3 divide-y divide-ink-100 dark:divide-ink-700">
            {savedLessons.map((l) => (
              <div key={l.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-700 dark:text-ink-100 truncate">{l.topic}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`pill !text-[10px] ${l.status === "published" ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300"}`}>
                      {l.status === "published" ? t("admin.published") : t("admin.draft")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setPreviewLesson(l)} title={t("admin.previewAsUser")} className="p-1.5 rounded-full text-ink-400 hover:text-azure-500 hover:bg-azure-50 dark:hover:bg-azure-900/40">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(l)}
                    title={l.status === "published" ? t("admin.unpublish") : t("admin.publish")}
                    className="p-1.5 rounded-full text-ink-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10"
                  >
                    {l.status === "published" ? <EyeOff className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-full text-ink-400 hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/50 p-4 sm:p-8" onClick={() => setPreviewLesson(null)}>
          <div className="w-full max-w-3xl mt-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button onClick={() => setPreviewLesson(null)} className="p-2 rounded-full bg-white dark:bg-ink-800 text-ink-500 hover:text-coral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <LessonView lesson={previewLesson} />
          </div>
        </div>
      )}
    </div>
  );
}

function UsersPanel({ t }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function togglePermission(user, key) {
    setSavingId(user.id);
    setError("");
    try {
      const next = { ...user.permissions, [key]: !user.permissions?.[key] };
      const updated = await updateUserPermissions(user.id, next);
      setUsers((list) => list.map((u) => (u.id === user.id ? updated : u)));
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId(null);
    }
  }

  async function toggleRole(user) {
    setSavingId(user.id);
    setError("");
    try {
      const nextRole = user.role === "admin" ? "user" : "admin";
      const updated = await updateUserRole(user.id, nextRole);
      setUsers((list) => list.map((u) => (u.id === user.id ? updated : u)));
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId(null);
    }
  }

  async function handleResetPassword(user) {
    const pw = window.prompt(t("admin.resetPasswordPrompt"));
    if (!pw) return;
    if (pw.length < 8) {
      setError(t("auth.errorPasswordLength"));
      return;
    }
    try {
      await resetUserPassword(user.id, pw);
      window.alert(t("admin.resetPasswordDone"));
    } catch (e) {
      setError(e.message);
    }
  }

  const permKeys = [
    { key: "viewContent", label: "permView" },
    { key: "createContent", label: "permCreate" },
    { key: "editContent", label: "permEdit" },
    { key: "deleteContent", label: "permDelete" },
    { key: "publishContent", label: "permPublish" },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{t("admin.usersTab")}</span>
        <button onClick={load} className="text-ink-400 hover:text-azure-500">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>
      <p className="mt-1 text-xs text-ink-400">{t("admin.adminAlwaysFull")}</p>
      {error && <p className="mt-3 text-sm text-coral-500">{error}</p>}

      {loading ? (
        <p className="mt-4 text-sm text-ink-400">{t("common.loading")}</p>
      ) : users.length === 0 ? (
        <p className="mt-4 text-sm text-ink-400">{t("admin.noUsers")}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {users.map((u) => (
            <div key={u.id} className="rounded-xl border border-ink-100 dark:border-ink-700 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink-800 dark:text-white flex items-center gap-1.5">
                    {u.name}
                    {u.role === "admin" && (
                      <span className="pill bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-300 !text-[10px]">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink-400">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResetPassword(u)}
                    className="btn-ghost !px-2.5 !py-1.5 text-xs"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> {t("admin.resetPassword")}
                  </button>
                  <button
                    onClick={() => toggleRole(u)}
                    disabled={savingId === u.id}
                    className="btn-ghost !px-2.5 !py-1.5 text-xs"
                  >
                    {u.role === "admin" ? t("admin.removeAdmin") : t("admin.makeAdmin")}
                  </button>
                </div>
              </div>

              {u.role !== "admin" && (
                <div className="mt-3 pt-3 border-t border-ink-100 dark:border-ink-700">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t("admin.permissions")}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {permKeys.map(({ key, label }) => {
                      const active = !!u.permissions?.[key];
                      return (
                        <button
                          key={key}
                          onClick={() => togglePermission(u, key)}
                          disabled={savingId === u.id}
                          className={`pill !text-xs border transition-colors ${
                            active
                              ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                              : "border-ink-200 dark:border-ink-600 text-ink-400"
                          }`}
                        >
                          {active ? <CheckCircle2 className="w-3 h-3" /> : null}
                          {t(`admin.${label}`)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VocabPanel({ t, onSaved }) {
  const [level, setLevel] = useState("beginner");
  const [count, setCount] = useState(10);
  const [topic, setTopic] = useState("");
  const [draftWords, setDraftWords] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedWords, setSavedWords] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const loadWords = useCallback(() => {
    setLoadingList(true);
    fetchAdminVocabulary(level)
      .then(setSavedWords)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingList(false));
  }, [level]);

  useEffect(() => {
    loadWords();
    setDraftWords([]);
  }, [level, loadWords]);

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const words = await generateVocabularyDraft(level, count, topic.trim() || "general");
      setDraftWords(words);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveAll() {
    setSaving(true);
    setError("");
    try {
      await saveVocabulary(draftWords);
      setDraftWords([]);
      loadWords();
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t("admin.confirmDeleteWord"))) return;
    try {
      await deleteVocabularyById(id);
      loadWords();
      onSaved();
    } catch (e) {
      setError(e.message);
    }
  }

  function updateDraftWord(i, patch) {
    setDraftWords((words) => words.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="card p-6">
        <div className="grid grid-cols-3 gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                level === lvl
                  ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                  : "border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
              }`}
            >
              {t(`common.${lvl}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("admin.count")}</label>
            <input type="number" min={1} max={30} value={count} onChange={(e) => setCount(Number(e.target.value))} className="input mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("admin.vocabTopic")}</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t("admin.vocabTopicPlaceholder")} className="input mt-1.5" />
          </div>
        </div>

        <button onClick={handleGenerate} disabled={generating} className="btn-primary mt-4">
          <Sparkles className="w-4 h-4" />
          {generating ? t("admin.generating") : t("admin.generateVocab")}
        </button>

        {error && <p className="mt-3 text-sm text-coral-500">{error}</p>}

        {draftWords.length > 0 && (
          <div className="mt-5 border-t border-ink-100 dark:border-ink-700 pt-4">
            <span className="eyebrow">{t("admin.preview")}</span>
            <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
              {draftWords.map((w, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 rounded-lg bg-ink-50 dark:bg-ink-900/60 p-2.5">
                  <input className="input !py-1.5 !text-sm" value={w.word} onChange={(e) => updateDraftWord(i, { word: e.target.value })} placeholder={t("admin.word")} />
                  <input className="input !py-1.5 !text-sm" value={w.somali} onChange={(e) => updateDraftWord(i, { somali: e.target.value })} placeholder={t("admin.somaliMeaning")} />
                  <input className="input !py-1.5 !text-sm col-span-2" value={w.example} onChange={(e) => updateDraftWord(i, { example: e.target.value })} placeholder={t("admin.example")} />
                </div>
              ))}
            </div>
            <button onClick={handleSaveAll} disabled={saving} className="btn-gold mt-4">
              <Save className="w-4 h-4" />
              {t("admin.saveVocab")}
            </button>
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <span className="eyebrow">{t("admin.savedVocab")}</span>
          <button onClick={loadWords} className="text-ink-400 hover:text-azure-500">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
        {loadingList ? (
          <p className="mt-4 text-sm text-ink-400">{t("common.loading")}</p>
        ) : savedWords.length === 0 ? (
          <p className="mt-4 text-sm text-ink-400">{t("admin.noVocabYet")}</p>
        ) : (
          <div className="mt-3 divide-y divide-ink-100 dark:divide-ink-700">
            {savedWords.map((w) => (
              <div key={w.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-700 dark:text-ink-100">{w.word} <span className="text-azure-500 font-normal">— {w.somali}</span></p>
                  <p className="text-xs text-ink-400 truncate">{w.example}</p>
                </div>
                <button onClick={() => handleDelete(w.id)} className="p-1.5 rounded-full text-ink-400 hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-500/10 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
