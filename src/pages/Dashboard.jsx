import { Link } from "react-router-dom";
import { Flame, BookOpen, ListChecks, MessageCircle, Mic, ArrowRight, GraduationCap } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { LevelStars } from "../components/Star";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { progress } = useProgress();

  const stats = [
    { icon: Flame, label: t("dashboard.streak"), value: progress.streak, accent: "text-gold-400" },
    { icon: GraduationCap, label: t("dashboard.level"), value: t(`common.${progress.level}`), accent: "text-azure-500" },
    { icon: BookOpen, label: t("dashboard.vocab"), value: progress.vocabLearned?.length || 0, accent: "text-teal-500" },
    { icon: ListChecks, label: t("dashboard.lessonsDone"), value: progress.lessonsCompleted, accent: "text-coral-400" },
  ];

  const quickActions = [
    { to: "/app/chat", label: t("dashboard.openChat"), icon: MessageCircle },
    { to: "/app/speaking", label: t("dashboard.practiceSpeaking"), icon: Mic },
    { to: "/app/vocabulary", label: t("dashboard.reviewVocab"), icon: BookOpen },
    { to: "/app/quiz", label: t("dashboard.takeQuiz"), icon: ListChecks },
  ];

  const weeklyGoal = 5;
  const weeklyPct = Math.min(100, Math.round(((progress.lessonsThisWeek || 0) / weeklyGoal) * 100));

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">
            {t("dashboard.welcome")}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-ink-500 dark:text-ink-300">{t("dashboard.subtitle")}</p>
        </div>
        <LevelStars level={progress.level} />
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, accent }) => (
          <div key={label} className="card p-5">
            <Icon className={`w-5 h-5 ${accent}`} />
            <p className="mt-3 text-2xl font-display font-semibold text-ink-900 dark:text-white">{value}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-6 bg-gradient-to-br from-azure-500 to-azure-700 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
          <span className="eyebrow !text-azure-100">{t("dashboard.dailyLessonTitle")}</span>
          <h2 className="mt-2 text-xl font-display font-semibold">{t("dashboard.dailyLessonBody")}</h2>
          <Link to="/app/lessons" className="btn-gold mt-5 !text-ink-900">
            {t("dashboard.startLesson")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="card p-6">
          <span className="eyebrow">{t("dashboard.weeklyGoal")}</span>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
            {progress.lessonsThisWeek || 0} / {weeklyGoal} {t("dashboard.lessonsThisWeek")}
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-ink-100 dark:bg-ink-700 overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${weeklyPct}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <span className="eyebrow">{t("dashboard.quickActions")}</span>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="card p-5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-xl bg-azure-50 dark:bg-azure-900/40 flex items-center justify-center text-azure-500 dark:text-azure-300 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-ink-700 dark:text-ink-100">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 card p-6">
        <span className="eyebrow">{t("dashboard.recentActivity")}</span>
        <div className="mt-3 divide-y divide-ink-100 dark:divide-ink-700">
          {(!progress.activityLog || progress.activityLog.length === 0) && (
            <p className="text-sm text-ink-400 py-4">{t("dashboard.noActivity")}</p>
          )}
          {progress.activityLog?.slice(0, 6).map((item, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-700 dark:text-ink-100">{item.label}</p>
                <p className="text-xs text-ink-400 capitalize">{item.type}</p>
              </div>
              <span className="text-xs text-ink-400 shrink-0">{new Date(item.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
