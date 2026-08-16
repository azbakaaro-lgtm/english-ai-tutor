import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Sun, Moon, Trash2, LogOut } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { useTheme } from "../context/ThemeContext";
import LanguageSwitch from "../components/LanguageSwitch";

const levels = ["beginner", "intermediate", "advanced"];

export default function Profile() {
  const { t } = useLanguage();
  const { user, updateUser, logout } = useAuth();
  const { progress, setLevel, resetProgress } = useProgress();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    updateUser({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    if (window.confirm(t("profile.resetConfirm"))) {
      resetProgress();
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("profile.title")}</h1>

      <form onSubmit={handleSave} className="mt-6 card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("profile.name")}</label>
          <input type="text" className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("profile.email")}</label>
          <input type="email" className="input mt-1.5 opacity-70" value={user?.email || ""} disabled />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("profile.level")}</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {levels.map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  progress.level === lvl
                    ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                    : "border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
                }`}
              >
                {t(`common.${lvl}`)}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary">
          <Save className="w-4 h-4" />
          {saved ? t("profile.saved") : t("profile.saveChanges")}
        </button>
      </form>

      <div className="mt-5 card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("profile.language")}</span>
          <LanguageSwitch />
        </div>
        <div className="flex items-center justify-between border-t border-ink-100 dark:border-ink-700 pt-4">
          <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("profile.theme")}</span>
          <div className="inline-flex rounded-full border border-ink-200 dark:border-ink-600 p-1">
            <button
              onClick={() => setTheme("light")}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${theme === "light" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300"}`}
            >
              <Sun className="w-3.5 h-3.5" /> {t("profile.light")}
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${theme === "dark" ? "bg-azure-500 text-white" : "text-ink-500 dark:text-ink-300"}`}
            >
              <Moon className="w-3.5 h-3.5" /> {t("profile.dark")}
            </button>
          </div>
        </div>
        <div className="border-t border-ink-100 dark:border-ink-700 pt-4">
          <button onClick={handleLogout} className="btn-ghost w-full sm:w-auto">
            <LogOut className="w-4 h-4" />
            {t("profile.logoutAll")}
          </button>
        </div>
      </div>

      <div className="mt-5 card p-6 border-coral-200 dark:border-coral-500/30">
        <span className="eyebrow !text-coral-500">{t("profile.dangerZone")}</span>
        <button onClick={handleReset} className="btn-ghost mt-3 !border-coral-300 !text-coral-500 hover:!bg-coral-50 dark:hover:!bg-coral-500/10">
          <Trash2 className="w-4 h-4" />
          {t("profile.resetProgress")}
        </button>
      </div>
    </div>
  );
}
