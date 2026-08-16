import { useState, useEffect, useCallback } from "react";
import { Trash2, Save, RefreshCcw, Upload, EyeOff, Eye, X, Pencil, PlusCircle } from "lucide-react";
import RichTextEditor from "../RichTextEditor";
import QuestionsEditor from "./QuestionsEditor";

const levels = ["beginner", "intermediate", "advanced"];

// Generic admin editor for a "simple" content type (readings, listenings,
// stories). `fields` describes which rich-text / plain-text inputs to show;
// `service` is one of readingsAdmin/listeningsAdmin/storiesAdmin from
// adminService.js; `Viewer` is the SAME component students see, used here
// for "Preview as user" — per spec, no separate preview design.
export default function ContentTypePanel({ t, service, fields, Viewer, labels, blankItem }) {
  const [level, setLevel] = useState("beginner");
  const [draft, setDraft] = useState(blankItem(level));
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);

  const load = useCallback(() => {
    setLoadingList(true);
    service
      .fetchAll(level)
      .then(setSavedItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingList(false));
  }, [level, service]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, load]);

  function resetForm() {
    setDraft(blankItem(level));
    setEditingId(null);
  }

  async function handleSave() {
    if (!draft.title?.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await service.update(editingId, { ...draft, level });
      } else {
        await service.create({ ...draft, level });
      }
      resetForm();
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    setDraft({ ...item });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm(t("admin.confirmDeleteLesson"))) return;
    try {
      await service.remove(id);
      if (editingId === id) resetForm();
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleTogglePublish(item) {
    try {
      if (item.status === "published") await service.unpublish(item.id);
      else await service.publish(item.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-3 gap-2 flex-1">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setLevel(lvl);
                  resetForm();
                }}
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
          {editingId && (
            <button onClick={resetForm} title="New" className="ml-2 p-2 rounded-full text-ink-400 hover:text-azure-500 hover:bg-azure-50 dark:hover:bg-azure-900/40">
              <PlusCircle className="w-5 h-5" />
            </button>
          )}
        </div>
        {editingId && <p className="mt-2 text-xs text-gold-600 dark:text-gold-300">{t("admin.editingExisting")}</p>}

        <label className="text-sm font-medium text-ink-700 dark:text-ink-200 mt-4 block">{t("admin.titleField")}</label>
        <input
          type="text"
          value={draft.title || ""}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder={t("admin.titlePlaceholder")}
          className="input mt-1.5"
        />

        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200 mt-4 block">{t(f.labelKey)}</label>
            {f.richText ? (
              <div className="mt-1.5">
                <RichTextEditor value={draft[f.key] || ""} onChange={(html) => setDraft({ ...draft, [f.key]: html })} />
              </div>
            ) : (
              <textarea
                className="input mt-1.5 min-h-24"
                value={draft[f.key] || ""}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}

        <label className="text-sm font-medium text-ink-700 dark:text-ink-200 mt-5 block border-t border-ink-100 dark:border-ink-700 pt-4">
          {t("admin.questionsTitle")}
        </label>
        <div className="mt-2">
          <QuestionsEditor questions={draft.questions} onChange={(questions) => setDraft({ ...draft, questions })} t={t} />
        </div>

        {error && <p className="mt-3 text-sm text-coral-500">{error}</p>}
        {saving && <p className="mt-2 text-xs text-ink-400">{t("admin.slowServerHint")}</p>}

        <button onClick={handleSave} disabled={saving || !draft.title?.trim()} className="btn-gold mt-4">
          <Save className="w-4 h-4" />
          {editingId ? t("common.save") : t("admin.saveDraft")}
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <span className="eyebrow">{labels.savedLabel}</span>
          <button onClick={load} className="text-ink-400 hover:text-azure-500">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
        {loadingList ? (
          <p className="mt-4 text-sm text-ink-400">{t("common.loading")}</p>
        ) : savedItems.length === 0 ? (
          <p className="mt-4 text-sm text-ink-400">{t("admin.noContentYet")}</p>
        ) : (
          <div className="mt-3 divide-y divide-ink-100 dark:divide-ink-700">
            {savedItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-700 dark:text-ink-100 truncate">{item.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`pill !text-[10px] ${item.status === "published" ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300"}`}>
                      {item.status === "published" ? t("admin.published") : t("admin.draft")}
                    </span>
                    {item.questions?.length > 0 && (
                      <span className="text-[10px] text-ink-400">{item.questions.length} {t("quiz.title").toLowerCase()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setPreviewItem(item)} title={t("admin.previewAsUser")} className="p-1.5 rounded-full text-ink-400 hover:text-azure-500 hover:bg-azure-50 dark:hover:bg-azure-900/40">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEdit(item)} title={t("common.save")} className="p-1.5 rounded-full text-ink-400 hover:text-azure-500 hover:bg-azure-50 dark:hover:bg-azure-900/40">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(item)}
                    title={item.status === "published" ? t("admin.unpublish") : t("admin.publish")}
                    className="p-1.5 rounded-full text-ink-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10"
                  >
                    {item.status === "published" ? <EyeOff className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-full text-ink-400 hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/50 p-4 sm:p-8" onClick={() => setPreviewItem(null)}>
          <div className="w-full max-w-2xl mt-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button onClick={() => setPreviewItem(null)} className="p-2 rounded-full bg-white dark:bg-ink-800 text-ink-500 hover:text-coral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Viewer item={previewItem} />
          </div>
        </div>
      )}
    </div>
  );
}
