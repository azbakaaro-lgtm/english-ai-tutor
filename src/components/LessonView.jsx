import { useState } from "react";
import { Globe2, Volume2, BookOpen, Headphones, CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { speak, isTTSSupported } from "../utils/speech";
import AudioButton from "./AudioButton";

// Full read/interact view of a lesson: grammar explanation, examples,
// vocabulary, reading, listening, exercises, and quiz. This is the SAME
// component rendered on the student-facing Lessons page and inside the
// Admin Dashboard's "Preview as user" — per spec, there is no separate
// admin preview design.
export default function LessonView({ lesson }) {
  const { t, lang } = useLanguage();
  const [showSomali, setShowSomali] = useState(lang === "so");
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);

  const exerciseScore = lesson.exercises?.length
    ? lesson.exercises.filter((ex) => normalize(answers[ex.id]) === normalize(ex.answer)).length
    : 0;
  const quizScore = lesson.quiz?.length
    ? lesson.quiz.filter((q) => quizAnswers[q.id] === q.answer).length
    : 0;

  return (
    <div className="space-y-5">
      <div className="card p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="pill bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300">{t(`common.${lesson.level}`)}</span>
          <button onClick={() => setShowSomali((s) => !s)} className="btn-ghost !px-3 !py-1.5 text-xs">
            <Globe2 className="w-3.5 h-3.5" />
            {t("lessons.somaliExplanation")}
          </button>
        </div>
        <h2 className="mt-3 text-xl font-display font-semibold text-ink-900 dark:text-white">{lesson.topic}</h2>

        <div className="mt-5 border-t border-ink-100 dark:border-ink-700 pt-5">
          <span className="eyebrow">{t("lessons.grammarFocus")}</span>
          <h3 className="mt-1 font-semibold text-ink-800 dark:text-white">{lesson.grammarTitle}</h3>
          <div className="mt-2 flex items-start gap-2">
            <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed flex-1">{lesson.explanationEn}</p>
            <AudioButton text={lesson.explanationEn} size="small" />
          </div>
          {showSomali && (
            <p className="mt-2 text-sm text-azure-600 dark:text-azure-300 leading-relaxed bg-azure-50 dark:bg-azure-900/30 rounded-lg p-3">
              {lesson.explanationSo}
            </p>
          )}
        </div>

        {lesson.examples?.length > 0 && (
          <div className="mt-5 border-t border-ink-100 dark:border-ink-700 pt-5">
            <span className="eyebrow">{t("lessons.examples")}</span>
            <ul className="mt-2 space-y-2">
              {lesson.examples.map((ex, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-ink-700 dark:text-ink-100">• {ex.en}</p>
                    {showSomali && <p className="text-ink-400 dark:text-ink-400 ml-3">{ex.so}</p>}
                  </div>
                  <AudioButton text={ex.en} size="small" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {lesson.vocabulary?.length > 0 && (
          <div className="mt-5 border-t border-ink-100 dark:border-ink-700 pt-5">
            <span className="eyebrow">{t("lessons.keyVocabulary")}</span>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {lesson.vocabulary.map((v) => (
                <div key={v.id} className="rounded-xl bg-ink-50 dark:bg-ink-900/60 px-3.5 py-2.5 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-800 dark:text-white">{v.word} <span className="font-normal text-ink-400">— {v.somali}</span></p>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 italic">{v.example}</p>
                  </div>
                  <AudioButton text={`${v.word}. ${v.example}`} size="small" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {lesson.reading && (
        <div className="card p-6">
          <span className="eyebrow flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {t("lessons.reading")}</span>
          <h3 className="mt-1 font-semibold text-ink-800 dark:text-white">{lesson.reading.title}</h3>
          <div className="mt-2 flex items-start gap-2">
            <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed flex-1">{lesson.reading.passage}</p>
            <AudioButton text={lesson.reading.passage} size="small" />
          </div>
          {lesson.reading.questions?.length > 0 && (
            <div className="mt-4 border-t border-ink-100 dark:border-ink-700 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t("lessons.readingQuestions")}</span>
              <InlineQuizBlock questions={lesson.reading.questions} t={t} />
            </div>
          )}
        </div>
      )}

      {lesson.listening && (
        <div className="card p-6">
          <span className="eyebrow flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5" /> {t("lessons.listening")}</span>
          <button
            onClick={() => speak(lesson.listening.script, { lang: "en-US" })}
            disabled={!isTTSSupported()}
            className="btn-ghost mt-3 !px-3.5 !py-2 text-sm"
          >
            <Volume2 className="w-4 h-4" />
            {t("speaking.listen")}
          </button>
          {lesson.listening.questions?.length > 0 && (
            <div className="mt-4 border-t border-ink-100 dark:border-ink-700 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t("lessons.listeningQuestions")}</span>
              <InlineQuizBlock questions={lesson.listening.questions} t={t} />
            </div>
          )}
        </div>
      )}

      {lesson.exercises?.length > 0 && (
        <div className="card p-6">
          <span className="eyebrow">{t("lessons.exercises")}</span>
          <div className="mt-3 space-y-4">
            {lesson.exercises.map((ex, i) => (
              <ExerciseItem key={ex.id} index={i} ex={ex} value={answers[ex.id]} checked={checked}
                onChange={(val) => setAnswers((a) => ({ ...a, [ex.id]: val }))} t={t} />
            ))}
          </div>
          {!checked ? (
            <button onClick={() => setChecked(true)} className="btn-primary mt-5">
              {t("lessons.checkAnswers")}
            </button>
          ) : (
            <p className="mt-5 text-sm font-medium text-ink-600 dark:text-ink-300">
              {exerciseScore} / {lesson.exercises.length}
            </p>
          )}
        </div>
      )}

      {lesson.quiz?.length > 0 && (
        <div className="card p-6">
          <span className="eyebrow">{t("quiz.title")}</span>
          <div className="mt-3 space-y-4">
            {lesson.quiz.map((q, i) => (
              <div key={q.id}>
                <div className="flex items-start gap-2">
                  <p className="text-sm font-medium text-ink-700 dark:text-ink-100 flex-1">{i + 1}. {q.prompt}</p>
                  <AudioButton text={q.prompt} size="small" />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const selected = quizAnswers[q.id] === opt;
                    const isRight = opt === q.answer;
                    let cls = "border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800";
                    if (quizChecked && selected) cls = isRight ? "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "border-coral-400 bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300";
                    else if (quizChecked && isRight) cls = "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300";
                    else if (selected) cls = "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300";
                    return (
                      <button
                        key={opt}
                        disabled={quizChecked}
                        onClick={() => setQuizAnswers((a) => ({ ...a, [q.id]: opt }))}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {!quizChecked ? (
            <button onClick={() => setQuizChecked(true)} className="btn-primary mt-5">
              {t("lessons.checkAnswers")}
            </button>
          ) : (
            <p className="mt-5 text-sm font-medium text-ink-600 dark:text-ink-300">
              {quizScore} / {lesson.quiz.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function InlineQuizBlock({ questions, t }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const score = questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div className="mt-3 space-y-4">
      {questions.map((q, i) => (
        <div key={q.id || i}>
          <div className="flex items-start gap-2">
            <p className="text-sm font-medium text-ink-700 dark:text-ink-100 flex-1">{i + 1}. {q.prompt}</p>
            <AudioButton text={q.prompt} size="small" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {q.options.map((opt) => {
              const selected = answers[i] === opt;
              const isRight = opt === q.answer;
              let cls = "border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800";
              if (checked && selected) cls = isRight ? "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "border-coral-400 bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300";
              else if (checked && isRight) cls = "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300";
              else if (selected) cls = "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300";
              return (
                <button
                  key={opt}
                  disabled={checked}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!checked ? (
        <button onClick={() => setChecked(true)} className="btn-ghost !px-3.5 !py-2 text-sm">
          {t("lessons.checkAnswers")}
        </button>
      ) : (
        <p className="text-sm font-medium text-ink-600 dark:text-ink-300">{score} / {questions.length}</p>
      )}
    </div>
  );
}

function ExerciseItem({ index, ex, value, checked, onChange, t }) {
  const isRight = checked && normalize(value) === normalize(ex.answer);
  return (
    <div>
      <div className="flex items-start gap-2">
        <p className="text-sm font-medium text-ink-700 dark:text-ink-100 flex-1">{index + 1}. {ex.prompt}</p>
        <AudioButton text={ex.prompt} size="small" />
      </div>
      {ex.options ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {ex.options.map((opt) => {
            const selected = value === opt;
            let cls = "border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800";
            if (checked && selected) cls = isRight ? "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "border-coral-400 bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300";
            else if (checked && opt === ex.answer) cls = "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300";
            else if (selected) cls = "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300";
            return (
              <button
                key={opt}
                disabled={checked}
                onClick={() => onChange(opt)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type="text"
          disabled={checked}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("lessons.yourAnswer")}
          className="input mt-2 max-w-xs"
        />
      )}
      {checked && (
        <p className={`mt-1.5 text-xs flex items-center gap-1 ${isRight ? "text-teal-600 dark:text-teal-300" : "text-coral-500"}`}>
          {isRight ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {isRight ? t("lessons.correct") : `${t("lessons.incorrect")}: ${ex.answer}`}
        </p>
      )}
    </div>
  );
}

function normalize(s) {
  return (s || "").toString().trim().toLowerCase();
}
