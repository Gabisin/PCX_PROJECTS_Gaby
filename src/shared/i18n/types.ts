export const SUPPORTED_LOCALES = ["pt", "en", "fr"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Dicionário plano por pontos (ex.: "nav.dashboard"). Mantém as 3 línguas com as mesmas chaves - falta uma chave falha em runtime de forma visível, não silenciosa. */
export type Dictionary = Record<string, string>;
