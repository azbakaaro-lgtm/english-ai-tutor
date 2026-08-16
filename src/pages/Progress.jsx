import { Flame, BookOpen, ListChecks, Mic, Award, TrendingUp } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProgress } from "../context/ProgressContext";
import { LevelStars } from "../components/Star";

export default function ProgressPage() {
  const { t } = useLanguage();
  const { progress } = useProgress();

  const quizAvg = progress.quizzes?.length
    ? Math.round((progress.quizzes.reduce((sum, q) => sum + q.score / q.total, 0) / progress.quizzes.length) * 100)
    : 0;

  const stats = [
    { icon: ListChecks, label: t("progress.lessonsCompleted"), value: progress.lessonsCompleted },
    { icon: Award, label: t("progress.quizAverage"), value: `${quizAvg}%` },
    { icon: BookOpen, label: t("progress.vocabLearned"), value: progress.vocabLearned?.length || 0 },
    { icon: Mic, label: t("progress.speakingSessions"), value: progress.speakingSessions || 0 },
    { icon: Flame, label: t("progress.currentStreak"), value: progress.streak },
    { icon: TrendingUp, label: t("progress.longestStreak"), value: progress.longestStreak || 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("progress.title")}</h1>
      <p className="mt-1 text-ink-500 dark:text-ink-300">{t("progress.subtitle")}</p>

      <div className="mt-6 card p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="eyebrow">{t("progress.levelProgress")}</span>
          <p className="mt-1 text-xl font-display font-semibold text-ink-900 dark:text-white">{t(`common.${progress.level}`)}</p>
        </div>
        <LevelStars level={progress.level} size="w-7 h-7" />
      </div>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-5">
            <Icon className="w-5 h-5 text-azure-500" />
            <p className="mt-3 text-2xl font-display font-semibold text-ink-900 dark:text-white">{value}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 card p-6">
        <span className="eyebrow">{t("progress.activityLog")}</span>
        <div className="mt-3 divide-y divide-ink-100 dark:divide-ink-700">
          {(!progress.activityLog || progress.activityLog.length === 0) && (
            <p className="text-sm text-ink-400 py-4">{t("progress.noLogs")}</p>
          )}
          {progress.activityLog?.map((item, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-700 dark:text-ink-100">{item.label}</p>
                <p className="text-xs text-ink-400 capitalize">{item.type}{item.meta?.level ? ` · ${item.meta.level}` : ""}</p>
              </div>
              <span className="text-xs text-ink-400 shrink-0">{new Date(item.date).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
