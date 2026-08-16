import { useLanguage } from "../context/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageSwitch({ compact = false }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-800 p-1 text-sm">
      {!compact && <Languages className="w-4 h-4 ml-1.5 mr-0.5 text-ink-400" aria-hidden="true" />}
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
          lang === "en" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300 hover:text-ink-800 dark:hover:text-white"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("so")}
        className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
          lang === "so" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300 hover:text-ink-800 dark:hover:text-white"
        }`}
        aria-pressed={lang === "so"}
      >
        SO
      </button>
    </div>
  );
}
