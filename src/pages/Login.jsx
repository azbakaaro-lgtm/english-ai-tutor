import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { StarGlyph } from "../components/Star";
import LanguageSwitch from "../components/LanguageSwitch";
import ThemeToggle from "../components/ThemeToggle";
import BackendRequiredNotice from "../components/BackendRequiredNotice";

export default function Login() {
  const { t } = useLanguage();
  const { login, backendConfigured } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!backendConfigured) return <BackendRequiredNotice />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError(t("auth.errorRequired"));
      return;
    }
    setSubmitting(true);
    const res = await login(form);
    setSubmitting(false);
    if (!res.ok) {
      setError(t(`auth.${res.error}`));
      return;
    }
    navigate("/app");
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">{t("auth.loginTitle")}</h1>
      <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{t("auth.loginSubtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("auth.email")}</label>
          <input
            type="email"
            className="input mt-1.5"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t("auth.emailPlaceholder")}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("auth.password")}</label>
          <input
            type="password"
            className="input mt-1.5"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder={t("auth.passwordPlaceholder")}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-sm text-coral-500">{error}</p>}
        {submitting && <p className="text-xs text-ink-400">{t("admin.slowServerHint")}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <LogIn className="w-4 h-4" />
          {t("auth.submitLogin")}
        </button>
      </form>

      <p className="mt-5 text-sm text-center text-ink-500 dark:text-ink-300">
        <Link to="/register" className="text-azure-500 font-medium hover:underline">
          {t("auth.switchToRegister")}
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({ children }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-star-field bg-ink-50 dark:bg-ink-950 flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-ink-800 dark:bg-gold-400 flex items-center justify-center">
            <StarGlyph className="w-[18px] h-[18px] text-gold-400 dark:text-ink-900" />
          </div>
          <span className="font-display font-semibold text-lg text-ink-800 dark:text-white">{t("appName")}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="card w-full max-w-md p-7 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
