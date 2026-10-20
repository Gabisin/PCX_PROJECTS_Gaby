import * as React from "react";
import { SUPPORTED_LOCALES, type Locale } from "@shared/i18n/types";
import pt from "@shared/i18n/locales/pt";
import en from "@shared/i18n/locales/en";
import fr from "@shared/i18n/locales/fr";

const dictionaries = { pt, en, fr } as const;
const STORAGE_KEY = "locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Traduz uma chave; devolve a própria chave entre colchetes se faltar - falha visível em vez de string vazia. */
  t: (key: string) => string;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) return stored as Locale;
  } catch {
    /* localStorage indisponível (modo privado) - cai para o default */
  }
  const browser = window.navigator.language.slice(0, 2);
  return (SUPPORTED_LOCALES as readonly string[]).includes(browser) ? (browser as Locale) : "pt";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(getInitialLocale);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignora - preferência só não persiste entre sessões */
    }
  }, []);

  const t = React.useCallback(
    (key: string) => dictionaries[locale][key] ?? `[${key}]`,
    [locale]
  );

  const value = React.useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n deve ser usado dentro de <I18nProvider>");
  return ctx;
}
