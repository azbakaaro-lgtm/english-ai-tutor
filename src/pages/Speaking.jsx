import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, Mic, Square, ArrowRight, AlertTriangle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProgress } from "../context/ProgressContext";
import { speakingPhrases } from "../data/speakingPhrases";
import {
  isSpeechRecognitionSupported,
  isTTSSupported,
  speak,
  createRecognizer,
  similarityScore,
} from "../utils/speech";

const levels = ["beginner", "intermediate", "advanced"];

export default function Speaking() {
  const { t } = useLanguage();
  const { progress, recordSpeakingSession } = useProgress();
  const [level, setLevel] = useState(progress.level || "beginner");
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(null);
  const recognizerRef = useRef(null);

  const phrases = speakingPhrases[level] || speakingPhrases.beginner;
  const phrase = phrases[index % phrases.length];

  const sttSupported = isSpeechRecognitionSupported();
  const ttsSupported = isTTSSupported();

  useEffect(() => {
    return () => recognizerRef.current?.stop?.();
  }, []);

  function handleListenTarget() {
    speak(phrase, { lang: "en-US" });
  }

  const startRecording = useCallback(() => {
    if (!sttSupported) return;
    setTranscript("");
    setScore(null);
    const recognizer = createRecognizer({
      lang: "en-US",
      onResult: (text) => {
        setTranscript(text);
        const s = similarityScore(text, phrase);
        setScore(s);
        recordSpeakingSession(phrase, s);
      },
      onEnd: () => setRecording(false),
      onError: () => setRecording(false),
    });
    recognizerRef.current = recognizer;
    recognizer.start();
    setRecording(true);
  }, [phrase, sttSupported, recordSpeakingSession]);

  function stopRecording() {
    recognizerRef.current?.stop?.();
    setRecording(false);
  }

  function nextPhrase() {
    setIndex((i) => (i + 1) % phrases.length);
    setTranscript("");
    setScore(null);
  }

  function scoreLabel() {
    if (score === null) return null;
    if (score >= 80) return t("speaking.great");
    if (score >= 50) return t("speaking.good");
    return t("speaking.practiceMore");
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">{t("speaking.title")}</h1>
          <p className="mt-1 text-ink-500 dark:text-ink-300 max-w-xl">{t("speaking.subtitle")}</p>
        </div>
        <select value={level} onChange={(e) => { setLevel(e.target.value); setIndex(0); setTranscript(""); setScore(null); }} className="input !w-auto !py-2 text-sm">
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>{t(`common.${lvl}`)}</option>
          ))}
        </select>
      </div>

      {!sttSupported && (
        <div className="mt-5 card p-4 border-gold-300 bg-gold-50 dark:bg-gold-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gold-700 dark:text-gold-300">{t("speaking.notSupported")}</p>
        </div>
      )}

      <div className="mt-6 card p-8 max-w-2xl text-center">
        <span className="eyebrow">{t("speaking.target")}</span>
        <p className="mt-3 text-2xl font-display font-semibold text-ink-900 dark:text-white leading-snug">{phrase}</p>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <button onClick={handleListenTarget} disabled={!ttsSupported} className="btn-ghost">
            <Volume2 className="w-4 h-4" />
            {t("speaking.listen")}
          </button>
          {!recording ? (
            <button onClick={startRecording} disabled={!sttSupported} className="btn-primary">
              <Mic className="w-4 h-4" />
              {t("speaking.recordStart")}
            </button>
          ) : (
            <button onClick={stopRecording} className="btn-primary !bg-coral-500 hover:!bg-coral-600">
              <Square className="w-4 h-4" />
              {t("speaking.recordStop")}
            </button>
          )}
        </div>

        {recording && <p className="mt-4 text-sm text-azure-500 animate-pulse">{t("speaking.recording")}</p>}
        {!ttsSupported && <p className="mt-4 text-xs text-ink-400">{t("speaking.ttsNotSupported")}</p>}

        {transcript && (
          <div className="mt-6 rounded-xl bg-ink-50 dark:bg-ink-900/60 p-4 text-left">
            <p className="text-xs text-ink-400">{t("speaking.youSaid")}</p>
            <p className="mt-1 text-sm font-medium text-ink-800 dark:text-white">"{transcript}"</p>
            {score !== null && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
                  <span>{t("speaking.scoreLabel")}</span>
                  <span className="font-mono font-semibold">{score}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-ink-100 dark:bg-ink-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${score >= 80 ? "bg-teal-400" : score >= 50 ? "bg-gold-400" : "bg-coral-400"}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-ink-700 dark:text-ink-200">{scoreLabel()}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={nextPhrase} className="btn-ghost">
            {t("speaking.nextPhrase")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
