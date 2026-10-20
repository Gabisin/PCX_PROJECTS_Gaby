import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "@shared/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

function renderSwitcher() {
  return render(
    <I18nProvider>
      <LanguageSwitcher />
    </I18nProvider>
  );
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Idioma do browser não suportado, para o I18nProvider arrancar sempre em "pt" (default previsível para o teste).
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("de-DE");
  });

  it("mostra o código do idioma actual em maiúsculas", () => {
    renderSwitcher();
    expect(screen.getByRole("button")).toHaveTextContent("PT");
  });

  it("roda pt → en → fr → pt a cada clique, sem dropdown", async () => {
    renderSwitcher();
    const button = screen.getByRole("button");

    await userEvent.click(button);
    expect(button).toHaveTextContent("EN");

    await userEvent.click(button);
    expect(button).toHaveTextContent("FR");

    await userEvent.click(button);
    expect(button).toHaveTextContent("PT");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
