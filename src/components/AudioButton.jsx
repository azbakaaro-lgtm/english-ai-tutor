import { useState, useEffect } from "react";
import { Volume2, Square } from "lucide-react";
import { speak, stopSpeaking, isTTSSupported } from "../utils/speech";

// A small, reusable play/stop button for reading ENGLISH text aloud via the
// browser's free built-in text-to-speech. Never used on Somali text — pass
// only English strings to `text`. Works on desktop and mobile (any browser
// that implements SpeechSynthesis).
export default function AudioButton({ text, size = "default", className = "" }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  if (!isTTSSupported() || !text) return null;

  function toggle() {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    speak(text, { lang: "en-US", onEnd: () => setPlaying(false) });
  }

  const dims = size === "small" ? "w-6 h-6" : "w-8 h-8";
  const iconDims = size === "small" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Stop" : "Play English audio"}
      title={playing ? "Stop" : "Play English audio"}
      className={`inline-flex items-center justify-center ${dims} rounded-full shrink-0 transition-colors ${
        playing
          ? "bg-coral-500 text-white hover:bg-coral-600"
          : "bg-azure-50 text-azure-500 hover:bg-azure-100 dark:bg-azure-900/40 dark:text-azure-300 dark:hover:bg-azure-900/70"
      } ${className}`}
    >
      {playing ? <Square className={iconDims} /> : <Volume2 className={iconDims} />}
    </button>
  );
}
