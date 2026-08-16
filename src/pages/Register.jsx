import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { AuthLayout } from "./Login";
import BackendRequiredNotice from "../components/BackendRequiredNotice";

const levels = ["beginner", "intermediate", "advanced"];

export default function Register() {
  const { t } = useLanguage();
  const { register, backendConfigured } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", level: "beginner" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!backendConfigured) return <BackendRequiredNotice />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError(t("auth.errorRequired"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("auth.errorPasswordMatch"));
      return;
    }
    setSubmitting(true);
    const res = await register(form);
    setSubmitting(false);
    if (!res.ok) {
      setError(t(`auth.${res.error}`));
      return;
    }
    navigate("/app");
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">{t("auth.registerTitle")}</h1>
      <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{t("auth.registerSubtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("auth.name")}</label>
          <input
            type="text"
            className="input mt-1.5"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Amina Hassan"
            autoComplete="name"
          />
        </div>
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("auth.password")}</label>
            <input
              type="password"
              className="input mt-1.5"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t("auth.passwordPlaceholder")}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("auth.confirmPassword")}</label>
            <input
              type="password"
              className="input mt-1.5"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700 dark:text-ink-200">{t("auth.englishLevel")}</label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {levels.map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setForm({ ...form, level: lvl })}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  form.level === lvl
                    ? "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300"
                    : "border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
                }`}
              >
                {t(`common.${lvl}`)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-coral-500">{error}</p>}
        {submitting && <p className="text-xs text-ink-400">{t("admin.slowServerHint")}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          <UserPlus className="w-4 h-4" />
          {t("auth.submitRegister")}
        </button>
      </form>

      <p className="mt-5 text-sm text-center text-ink-500 dark:text-ink-300">
        <Link to="/login" className="text-azure-500 font-medium hover:underline">
          {t("auth.switchToLogin")}
        </Link>
      </p>
    </AuthLayout>
  );
}
