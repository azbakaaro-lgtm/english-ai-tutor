import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { defaultProgress, touchActivity, logActivity } from "../utils/storage";
import { fetchProgress, persistProgress } from "../utils/progressService";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const { user, updateUser } = useAuth();
  const [progress, setProgress] = useState(defaultProgress());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user) {
        const p = await fetchProgress();
        if (!cancelled) setProgress(p || defaultProgress(user.level));
      } else {
        setProgress(defaultProgress());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const persist = useCallback(
    (next) => {
      setProgress(next);
      if (user) persistProgress(next);
    },
    [user]
  );

  const completeLesson = useCallback(
    (lesson) => {
      const next = touchActivity({ ...progress });
      next.lessonsCompleted += 1;
      next.lessonsThisWeek = (next.lessonsThisWeek || 0) + 1;
      const learnedIds = new Set(next.vocabLearned);
      (lesson.vocabulary || []).forEach((v) => learnedIds.add(v.id));
      next.vocabLearned = Array.from(learnedIds);
      logActivity(next, "lesson", lesson.topic, { level: lesson.level });
      persist(next);
    },
    [progress, persist]
  );

  const recordQuiz = useCallback(
    (score, total, category, level) => {
      const next = touchActivity({ ...progress });
      next.quizzes = [{ date: new Date().toISOString(), score, total, category, level }, ...(next.quizzes || [])].slice(0, 50);
      logActivity(next, "quiz", `${category} quiz — ${score}/${total}`, { level });
      persist(next);
    },
    [progress, persist]
  );

  const recordSpeakingSession = useCallback(
    (phrase, score) => {
      const next = touchActivity({ ...progress });
      next.speakingSessions = (next.speakingSessions || 0) + 1;
      logActivity(next, "speaking", phrase, { score });
      persist(next);
    },
    [progress, persist]
  );

  const toggleFavoriteWord = useCallback(
    (wordId) => {
      const next = { ...progress };
      const set = new Set(next.favoriteWords || []);
      if (set.has(wordId)) set.delete(wordId);
      else set.add(wordId);
      next.favoriteWords = Array.from(set);
      persist(next);
    },
    [progress, persist]
  );

  const markVocabLearned = useCallback(
    (wordIds) => {
      const next = { ...progress };
      const set = new Set(next.vocabLearned || []);
      wordIds.forEach((id) => set.add(id));
      next.vocabLearned = Array.from(set);
      persist(next);
    },
    [progress, persist]
  );

  const setLevel = useCallback(
    (level) => {
      const next = { ...progress, level };
      persist(next);
      if (user) updateUser({ level });
    },
    [progress, persist, user, updateUser]
  );

  const resetProgress = useCallback(() => {
    const next = defaultProgress(progress.level);
    persist(next);
  }, [progress.level, persist]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeLesson,
        recordQuiz,
        recordSpeakingSession,
        toggleFavoriteWord,
        markVocabLearned,
        setLevel,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
