import { useState, useMemo, useEffect } from "react";
import { Search, Star, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProgress } from "../context/ProgressContext";
import { vocabularyBank } from "../data/vocabulary";
import { fetchPublicVocabulary } from "../utils/contentService";
import AudioButton from "../components/AudioButton";

const levels = ["all", "beginner", "intermediate", "advanced"];

export default function Vocabulary() {
  const { t } = useLanguage();
  const { progress, toggleFavoriteWord } = useProgress();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [favOnly, setFavOnly] = useState(false);
  const [adminWords, setAdminWords] = useState([]);

  useEffect(() => {
    fetchPublicVocabulary().then(setAdminWords);
  }, []);

  const allWords = useMemo(() => [...vocabularyBank, ...adminWords], [adminWords]);

  const favorites = useMemo(() => new Set(progress.favoriteWords || []), [progress.favoriteWords]);

  const filtered = useMemo(() => {
    return allWords.filter((v) => {
      if (level !== "all" && v.level !== level) return false;
      if (favOnly && !favorites.has(v.id)) return false;
      if (query && !`${v.word} ${v.somali}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, level, favOnly, favorites, allWords]);

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("vocabulary.title")}</h1>
          <p className="mt-1 text-ink-500 dark:text-ink-300">{t("vocabulary.subtitle")}</p>
        </div>
        <span className="pill bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
          {progress.vocabLearned?.length || 0} {t("vocabulary.wordsLearned")}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("vocabulary.search")}
            className="input !pl-10"
          />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="input !w-auto !py-2 text-sm">
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl === "all" ? t("vocabulary.allLevels") : t(`common.${lvl}`)}</option>
          ))}
        </select>
        <button
          onClick={() => setFavOnly((f) => !f)}
          className={`btn-ghost !px-3.5 !py-2 text-sm ${favOnly ? "!border-gold-400 !text-gold-600 dark:!text-gold-300" : ""}`}
        >
          <Star className={`w-4 h-4 ${favOnly ? "fill-gold-400 text-gold-400" : ""}`} />
          {t("vocabulary.favoritesOnly")}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink-400">{t("vocabulary.noResults")}</p>
      ) : (
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => {
            const isFav = favorites.has(v.id);
            return (
              <div key={v.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-semibold text-ink-900 dark:text-white">{v.word}</p>
                    <p className="text-sm text-azure-500 dark:text-azure-300">{v.somali}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <AudioButton text={`${v.word}. ${v.example || ""}`} size="small" />
                    <button
                      onClick={() => toggleFavoriteWord(v.id)}
                      aria-label={isFav ? t("vocabulary.removeFavorite") : t("vocabulary.addFavorite")}
                      className="p-1.5 rounded-full text-ink-400 hover:text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-500/10"
                    >
                      <Star className={`w-4 h-4 ${isFav ? "fill-gold-400 text-gold-400" : ""}`} />
                    </button>
                  </div>
                </div>
                <p className="mt-2.5 text-xs text-ink-500 dark:text-ink-400 italic leading-relaxed">
                  <span className="not-italic font-medium text-ink-400 dark:text-ink-500">{t("vocabulary.example")}: </span>
                  {v.example}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="pill bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300 !text-[10px]">
                    {v.level}
                  </span>
                  {v.topic && (
                    <span className="pill bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-300 !text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" /> {v.topic}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
