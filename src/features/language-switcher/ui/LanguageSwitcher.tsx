import { Languages } from "lucide-react";
import { useI18n, SUPPORTED_LOCALES } from "@shared/i18n";

/**
 * Alterna pt → en → fr num único clique - reproduz à risca o `LangToggle`
 * de `legal_request_management_platform/Header.tsx` (um botão que roda
 * pelo ciclo de línguas e mostra o código actual), em vez de um dropdown.
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  function cycle() {
    const idx = SUPPORTED_LOCALES.indexOf(locale);
    setLocale(SUPPORTED_LOCALES[(idx + 1) % SUPPORTED_LOCALES.length]);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      title="Mudar idioma / Switch language / Changer de langue"
      className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex"
    >
      <Languages className="size-4" aria-hidden="true" />
      {locale.toUpperCase()}
    </button>
  );
}
