import { useState } from "react";
import { ListChecks, CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProgress } from "../context/ProgressContext";
import { generateQuiz } from "../utils/aiEngine";
import AudioButton from "../components/AudioButton";

const levels = ["beginner", "intermediate", "advanced"];
const categories = ["mixed", "grammar", "vocabularyCat", "translation"];

export default function Quiz() {
  const { t } = useLanguage();
  const { recordQuiz } = useProgress();
  const [level, setLevel] = useState("beginner");
  const [category, setCategory] = useState("mixed");
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  function startQuiz() {
    const qs = generateQuiz(level, category, 8);
    setQuestions(qs);
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setSubmitted(false);
    setFinished(false);
  }

  function handleSubmitAnswer() {
    setAnswers((a) => ({ ...a, [questions[current].id]: selected }));
    setSubmitted(true);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      const score = questions.filter((q) => answers[q.id] === q.answer || (q.id === questions[current].id && selected === q.answer)).length;
      recordQuiz(score, questions.length, category, level);
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setSubmitted(false);
  }

  function retake() {
    setQuestions(null);
    setFinished(false);
  }

  if (!questions) {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("quiz.title")}</h1>
        <p className="mt-1 text-ink-500 dark:text-ink-300">{t("quiz.subtitle")}</p>

        <div className="mt-6 card p-6 max-w-xl">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("lessons.level")}</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  level === lvl
                    ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                    : "border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
                }`}
              >
                {t(`common.${lvl}`)}
              </button>
            ))}
          </div>

          <label className="text-sm font-medium text-ink-700 dark:text-ink-200 mt-5 block">{t("quiz.category")}</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                    : "border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
                }`}
              >
                {t(`quiz.${cat}`)}
              </button>
            ))}
          </div>

          <button onClick={startQuiz} className="btn-primary mt-6">
            <ListChecks className="w-4 h-4" />
            {t("quiz.start")}
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const score = questions.filter((q) => answers[q.id] === q.answer).length;
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("quiz.resultsTitle")}</h1>
        <div className="mt-5 card p-6 text-center">
          <p className="text-4xl font-display font-semibold text-azure-500">{score} / {questions.length}</p>
          <p className="text-sm text-ink-400 mt-1">{t("quiz.scoreLabel")}</p>
        </div>

        <div className="mt-5 card p-6">
          <span className="eyebrow">{t("quiz.reviewTitle")}</span>
          <div className="mt-3 space-y-4">
            {questions.map((q, i) => {
              const right = answers[q.id] === q.answer;
              return (
                <div key={q.id} className="text-sm">
                  <p className="font-medium text-ink-700 dark:text-ink-100 flex items-center gap-1.5">
                    {right ? <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" /> : <XCircle className="w-4 h-4 text-coral-500 shrink-0" />}
                    {i + 1}. {q.prompt}
                  </p>
                  <p className="ml-5 text-ink-400 mt-0.5">
                    {t("quiz.yourAnswer")}: {answers[q.id] || "—"}
                    {!right && <span> · {t("quiz.correctAnswer")}: {q.answer}</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={retake} className="btn-primary mt-5">
          <RotateCcw className="w-4 h-4" />
          {t("quiz.retake")}
        </button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">{t("quiz.title")}</h1>
        <span className="text-sm text-ink-400">
          {t("quiz.question")} {current + 1} {t("quiz.of")} {questions.length}
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-ink-100 dark:bg-ink-700 overflow-hidden">
        <div className="h-full bg-azure-500 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="mt-6 card p-6">
        <div className="flex items-start gap-2">
          <p className="text-lg font-medium text-ink-800 dark:text-white flex-1">{q.prompt}</p>
          <AudioButton text={q.prompt} />
        </div>
        <div className="mt-4 space-y-2">
          {q.options.map((opt) => {
            const isSelected = selected === opt;
            const isRight = opt === q.answer;
            let cls = "border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800";
            if (submitted && isSelected) cls = isRight ? "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "border-coral-400 bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300";
            else if (submitted && isRight) cls = "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300";
            else if (isSelected) cls = "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300";
            return (
              <button
                key={opt}
                disabled={submitted}
                onClick={() => setSelected(opt)}
                className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <button onClick={handleSubmitAnswer} disabled={!selected} className="btn-primary mt-5">
            {t("quiz.submit")}
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary mt-5">
            {current + 1 >= questions.length ? t("quiz.finish") : t("quiz.next")}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
