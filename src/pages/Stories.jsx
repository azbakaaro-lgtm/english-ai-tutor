import { useState, useEffect } from "react";
import { ArrowLeft, Feather } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProgress } from "../context/ProgressContext";
import { fetchPublicStories } from "../utils/contentService";
import { StoryView } from "../components/ContentView";

const levels = ["all", "beginner", "intermediate", "advanced"];

export default function Stories() {
  const { t } = useLanguage();
  const { recordQuiz } = useProgress();
  const [level, setLevel] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPublicStories(level === "all" ? null : level).then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, [level]);

  if (selected) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => setSelected(null)} className="btn-ghost !px-3 !py-1.5 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> {t("stories.title")}
        </button>
        <StoryView item={selected} onComplete={(score, total) => recordQuiz(score, total, "story", selected.level)} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("stories.title")}</h1>
      <p className="mt-1 text-ink-500 dark:text-ink-300 max-w-xl">{t("stories.subtitle")}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              level === lvl
                ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                : "border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
            }`}
          >
            {lvl === "all" ? t("vocabulary.allLevels") : t(`common.${lvl}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-400">{t("common.loading")}</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-center text-ink-400">{t("stories.empty")}</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="card p-5 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-300">
                <Feather className="w-4 h-4" />
              </div>
              <p className="mt-3 font-semibold text-ink-800 dark:text-white">{item.title}</p>
              <span className="mt-2 inline-block pill bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300 !text-[10px]">{item.level}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
