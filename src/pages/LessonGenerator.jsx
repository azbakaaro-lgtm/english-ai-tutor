import { useState, useMemo, useEffect } from "react";
import { Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProgress } from "../context/ProgressContext";
import { generateLesson, getTopicsForLevel } from "../utils/aiEngine";
import { fetchPublicLessons } from "../utils/contentService";
import LessonView from "../components/LessonView";

const levels = ["beginner", "intermediate", "advanced"];

export default function LessonGenerator() {
  const { t } = useLanguage();
  const { completeLesson } = useProgress();
  const [level, setLevel] = useState("beginner");
  const [topicId, setTopicId] = useState(null);
  const [adminLessonId, setAdminLessonId] = useState(null);
  const [adminLessons, setAdminLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const topics = useMemo(() => getTopicsForLevel(level), [level]);

  useEffect(() => {
    let cancelled = false;
    setAdminLessonId(null);
    fetchPublicLessons(level).then((list) => {
      if (!cancelled) setAdminLessons(list);
    });
    return () => {
      cancelled = true;
    };
  }, [level]);

  function handleGenerate() {
    setGenerating(true);
    setCompleted(false);
    setTimeout(() => {
      if (adminLessonId) {
        const found = adminLessons.find((l) => l.id === adminLessonId);
        setLesson(found || generateLesson(level, topicId));
      } else {
        setLesson(generateLesson(level, topicId));
      }
      setGenerating(false);
    }, 550); // brief pause so "Building your lesson…" feels real, not instant-swap
  }

  function handleReset() {
    setLesson(null);
    setCompleted(false);
  }

  function handleMarkComplete() {
    completeLesson(lesson);
    setCompleted(true);
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("lessons.title")}</h1>
      <p className="mt-1 text-ink-500 dark:text-ink-300 max-w-2xl">{t("lessons.subtitle")}</p>

      {!lesson && (
        <div className="mt-6 card p-6 max-w-2xl">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("lessons.level")}</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setLevel(lvl);
                  setTopicId(null);
                }}
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

          <label className="text-sm font-medium text-ink-700 dark:text-ink-200 mt-5 block">{t("lessons.topic")}</label>
          <div className="mt-2 grid sm:grid-cols-2 gap-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setTopicId(topic.id);
                  setAdminLessonId(null);
                }}
                className={`text-left rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  topicId === topic.id && !adminLessonId
                    ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                    : "border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
                }`}
              >
                {topic.label}
              </button>
            ))}
            {adminLessons.map((al) => (
              <button
                key={al.id}
                onClick={() => setAdminLessonId(al.id)}
                className={`text-left rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  adminLessonId === al.id
                    ? "border-gold-400 bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-300"
                    : "border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                {al.topic}
              </button>
            ))}
          </div>

          <button onClick={handleGenerate} disabled={generating} className="btn-primary mt-6 w-full sm:w-auto">
            <Sparkles className="w-4 h-4" />
            {generating ? t("lessons.generating") : t("lessons.generate")}
          </button>
        </div>
      )}

      {lesson && (
        <div className="mt-6 max-w-3xl">
          <LessonView lesson={lesson} />

          <div className="flex flex-wrap items-center gap-3 mt-5">
            {!completed ? (
              <button onClick={handleMarkComplete} className="btn-gold">
                <CheckCircle2 className="w-4 h-4" />
                {t("lessons.markComplete")}
              </button>
            ) : (
              <p className="pill bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                <CheckCircle2 className="w-4 h-4" /> {t("lessons.completed")}
              </p>
            )}
            <button onClick={handleReset} className="btn-ghost">
              <RotateCcw className="w-4 h-4" />
              {t("lessons.backToLevels")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
