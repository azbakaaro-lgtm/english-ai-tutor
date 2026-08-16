import { useState } from "react";
import { Volume2, Square, CheckCircle2 } from "lucide-react";
import { speak, stopSpeaking, isTTSSupported } from "../utils/speech";
import { useLanguage } from "../context/LanguageContext";
import AudioButton from "./AudioButton";

// Shared read-only renderer for Reading / Listening / Story items. This is
// the SAME component used on the student-facing pages and inside the Admin
// "Preview as User" panel — per the spec, admin must see exactly what a
// student sees, with no separate preview design.

export function QuestionBlock({ questions, onComplete }) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  if (!questions || questions.length === 0) return null;
  const scorable = questions.filter((q) => q.options?.length > 0);
  const score = scorable.filter((q) => answers[questions.indexOf(q)] === q.answer).length;

  function handleCheck() {
    setChecked(true);
    onComplete?.(score, scorable.length);
  }

  return (
    <div className="mt-5 border-t border-ink-100 dark:border-ink-700 pt-4 space-y-4">
      {questions.map((q, i) => {
        const selected = answers[i];
        const isRight = checked && selected === q.answer;
        return (
          <div key={i}>
            <div className="flex items-start gap-2">
              <p className="text-sm font-medium text-ink-700 dark:text-ink-100 flex-1">{i + 1}. {q.prompt}</p>
              <AudioButton text={q.prompt} size="small" />
            </div>
            {q.options?.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const isSelected = selected === opt;
                  const optRight = opt === q.answer;
                  let cls = "border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800";
                  if (checked && isSelected) cls = optRight ? "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300" : "border-coral-400 bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300";
                  else if (checked && optRight) cls = "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300";
                  else if (isSelected) cls = "border-azure-500 bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300";
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
            ) : (
              <p className="mt-1 text-xs text-ink-400 italic">{q.answer}</p>
            )}
            {checked && q.explanation && (
              <p className={`mt-1.5 text-xs flex items-start gap-1 ${isRight ? "text-teal-600 dark:text-teal-300" : "text-ink-500 dark:text-ink-400"}`}>
                {isRight ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : null}
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}
      {scorable.length > 0 && (
        !checked ? (
          <button onClick={handleCheck} className="btn-ghost !px-3.5 !py-2 text-sm">
            {t("lessons.checkAnswers")}
          </button>
        ) : (
          <p className="text-sm font-medium text-ink-600 dark:text-ink-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-500" /> {score} / {scorable.length}
          </p>
        )
      )}
    </div>
  );
}

export function ReadingView({ item, onComplete }) {
  const { t } = useLanguage();
  const [showSomali, setShowSomali] = useState(false);
  return (
    <div className="card p-6">
      <span className="pill bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300">{t(`common.${item.level}`)}</span>
      <h2 className="mt-3 text-xl font-display font-semibold text-ink-900 dark:text-white">{item.title}</h2>
      <div className="mt-4 flex items-start gap-2">
        <div className="richtext-display text-sm text-ink-700 dark:text-ink-200 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: item.contentEn || "" }} />
        <AudioButton text={stripHtml(item.contentEn)} size="small" />
      </div>
      {item.contentSo && (
        <>
          <button onClick={() => setShowSomali((s) => !s)} className="btn-ghost mt-4 !px-3.5 !py-2 text-xs">
            {t("lessons.somaliExplanation")}
          </button>
          {showSomali && (
            <div className="richtext-display mt-3 text-sm text-azure-600 dark:text-azure-300 leading-relaxed bg-azure-50 dark:bg-azure-900/30 rounded-lg p-3" dangerouslySetInnerHTML={{ __html: item.contentSo }} />
          )}
        </>
      )}
      <QuestionBlock questions={item.questions} onComplete={onComplete} />
    </div>
  );
}

export function ListeningView({ item, onComplete }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  function handlePlay() {
    setPlaying(true);
    speak(item.transcriptEn, { lang: "en-US", onEnd: () => setPlaying(false) });
  }
  function handleStop() {
    stopSpeaking();
    setPlaying(false);
  }

  return (
    <div className="card p-6">
      <span className="pill bg-azure-50 text-azure-600 dark:bg-azure-900/40 dark:text-azure-300">{t(`common.${item.level}`)}</span>
      <h2 className="mt-3 text-xl font-display font-semibold text-ink-900 dark:text-white">{item.title}</h2>
      <div className="mt-4 flex items-center gap-2">
        {!playing ? (
          <button onClick={handlePlay} disabled={!isTTSSupported()} className="btn-primary">
            <Volume2 className="w-4 h-4" /> {t("speaking.listen")}
          </button>
        ) : (
          <button onClick={handleStop} className="btn-primary !bg-coral-500 hover:!bg-coral-600">
            <Square className="w-4 h-4" /> {t("speaking.recordStop")}
          </button>
        )}
        <button onClick={() => setShowTranscript((s) => !s)} className="btn-ghost !px-3.5 !py-2 text-xs">
          {showTranscript ? t("common.close") : t("lessons.somaliExplanation")}
        </button>
      </div>
      {showTranscript && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">{item.transcriptEn}</p>
          {item.transcriptSo && <p className="text-sm text-azure-600 dark:text-azure-300 leading-relaxed bg-azure-50 dark:bg-azure-900/30 rounded-lg p-3">{item.transcriptSo}</p>}
        </div>
      )}
      <QuestionBlock questions={item.questions} onComplete={onComplete} />
    </div>
  );
}

export function StoryView({ item, onComplete }) {
  const { t } = useLanguage();
  const [showSomali, setShowSomali] = useState(false);
  return (
    <div className="card p-6">
      <span className="pill bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-300">{t(`common.${item.level}`)}</span>
      <h2 className="mt-3 text-xl font-display font-semibold text-ink-900 dark:text-white">{item.title}</h2>
      <div className="mt-4 flex items-start gap-2">
        <div className="richtext-display text-sm text-ink-700 dark:text-ink-200 leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: item.storyEn || "" }} />
        <AudioButton text={stripHtml(item.storyEn)} size="small" />
      </div>
      {item.storySo && (
        <>
          <button onClick={() => setShowSomali((s) => !s)} className="btn-ghost mt-4 !px-3.5 !py-2 text-xs">
            {t("lessons.somaliExplanation")}
          </button>
          {showSomali && (
            <div className="richtext-display mt-3 text-sm text-azure-600 dark:text-azure-300 leading-relaxed bg-azure-50 dark:bg-azure-900/30 rounded-lg p-3" dangerouslySetInnerHTML={{ __html: item.storySo }} />
          )}
        </>
      )}
      {item.vocabulary?.length > 0 && (
        <div className="mt-5 border-t border-ink-100 dark:border-ink-700 pt-4">
          <span className="eyebrow">{t("lessons.keyVocabulary")}</span>
          <div className="mt-2 grid sm:grid-cols-2 gap-2">
            {item.vocabulary.map((v, i) => (
              <div key={i} className="rounded-xl bg-ink-50 dark:bg-ink-900/60 px-3.5 py-2.5">
                <p className="text-sm font-semibold text-ink-800 dark:text-white">{v.word} <span className="font-normal text-ink-400">— {v.somali}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}
      <QuestionBlock questions={item.questions} onComplete={onComplete} />
    </div>
  );
}

// Sanity guard: XSS is a real concern with dangerouslySetInnerHTML. Content
// here only ever comes from authenticated admins/editors with createContent
// permission (never raw end-user input), which is the same trust boundary
// already required to write to the database in the first place.
export const VIEWERS = { reading: ReadingView, listening: ListeningView, story: StoryView };

// Strips HTML tags before handing text to the speech synthesizer, so it
// reads words, not markup.
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
