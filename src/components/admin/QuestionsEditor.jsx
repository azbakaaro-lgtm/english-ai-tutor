import { Plus, Trash2, X } from "lucide-react";

// A real form-based question builder: no JSON editing. Each question has a
// prompt, 2-4 answer options, a correct answer (picked from those options),
// and an optional explanation shown to students after they answer.
export default function QuestionsEditor({ questions, onChange, t }) {
  const list = questions || [];

  function addQuestion() {
    onChange([...list, { prompt: "", options: ["", ""], answer: "", explanation: "" }]);
  }

  function updateQuestion(i, patch) {
    onChange(list.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  function removeQuestion(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }

  function updateOption(qIdx, optIdx, value) {
    const q = list[qIdx];
    const oldOption = q.options[optIdx];
    const options = q.options.map((o, i) => (i === optIdx ? value : o));
    // keep the correct-answer selection pointing at the same option if it was selected
    const answer = q.answer === oldOption ? value : q.answer;
    updateQuestion(qIdx, { options, answer });
  }

  function addOption(qIdx) {
    const q = list[qIdx];
    if (q.options.length >= 4) return;
    updateQuestion(qIdx, { options: [...q.options, ""] });
  }

  function removeOption(qIdx, optIdx) {
    const q = list[qIdx];
    if (q.options.length <= 2) return;
    const removed = q.options[optIdx];
    const options = q.options.filter((_, i) => i !== optIdx);
    updateQuestion(qIdx, { options, answer: q.answer === removed ? "" : q.answer });
  }

  return (
    <div>
      <div className="space-y-3">
        {list.map((q, qIdx) => (
          <div key={qIdx} className="rounded-xl border border-ink-100 dark:border-ink-700 p-3.5">
            <div className="flex items-start gap-2">
              <input
                type="text"
                value={q.prompt}
                onChange={(e) => updateQuestion(qIdx, { prompt: e.target.value })}
                placeholder={t("admin.questionPrompt")}
                className="input !text-sm flex-1"
              />
              <button onClick={() => removeQuestion(qIdx)} className="p-2 rounded-full text-ink-400 hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-500/10 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 space-y-1.5">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.answer === opt && opt !== ""}
                    onChange={() => updateQuestion(qIdx, { answer: opt })}
                    title={t("admin.correctAnswer")}
                    className="shrink-0 accent-teal-500"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                    placeholder={`${t("admin.optionLabel")} ${optIdx + 1}`}
                    className="input !text-sm !py-1.5 flex-1"
                  />
                  {q.options.length > 2 && (
                    <button onClick={() => removeOption(qIdx, optIdx)} className="p-1 rounded-full text-ink-300 hover:text-coral-500 shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {q.options.length < 4 && (
                <button onClick={() => addOption(qIdx)} className="text-xs text-azure-500 hover:underline flex items-center gap-1 mt-1">
                  <Plus className="w-3 h-3" /> {t("admin.addOption")}
                </button>
              )}
            </div>

            <input
              type="text"
              value={q.explanation || ""}
              onChange={(e) => updateQuestion(qIdx, { explanation: e.target.value })}
              placeholder={t("admin.explanationOptional")}
              className="input !text-sm mt-2.5"
            />
          </div>
        ))}
      </div>

      <button onClick={addQuestion} className="btn-ghost mt-3 !px-3.5 !py-2 text-sm">
        <Plus className="w-4 h-4" /> {t("admin.addQuestion")}
      </button>
    </div>
  );
}
