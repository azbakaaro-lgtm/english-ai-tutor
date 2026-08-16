// The five-pointed star is this app's signature motif — echoing the star on
// the Somali flag and doubling as the visual language for streaks, level
// progress and achievement across the product.
export function StarGlyph({ className = "", filled = true }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
      <path d="M12 2.5 L14.7 9.3 L22 9.9 L16.4 14.6 L18.2 21.8 L12 17.8 L5.8 21.8 L7.6 14.6 L2 9.9 L9.3 9.3 Z" strokeLinejoin="round" />
    </svg>
  );
}

// Row of stars representing level: 1 = beginner, 2 = intermediate, 3 = advanced.
export function LevelStars({ level, size = "w-5 h-5", className = "" }) {
  const filledCount = level === "advanced" ? 3 : level === "intermediate" ? 2 : 1;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3].map((i) => (
        <StarGlyph key={i} filled={i <= filledCount} className={`${size} ${i <= filledCount ? "text-gold-400" : "text-ink-200 dark:text-ink-600"}`} />
      ))}
    </div>
  );
}
