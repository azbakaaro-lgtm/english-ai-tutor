import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { t as translate } from "../data/translations";
import { getLang, setLang as persistLang } from "../utils/storage";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => getLang() || "en");

  useEffect(() => {
    document.documentElement.lang = lang === "so" ? "so" : "en";
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    persistLang(l);
  }, []);

  const toggleLang = useCallback(() => setLang(lang === "en" ? "so" : "en"), [lang, setLang]);

  const t = useCallback((path) => translate(lang, path), [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
