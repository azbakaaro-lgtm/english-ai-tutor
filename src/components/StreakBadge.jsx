import { Flame } from "lucide-react";

export default function StreakBadge({ streak = 0, label, size = "default" }) {
  const active = streak > 0;
  const sizes = size === "small" ? "text-xs px-2 py-1 gap-1" : "text-sm px-3 py-1.5 gap-1.5";
  return (
    <div
      className={`pill ${sizes} ${
        active
          ? "bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-300"
          : "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300"
      }`}
    >
      <Flame className={`w-4 h-4 ${active ? "text-gold-400 animate-flicker" : "text-ink-400"}`} />
      <span>
        {streak} {label}
      </span>
    </div>
  );
}
