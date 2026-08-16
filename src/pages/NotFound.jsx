import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { StarGlyph } from "../components/Star";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink-50 dark:bg-ink-950 px-4 text-center">
      <StarGlyph className="w-10 h-10 text-gold-400" />
      <h1 className="mt-4 text-3xl font-display font-semibold text-ink-900 dark:text-white">404</h1>
      <p className="mt-2 text-ink-500 dark:text-ink-300">This page doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        {t("appName")}
      </Link>
    </div>
  );
}
