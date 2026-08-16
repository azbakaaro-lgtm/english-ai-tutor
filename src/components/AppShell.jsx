import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  MessageCircle,
  Mic,
  BookOpen,
  ListChecks,
  TrendingUp,
  UserCircle,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  BookText,
  Feather,
  Headphones,
  MessagesSquare,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import LanguageSwitch from "./LanguageSwitch";
import ThemeToggle from "./ThemeToggle";
import { StarGlyph } from "./Star";
import StreakBadge from "./StreakBadge";

const navItems = [
  { to: "/app", key: "dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/lessons", key: "lessons", icon: Sparkles },
  { to: "/app/reading", key: "reading", icon: BookText },
  { to: "/app/listening", key: "listening", icon: Headphones },
  { to: "/app/stories", key: "stories", icon: Feather },
  { to: "/app/conversations", key: "conversations", icon: MessagesSquare },
  { to: "/app/chat", key: "chatbot", icon: MessageCircle },
  { to: "/app/speaking", key: "speaking", icon: Mic },
  { to: "/app/vocabulary", key: "vocabulary", icon: BookOpen },
  { to: "/app/quiz", key: "quiz", icon: ListChecks },
  { to: "/app/progress", key: "progress", icon: TrendingUp },
];

export default function AppShell({ children }) {
  const { t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allNavItems = isAdmin
    ? [...navItems, { to: "/app/admin", key: "admin", icon: ShieldCheck }]
    : navItems;

  function handleLogout() {
    logout();
    navigate("/");
  }

  const NavList = ({ onNavigate }) => (
    <nav className="flex flex-col gap-1">
      {allNavItems.map(({ to, key, icon: Icon, end }) => (
        <NavLink
          key={key}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-azure-500 text-white shadow-sm"
                : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700"
            }`
          }
        >
          <Icon className="w-[18px] h-[18px] shrink-0" />
          <span>{t(`nav.${key}`)}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-5">
        <BrandMark />
        <div className="mt-6 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <div className="border-t border-ink-100 dark:border-ink-800 pt-4 mt-4 space-y-3">
          <StreakBadge streak={progress.streak} label={t("dashboard.streak").toLowerCase()} size="small" />
          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-azure-500 text-white" : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700"
              }`
            }
          >
            <UserCircle className="w-[18px] h-[18px]" />
            <span className="truncate">{user?.name || t("nav.profile")}</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-500/10 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 dark:border-ink-800 bg-white/90 dark:bg-ink-900/90 backdrop-blur px-4 py-3">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-2 -ml-2 text-ink-600 dark:text-ink-200">
          <Menu className="w-6 h-6" />
        </button>
        <BrandMark small />
        <StreakBadge streak={progress.streak} label="" size="small" />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white dark:bg-ink-900 h-full px-4 py-5 flex flex-col animate-[starPop_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <BrandMark />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-1 text-ink-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavList onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-ink-100 dark:border-ink-800 pt-4 mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <LanguageSwitch compact />
                <ThemeToggle />
              </div>
              <NavLink
                to="/app/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700"
              >
                <UserCircle className="w-[18px] h-[18px]" />
                <span className="truncate">{user?.name || t("nav.profile")}</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-500/10"
              >
                <LogOut className="w-[18px] h-[18px]" />
                {t("nav.logout")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="hidden lg:flex items-center justify-end gap-3 px-8 pt-5">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}

function BrandMark({ small = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-ink-800 dark:bg-gold-400 flex items-center justify-center">
        <StarGlyph className="w-4 h-4 text-gold-400 dark:text-ink-900" />
      </div>
      {!small && <span className="font-display font-semibold text-ink-800 dark:text-white leading-tight">English AI Tutor</span>}
    </div>
  );
}
