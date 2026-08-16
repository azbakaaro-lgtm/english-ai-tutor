import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, Mic, BookOpen, TrendingUp, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitch from "../components/LanguageSwitch";
import ThemeToggle from "../components/ThemeToggle";
import { StarGlyph, LevelStars } from "../components/Star";

const features = [
  { icon: Sparkles, titleKey: "feat1Title", bodyKey: "feat1Body" },
  { icon: MessageCircle, titleKey: "feat2Title", bodyKey: "feat2Body" },
  { icon: Mic, titleKey: "feat3Title", bodyKey: "feat3Body" },
  { icon: BookOpen, titleKey: "feat4Title", bodyKey: "feat4Body" },
  { icon: TrendingUp, titleKey: "feat5Title", bodyKey: "feat5Body" },
];

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-ink-800 dark:bg-gold-400 flex items-center justify-center">
            <StarGlyph className="w-[18px] h-[18px] text-gold-400 dark:text-ink-900" />
          </div>
          <span className="font-display font-semibold text-lg text-ink-800 dark:text-white">{t("appName")}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
          <Link to="/login" className="btn-ghost !px-4 !py-2 text-sm hidden sm:inline-flex">
            {t("nav.login")}
          </Link>
          <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
            {t("nav.register")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-star-field pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="eyebrow">{t("landing.eyebrow")}</span>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold text-ink-900 dark:text-white">
                {t("landing.heroTitle")}
              </h1>
              <p className="mt-5 text-lg text-ink-500 dark:text-ink-300 max-w-xl">{t("landing.heroSubtitle")}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/register" className="btn-gold text-base">
                  {t("landing.ctaPrimary")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-ghost text-base">
                  {t("landing.ctaSecondary")}
                </Link>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 pill bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300">
                <Check className="w-3.5 h-3.5" />
                {t("landing.demoBadge")}
              </div>
            </div>

            <div className="relative">
              <HeroPanel />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <span className="eyebrow">{t("landing.featuresEyebrow")}</span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-white max-w-xl">
          {t("landing.featuresTitle")}
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, titleKey, bodyKey }) => (
            <div key={titleKey} className="card p-6">
              <div className="w-10 h-10 rounded-xl bg-azure-50 dark:bg-azure-900/40 flex items-center justify-center text-azure-500 dark:text-azure-300">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-lg text-ink-800 dark:text-white">{t(`landing.${titleKey}`)}</h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{t(`landing.${bodyKey}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels */}
      <section className="bg-white dark:bg-ink-900 border-y border-ink-100 dark:border-ink-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <span className="eyebrow">{t("landing.levelsEyebrow")}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-white max-w-xl">{t("landing.levelsTitle")}</h2>
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {[
              { key: "beginner", level: "beginner" },
              { key: "intermediate", level: "intermediate" },
              { key: "advanced", level: "advanced" },
            ].map(({ key, level }) => (
              <div key={key} className="card p-6">
                <LevelStars level={level} />
                <h3 className="mt-4 font-display font-semibold text-lg text-ink-800 dark:text-white">{t(`landing.${key}`)}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{t(`landing.${key}Body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-white">{t("landing.finalCtaTitle")}</h2>
        <p className="mt-4 text-ink-500 dark:text-ink-300 max-w-xl mx-auto">{t("landing.finalCtaBody")}</p>
        <Link to="/register" className="btn-gold text-base mt-8 inline-flex">
          {t("landing.ctaPrimary")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="border-t border-ink-100 dark:border-ink-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-ink-400">
          <span>© {new Date().getFullYear()} {t("appName")}</span>
          <span>{t("landing.footerNote")}</span>
        </div>
      </footer>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="card p-5 sm:p-6 max-w-md mx-auto lg:ml-auto animate-starPop">
      <div className="flex items-center justify-between">
        <span className="pill bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300">AI Tutor</span>
        <LevelStars level="intermediate" size="w-4 h-4" />
      </div>
      <div className="mt-4 space-y-3">
        <ChatBubble align="left" en="Yesterday I go to market." so="Khaladka: 'go' waa 'went' (past)." />
        <ChatBubble align="right" en="Yesterday I went to the market." />
        <ChatBubble align="left" en="Great fix! Tell me — what did you buy?" />
      </div>
      <div className="mt-5 pt-4 border-t border-ink-100 dark:border-ink-700 flex items-center justify-between text-sm">
        <span className="text-ink-400">Vocabulary learned</span>
        <span className="font-mono font-semibold text-ink-700 dark:text-ink-100">128</span>
      </div>
    </div>
  );
}

function ChatBubble({ align, en, so }) {
  const isLeft = align === "left";
  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isLeft
            ? "bg-ink-100 dark:bg-ink-700 text-ink-700 dark:text-ink-100 rounded-tl-sm"
            : "bg-azure-500 text-white rounded-tr-sm"
        }`}
      >
        <p>{en}</p>
        {so && <p className="mt-1 text-xs opacity-80">{so}</p>}
      </div>
    </div>
  );
}
