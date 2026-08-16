// Thin wrapper around the browser's built-in Web Speech API.
// This is completely free and requires no server or API key — it uses
// whatever speech engine ships with the user's browser/OS.

export function isSpeechRecognitionSupported() {
  return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isTTSSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text, { lang = "en-US", rate = 0.95, onEnd } = {}) {
  if (!isTTSSupported()) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = rate;
  utter.pitch = 1;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
  return true;
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel();
}

// Creates a speech recognizer instance. Returns null if unsupported.
export function createRecognizer({ lang = "en-US", onResult, onEnd, onError } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const recognizer = new SR();
  recognizer.lang = lang;
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 1;
  recognizer.continuous = false;

  recognizer.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((r) => r[0].transcript)
      .join(" ")
      .trim();
    onResult?.(transcript);
  };
  recognizer.onerror = (e) => onError?.(e);
  recognizer.onend = () => onEnd?.();

  return recognizer;
}

// Basic normalized similarity score (0-100) between spoken text and target phrase.
// Uses word-level Levenshtein-ish overlap — good enough to give encouraging,
// approximate feedback without needing a paid pronunciation-scoring API.
export function similarityScore(spoken, target) {
  const clean = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const a = clean(spoken);
  const b = clean(target);
  if (b.length === 0) return 0;

  let matches = 0;
  const bCopy = [...b];
  for (const word of a) {
    const idx = bCopy.indexOf(word);
    if (idx !== -1) {
      matches += 1;
      bCopy.splice(idx, 1);
    }
  }
  const score = Math.round((matches / b.length) * 100);
  return Math.max(0, Math.min(100, score));
}
