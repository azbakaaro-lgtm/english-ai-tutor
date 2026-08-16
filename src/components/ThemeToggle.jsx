import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-800 text-ink-600 dark:text-gold-300 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
