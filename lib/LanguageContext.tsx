"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  DICTIONARIES,
  LANGUAGES,
  type Dictionary,
  type Language,
  type LocaleCode,
} from "./i18n";

const STORAGE_KEY = "taxiwalt.locale";

type LanguageContextValue = {
  locale: LocaleCode;
  language: Language;
  languages: Language[];
  t: Dictionary;
  setLocale: (code: LocaleCode) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is LocaleCode {
  return !!value && value in DICTIONARIES;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  // Restore saved / browser-preferred locale on mount (client only).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) {
      setLocaleState(saved);
      return;
    }
    const browser = navigator.language.slice(0, 2).toLowerCase();
    const match = LANGUAGES.find(
      (l) => l.htmlLang === browser || l.code === browser
    );
    if (match) setLocaleState(match.code);
  }, []);

  // Keep <html lang> in sync for a11y / SEO.
  useEffect(() => {
    const lang = LANGUAGES.find((l) => l.code === locale);
    if (lang) document.documentElement.lang = lang.htmlLang;
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const language =
      LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
    return {
      locale,
      language,
      languages: LANGUAGES,
      t: DICTIONARIES[locale],
      setLocale,
    };
  }, [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return ctx;
}
