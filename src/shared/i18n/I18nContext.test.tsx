import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider, useI18n } from "./I18nContext";

function Probe() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div>
      <p>locale: {locale}</p>
      <p>{t("common.search")}</p>
      <p>{t("chave.inexistente")}</p>
      <button onClick={() => setLocale("en")}>en</button>
      <button onClick={() => setLocale("fr")}>fr</button>
    </div>
  );
}

describe("I18nProvider / useI18n", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("cai para pt quando não há preferência guardada nem o idioma do browser é suportado", () => {
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("de-DE");
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );
    expect(screen.getByText("locale: pt")).toBeInTheDocument();
    expect(screen.getByText("Pesquisar")).toBeInTheDocument();
  });

  it("usa o idioma do browser como default quando é um dos suportados", () => {
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("fr-FR");
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );
    expect(screen.getByText("locale: fr")).toBeInTheDocument();
  });

  it("devolve a chave entre colchetes quando a tradução não existe, em vez de string vazia", () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );
    expect(screen.getByText("[chave.inexistente]")).toBeInTheDocument();
  });

  it("muda de idioma e actualiza as traduções", async () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: "en" }));
    expect(screen.getByText("locale: en")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("persiste a preferência de idioma no localStorage e re-usa-a ao remontar", async () => {
    const { unmount } = render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: "fr" }));
    expect(window.localStorage.getItem("locale")).toBe("fr");
    unmount();

    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );
    expect(screen.getByText("locale: fr")).toBeInTheDocument();
  });

  it("useI18n fora do I18nProvider lança um erro claro", () => {
    expect(() => render(<Probe />)).toThrow("useI18n deve ser usado dentro de <I18nProvider>");
  });
});
